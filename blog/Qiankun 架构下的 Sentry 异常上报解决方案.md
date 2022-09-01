---
theme: cyanosis
---

<h3>前言</h3>

最近项目组决定将前端异常监控由 `Fundebug` 切换为 `Sentry`。整个切换过程非常简单，部署一个后台服务，然后将 `Sentry SDK` 集成到前端应用中就完事儿了。在之后的使用过程中，小编遇到了一个问题。由于我们的项目采用的是基于 `qiankun` 的微前端架构，在应用使用过程中，常常会出现发生异常应用和上报应用不匹配的情况。

为了解决这个问题，小编先去 `qiankun` 的 `issue` 下翻了翻，看有没有好的解决方案。虽然也有不少人遇到了同样的问题 - **[求教一下 主子应用的sentry应该如何实践 #1088](https://github.com/umijs/qiankun/issues/1088)**，但是社区里并没有一个好的解决方案。于是乎小编决定自己去阅读 `Sentry` 源码和官方文档，期望能找到一种合理并通用的解决方案。

经过一番梳理，小编如愿找到了解决方案，并且效果还不错。接下来小编就带着大家了解一下整个解决方案的具体情况。

本文的目录结构如下:
- **<a href="#1">使用 Sentry 上报异常</a>**
- **<a href="#2">解决方案</a>**

    - **<a href="#2-1">失败的方案一</a>**
    
    - **<a href="#2-2">不通用的方案二</a>**
    
    - **<a href="#2-3">合理、优雅的方案三</a>**
    
    - **<a href="#2-4">7.x 版本解决方案</a>**
    
- **<a href="3">结束语</a>**


<h3>使用 Sentry 上报异常</h3>

在正式介绍解决方案之前，小编先带大家简单回顾一下一个前端应用是如何接入 `Sentry` 的。

1. 第一步，在 `Sentry` 管理后台构建一个项目

    ![Aug-30-2022 10-20-22.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0537930e4c14f9a85ae832a2acc520e~tplv-k3u1fbpfcp-watermark.image?)

    项目创建好以后，会自动生成一个 `dsn`，这个 `dsn` 会在前端项目接入 Sentry 时作为必填项传入。

2. 第二步，前端应用接入 `Sentry`

    前端应用接入 `Sentry` 也非常简单，只要使用 `Sentry` 提供的 `init` api，传入必传的 `dsn` 就可以了。
    
    
    ```
    import React from "react";
    import ReactDOM from "react-dom";
    import * as Sentry from "@sentry/react";
    import { Integrations } from "@sentry/tracing";
    import App from "./App";

    Sentry.init({
      dsn: "https://90eb5fc98bf447a3bdc38713cc253933@sentry.byai.com/66",
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
    });

    ReactDOM.render(<App />, document.getElementById("root"));
    ```

经过这两步，前端应用的异常监控接入就完成了。当应用在使用时，如果发生异常，`Sentry` 会自动捕获异常，然后上报到后台管理系统。上报完成以后，我们就可以在项目的 `issues` 中查看异常并着手修复。

单个的 `Spa` 应用接入 `Sentry` 时按照上面的步骤无脑操作就可以了，但如果应用是基于 `qiankun` 的微前端架构，那就需要解决异常上报不匹配的问题了。

小编手上的项目就是采用了基于 `qiankun` 的微前端架构，一个页面会至少同时存在两个应用，有时甚至会有 3 到 4 个应用。在应用使用过程中，常常会出现异常上报不匹配的问题。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d902cf5cf3d14a049816b295fd2334e9~tplv-k3u1fbpfcp-watermark.image?)

如上图所示，主应用、cc sdk 应用中的异常都会上报到 aicc 项目中，这给异常处理带来很大的困扰。

出现这个问题的原因也非常好理解。 

 

`Sentry` 在执行 `init` 方法时会通过覆写 `window.onerror`、`window.unhandledrejection` 的方式初始化异常捕获逻辑。之后不管是哪个应用发生异常，都最终会触发 `onerror`、`unhandledrejection` 的 `callback` 而被 `Sentry` 感知，然后上报到 `dsn` 指定的项目中。而且 `Sentry` 的 `init` 代码不管是放在主应用中，还是放在子应用里面，都没有质的改变，所有被捕获的异常还是会一股脑的上报到某个项目中，无法自动区分。

