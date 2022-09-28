---
theme: cyanosis
---

本文为稀土掘金技术社区首发签约文章，14天内禁止转载，14天后未获授权禁止转载，侵权必究！

<h3>前言</h3>

衡量一个站点性能的好坏，我们通常看两个方面: 首屏性能和页面加载以后整个交互的流畅程度。这两个指标的好坏，决定了站点是否可以吸引用户和留住用户。

为了能获得好的用户体验，我们常常需要对站点做性能优化。做性能优化，首先要对站点进行性能分析，寻找到底是哪个阶段性能较差，然后具体问题具体分析，找到对应的解决方案。而谈到性能分析，小编猜大家第一时间想到的是应该是打开浏览器 `performance`、`network`、`lighthouse` 面板，然后对页面加载过程进行分析吧。

诚然这是一个有效的办法，但在实际使用时却存在非常大的局限性。也许，我们自己访问站点的时候性能很好，没有什么问题，但用户在实际访问时，由于设备、网络、使用姿势、使用人数、使用时间段、服务吞吐量等原因，整个体验很可能会没有达到我们的预期。这种情况下进行性能分析就非常麻烦了，首先我们无法感知，其次我们也无法在本地直接复现出用户的使用情形。那怎么办呢，😂?

这个时候，我们可以借助性能监控工具来处理这个问题，如 `Sentry`、`Fundebug` (当然，也可以自研)。这类工具，可以在用户访问站点时，将首屏性能、用户交互涉及的一些指标数据通过接口上报给后台管理系统。后台系统接收到上报数据以后，对数据做汇总、计算，然后以可视化图表的方式展示。通过这些图表，我们就可以进行性能分析，找到影响用户体验的因素，非常方便。

本文，小编就以 `Sentry` 为例，和大家一起聊聊 `Sentry` 是如何做性能监控的, 希望能给到大家一些启发。

本文的目录结构如下:

- **<a href="#1">常见的性能优化指标及获取方式</a>**
  - **<a href="#1-1">页面何时开始渲染 - FP & FCP</a>**
  - **<a href="#1-2">页面何时渲染主要内容 - FMP & SI & LCP</a>**
  - **<a href="#1-3">何时可以交互 - TTI & TBT</a>**
  - **<a href="#1-4">交互是否有延迟 - FID & MPFID & Long Task</a>**
  - **<a href="#1-5">页面视觉是否有稳定 - CLS</a>**
  - **<a href="#1-6">性能分析关键指标</a>**

- **<a href="#2">Sentry 如何做性能监控</a>**
  - **<a href="#2-1">Sentry 如何配置性能监控<</a>**
  - **<a href="#2-2">Sentry 性能监控原理</a>** 

- **<a href="#4">结束语</a>**

<h3 id="1">常见的性能优化指标及获取方式</h3>

做性能分析，不管是在本地，还是通过工具，最重要的是要有数据支撑。目前，`w3c` 对性能相关数据，已经有了详尽的分类标准和与之配套的获取方式。本节，小编就先和大家了聊一聊常用的性能优化指标以及获取指标数据的方式。

先给大家放一张谈到性能优化，就必须会提及的加载过程模型图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64e30109b49e455385113c626060a4aa~tplv-k3u1fbpfcp-watermark.image?)

