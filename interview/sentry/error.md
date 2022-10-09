---
theme: cyanosis
---

<h3>前言</h3>

自从知道了 `Sentry`、`Fundbug` 可用于异常监控之后，小编就一直对它们能自动捕获前端异常的机制非常感兴趣。最近为了解决 `Qiankun` 下 `Sentry` 异常上报不匹配的问题，小编特意去翻阅了一下 `Sentry` 的源代码，在解决了问题的同时，也对 `Sentry` 异常上报的机制有了一个清晰的认识，收获满满。

在这里，小编将自己学习所得总结出来，希望能给到同样对 `Sentry` 工作机制感兴趣的同学一些帮助。

本文的目录结构如下:

- **<a href="#1">常见的前端异常及其捕获方式</a>**
    - **<a href="#1-1">js 代码执行时异常</a>**
    
    - **<a href="#1-2">promise 类异常</a>**
    - **<a href="#1-3">静态资源加载类型异常</a>**
    - **<a href="#1-4">接口请求类型异常</a>**
    - **<a href="#1-5">跨域脚本执行异常</a>**

- **<a href="#2">Sentry 异常监控原理</a>**
    - **<a href="#2-1">有效的异常监控需要哪些必备要素</a>**
    
    - **<a href="#2-2">异常详情获取</a>**

    - **<a href="#2-3">用户行为获取</a>**

- **<a href="#3">结束语</a>**

- **<a href="#4">传送门</a>**

<h3 id="1">常见的前端异常及其捕获方式</h3>

在了解 `Sentry` 自动捕获异常的机制之前，小编先带大家了解一下常见的前端异常类型以及各自可以被捕获的方式。

前端异常通常可以分为以下几种类型:

- `js` 代码执行时异常；

- `promise` 类型异常；

- `资源加载`类型异常；

- `网络请求`类型异常；

- `跨域脚本`执行异常；

不同类型的异常，捕获方式不同。

<h4>js 代码执行时异常</h4>

`js` 代码执行异常，是我们经常遇到异常。

这一类型的异常，又可以具体细分为:
- `Error`，最基本的错误类型，其他的错误类型都继承自该类型。通过 `Error`，我们可以自定义 `Error` 类型。

- `RangeError`: 范围错误。当出现堆栈溢出(递归没有终止条件)、数值超出范围(`new Array` 传入负数或者一个特别大的整数)情况时会抛出这个异常。
- `ReferenceError`，引用错误。当一个不存在的对象被引用时发生的异常。
- `SyntaxError`，语法错误。如变量以数字开头；花括号没有闭合等。
- `TypeError`，类型错误。如把 number 当 str 使用。
- `URIError`，向全局 `URI` 处理函数传递一个不合法的 `URI` 时，就会抛出这个异常。如使用 `decodeURI('%')`、`decodeURIComponent('%')`。
- `EvalError`， 一个关于 eval 的异常，不会被 javascript 抛出。

