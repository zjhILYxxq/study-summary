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

通常，我们会通过 `try...catch` 语句块来捕获这一类型异常。如果不使用 `try...catch`，我们也可以通过 `window.onerror = callback
` 或者 `window.addEventListener('error', callback)` 的方式进去全局捕获。

<h4>promise 类异常</h4>

在使用 `promise` 时，如果 `promise` 被 `reject` 但没有被 `catch` 处理时，就会抛出 `promise` 类异常。

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

> 之以会这样，是因为浏览器的安全机制: 浏览器只允许同域下的脚本捕获具体异常信息，跨域脚本中的异常，不会报告错误的细节。

针对这类型的异常，我们可以通过 `window.addEventListener('error', callback)` 或者 `window.onerror` 的方式捕获异常。

当然，如果我们想获取这类异常的详情，需要做以下两个操作:

- 在 `script` 添加 `crossorigin="anonymous"`;

- 响应头中添加 `Access-Control-Allow-Origin: *`；


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

这三点，分别对应`异常推送`、`异常详情获取`、`用户行为获取`。

关于异常推送，小编在 [借助飞书捷径，我快速完成了 Sentry 上报异常的自动推送，点赞！]() 一文中已经做了详细说明，感兴趣的小伙伴可以去看看，在这里我们就不再做过多的说明。

接下来，我们就重点聊一聊异常详情获取和用户行为获取。


<h4>异常详情获取</h4>

<h4>用户行为获取</h4>

常见的用户行为，可以归纳为`页面跳转`、`鼠标 click 行为`、`键盘 press 行为`、 `fetch / xhr 接口请求`、`console 打印信息`。

`Sentry` 接入应用以后，会在用户使用应用的过程中，将上述行为一一收集起来。等到捕获到异常时，会将收集到的用户行为和异常信息一起上报。

那 `Sentry` 是怎么实现收集用户行为的呢？答案: `劫持并覆写上述操作涉及的 api`。

具体实现过程如下:

- 收集页面跳转行为

    为了可以收集用户页面跳转行为，`Sentry` 劫持并覆写了原生 `history` 的 `pushState`、`replaceState` 方法和 `window` 的 `onpopstate`。
    
    ```
    // 劫持并覆写 onpopstate
    var oldPopState = window.onpopstate;
    var lastHref;
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
                return oldOnPopState.apply(this, args);
            } catch (e) {
                ...
            }
        }
        ...
    }
    ```
    
    ```
    // 劫持并覆写 pushState、replaceState
    
    var originPushState = window.history.pushState;
    var originReplaceState = window.history.replaceState;
    
    // 覆写 pushState
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
         return originPushState.apply(this, args);
    }
    
    // 覆写 replaceState
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
         return originReplaceState.apply(this, args);
    }
    ```
- 收集鼠标 `click` / 键盘 `press` 行为

    为了收集用户鼠标 click 和键盘 press 行为， Sentry 做了双保险操作:
    - 允许冒泡时，通过 document 代理 click、keypress 事件来收集 click、press 行为；
    - 不允许冒泡时，通过劫持 addEventListener 方法来收集 click、press 行为；


    具体实现如下：

    ```
    
    
    ```

- 收集 `fetch` / `xhr` 接口请求行为

- 收集 `console` 打印行为



<h3 id="4">结束语</h3>



<h3 id="5">传送门</h3>

