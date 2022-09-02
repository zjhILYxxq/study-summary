- [x] 性能监控

    1. `Performance API` 的使用

        `Performance` 接口可以获取到当前页面中与性能相关的信息。该类型的对象可以通过 `window.performance` 来获得。

        常用的 `API`：

        - `performance.navigation`

            `performance.navigation` 提供了与页面导航操作相关的信息，包括页面是加载还是刷新、发生了多少次重定向。

            即通过 `performance.navigation.type`, 就可以知道触发页面加载的动作：
            - `0`，点击链接、直接输入 url、脚本操作(直接操作 href) 等；
            - `1`，点击刷新按钮、Location.reload()'
            - `2`，通过 history 访问；
            - `255`， 其他方式；

            此外，通过 `performance.navigation.redirectCount` 还可以知道到达这个页面之间重定向了多少次。


        - `performance.timing`


        - `performance.getEntries()`

            通过 `performance.getEntries()`，可以获取 web 页面整个生命周期中各个操作的开始时间和耗时时间，包括服务端响应时间、FP 时间、资源请求时间、接口请求时间。

            常见的操作类型如下:
            - `navigation`，导航类型, 通过 `navigation` 可以获取如下时间:
            - `unloadEventStart` - 前一个页面卸载事件开始的时间；
            - `unloadEventEnd` - 前一个页面卸载事件结束的时间；
            - `fetchStart` - 浏览器准备好使用 http 抓取文档的时间，发生在检查本地缓存之前；
            - `domainLookupStart` - DNS 域名查询开始的时间；
            - `domainLookupEnd` - DNS 域名查询完成的时间；
            - `connectStart` - TCP 开始建立的时间；
            - `connectEnd` - TCP 完成建立的时间；
            - `requestStart` - html 页面开始请求的时间；
            - `responseStart` - html 页面响应的开始时间；
            - `responseEnd` - html 页面响应的结束时间；
            - `domLoading` - 开始解析 dom 树的时间；
            - `domInteractive` - dom 树解析完成的时间，此时可以操作 dom 树；
            - `domContentLoadedEventStart` - DomContentLoaded 事件开始时间；
            - `domContentLoadedEventEnd` - DomContentLoaded 事件结束时间；
            - `domComplete` - dom 树解析完成，所有的资源也准备就绪；
            - `loadEventStart` - loaded 事件开始时间；
            - `loadEventEnd` - loaded 事件结束时间；
            - `type`, 导航类型， 值为 navigate、reload、back_forward、prerender 等；
            - `resource`, 资源类型，包括接口请求、静态资源获取、DNS 域名解析等，可获取开始时间、耗时时间、请求资源大小等；
            - `paint`, 渲染类型, 包括 FP、FCP、LCP 等。
            - `longtask` - 长任务类型， 可以获取长任务(超过 50 ms) 的开始时间、耗时时间；
            - 

            通过 `performance.getEntriesByType()`、`performance.getEntriesByName()` 可以获取指定类型的 `PerformanceEntry`。
        
        
        - `performance.now()`

            用于计算从浏览器开始导航到当前调用经过的时间，是一个相对时间。

            和 `Date.now()` 的对比：
            - 精度高，可到微妙；
            - 相对时间，不受本地时钟影响；

    2. 首屏关键指标

       - `FP`, `First Paint`，页面在导航后首次呈现出不同于导航前内容的时间点，通过 `performance.getEntriesByName('first-paint')` 可以获取 `FP` 的时间；

       - `FCP`, `First Contentful Paint`，首次绘制任何文本、图像、非空白 canvas 或者 SVG 的时间点，通过 `performance.getEntriesByName('first-contentful-paint')` 可以获取 `FCP` 的时间；

       - `LCP`, `Largest Contentful Paint`，最大内容绘制，通过 `PerformanceObserver` 监听 `largest-contentful-paint` 可以获取 `LCP` 时间；

       - `FID` - `First Input Delay`， 首次输入延迟，用于测量从用户第一次与页面交互到浏览器对交互做出响应，并且开始处理事件处理程序所经过的时间，通过 `PerformanceObserver` 监听 `first-input` 可以获取 `FID` 时间；

       - `TTFB`, 首字节时间， 可以用过 `responseStart` - `fetchStart` 获取；
  
       - `TTI`, `time to interactive`, 可交互时间，计算方式： 安静窗口期之前最后一个长任务的结束时间，如果没有长任务，则为 `FCP`；
  
            长任务监听: `performanceObserver` 监听 `longtast`；

            安静窗口期：没有长任务且不超过两个正在处理的网络 get 请求(通过拦截 xhr、fetch、mutationObserver 监听)；

            计算方式： 建立一个缓存池，启动的请求添加到缓存池中，结束的请求移除缓存池。当缓存池中的中请求小于 3 且没有长任务时，建立一个 5s 的定时器。5s 之后，如果请求还是 2 且没有长任务，那么就找到了安静窗口，然后再找到安静窗口之前的最后一个长任务。

       - `TBT`, `FCP` 和 `TTI` 之间的总时间；
  
       - `CLS`, 累积布局偏移， 通过 `PerformanceObserver` 监听 `layout-shift` 可以获取；


        `Web Vitals` 需要统计的三个指标: `LCP`、`CLS`、`FID`

    3. 首屏性能指标的优化方式

        `FP`, 优化方式: 优化服务器响应速度(SSG、index.html 静态页面)、script 脚本放在 body 底部、

        `FCP`, 优化方式就是**消除渲染阻塞资源**，优化手段有 SSR(最好是 SSG)、资源 preload、通过合理的分包配置减小入口文件的体积、利用缓存、script 脚本放在 body 底部；

        `LCP`, 优化方式就是: SSR、资源 preload、利用缓存；

        `TTI`, 优化方式: 资源预加载(缓存)、web worker、缩小 js、 减少 js 执行时间、减少初始请求；

        `TBT`, 优化方式: web worker、减少 js 执行时间、减少初始请求；


        总结: 
        - **让用户尽早看到页面** - FP、FCP、LCP，资源预加载、SSR、script 脚本放在 body 底部；
        - **让用户尽早可以操作页面** - 减少 js 执行时间、减少初始请求、web worker 等；

    4. DomContentLoaded 和 loaded

        `domLoading`, dom 树开始解析， 解析到一半的 dom 树也会渲染；

        `domInteractive`, 整个 dom 树解析完成， 所有的 js 脚本全部执行完毕。

        `DomContentLoaded`, dom 树解析完成就可以触发 `DomContentLoaded` 事件

        `domComplete`, dom 树解析完成，资源请求完毕。

        `onload`, dom 树解析完成，资源请求完毕即可触发 `onload` 事件。

        `async 异步脚本` 没有顺序，加载完毕之后会立即执行，且会阻塞 dom 树的解析。

        `defer 异步脚本` 有顺序，不会阻塞 dom 树的解析。

    5. Sentry 性能监控做了哪些事情？

        首屏：统计首屏指标 + 接口

        每次页面跳转: 资源加载 + 接口

    6. Sentry 是如何做性能监控的？

        Sentry 的性能监控也非常简单，需要监控首屏性能、懒加载性能和接口性能。

        首屏性能数据的获取方式: 通过 window.performace.getEntry() 和通过 performanceObserver 监听 CLS、FID、LCP 指标。

        懒加载性能: 通过劫持并重写 history 的 pushState、replaceState、onpopstate 方法，获取到页面跳转，再通过 window.performance.getEntry() 收集懒加载获取静态资源、接口。

        接口性能: 通过 window.performance.getEntry() 获取接口的情况，通过劫持 fetch / xhr 的 onload 方法获取接口的请求情况。

        收集到性能指标以后，然后通过一个 ajax 请求发送到 Sentry 后端。

    7. Sentry 如何上报性能监控数据

        Sentry 默认情况下，通过一个 setTimeout 来延迟 1s 来上报首屏、懒加载的性能数据。

        这个 timeout 可以配置。

        Sentry 在上报一个性能监控数据时，如果发现上一次性能监控没有结束，会先结束上一次性能监控并上报，然后才开始新的性能监控。


    8. 采样率是一个什么东西？

        性能监控数据以什么样的频率上报。

        如果是 1.0, 这每次 pageload、懒加载都上报.
        
        如果是 0.5, 则会有 50% 的几率上报。

        如果是 0， 则不上报。

        采样率越高，数据越丰富。
    
    9.  heart beat 心跳是一个什么东东？

        sentry 在做性能监控时，如果一个性能监控数据一直没有上报，那么会做三次心跳，间隔 5s。如果三次心跳结束以后，还没有上报，就自动上报。
    



