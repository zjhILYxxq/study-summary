#### 准备内容

本次准备内容:

- 项目介绍

  - [x] SaaS 项目准备
  
    1. 微前端架构下项目部署的情况
    - SaaS (非容器话部署)
      1. 每个子应用通过 webpack 打包，生成 asset-manifest.json 文件，静态资源全部上传到 cdn;
      2. 获取当前 branch、commit 信息，以及入口 js 文件、css 文件的链接，通过 deploy 接口上传到 lego；
      3. 主应用通过 resource 接口，获取各个子应用当前 active 的 js、css 链接；
      4. 给 qiankun 的每一个子应用配资 entry 的 js、css 资源；
      5. 可以通过 lego 对子应用进行回滚，选定历史某个版本作为 active；

      主应用是一个 node 应用，部署的时候也是容器话部署，需要指定端口号、app_name、环境、项目类型 - node、启动命令。

    - byfe-scrm(容器化部署)
      1.  每个子应用通过 webpack 打包，静态资源上传到 cdn( 也可以不上传)；
      2.  将 build 文件做一个压缩包 htm.tar.gz;
      3.  使用 docker 打包一个镜像(指定 app_name、端口号、环境、项目类型 - html)；
      4.  部署镜像；
      5.  主应用配置路由对应的 nginx，将路由指向子应用的 entry；
      6.  回滚子应用可以通过镜像回滚；

      主应用是一个 html 静态应用，和子应用没有区别。

    1. 为什么之前 SaaS 之前用的是 ssr 架构？ 

            - 首屏性能优化，主应用可以直出 html 页面；借助 SSR，子应用也可以直出 html 页面，还可以预加载；
    - 实现一个简单的 BFF 层，可以实现权限控制、版本控制、接入到第三方应用时的鉴权控制、接口聚合、接口缓存、承接复杂业务等；



    2. 微前端采用 qiankun 的初衷是什么？

        原来的架构的缺点:

        - 不能满足新的业务需求。原来的业务，是一级菜单在顶部，按照项目来划分，二级菜单是子应用里面的路由配置，采用原来的架构，用户使用应用时，割裂感不是很强。新业务线调整以后，功能划分不再以项目划分，而是根据业务线来划分的，这就导致了页面上的某一个一级菜单下的二级菜单来自不同的子应用。这个时候，原来的架构带来的体验就不好了，割裂感特别严重，这时就需要我们的 SaaS 应用也能达到 SPA 的效果。
  
        - 重构子项目时，只能通过 iframe 的方式接入, 开发体验和用户体验都不是很好；


    3. 为什么要使用 module federation? 除了这种方式还有吗？

    4. SaaS 首屏性能是怎么优化的？
  
    5. 如何解决 qiankun 开启严格样式隔离后子应用出现页面抖动问题?


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