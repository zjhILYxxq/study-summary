#### 围绕交付周期设计前端稳定性体系

**交付周期**:
- 开发阶段 - 代码规范(书写规范)、代码质量(eslint、tslint、codeReview 等)、自动化测试、性能检测；
- 编译部署 - webpack、k8s、docker；
- 线上阶段 - 异常监控、性能监控、数据埋点；

**sentry** 接入:
- 无感知接入：提供一个 npm 包，直接在入口文件添加 sentry 的初始化过程; 修改 package.json 的 scrpt 脚本(可以使用命令行工具更新项目);
- 告警过滤: 目前还是在 sentry 中设置告警过滤信息；
- 告警通知: webhook + 微信机器人；(需要根据异常信息，确定异常的优先级，通知的指定人员)；
- 告警处理结果: 后续接入工作台，统计异常处理情况



#### 整个 sentry 接入

SaaS 项目 sentry 的接入总共分为三个阶段：
- **子项目 sentry 配置初始化**

    子项目需要做两件事情:
    - 上传 source-map；
    - 添加错误边界，主动上报异常；
  
    这里可以通过脚手架 byai-cli 中的 sentry-init 命令给每个子项目做 sentry 配置的初始化
    - 创建 .sentryrc 文件(token、url、projectName) 等；
    - 创建一个 HOC， 包装 App，HOC 内部设置错误边界；
    - 修改 package.json 的 script 脚本；
    - 安装 sentry 依赖；

- **微前端异常上报**

    这里做的事情： 魔改 sentry.js， 拦截最后一步异常上报的接口请求操作，拿到要上报的异常信息，根据异常信息追踪栈，找到对应的子应用，将异常信息上报给对应的子应用的 sentry 项目。

    关键:
    - 主应用中接入 sentry，调用 Sentry 的 init 方法；
    - 根据异常信息找到对应的子应用，重新拼装 url，然后通过原生的 fetch 方法上报异常；
  
- **上报异常处理**

    关键: 
    - 有一个 node 服务，用于将 sentry 的异常信息通过企业微信机器人，通知对应的负责人进行处理；
    - 配置 sentry 子项目的 webhook(通过内部服务)


#### sentry 上报异常 source map 不生效:

qiankun 运行js时， 会把 script 的 src 作为 sourceurl 添加到尾行
会在首行添加 ;(function(window, self, globalThis){with(window){，导致 err stack 内的 1231:1 含有 qiankun 的代码， 与 sourcemap 的 1231:1 不符。

解决方法是 webpack.BannerPlugin插件在开头加一行注释，这样sourcemap会从第二行开始。


#### sentry 监控原理

每当代码在 **runtime** 时发生错误时，**JavaScript** 引擎就会抛出一个 **Error** 对象，并且触发 **window.onerror** 函数。

**Sentry** 对 **window.onerror** 函数进行了改写，在这里实现了错误监控的逻辑，添加了很多运行时信息帮助进行错误定位，对错误处理进行跨浏览器的兼容等等。

在我们使用 **Promise** 的时候，如果发生错误而我们没有去 **catch** 的话，**window.onerror** 是不能监控到这个错误的。但是这个时候，**JavaScript** 引擎会触发 **unhandledrejection** 事件，只要我们监听这个事件，那么就能够监控到Promise产生的错误。

对于跨域的 JS 资源，**window.onerror** 拿不到详细的信息，需要往资源的请求添加额外的头部。为了拿到详细信息，需要做两件事情：一是跨域脚本的服务器必须通过 **Access-Control-Allow-Origin** 头信息允许当前域名可以获取错误信息，二是网页里的 **script** 标签也必须指明 **src** 属性指定的地址是支持跨域的地址，也就是 **crossorigin** 属性。有了这两个条件，就可以获取跨域脚本的错误信息。



#### 前端埋点

前端埋点方式:
- 代码埋点，入侵时手动埋点；
- 无代码埋点，引入流行的埋点库(事件代理？原生方法覆写?);



#### 前端异常监控问题相关

- [x] 常见的 js 异常类型

    Error，最基本的错误类型，其他的错误类型都继承自该类型。通过 Error，我们可以自定义 Error 类型。

    RangeError: 范围错误。当出现堆栈溢出(递归没有终止条件)、数值超出范围(new Array 传入负数或者一个特别大的整数)情况时会抛出这个异常

    ReferenceError，引用错误。当一个不存在的对象被引用时发生的异常。

    SyntaxError，语法错误。如变量以数字开头；花括号没有闭合等。

    TypeError，类型错误。如把 number 当 str 使用。

    URIError，向全局 URI 处理函数传递一个不合法的 URI 时，就会抛出这个异常。如使用 decodeURI('%')、decodeURIComponent('%')。

    AggregateError，把多个错误包装为一个错误，如果 Promise.any([...]).cath(error => console.log(error.errors))。

    InternalError， js 引擎内部的异常。

    EvalError， 一个关于 eval 的异常，不会被 javascript 抛出。

    能捕捉到的异常，必须是线程执行已经进入 try catch 但 try catch 未执行完的时候抛出来的。

- [ ] Sentry 异常处理机制

- [ ] 异常监控相关问题

- [ ] 微前端下异常处理 