了解了异常上报无法自动区分的问题，接下来小编就给大家讲一下自己是如何解决这个问题的。


<h3>解决方案</h3>

想要解决这个问题，我们必须要先找到问题的切入点，而异常上报时的接口调用就是这个切入点。


当 `Sentry` 捕获到应用产生的异常时，会调用一个接口来上报异常，如下:


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f013f6bb47c4334a83099db720f76a9~tplv-k3u1fbpfcp-watermark.image?)

对比这个接口的 `url` 和上报应用的 `dsn`，我们可以发现异常上报接口的 `url` 其实是由上报应用的 `dsn` 转化来的，转化过程如下:

```
// https://62187b367e474822bb9cb733c8a89814@sentry.byai.com/56
dsn - https://{param1}@{param2}/{param3}
                |
                |
                v
url - https://{param2}/api/{param3}/store/?sentry_key={param1}&sentry_version=7

```

我们再来看看这个上报接口携带的参数:

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1119da1835c479589ab8ecf2baac73a~tplv-k3u1fbpfcp-watermark.image?)

在接口参数中，`exceptions.values[0].stacktrace.frames` 是异常的追踪栈信息。通过栈信息中的 `filename` 字段，我们可以知道发生异常的 `js` 文件的 `url`。通常情况下，微前端中各个子应用的 `js` 的 `url` 前缀是不相同的(各个子应用静态文件的位置是分离的)，那么根据发生异常的 `js` 的 `url` 就可以判断该异常属于哪个应用。

有了上面两个信息，异常上报自动区分的解决方案就清晰明了了:

1. 第一步拦截异常上报接口，拿到异常详情，根据追踪栈中的 `filename` 判断异常属于哪个应用；

2. 第二步，根据匹配应用的 `dsn` 重新构建 `url`；

3. 第三步，使用新的 `url` 上报异常；

在这个方案中，最关键的是拦截异常上报接口。为了能实现这一步，小编进行了各种尝试。

<h4>失败的方案一</h4>

由于 `Sentry` 异常上报是通过 `window.fetch(url, options)` 来实现的，所以我们可以通过覆写 `window.fetch` 的方式去拦截异常上报。

代码实现如下:

```
const originFetch = window.fetch;
window.fetch = (url, options) => {
    // 根据 options 中的异常信息，返回新的 url 和 options
    const [newUrl, newOptions] = sentryFilter(url, options);
    // 使用原生的 fetch
    return originFetch(newUrl, newOptions);
}
```
该方案看起来很简单，也很靠谱，然而在实际使用的时候并未发挥作用，原因是 `Sentry` 内部只会使用原生的 `fetch`。如果发现 `fetch` 方法被覆写，那么 `Sentry` 会通过自己的方式重新去获取原生的 `fetch`。

小编截取了 `Sentry` 的部分源码给大家看一下:

```
...

// FetchTransport 是一个构造函数
// Sentry 在执行 init 方法时会构建一个 FetchTransport 实例，然后通过这个 FetchTransport 实例调用 window.fetch 方法去做异常上报
function FetchTransport(options, fetchImpl) {
    if (fetchImpl === void 0) { fetchImpl = getNativeFetchImplementation(); }
    var _this = _super.call(this, options) || this;
    _this._fetch = fetchImpl;
    return _this;
}

// 使用原生的 window.fetch 实现 FetchTransport
function getNativeFetchImplementation() {
    if (cachedFetchImpl) {
        return cachedFetchImpl;
    }
    // 根据 isNativeFetch 来判断 window.fetch 是否被覆写
    if (isNativeFetch(global$7.fetch)) {
        return (cachedFetchImpl = global$7.fetch.bind(global$7));
    }
    var document = global$7.document;
    var fetchImpl = global$7.fetch;
    // 如果被覆写，借助 iframe 获取原生的 window.fetch
    if (document && typeof document.createElement === 'function') {
        try {
            var sandbox = document.createElement('iframe');
            sandbox.hidden = true;
            document.head.appendChild(sandbox);
            var contentWindow = sandbox.contentWindow;
            if (contentWindow && contentWindow.fetch) {
                fetchImpl = contentWindow.fetch;
            }
            document.head.removeChild(sandbox);
        }
        catch (e) {
            logger.warn('Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ', e);
        }
        }
    return (cachedFetchImpl = fetchImpl.bind(global$7));
}

// 判断 window.fetch 是否已经被覆写
function isNativeFetch(func) {
    return func && /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString());
}

```
由于 `Sentry` 内部有一套逻辑来保证 `fetch` 必须为原生方法，所以覆写 `window.fetch` 的方案失败， `pass` ！

