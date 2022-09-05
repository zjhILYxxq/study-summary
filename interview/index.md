#### 准备内容

本次准备内容:

- 项目亮点介绍

  - [x] SaaS 项目的一系列优化点

    为什么之前 SaaS 之前用的是 ssr 架构？ 有什么好处？ 有什么劣势？

    微前端采用 qiankun 的初衷是什么？

    为什么要使用 module federation? 除了这种方式还有吗？

    SaaS 首屏性能是怎么优化的？
  
    如何解决 qiankun 开启严格样式隔离后子应用出现页面抖动问题?

    
  - [x] Sentry 前端监控的亮点
  
    建立一套异常处理的闭环逻辑: 项目初始化、异常捕获、异常自动上报对应子应用、异常自动通知(飞书捷径)、异常处理；

    项目初始化: 通过 byai-cli 的 sentry-init 功能，可以根据项目的类型对项目进行 sentry 配置初始化。为每一个项目初始化 .sentryclirc 文件、初始化 package.json 中上传 source-map 的命令、初始化一个 HOC - SentryErrorWrapper、安装 @sentry/browser @sentry/tracing @sentry/react 等依赖包。

    微前端的异常处理逻辑: 
    - 主应用接入 Sentry.init 逻辑，通过 props 将 Sentry 对象传递给子应用；
    - 主应用对捕获的异常做拦截，分析异常属于哪个子应用，根据子应用的 dsn 重组 url，将异常上报给正确的项目；

    异常自动通知:
    - 配置一个飞书捷径，对接 Sentry 的 webhook，然后将异常推送到飞书群中，并指定负责人；
    - 相关负责人收到推送以后，建立 jira，分配给具体的处理人。

    Sentry 异常监控、性能监控的原理 !!

  
  - [x] Vite 接入的亮点

    对已有项目进行改造，开发模式采用支持 Vite、Webpack, 生产环境还是使用 Webpack。

    在改造过程中，总结遇到的问题，修复并抽象为插件： UrlResolvePlugin、LazyLoadPrefetchPlugin。

    提炼了了一套标准配置项、常用的 plugin，通过 byai-cli 的 vite-init 命令可一键初始化。

- 前端知识
  - [ ] 微前端
  - [ ] react
  - [ ] 构建工具 Webpack、Vite、Rollup、Esbuild
  - [ ] ssr
  - [ ] typescript
  - [ ] 前端监控
  - [ ] 基础知识

  - [ ] lerna、webrtc、前端工程化、k8s、docker、CI/CD 等
  
- 算法
  - [ ] 动态规划
  - [ ] 回溯
  - [ ] dfs / dfs
  - [ ] n 数之和
  - [ ] 左右指针 + 滑动窗口
  - [ ] 链表
  - [ ] 二叉树
  - [ ] 排序
  - [ ] 查找