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

`Sentry` 在执行 `init` 方法时会通过覆写 `window.onerror`、`window.unhandledrejection` 的方式初始化异常捕获逻辑。之后不管是哪个应用发生异常，都最终会触发 `onerror`、`unhandledrejection` 的 `callback` 而被 `Sentry` 感知，然后上报到 `dsn` 指定的项目中。而且 `Sentry` 的 `init` 过程不管是放在主应用中，还是放在子应用里面，都没有质的改变，所有被捕获的异常还是一股脑的上报到某个项目中，无法自动区分。

了解了异常上报不匹配的问题，接下来小编就给大家讲一下自己是如何解决这个问题的。



<h3>解决方案</h3>

<h4>失败的方案一</h4>

<h4>不通用的方案二</h4>

<h4>合理、优雅的方案三</h4>

<h4>7.x 版本解决方案</h4>



<h3>结束语</h3>