> 具体详见: [Error - JavaScript - MDN Web Docs - Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

通常，我们会通过 `try...catch` 语句块来捕获这一类型异常。如果不使用 `try...catch`，我们也可以通过 `window.onerror = callback` 或者 `window.addEventListener('error', callback)` 的方式进行全局捕获。

<h4>promise 类异常</h4>

在使用 `promise` 时，如果 `promise` 被 `reject` 但没有做 `catch` 处理时，就会抛出 `promise` 类异常。

```
Promise.reject(); // Uncaught (in promise) undefined
```
`promise` 类型的异常无法被 `try...catch` 捕获，也无法被 `window.onerror = callback` 或者 `window.addEventListener('error', callback)` 的方式全局捕获。针对这一类型的异常, 我们需要通过 `window.onrejectionhandled = callback` 或者 `window.addListener('rejectionhandled'， callback)` 的方式去全局捕获。

<h4>静态资源加载类型异常</h4>

有的时候，如果我们页面的`img`、`js`、`css` 等资源链接失效，就会提示资源类型加载如异常。

```
<img src="localhost:3000/data.png" /> // Get localhost:3000/data.png net::ERR_FILE_NOT_FOUND
```
针对这一类的异常，我们可以通过 `window.addEventListener('error', callback, true)` 的方式进行全局捕获。

这里要注意一点，使用 `window.onerror = callback` 的方式是无法捕获静态资源类异常的。

原因是资源类型错误没有冒泡，只能在捕获阶段捕获，而 `window.onerror` 是通过在冒泡阶段捕获错误，对静态资源加载类型异常无效，所以只能借助 `window.addEventListener('error', callback, true)` 的方式捕获。


<h4>接口请求类型异常</h4>

在浏览器端发起一个接口请求时，如果请求的 `url` 的有问题，也会抛出异常。

不同的请求方式，异常捕获方式也不相同:

- 接口调用是通过 `fetch` 发起的
     
     我们可以通过 `fetch(url).then(callback).catch(callback)` 的方式去捕获异常。
     
- 接口调用通过 `xhr` 实例发起

    如果是 `xhr.open` 方法执行时出现异常，可以通过 `window.addEventListener('error', callback)` 或者 `window.onerror` 的方式捕获异常。  
    
    ```
    xhr.open('GET', "https://")  // Uncaught DOMException: Failed to execute 'open' on 'XMLHttpRequest': Invalid URL
    at ....
    ```
    
    如果是 `xhr.send` 方法执行时出现异常，可以通过 `xhr.onerror` 或者 `xhr.addEventListener('error', callback)` 的方式捕获异常。
    
    ```
    xhr.open('get'， '/user/userInfo');
    xhr.send();  // send localhost:3000/user/userinfo net::ERR_FAILED
    ```

<h4>跨域脚本执行异常</h4>

当项目中引用的第三方脚本执行发生错误时，会抛出一类特殊的异常。这类型异常和我们刚才讲过的异常都不同，它的 `msg` 只有 `'Script error'` 信息，没有具体的行、列、类型信息。

之以会这样，是因为浏览器的安全机制: 浏览器只允许同域下的脚本捕获具体异常信息，跨域脚本中的异常，不会报告错误的细节。

针对这类型的异常，我们可以通过 `window.addEventListener('error', callback)` 或者 `window.onerror` 的方式捕获异常。

当然，如果我们想获取这类异常的详情，需要做以下两个操作:

- 在发起请求的 `script` 标签上添加 `crossorigin="anonymous"`;

- 请求响应头中添加 `Access-Control-Allow-Origin: *`；

这样就可以获取到跨域异常的细节信息了。


<h3 id="2">Sentry 异常监控原理</h3>

了解了常见的前端异常类型以及各自可以被捕获的方式之后，我们接下来就一起看看 `Sentry` 是如何做异常监控。

这时候，应该已经有不少小伙伴可以猜到 `Sentry` 进行异常监控的工作原理了吧，是不是就是我们在 **<a href="#2">Sentry 异常监控原理</a>** 章节中提到的各类型异常全局捕获方式的汇总呢？

是的，大家猜的没错，基本上就是这样的，😄。

不过虽然原理大家已经知道了，但是 `Sentry` 内部依旧有不少巧妙的实现可以拿来讲一下的。在这一章节，小编就跟大家一起聊聊 `Sentry` 异常监控的原理。

<h4>有效的异常监控需要哪些必备要素</h4>

异常监控的核心作用就是通过上报的异常，帮开发人员及时发现线上问题并快速修复。

要达到这个目的，异常监控需要做到以下 3 点:
1. 线上应用出现异常时，可以及时推送给开发人员，安排相关人员去处理。
2. 上报的异常，含有异常类型、发生异常的源文件及行列信息、异常的追踪栈信息等详细信息，可以帮助开发人员快速定位问题。
3. 可以获取发生异常的用户行为，帮助开发人员、测试人员重现问题和测试回归。

这三点，分别对应`异常自动推送`、`异常详情获取`、`用户行为获取`。

关于异常推送，小编在 [借助飞书捷径，我快速完成了 Sentry 上报异常的自动推送，点赞！](https://juejin.cn/post/7143142055294795807) 一文中已经做了详细说明，感兴趣的小伙伴可以去看看，在这里我们就不再做过多的说明。

接下来，我们就重点聊一聊异常详情获取和用户行为获取。


<h4>异常详情获取</h4>

为了能自动捕获应用异常，`Sentry` 劫持覆写了 `window.onerror` 和 `window.unhandledrejection` 这两个 `api`。

整个实现过程非常简单。

劫持覆写 `window.onerror` 的代码如下:

```
oldErrorHandler = window.onerror;
window.onerror = function (msg, url, line, column, error) {
    // 收集异常信息并上报
    triggerHandlers('error', {
        column: column,
        error: error,
        line: line,
        msg: msg,
        url: url,
    });
    if (oldErrorHandler) {
        return oldErrorHandler.apply(this, arguments);
    }
    return false;
};

```

劫持覆写 `window.unhandledrejection` 的代码如下:

```
oldOnUnhandledRejectionHandler = window.onunhandledrejection;
window.onunhandledrejection = function (e) {
    // 收集异常信息并上报
    triggerHandlers('unhandledrejection', e);
    if (oldOnUnhandledRejectionHandler) {
        return oldOnUnhandledRejectionHandler.apply(this, arguments);
    }
    return true;
};
```

虽然通过劫持覆写 `window.onerror` 和 `window.unhandledrejection` 已足以完成异常自动捕获，但为了能获取更详尽的异常信息, `Sentry` 在内部做了一些更细微的异常捕获。

具体来说，就是 Sentry 内部对异常发生的特殊上下文，做了标记。这些特殊上下文包括: `dom` 节点事件回调、`setTimeout` / `setInterval` 回调、`xhr` 接口调用、`requestAnimationFrame` 回调等。

举个 🌰，如果是 `click` 事件的 `callback` 中发生了异常， `Sentry` 会捕获这个异常，并将异常发生时的事件 `name`、`dom` 节点描述、`callback` 函数名等信息上报。

具体处理逻辑如下:

- 标记 `setTimeout` / `setInterval` / `requestAnimationFrame`

    为了标记 `setTimeout` / `setInterval` / `requestAnimationFrame` 类型的异常，`Sentry` 先劫持覆写了原生的 `setTimout` / `setInterval` / `requestAnimationFrame` 方法。新的 `setTimeout` / `setInterval` / `requestAnimationFrame` 方法调用时，会使用 `try ... catch` 语句块包裹 `callback`。当 `callback` 内部发生异常时，会被 `catch` 捕获，捕获的异常会标记 `setTimeout` / `setInterval` / `requestAnimationFrame`。

    具体实现如下:

    ```
    var originSetTimeout = window.setTimeout;
    window.setTimeout = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var originalCallback = args[0];
        // wrap$1 会对 setTimeout 的入参 callback 使用 try...catch 进行包装
        // 在 catch 中上报异常
        args[0] = wrap$1(originalCallback, {
            mechanism: {
                data: { function: getFunctionName(original) },
                handled: true,
                // 异常的上下文是 setTimeout
                type: 'setTimeout',
            },
        });
        return original.apply(this, args);
    }
    ```

    `setInterval`、`requestAnimationFrame` 的劫持覆写逻辑和 `setTimeout` 一样。



- 标记 `dom` 事件回调

    所有的 `dom` 节点都继承自 `window.Node` 对象，`dom` 对象的 `addEventListener` 方法来自 `Node` 的 `prototype` 对象。

    为了标记 `dom` 事件回调，`Sentry` 对 `Node.prototype.addEventListener` 进行了劫持覆写。新的 `addEventListener` 方法调用时，同样会使用 `try ... catch` 语句块包裹传入的 `handler`。当 `handler` 内部发生异常时，会被 `catch` 捕获，捕获的异常会被标记 `handleEvent`, 并携带 `event name`、`event target` 等信息。

    相关代码实现如下:

    ```
    function xxx() {
        var proto = window.Node.prototype;
        ...
        // 覆写 addEventListener 方法
        fill(proto, 'addEventListener', function (original) {
            
            return function (eventName, fn, options) {
                try {
                    if (typeof fn.handleEvent === 'function') {
                        fn.handleEvent = wrap$1(fn.handleEvent.bind(fn), {
                            mechanism: {
                                data: {
                                    function: 'handleEvent',
                                    handler: getFunctionName(fn),
                                    target: target,
                                },
                                handled: true,
                                type: 'instrument',
                            },
                        });
                    }
                }
                catch (err) {}
                return original.apply(this, [
                    eventName,
                    wrap$1(fn, {
                        mechanism: {
                            data: {
                                function: 'addEventListener',
                                handler: getFunctionName(fn),
                                target: target,
                            },
                            handled: true,
                            type: 'instrument',
                        },
                    }),
                    options,
                ]);
            };
        });
    }
    ```

    其实，除了标记 `dom` 事件回调上下文，`Sentry` 还可以标记 `Notification`、`WebSocket`、`XMLHttpRequest` 等对象的事件回调上下文。可以这么说，只要一个对象有 `addEventListener` 方法并且可以被劫持覆写，那么对应的回调上下文会可以被标记。


- 标记 `xhr` 接口回调

    为了标记 `xhr` 接口回调标记，`Sentry` 先对 `XMLHttpRequest.prototype.send` 方法劫持覆写, 等 xhr 实例使用覆写以后的 send 方法时，再对 xhr 对象的 onload、onerror、onprogress、onreadystatechange 方法进行了劫持覆写, 使用 `try ... catch` 语句块包裹传入的 `callback`。当 `callback` 内部发生异常时，会被 `catch` 捕获，捕获的异常会被标记对应的请求阶段。

    具体代码如下:

    ```
    fill(XMLHttpRequest.prototype, 'send', _wrapXHR);

    function _wrapXHR(originalSend) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var xhr = this;
            var xmlHttpRequestProps = ['onload', 'onerror', 'onprogress', 'onreadystatechange'];
            xmlHttpRequestProps.forEach(function (prop) {
                if (prop in xhr && typeof xhr[prop] === 'function') {
                    fill(xhr, prop, function (original) {
                        var wrapOptions = {
                            mechanism: {
                                data: {
                                    function: prop,
                                    handler: getFunctionName(original),
                                },
                                handled: true,
                                type: 'instrument',
                            },
                        };
                        var originalFunction = getOriginalFunction(original);
                        if (originalFunction) {
                            wrapOptions.mechanism.data.handler = getFunctionName(originalFunction);
                        }
                        return wrap$1(original, wrapOptions);
                    });
                }
            });
            return originalSend.apply(this, args);
        };

    ```





<h4>用户行为获取</h4>

常见的用户行为，可以归纳为`页面跳转`、`鼠标 click 行为`、`键盘 keypress 行为`、 `fetch / xhr 接口请求`、`console 打印信息`。

`Sentry` 接入应用以后，会在用户使用应用的过程中，将上述行为一一收集起来。等到捕获到异常时，会将收集到的用户行为和异常信息一起上报。

那 `Sentry` 是怎么实现收集用户行为的呢？答案: `劫持覆写上述操作涉及的 api`。

具体实现过程如下:

- 收集页面跳转行为

    为了可以收集用户页面跳转行为，`Sentry` 劫持并覆写了原生 `history` 的 `pushState`、`replaceState` 方法和 `window` 的 `onpopstate`。
    
    劫持覆写 `onpopstate`:
    ```
    // 使用 oldPopState 变量保存原生的 onpopstate
    var oldPopState = window.onpopstate;
    var lastHref;
    // 覆写 onpopstate
    window.onpopstate = function() {
        ...
        var to = window.location.href;
        var from = lastHref;
        lastHref = to;
        // 将页面跳转行为收集起来
        triggerHandlers('history', {
            from: from,
            to: to,
        });
        if (oldOnPopState) {
            try {
                // 使用原生的 popstate 
                return oldOnPopState.apply(this, args);
            } catch (e) {
                ...
            }
        }
        ...
    }
    ```
    
    劫持覆写 `pushState`、`replaceState`：

    ```
    // 保存原生的 pushState 方法
    var originPushState = window.history.pushState;
    // 保存原生的 replaceState 方法
    var originReplaceState = window.history.replaceState;
    
    // 劫持覆写 pushState
    window.history.pushState = function() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        var url = args.length > 2 ? args[2] : undefined;
        if (url) {
            var from = lastHref;
            var to = String(url);
            lastHref = to;
            // 将页面跳转行为收集起来
            triggerHandlers('history', {
                from: from,
                to: to,
            });
         }
         // 使用原生的 pushState 做页面跳转
         return originPushState.apply(this, args);
    }
    
    // 劫持覆写 replaceState
    window.history.replaceState = function() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        var url = args.length > 2 ? args[2] : undefined;
        if (url) {
            var from = lastHref;
            var to = String(url);
            lastHref = to;
            // 将页面跳转行为收集起来
            triggerHandlers('history', {
                from: from,
                to: to,
            });
         }
         // 使用原生的 replaceState 做页面跳转
         return originReplaceState.apply(this, args);
    }
    ```
- 收集鼠标 `click` / 键盘 `keypress` 行为

    为了收集用户鼠标 `click` 和键盘 `keypress` 行为， `Sentry` 做了双保险操作:
    - 通过 `document` 代理 `click`、`keypress` 事件来收集 `click`、`keypress` 行为；
    - 通过劫持 `addEventListener` 方法来收集 `click`、`keypress` 行为；


    相关代码实现如下：

    ```
    function instrumentDOM() {
        ...
        // triggerDOMHandler 用来收集用户 click / keypress 行为
        var triggerDOMHandler = triggerHandlers.bind(null, 'dom');
        var globalDOMEventHandler = makeDOMEventHandler(triggerDOMHandler, true);

        // 通过 document 代理 click、keypress 事件的方式收集 click、keypress 行为
        document.addEventListener('click', globalDOMEventHandler, false);
        document.addEventListener('keypress', globalDOMEventHandler, false);

        ['EventTarget', 'Node'].forEach(function (target) {
            var proto = window[target] && window[target].prototype;
            if (!proto || !proto.hasOwnProperty || !proto.hasOwnProperty('addEventListener')) {
                return;
            }

            // 劫持覆写 Node.prototype.addEventListener 和 EventTarget.prototype.addEventListener
            fill(proto, 'addEventListener', function (originalAddEventListener) {
                
                // 返回新的 addEventListener 覆写原生的 addEventListener
                return function (type, listener, options) {
                    
                    // click、keypress 事件，要做特殊处理，
                    if (type === 'click' || type == 'keypress') {
                        try {
                            var el = this;
                            var handlers_1 = (el.__sentry_instrumentation_handlers__ = el.__sentry_instrumentation_handlers__ || {});
                            var handlerForType = (handlers_1[type] = handlers_1[type] || { refCount: 0 });
                            // 如果没有收集过 click、keypress 行为
                            if (!handlerForType.handler) {
                                var handler = makeDOMEventHandler(triggerDOMHandler);
                                handlerForType.handler = handler;
                                originalAddEventListener.call(this, type, handler, options);
                            }
                            handlerForType.refCount += 1;
                        }
                        catch (e) {
                            // Accessing dom properties is always fragile.
                            // Also allows us to skip `addEventListenrs` calls with no proper `this` context.
                        }
                    }
                    // 使用原生的 addEventListener 方法注册事件
                    return originalAddEventListener.call(this, type, listener, options);
                };
            });
            ...
        });
    }
    
    ```

    整个实现过程还是非常巧妙的，很值得拿来细细说明。

    首先， `Sentry` 使用 `document` 代理了 `click`、`keypress` 事件。通过这种方式，用户的 `click`、`keypress` 行为可以被感知，然后被 `Sentry` 收集。但这种方式有一个问题，如果应用的 `dom` 节点是通过 `addEventListener` 注册了 `click`、`keypress` 事件，并且在事件回调中做了阻止事件冒泡的操作，那么就无法通过代理的方式监控到 `click`、`keypress` 事件了。

    针对这一种情况， `Sentry` 采用了覆写 `Node.prototype.addEventListener` 的方式来监控用户的 `click`、`keypress` 行为。

    由于所有的 `dom` 节点都继承自 `Node` 对象，`Sentry` 劫持覆写了 `Node.prototype.addEventListener`。当应用代码通过 `addEventListener` 订阅事件时，会使用覆写以后的 `addEventListener` 方法。 
    
    新的 `addEventListener` 方法，内部里面也有很巧妙的实现。如果不是 `click`、`keypress` 事件，会直接使用原生的 `addEventListener` 方法注册应用提供的 `listener`。但如果是 `click`、`keypress` 事件，除了使用原生的 `addEventListener` 方法注册应用提供的 `listener` 外，还使用原生 `addEventListener` 注册了一个 `handler`，这个 `handler` 执行的时候会将用户 `click`、`keypress` 行为收集起来。

    也就是说，如果是 `click`、`keypress` 事件，应用程序在调用 `addEventListener` 的时候，实际上是调用了两次原生的 `addEventListener`。

    为这个实现方案点赞!

    另外，在收集 `click`、`keypress` 行为时，`Sentry` 还会把 `target` 节点的的父节点信息收集起来，帮助我们快速定位节点位置。

- 收集 `fetch` / `xhr` 接口请求行为

    同理，为了收集应用的接口请求行为，`Sentry` 对原生的 `fetch` 和 `xhr` 做了劫持覆写。

    劫持覆写 `fetch`:

    ```
    var originFetch = window.fetch;
    
    window.fetch = function() {

        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // 获取接口 url、method 类型、参数、接口调用时间信息
        var handlerData = {
            args: args,
            fetchData: {
                method: getFetchMethod(args),
                url: getFetchUrl(args),
            },
            startTimestamp: Date.now(),
        };
        // 收集接口调用信息
        triggerHandlers('fetch', __assign({}, handlerData));
        return originalFetch.apply(window, args).then(function (response) {
            // 接口请求成功，收集返回数据
            triggerHandlers('fetch', __assign(__assign({}, handlerData), { endTimestamp: Date.now(), response: response }));
            return response;
        }, function (error) {
            // 接口请求失败，收集接口异常数据
            triggerHandlers('fetch', __assign(__assign({}, handlerData), { endTimestamp: Date.now(), error: error }));
            throw error;
        });
    }
    ```

    应用中使用 `fetch` 发起请求时，实际使用的是新的 `fetch` 方法。新的 `fetch` 内部，会使用原生的 `fetch` 发起请求，并收集接口请求数据和返回结果。

    劫持覆写 `xhr`:

    ```
    function instrumentXHR() {
        ...
        var xhrproto = XMLHttpRequest.prototype;
        // 覆写 XMLHttpRequest.prototype.open
        fill(xhrproto, 'open', function (originalOpen) {
            return function () {
                ...
                var onreadystatechangeHandler = function () {
                    if (xhr.readyState === 4) {
                        ...

                        // 收集接口调用结果
                        triggerHandlers('xhr', {
                            args: args,
                            endTimestamp: Date.now(),
                            startTimestamp: Date.now(),
                            xhr: xhr,
                        });
                    }
                };
                // 覆写 onreadystatechange
                if ('onreadystatechange' in xhr && typeof xhr.onreadystatechange === 'function') {
                    fill(xhr, 'onreadystatechange', function (original) {
                        return function () {
                            var readyStateArgs = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                readyStateArgs[_i] = arguments[_i];
                            }
                            onreadystatechangeHandler();
                            return original.apply(xhr, readyStateArgs);
                        };
                    });
                }
                else {
                    xhr.addEventListener('readystatechange', onreadystatechangeHandler);
                }
                return originalOpen.apply(xhr, args);
            };
        });

        // 覆写 XMLHttpRequest.prototype.send
        fill(xhrproto, 'send', function (originalSend) {
            return function () {
                ...
                // 收集接口调用行为
                triggerHandlers('xhr', {
                    args: args,
                    startTimestamp: Date.now(),
                    xhr: this,
                });
                return originalSend.apply(this, args);
            };
        });
    }

    ```

    `Sentry` 是通过劫持覆写 `XMLHttpRequest` 原型上的 `open`、`send` 方法的方式来实现收集接口请求行为的。

    当应用代码中调用 `open` 方法时，实际使用的是覆写以后的 `open` 方法。在新的 `open` 方法内部，又覆写了 `onreadystatechange`，这样就可以收集到接口请求返回的结果。新的 `open` 方法内部会使用调用原生的 `open` 方法。
    
    同样的，当应用代码中调用 `send` 方法时，实际使用的是覆写以后的 `send` 方法。新的 `send` 方法内部先收集接口调用信息，然后调用原生的 `send` 方法。

- 收集 `console` 打印行为

    有了前面的铺垫，`console` 行为的收集机制理解起来就非常简单了，实际就是对 `console` 的 `debug`、`info`、`warn`、`error`、`log`、`assert` 这借个 `api` 进行劫持覆写。

    代码如下:

    ```
    var originConsoleLog = console.log;

    console.log = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // 收集 console.log 行为
        triggerHandlers('console', { args: args, level: 'log' });
        if (originConsoleLog) {
            originConsoleLog.apply(console, args);
        }
    }

    ```



<h3 id="4">结束语</h3>