- [x] 异常监控

    1. 完善的异常监控，需要做哪些事情:
       - 应用报错时，可以及时知晓，及时安排人员修复问题，这就需要做到异常推送；
       - 修复报错时，可以追踪到用户行为，帮助 bug 复现，这一点对应 Sentry 里面的 breadcrumb；
       - 修复报错时，可以找到错误行列及其他详细信息，帮助快速定位异常源代码；
       - 数据统计功能，分析错误数、错误率、影响用户数、异常处理等关键指标，这就需要做到可视化异常统计、异常处理统计；

    2. 常见的前端异常类型:
       - 常见的 `js` 代码执行异常， 这类型的异常可以通过 `window.onerror` 或者 `window.addEventListener('error', callback)` 捕获；
       - `promise` 类异常，这类型的异常可以通过 `window.unhandledrejection` 或者 `window.addEventListener('handlerejection', callback)` 捕获；
       - 资源加载异常，这类型的异常可以通过 `window.addEventListener('error', callback, true`) 来捕获；
       - 网络请求异常，对 `xhr` (分析 `onerror`、`onload` 的结果) 或者 `fetch` 做劫持，然后对返回的结果做判断；
       - 跨域脚本异常，跨域的脚本只会报简单的 `script error` 异常，没有异常的详细信息，这个时候需要先在 script 添加 crossorigin="anonymous"，然后给响应信息添加 Access-Control-Allow-Origin: *；


    3. 常见的 `js` 异常类型:

       - `Error`，最基本的错误类型，其他的错误类型都继承自该类型。通过 Error，我们可以自定义 Error 类型。

       - `RangeError`: 范围错误。当出现堆栈溢出(递归没有终止条件)、数值超出范围(new Array 传入负数或者一个特别大的整数)情况时会抛出这个异常

       - `ReferenceError`，引用错误。当一个不存在的对象被引用时发生的异常。

       - `SyntaxError`，语法错误。如变量以数字开头；花括号没有闭合等。

       - `TypeError`，类型错误。如把 number 当 str 使用。

       - `URIError`，向全局 URI 处理函数传递一个不合法的 URI 时，就会抛出这个异常。如使用 decodeURI('%')、decodeURIComponent('%')。

       - `AggregateError`，把多个错误包装为一个错误，如果 Promise.any([...]).cath(error => console.log(error.errors))。

       - `InternalError`， js 引擎内部的异常。

       - `EvalError`， 一个关于 eval 的异常，不会被 javascript 抛出。

        能捕捉到的异常，必须是线程执行已经进入 `try catch` 但 `try catch` 未执行完的时候抛出来的。


    4. 如何给特殊异常打标记？比如说我想区分 setTimeout 和 requestAnimationFrame 的 callback 中发生的异常，或者我想区分接口回调和事件回调中发生的异常？

        js 代码执行的异常，我们可以通过 window.onerror 或者 window.addEventListener('error', callback) 来捕获异常，查看异常的追踪栈信息。

        这其实也够用了，但是如果我们想拿到一些更准确的信息，比如是在 setTimeout 中出现异常、事件中出现异常，还是接口中出现异常，这是我们可以对 setTimeout、setInterval、requestAnimationFrame、requestIdleCallback、Node 的 addEventListener 原型方法进行覆写，对 callback 使用 try...catch... 包装，给特殊类型的异常打标记。


    5. 如何获取异常发生时的用户行为？

        常见的用户行为: 页面跳转、鼠标点击行为、键盘 press 行为、fetch / xhr 请求的 url、console 打印的信息等。

        收集异常发生时的用户行为，主要是为了重现问题。
    
        为了记录这些行为，我们可以对 history、console 的 api、fetch、 XMLHttpRequest 原型链上的 open / send 方法、Node 原型链上 addEventListener 方法覆写，拦截相关操作，拿到路由跳转信息、点击/press 事件发生的 dom 节点、 请求的 url、console 打印的信息等。

        然后把这些行为和捕获到的异常一起上报，根据异常追踪栈信息和用户行为，就可以定位问题并重现问题。


    6. 如何判断一个不需要重复上报的异常？

        判断异常的类型、异常的值、异常的追踪栈是否相等：追踪栈的长度、每一层的信息是否完成相等



    1. 如何过滤一个异常？