> 图片截取自 [Navigation Timing](https://www.w3.org/TR/navigation-timing/)

这个加载过程模型，是[web 性能工作组](https://www.w3.org/webperf/) 早在 `2012` 年就针对页面加载过程制定的，定义了从上一个页面结束，到下一个页面从开始加载到完成加载的整个过程。基于这个模型，我们可以获取到页面加载过程中各个阶段的耗时情况，然后分析出页面加载性能。

最初，我们可以通过 `window.performance.timing` 这个接口获取加载过程模型中各个阶段的耗时数据。

```
var timing = window.performance.timing;

// 返回数据格式
{
    navigationStart,  // 同一个浏览器上下文中，上一个文档结束时的时间戳。如果没有上一个文档，这个值会和 fetchStart 相同。
    unloadEventStart,  // 上一个文档 unload 事件触发时的时间戳。如果没有上一个文档，为 0。
    unloadEventEnd, // 上一个文档 unload 事件结束时的时间戳。如果没有上一个文档，为 0。
    redirectStart, // 表示第一个 http 重定向开始时的时间戳。如果没有重定向或者有一个非同源的重定向，为 0。
    redirectEnd, // 表示最后一个 http 重定向结束时的时间戳。如果没有重定向或者有一个非同源的重定向，为 0。
    fetchStart, // 表示浏览器准备好使用 http 请求来获取文档的时间戳。这个时间点会在检查任何缓存之前。
    domainLookupStart, // 域名查询开始的时间戳。如果使用了持久连接或者本地有缓存，这个值会和 fetchStart 相同。
    domainLookupEnd, // 域名查询结束的时间戳。如果使用了持久连接或者本地有缓存，这个值会和 fetchStart 相同。
    connectStart, // http 请求向服务器发送连接请求时的时间戳。如果使用了持久连接，这个值会和 fetchStart 相同。
    connectEnd, // 浏览器和服务器之前建立连接的时间戳，所有握手和认证过程全部结束。如果使用了持久连接，这个值会和 fetchStart 相同。
    secureConnectionStart, // 浏览器与服务器开始安全链接的握手时的时间戳。如果当前网页不要求安全连接，返回 0。
    requestStart, // 浏览器向服务器发起 http 请求(或者读取本地缓存)时的时间戳，即获取 html 文档。
    responseStart, // 浏览器从服务器接收到第一个字节时的时间戳。
    responseEnd, // 浏览器从服务器接受到最后一个字节时的时间戳。
    domLoading, // dom 结构开始解析的时间戳，document.readyState 的值为 loading。
    domInteractive, // dom 结构解析结束，开始加载内嵌资源的时间戳，document.readyState 的状态为 interactive。
    domContentLoadedEventStart, // DOMContentLoaded 事件触发时的时间戳，所有需要执行的脚本执行完毕。
    domContentLoadedEventEnd,  // DOMContentLoaded 事件结束时的时间戳
    domComplete, // dom 文档完成解析的时间戳， document.readyState 的值为 complete。
    loadEventStart, // load 事件触发的时间。
    loadEventEnd // load 时间结束时的时间。
}
```
后来，`window.performance.timing` 被废弃，改用 `window.performance.getEntriesByType('navigation')`。旧的 `api`，返回的是一个 `UNIX` 类型的绝对时间，和用户的系统时间相关，分析的时候需要再次计算。而新的 `api`，返回的是一个相对时间，可以直接用来分析，非常方便。

不过，光有这些还不够。上面的这些指标，更多是面向开发人员来说的，如果从用户角度来看，不够形象，并且难以理解。实际上，从用户角度来说，用户更加关心页面何时开始渲染、何时渲染出主要内容、何时可以交互、交互否有延迟、页面视觉是否稳定。

针对用户关心的这几个方面，官方也提供了对应的指标和相应的获取方式。

<h4 id="1-1">页面何时开始渲染 - FP & FCP</h4>

衡量页面何时开始渲染，有两个指标: `FP` 和 `FCP`:

- `FP`, `first paint`, 表示页面开始首次绘制的时间点，值越小约好。在 `FP` 时间点之前，用户看到的是导航之前的页面。

- `FCP`, `first contentful paint`, `lighthouse` 面板的六大指标之一，表示首次绘制任何文本、图像、非空白 `canvas` 或者 `SVG` 的时间点，值越小约好。官方资料: [FCP](https://web.dev/fcp/)。

这两个指标，我们可以通过 `performance.getEntry`、`performance.getEntriesByName`、`performanceObserver` 来获取。

```
    performance.getEntries().filter(item => item.name === 'first-paint')[0];  // 获取 FP 时间

    performance.getEntries().filter(item => item.name === 'first-contentful-paint')[0];  // 获取 FCP 时间

    performance.getEntriesByName('first-paint'); // 获取 FP 时间

    performance.getEntriesByName('first-contentful-paint');  // 获取 FCP 时间

    // 也可以通过 performanceObserver 的方式获取
    var observer = new PerformanceObserver(function(list, obj) {
        var entries = list.getEntries();
        entries.forEach(item => {
            if (item.name === 'first-paint') {
                ...
            }
            if (item.name === 'first-contentful-paint') {
                ...
            }
        })
    });
    observer.observe({type: 'paint'});
```

<h4 id="1-2">页面何时渲染主要内容 - FMP & SI & LCP</h4>

衡量页面何时渲染主要内容，有三个指标: `FMP`、`SI` 和 `LCP`:

- `FMP`，`first meaningful paint`, 首次完成有意义内容绘制的时间点，值越小约好。官方资料: [FMP](https://web.dev/first-meaningful-paint/)。
  
- `SI`, `speed index`, 速度指标, `lighthouse` 面板中的六大指标之一，用于衡量页面加载期间内容的绘制速度，值越小约好。官方资料: [SI](https://web.dev/speed-index/)。
  
- `LCP`， `lagest contentful paint`， `lighthouse` 面板中的六大指标之一，完成最大内容绘制的时间点，值越小约好。官方资料: [LCP](https://web.dev/lcp/)。

`FMP`, 是一个已经废弃的性能指标。在实践过程中，由于 `FMP` 对页面加载的微小差异过于敏感，经常会出现结果不一致的情况。此外，该指标的定义依赖于特定于浏览器的实现细节，这意味着它不能标准化，也不能在所有 `Web` 浏览器中实现。目前，官方并没有提供有效的获取 `FMP` 的接口，因此性能分析的时候不再使用这个指标。

`SI` 和 `FMP` 一样，官方也没有提供有效的获取接口，只能通过 `lighthouse` 面板来查看，不作为 `Sentry` 等工具做性能分析的指标。

`LCP`，和 `FMP` 类似，但只聚焦页面首次加载时最大元素的绘制时间点，计算相对简单一些。通过 `performanceObserver` 这个接口，我们可以获取到 `LCP` 指标数据。

```
    new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            console.log('LCP candidate:', entry.startTime, entry);
        }
    }).observe({type: 'largest-contentful-paint', buffered: true});
``` 

<h4 id="1-3">何时可以交互 - TTI & TBT</h4>

衡量页面何时可以交互，有两个指标: `TTI` 和 `TBT`。

`TTI`, `time to ineractive`, 可交互时间， `lighthouse` 面板中的六大指标之一, 用于测量页面从开始加载到主要资源完成渲染，并能够快速、可靠地响应用户输入所需的时间, 值越小约好。 官方资料: [TTI](https://web.dev/i18n/zh/tti/)。

和 `FMP`、`SI` 一样，官方并没有提供获取 `TTI` 的有效接口，只能通过 `lighthouse` 面板来查看，不会作为 `Sentry` 做性能分析的指标。
    
不过没有关系，官方提供了 `TTI` 的计算公式，我们可以自己手动实现。
    
计算方式人如下:

1. 先进行 `First Contentful Paint` 首次内容绘制；
   
2. 沿时间轴正向搜索时长至少为 `5` 秒的安静窗口，其中，安静窗口的定义为：没有长任务且不超过 `2` 个正在处理的网络请求;
   
3. 沿时间轴反向搜索安静窗口之前的最后一个长任务，如果没有找到长任务，则在 `FCP` 步骤停止执行。
   
4. `TTI` 是安静窗口之前最后一个长任务的结束时间（如果没有找到长任务，则与 `FCP` 值相同）。

通过官方提供的一张图，我们可以更方便的理解上面的计算过程：
    
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ebdd6d7ad2c4e90a8bf1e3ecee5b73a~tplv-k3u1fbpfcp-watermark.image?)

这里，小编要先解释一下 `long task` 是怎么定义的。通常，如果一个任务在主线程上运行的时间超过 `50` ms，那么这个任务就是一个 `long task`, 主线程就被视作阻塞状态。

有了上面的计算方式，我们就可以尝试自己去计算 `TTI` 了。

在这个计算过程中，最关键的两点: 收集 `long task` 和计算安静窗口。

 `long task` 的收集比较简单，我们可以通过 `performanceObserver` 来实现。

```
    let longTask = [];

    new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            // 收集每一个 long task 结束的时间
            longTask.push({
                startTime: entry.startTime,
                duration: entry.duration,
                endTime:entry.startTime + entry.duration
            });
        }
    }).observe({type: 'longtask', buffered: true});
```

安静窗口的计算就有点复杂了。如何知道在 `5s` 的时间内请求数不超过 `2` 次呢 ？ 
    
关于这一点，我们可以通过拦截网络请求加一个请求 `pool` 实现。

我们先来实现一个请求 `pool` :

```
    // 请求池
    let pool = [];
    //定時器
    var timer = null;
    // TTI
    var tti;
    // 将发起的请求添加到请求池中
    function push(id) {
        if(pool.length < 3 && !tti)
            timer = setTimeout(() => {
                // 如果 timer 的 callback 能顺利执行，说明连续 5 s 的请求数没有超过 2 次
                let fcp = performance.getEntriesByName('first-contentful-paint');
                TTI = longTask.length ? longTask[longTask.length - 1].endTime - fcp[0].startTime : fcp[0].startTime;
            }, 5000)
        else {
          clearTimeout(timer);
        }

    }
    // 结束的请求从请求池中移除
    function pop(id) {
      pool = pool.filter(item => item !== id);
        if(pool.length < 3 && !tti)
            timer = setTimeout(() => {
                // 如果 timer 的 callback 能顺利执行，说明连续 5 s 的请求数没有超过 2 次
                let fcp = performance.getEntriesByName('first-contentful-paint');
                TTI = longTask.length ? longTask[longTask.length - 1].endTime - fcp[0].startTime : fcp[0].startTime;
            }, 5000);
        else {
          clearTimeout(timer);
        }
    }

    let uniqueId = 0;

```

接下来，再实现网络请求拦截。通常，网络请求可以分为三类: `xhr` 请求、`fetch` 请求、静态资源请求。为了拦截这些网络请求，我们可以做一些拦截覆写和监听操作。

拦截 `xhr` 请求:

```
    // 拦截 xhr 请求
    const proxyXhr = () => {
        const send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(...args) {
            const requestId = uniqueId++;
            // 将请求添加到请求 pool 中
            push(requestId);
            this.addEventListener('readystatechange', () => {
                if (this.readyState === 4) {
                    // 将请求从请求池中移除
                    pop(requestId);
                }
            });
            return send.apply(this, args);
        };
    }
```
    
拦截 `fetch` 请求：
```
    function patchFetch() {
        const originalFetch = fetch;
        fetch = (...args) => {
            return new Promise((resolve, reject) => {
            const requestId = uniqueId++;
            // 将请求添加到请求 pool 中
            push(requestId);
            originalFetch(...args).then(
                (value) => {
                    // 将请求从请求 pool 中移除
                    pop(requestId);
                    resolve(value);
                },
                (err) => {
                    // 将请求从请求 pool 中移除
                    pop(err);
                    reject(err);
                });
            });
        };
    }
```

静态资源请求的处理最为麻烦。我们可以通过 `mutationObserver` 对静态资源请求做监听，然后通过 `PerformanceOberserver` 来检测请求是否完成。


```
    const requestCreatingNodeNames = ['img', 'script', 'iframe', 'link', 'audio', 'video', 'source'];

    function observeResourceFetchingMutations() {
        const mutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type == 'childList' && mutation.addedNodes.length && requestCreatingNodeNames.includes(mutation.addedNodes[0].nodeName.toLowerCase())) {
                    // 收集静态文件链接
                    push(mutation.addedNodes[0].href || mutation.addedNodes[0].src);
                } else if (mutation.type == 'attributes' && (mutation.attributeName === 'href' || mutation.attributeName === 'src') &&
                    requestCreatingNodeNames.includes(
                        mutation.target.tagName.toLowerCase())) {
                    push(mutation.target.href || mutation.target.src);
                }
            }
        });
        // 监听静态资源节点
        mutationObserver.observe(document, {
            attributes: true,
            childList: true,
            subtree: true,
            // img、script、link
            attributeFilter: ['href', 'src'],
        });

        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                // 将完成的静态资源请求移除
                pop(entry.name);
            }
        }).observe({type: 'resource', buffered: true});
    }
```

这样，我们就可以自己手动计算 `TTI` 了。不过要注意哈，上面代码只是根据官方提供的计算公式反推出来的，实际计算出来的数据，和 `lighthouse` 面板中的数据会有较大的误差，因此仅供参考，不在实际性能监控工具中使用。

了解完 `TTI`，我们再来看看 `TBT`。
    
`TBT`, `total blocking time`，总的阻塞时间， `lighthouse` 面板中的六大指标之一，用于测量 `FCP` 到 `TTI` 之间的总的阻塞时间，值越小约好。官方资料: [TBT](https://web.dev/lighthouse-total-blocking-time/)。

和 `TTI` 一样，官方也没有提供获取 `TBT` 的有效接口，只能通过 `lighthouse` 面板来查看，不会作为 `Sentry` 做性能分析的指标。

不过我们既然可以手动计算 `TTI`，那么也可以手动计算 `TBT`。计算过程也很简单，就是在计算 `TTI` 的时候，遍历收集的 `longTask`, 计算总的阻塞时间。

代码如下:


```
    let TBT = longTask.reduce((initial, item) => initial + item.durationg - 50, 0);
```

<h4 id="1-4">交互是否有延迟 - FID & MPFID & Long Task</h4>

衡量交互是否有延迟，有 `3` 个指标: `FID`、`MPFID`、`Long Task`。其中，`FID` 和 `MPFID` 可用来衡量用户首次交互延迟的情况，`Long Task` 用来衡量用户在使用应用的过程中遇到的延迟、阻塞情况。

`FID`，`first input delay`, 首次输入延迟，测量从用户第一次与页面交互（例如当他们单击链接、点按按钮或使用由 `JavaScript` 驱动的自定义控件）直到浏览器对交互作出响应，并实际能够开始处理事件处理程序所经过的时间。官方资料: [FID](https://web.dev/fid/)。

`FID` 指标的值越小约好。通过 `performanceObserver`，我们可以获取到 `FID` 指标数据。

```
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    const delay = entry.processingStart - entry.startTime;
    console.log('FID candidate:', delay, entry);
  }
}).observe({type: 'first-input', buffered: true});

```

`MPFID`, `Max Potential First Input Delay`，最大潜在首次输入延迟，用于测量用户可能遇到的最坏情况的首次输入延迟。和 `FMP` 一样，这个指标已经被废弃不再使用。

`Long Task`，衡量用户在使用过程中遇到的交互延迟、阻塞情况。这个指标，可以告诉我们哪些任务执行耗费了 `50ms` 或更多时间。官方资料: [Long Task](https://developer.mozilla.org/zh-CN/docs/Web/API/Long_Tasks_API)

通过 `performanceObserver`, 我们可以获取到 `Long Task` 指标数据。

```
new PerformanceObserver(function(list) {
    var perfEntries = list.getEntries();
    for (var i = 0; i < perfEntries.length; i++) {
        ...
    }
})observe({ type: 'longtask'});

```

<h4 id="1-5">页面视觉是否有稳定 - CLS</h4>

衡量页面视觉是否稳定，有 `1` 个指标: `CLS`

`CLS`, `Cumulative Layout Shift`, 累积布局偏移，用于测量整个页面生命周期内发生的所有意外布局偏移中最大一连串的布局偏移情况。官方资料: [CLS](https://web.dev/cls/)。

`CLS`, 值越小，表示页面视觉越稳定。通过 `performanceObserver`，我们可以获取到 `CLS` 指标数据。

```
new PerformanceObserver(function(list) {
    var perfEntries = list.getEntries();
    for (var i = 0; i < perfEntries.length; i++) {
        ...
    }
})observe({type: 'layout-shift', buffered: true});
```

<h4 id="1-6">性能分析关键指标</h4>

实际在做性能分析时，上面列举的性能指标并不会全部使用。

如果是本地通过 `lighthouse` 进行性能分析，会使用 `6` 大指标: `FCP`、`LCP`、`SI`、`TTI`、`TBT`、`CLS`。这些指标涵盖了页面渲染、交互和视觉稳定性情况。

如果是通过 `Sentry` 等工具进行性能分析，会使用 `4` 大指标: `FCP`、`LCP`、`FID`、`CLS`。这些指标也涵盖了页面渲染、交互、视觉稳定性情况。之所以选这四个指标，原因想必大家也知道，就是这四个指标的数据可以通过 `performanceObserver` 获取。



<h3 id="2">Sentry 如何做性能监控</h3>

了解了做性能分析可用的指标以后，我们接下来就看看 `Sentry` 是如何做性能监控的。

<h4 id="2-1">Sentry 如何配置性能监控</h4>

首先，我们先看看使用 `Sentry` 做性能监控时，如何配置。

整个过程非常简单:

1. 安装 `@sentry/tracing`

    ```
    yarn add @sentry/tracing

    npm install --save @sentry/tracing

    ```
2. 在 `Sentry.init` 方法内部添加性能监控配置项

    ```
    import * as Sentry from "@sentry/react";
    import { BrowserTracing } from "@sentry/tracing";

    Sentry.init({
        dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
        integrations: [new BrowserTracing()],
        tracesSampleRate: 0.2
    });
    ```
    注意，`tracesSampleRate` - 采样率是必不可少的配置项，它的值决定了性能指标数据上报的频率。如果 `tracesSampleRate` 为 `0.7`, 那么用户在使用应用时，`70%` 的几率会上报性能数据，`30%` 的几率不会上报性能数据。注意，如果 `tracesSampleRate` 设置为 0，则不上报性能指标数据。

    `tracesSampleRate` 最大值为 `1`。通过设置 `tracesSampleRate`，可以有效降低 `Sentry` 后端的压力。

<h4 id="2-2">Sentry 性能监控原理</h4>

做性能监控，最重要的是获取性能指标数据。有了 **<a href="#2">Sentry 如何做性能监控</a>** 这一节的铺垫，相信大家对 `Sentry` 做性能监控的原理也心中有数了吧。

简单来说，就是通过 `window.performance.getEntries` 和 `performanceObserver` 这两个 `api`，获取用户在使用应用过程中涉及的 `load` 相关、`fcp`、`lcp`、`fid`、`cls` 等指标数据，然后通过接口上报。后台管理系统拿到数据以后，通过可视化图标的方式展示性能指标数据，帮助我们分析。

具体在做性能监控时，`Sentry` 将性能指标数据分为两个部分: 首屏加载相关数据和页面切换相关数据。

- 首屏加载 - `pageload`

    首屏相关数据的上报过程非常简单, 具体如下:

    1. 应用加载时执行 `Sentry.init` 方法进行初始化。

        在初始化的时候，会通过 `setTimeout` 实现首屏完成以后再上报首屏性能指标数据。默认情况下，`timeout` 为 `1000 ms`。

        有时我们应用的首屏时间可能超过 `1000 ms`，这样我们就无法获取完整的首屏数据。
        
        遇到这种情况，这个时候我们可以手动设置 `timeout`，具体如下:

        ```
        Sentry.init({
            dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
            integrations: [
                new BrowserTracing({
                    idleTimeout: 3000,
                    ...
                }),
            ],
            tracesSampleRate: 1.0,
        });

        ```
    2. 在 `setTimeout` 的 `callback` 中通过 `window.performance.getEntries` 和 `performanceObserver` 获取性能指标数据，然后通过接口上报。

- 页面切换 - `navigation`

    页面切换相关数据上报过程也很简单，过程如下:

    1. 在 `Sentry.init` 初始化过程中对 `history.pushState`、`history.replaceState`、`window.onpopstate` 方法进行覆写，拦截应用路由切换操作。
   
    2. 页面切换完成以后，通过 `window.performance.getEntries` 获取性能指标数据，然后通过接口上报。

        通过 `performance.getEntries` 获取性能指标数据时，`Sentry` 会记录上次上报时的 `oldIndex`。等到下次上报时，从 `oldIndex + 1` 开始获取性能指标数据。


这样，`Sentry` 性能监控最关键的一步 - 性能指标数据上报就完成了。接下来要做的就是打开 `Sentry` 后台管理系统，进行性能分析了。


<h3 id="4">结束语</h3>

到这里，关于 `Sentry` 如何做性能监控的原理篇就结束了。下一篇，小编会着重介绍如何通过 `Sentry` 后台管理系统的 `Performance` 面板做性能分析，敬请期待哦。

如果大家觉得本文还不错，记得给小编点个赞哦，😄。


<h3 id="5">参考资料</h3>

- **[前端监控系列3 ｜ 如何衡量一个站点的性能好坏](https://juejin.cn/post/7143201009781702687#heading-10)**

- **[Navigation Timing](https://www.w3.org/TR/navigation-timing/)**

- **[Navigation Timing Level 2](https://www.w3.org/TR/navigation-timing-2/)**

- **[FCP](https://web.dev/fcp/)**、**[FMP](https://web.dev/first-meaningful-paint/)**、**[SI](https://web.dev/speed-index/)**、**[LCP](https://web.dev/lcp/)**、**[TTI](https://web.dev/i18n/zh/tti/)**、**[TBT](https://web.dev/lighthouse-total-blocking-time/)**、**[FID](https://web.dev/fid/)**、**[MPFID](https://web.dev/lighthouse-max-potential-fid/)**、**[Long Task](https://developer.mozilla.org/zh-CN/docs/Web/API/Long_Tasks_API)**、**[CLS](https://web.dev/cls/)**   

- **[Time to First Meaningful Paint](https://docs.google.com/document/d/1BR94tJdZLsin5poeet0XoTW60M0SjvOJQttKT-JK8HI/view)**