<h4>不通用的方案二</h4>

既然覆写 window.fetch 的方案行不通，那我们就重新想办法。

观察上面的 FetchTransport 的入参。如果没有指定 fetchImpl，Sentry 会通过 getNativeFetchImplementation 来实现一个 fetchImpl。那我们主动给 FetchTransport 传递覆写以后的 fetch 方法，不就可以拦截 fetch 调用了吗？

这个方案看起来也很靠谱，赶紧试一下。

从 FetchTransport 追本溯源，小编找到了 FetchTransport 方法调用的位置:

```
BrowserBackend.prototype._setupTransport = function () {
    if (!this._options.dsn) {
        return _super.prototype._setupTransport.call(this);
    }
    var transportOptions = __assign(__assign({}, this._options.transportOptions), { dsn: this._options.dsn, tunnel: this._options.tunnel, sendClientReports: this._options.sendClientReports, _metadata: this._options._metadata });
    var api = initAPIDetails(transportOptions.dsn, transportOptions._metadata, transportOptions.tunnel);
    var url = getEnvelopeEndpointWithUrlEncodedAuth(api.dsn, api.tunnel);
    if (this._options.transport) {
        return new this._options.transport(transportOptions);
    }
    if (supportsFetch()) {
        var requestOptions = __assign({}, transportOptions.fetchParameters);
        this._newTransport = makeNewFetchTransport({ requestOptions: requestOptions, url: url });
        return new FetchTransport(transportOptions);
    }
    this._newTransport = makeNewXHRTransport({
        url: url,
        headers: transportOptions.headers,
    });
    return new XHRTransport(transportOptions);
};

```
在上面的这段代码中， this._options 就是我们执行 Sentry.init 时的入参。观看 FetchTransport 调用的地方，没有 fetchImpl 的入参，所以 Sentry 会通过 getNativeFetchImplementation 来实现 fetchImpl。既然这样，那我们可以在 Sentry.init 方法执行的时候添加一个 fetchImpl 入参，然后再调用 FetchTransport 方法时传入。

改造后的代码如下:

```
// 改动 Sentry 源码
BrowserBackend.prototype._setupTransport = function () {
    ...
    if (supportsFetch()) {
        var requestOptions = __assign({}, transportOptions.fetchParameters);
        this._newTransport = makeNewFetchTransport({ requestOptions: requestOptions, url: url });
        return new FetchTransport(transportOptions, this._options.fetchImpl);
    }
    ...

}

// 业务代码
const originFetch = window.fetch;
// Sentry.init 执行
Sentry.init({
    dsn: 'xxx',
    ...
    fetchImpl: (url, options) => {
        // 根据 options 中的异常信息，返回新的 url 和 options
        const [newUrl, newOptions] = sentryFilter(url, options);
        // 使用原生的 fetch
        return originFetch(newUrl, newOptions);
    }
    ...
});
```
经验证，该方案可正常工作，捕获的异常都可自动上报到对应的应用中，perfect 😄。

兴奋过后，再回过头来看看这个方案，发现其实槽点还是蛮多的:

1. 要修改 Sentry 源码，重新生成一个内部 npm 包；

2. 如果 Sentry 版本升级，必须再次修改源码；

总体来说，这个方案虽然能解决问题，但是不够通用，不够优雅。作为一名有追求的 👨🏻‍💻，小编当然不能仅仅止步于实现功能，还得想办法实现的更好，于是就有了接下来的方案三。
   





<h4>合理、优雅的方案三</h4>

<h4>7.x 版本解决方案</h4>



<h3>结束语</h3>