- [x] 用户行为追踪

    常见的用户行为追踪:
    - PV/UV;
    - 用户的基本信息；
    - 用户行为记录(点击操作、路由切换操作、接口请求情况等)；
    - 页面停留时间;

    PV: 每个页面都有一个 PV 接口，由后端根据接口的调用数量来统计 PV。

    UV: 由后端来统计。

    用户的基本信息：将用户浏览器信息、用户 id 等信息通过接口上报。

    用户行为记录: 对路由切换、点击、接口请求做拦截，收集用户行为。

    页面停留时间: 拦截路由 pushState、replaceState、onpopstate 方法，收集页面停留时间。

  

- [x] 微前端下异常处理 

    微前端下异常上报存在的问题: 由于同一个页面可能会存在一个或者多个应用，导致出现异常出现的应用和上报的应用不匹配的情况。

    解决思路: 主应用设置一个拦截器，拦截异常上报接口，根据异常的堆栈信息判断异常属于哪个应用，然后重组接口参数，将异常上报到正确的应用。

    Sentry 异常上报最后一步是通过 fetch 实现的，内部实现了一个 fetchTransport。

    而我们的解决方法就是覆写这个 fetchTransport，重新实现它。

    解决方案:
    - 6.x 版本

        在执行 init 方法的时候，传入一个自定义的 transport。

        这个 transport 继承自 FetchTransport。

        在 transport，我们可以对异常重新分析，看它属于哪个应用。

        ```
        const { FetchTransport } = Transports;

        const fetchImpl = (url, options) => {
            console.log(url, options);
            const [newUrl, newOptions] = sentryFilter(url, options);
            console.log('newUrl', newUrl, 'newOptions', newOptions);
            return window.fetch(newUrl, newOptions);
        };

        class MyFetchTransport extends FetchTransport {
            constructor(options) {
                super(options, fetchImpl);
            }
        }
        // @ts-ignore
        init({
            // byai-console 对应的 dsn
            dsn: 'https://525053cc037e42bcb981670e97a0a821@sentry.byai.com/52',
            enabled: true,
            environment: feConfig.API_ENV || 'local',
            transport: MyFetchTransport,
        });
        ```

    - 7.x 版本

        基于 Sentry 提供的 makeFetchTransport, 自定义一个 transport

        ```
            const myCustomeTransport = (options: BrowserTransportOptions) => {
                const fetchImpl = (url, options) => {
                    console.log('oldUrl', url, options);
                    const [newUrl, newOptions] = sentryFilter(url, options);
                    console.log('newUrl', newUrl, 'newOptions', newOptions);
                    return window.fetch(newUrl, newOptions);
                };
                return makeFetchTransport(options, fetchImpl);
            };

            // @ts-ignore
            init({
                // byai-console 对应的 dsn
                dsn: 'https://525053cc037e42bcb981670e97a0a821@sentry.byai.com/52',
                enabled: true,
                environment: feConfig.API_ENV || 'local',
                transport: myCustomeTransport,
            });

        ```

- [x] SaaS 应用的 Sentry 接入方案

    SaaS 项目 sentry 的接入总共分为三个阶段：

    - 子项目 sentry 配置初始化

        子项目需要做两件事情:
        - 上传 source-map；
        - 添加错误边界，主动上报异常；
      
        这里可以通过脚手架 byai-cli 中的 sentry-init 命令给每个子项目做 sentry 配置的初始化
        - 创建 .sentryrc 文件(token、url、projectName) 等；
        - 创建一个 HOC， 包装 App，HOC 内部设置错误边界；
        - 修改 package.json 的 script 脚本；
        - 安装 sentry 依赖；

    - 微前端异常上报

        继承 Sentry 暴露给外面的 Transport.FetchTransport，自定义一个 CustomeTransport，重写 window.fetch 拦截异常上报。

        关键:
        - 主应用中接入 sentry，调用 Sentry 的 init 方法；
        - 根据异常信息找到对应的子应用，重新拼装 url，然后通过原生的 fetch 方法上报异常；
      
    - 上报异常处理

        关键: 
        - 有一个 node 服务，用于将 sentry 的异常信息通过企业微信机器人，通知对应的负责人进行处理；
        - 配置 sentry 子项目的 webhook(通过内部服务)

- [x] sentry 上报异常 source map 不生效

    qiankun 运行js时， 会把 script 的 src 作为 sourceurl 添加到尾行
    会在首行添加 ;(function(window, self, globalThis){with(window){，导致 err stack 内的 1231:1 含有 qiankun 的代码， 与 sourcemap 的 1231:1 不符。

    解决方法是 webpack.BannerPlugin插件在开头加一行注释，这样sourcemap会从第二行开始。


- [x] 异常监控的架构设计

    一个完善的异常监控需要: 搜集上报端(前端 SDK)、采集聚合端(后台服务)、可视化分析端、监控告警端

    收集上报端: 异常捕获、异常上报、可以跨平台。

    采集聚合端: 错误表示、错误过滤、错误聚合、错误存储、削峰限流(设置一个采样率)

    可视化分析: 查看异常信息、性能监控信息、异常统计信息、异常修复信息等。

    监控告警: 通过一个 webhook，然后接入 企业微信、飞书

- [x] 围绕交付周期设计前端稳定性体系

    交付周期:
    - 开发阶段 - 代码规范(书写规范)、代码质量(eslint、tslint、codeReview 等)、自动化测试、性能检测；
    - 编译部署 - webpack、k8s、docker；
    - 线上阶段 - 异常监控、性能监控、数据埋点；

    sentry 接入
    - 无感知接入：提供一个 npm 包，直接在入口文件添加 sentry 的初始化过程; 修改 package.json 的 scrpt 脚本(可以使用命令行工具更新项目);
    - 告警过滤: 目前还是在 sentry 中设置告警过滤信息；
    - 告警通知: webhook + 微信机器人；(需要根据异常信息，确定异常的优先级，通知的指定人员)；
    - 告警处理结果: 后续接入工作台，统计异常处理情况

- [x] sentry 监控原理

    每当代码在 runtime 时发生错误时，JavaScript 引擎就会抛出一个 Error 对象，并且触发 window.onerror 函数。

    Sentry 对 window.onerror 函数进行了覆写，在这里实现了错误监控的逻辑，添加了很多运行时信息帮助进行错误定位，对错误处理进行跨浏览器的兼容等等。

    在我们使用 Promise 的时候，如果发生错误而我们没有去 catch 的话，window.onerror 是不能监控到这个错误的。但是这个时候，JavaScript** 引擎会触发 unhandledrejection 事件，只要我们监听这个事件，那么就能够监控到Promise产生的错误。

    对于跨域的 JS 资源，window.onerror 拿不到详细的信息，需要往资源的请求添加额外的头部。为了拿到详细信息，需要做两件事情：一是跨域脚本的服务器必须通过 Access-Control-Allow-Origin 头信息允许当前域名可以获取错误信息，二是网页里的 script 标签也必须指明 src 属性指定的地址是支持跨域的地址，也就是 crossorigin 属性。有了这两个条件，就可以获取跨域脚本的错误信息。


- [x] 前端埋点

前端埋点方式:
- 代码埋点，入侵时手动埋点；
- 无代码埋点，引入流行的埋点库, 方式主要有: 事件代理、方法覆写。












