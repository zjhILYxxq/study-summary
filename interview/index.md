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

      主应用是一个 node 应用，部署的时候也是容器化部署，需要指定端口号、app_name、环境、项目类型 - node、启动命令。

    - byfe-scrm(容器化部署)
      1.  每个子应用通过 webpack 打包，静态资源上传到 cdn( 也可以不上传)；
      2.  每个子应用都要配置 nginx，将 nginx/html/index.html 指向到具体的入口文件的地址，不配置缓存；
      3.  将 build 文件做一个压缩包 htm.tar.gz;
      4.  使用 docker 打包一个镜像(指定 app_name、端口号、环境、项目类型 - html)；
      5.  部署镜像；
      6.  主应用配置路由对应的 nginx，将路由指向子应用的 entry；
      7.  回滚子应用可以通过镜像回滚；

      主应用是一个 html 静态应用，和子应用没有区别。

    2. 为什么之前 SaaS 之前用的是 ssr 架构？ 
   
       - 通过一个简单的 BFF 层，实现权限控制、客户定制、免登、微前端架构下子应用的聚合；
     
       - 首屏性能优化，主应用可以直出 html 页面；借助 SSR，子应用也可以直出首页，还可以预加载；

      免登的逻辑:
      1. 先通过一个接口，传入 id 信息生成一个 authToken；
      2. 将这个 authToken 信息，添加到 SaaS 应用的 url 里面；
      3. SaaS 应用的 server 端中间件，根据 url 中的 authToken 信息，返回一个 loading 页面；
      4. 在 loading 页面中，通过一个接口，传入 authToken，获取用去的 token 信息，写到当前域名下；
      5. 重新跳转到一开始需要跳转的页面；

      现在回过头来看，其实权限控制、客户定制、子应用聚合、免登逻辑都可以在主应用采用 spa 架构下也能实现。

    2. 微前端采用 qiankun 的初衷是什么？

        原来的架构的缺点:

        - 不能满足新的业务需求。原来的业务，是一级菜单在顶部，按照项目来划分，二级菜单是子应用里面的路由配置，采用原来的架构，用户使用应用时，割裂感不是很强。新业务线调整以后，功能划分不再以项目划分，而是根据业务线来划分的，这就导致了页面上的某一个一级菜单下的二级菜单来自不同的子应用。这个时候，原来的架构带来的体验就不好了，割裂感特别严重，这时就需要我们的 SaaS 应用也能达到 SPA 的效果。
  
        - 重构子项目、升级子项目技术栈的时候，只能通过 iframe 的方式接入, 开发体验和用户体验都不是很好；


    3. 为什么要使用 module federation?

        项目 A 要复用项目 B 中一个复杂业务逻辑，但两个项目使用的 antd 版本不一致。当时为了快速响应，特意为项目 B 中要复用的逻辑新建一个路由，然后项目 A 通过 iframe 的方式复用项目 B 的应用。

        这种方式缺点: 
        - 项目 A 中打开复用逻辑，加载非常慢，用户体验非常差；
        - 每次打开都需要重新加载；
        - 项目 A 和复用逻辑通信也非常麻烦，要通过 postmessage 的方式通信。

        改造方式: 将项目 A 和项目 B 同时升级到 webpack5， 然后使用 module federation 复用逻辑。

        项目 B 做 module federation 配置，打包完成以后，将静态文件上传到 cdn 上，并通过 deploy 脚本将对应的静态文件的 cdn 地址存到 lego。

        项目 A 每次打包的时候，都需要从 lego 通过接口拿到项目 B 的静态文件的 cdn 链接，然后添加到 remote 配置项中。

        注意，使用 module federation 以后，css 文件也会通过动态添加 style 标签的方式异步获取。 


    4. SaaS 首屏性能是怎么优化的？

        首屏打开时，对应的子页面也采用 ssr 的结构。

  
    5. 如何解决 qiankun 开启严格样式隔离后子应用重新激活出现页面抖动问题。
        
        出现这个问题的真实原因: qiankun 切换子应用时，会将原来的子应用卸载，再切换回来的时候会重新挂载。

        重新挂载的时候，会出现页面抖动的问题。

        原因是卸载子应用时，会把 css 链接保存下来，重新激活的时候再添加。添加 css 是一个异步的过程，导致先完成 dom tree 结构渲染，然后再添加样式，导致重绘，也就是页面抖动。

        通过 mutationObserver 来监听容器节点的新增节点操作，收集 link 节点的 href，把子应用的 dom 结构先从 dom tree 上移除 。通过 fetch + Promise.all 的方式先去获取样式资源，获取完毕以后再把 dom 结构添加到 dom tree 上。

        这种方案对比样式前缀方案，有优点也有缺点.

        优点: 不用给每个子应用添加样式前缀(不同子应用的构建工具、antd 版本不一样。可能不支持样式前缀改写)。

        缺点: 比样式前缀方式性能会差点

    6. qiankun 样式隔离的实践方案

        实践方案:
        - antd 添加样式前缀，体验会好，但是需要对子应用做改造，支持打包构建是添加样式前缀(antd 版本、构建工具类型会有影响)。
        - 开启严格样式隔离，不需要对子应用做改造，但是体验会比添加样式前缀会差点。

    7. SaaS 业务相关
    
      AI 语音三大算法**：
      - **ASR 语音识别**, 将人的语音转化为文字；
      - **NLP 语义理解**，自然语言处理技术；
      - **TTS 语音合成**, 文本转语音技术；
       
      **aicc** 通用业务流程:
      - 创建一个话术，配置决策树，训练 (TTS - 知识库、热词、关键词? 精准识别关键词？话术要训练？)；
      - 创建外呼任务: 话术配置、线路配置；
      - 发起外呼任务；
      - 语音对话交互(ASR、NLP、TTS、坐席监听、通话监听、AI 转人工)；
      - 数据分析统计

      rtp: 实时传送协议

      FreeSwitch、Sip、引擎端、客户端之间的关系

      FreeSwitch: 跨平台的开源电话交换平台

      Sip: 协议；

      WebRTC: 网页实时通信技术；

      [webrtc 相关](../WebRtc/WebRtc.md);

    


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

    提炼了一套标准配置项、常用的 plugin，通过 byai-cli 的 vite-init 命令可一键初始化。

- 前端知识
  - [x] 微前端技术的理解

    1. 谈谈你对微前端技术的理解

        微前端解决的问题、优点、挑战、常用技术方案

    3. single-spa 的工作原理 
    
    2. qiankun 的工作原理
    
      子应用加载、js 隔离、css 隔离、副作用处理、状态重置
    
    3. qiankun 在使用过程中有遇到哪些问题？

      对接 sentry

      样式隔离问题

      首个子应用加载优化

    4. 你们的微前端技术架构是怎么样子的?

        ssr + qiankun
    
    5. 谈谈你们为什么要采用 qiankun 的技术方案？  

        产品升级 + 用户体验 + 子应用技术栈升级

  - [x] 构建工具的理解

    1. 谈谈你对常用构建工具的理解 ？

      [对构建工具的理解](./build%20tools/对构建工具的理解.md)

    2. 谈谈你对 Webpack 配置项的理解？

      [对 webpack 配置项的理解](./build%20tools/对%20webpack%20各个配置项的理解.md)
    
    3. webpack 的工作原理是怎么样的 ？

        分析模块依赖关系、构建模块依赖图、tree shaking、分离 chunks、输出

    4. 谈谈你对 webpack 的 loader、plugin 的理解 ?

      loader 的理解、执行顺序

      plugins 的分类、写法
    
    5. 谈谈你对 webpack5 的 module federation 的理解 ?

       微前端、配置

       工作原理
    
    6. 谈谈你对 source-map 的理解?  

      七个关键字、 devtoo、Sentry

    7. 谈谈你对 module hot replace 的理解 ? 

      websocket、inline、hot、module.hot.accept
    
    8. 谈谈你对 webpack5 的持久化缓存的理解？

      配置 cache
    
    9.  谈谈你对 hash 的理解？

      hash、chunkhash、contenthash、modulehash
    
    10. 谈谈你对 tree shaking 的理解 ？

        ESM 规范、module level、statement level

        sideEffects、useExports、minimize
    
    11. 谈谈你知道的 webpack 的常用优化策略 ？

        速度: 缓存策略、使用更高效的语言、缩小打包范围、开启多线程、使用高版本的 node / webpack

        体积: 压缩、externals、dll 等
    
    12. 谈谈你知道的 webpack 打包构建分析工具 ？

        速度: speed-measure-webpack-plugin

        体积: webpack-bunde-analyer
    
    13. 谈谈你对 babel 的理解 ？

        做了什么、过程、用途

        api、plugin、preset

        plugin、preset 执行顺序

        pollify 方案
        
        runtime 方案
    
    14. 谈谈你对 AST 的理解 ？ 

    15. 谈谈你对 Rollup 的理解 ?

      配置项、插件机制、原理
    
    16. 谈谈你对 Esbuild 的理解 ？

      配置项、插件机制、原理
    
    17. 谈谈你对 Vite 的理解?

      unbundle 机制

      预构建、二次预构建及优化

      配置项

      插件机制

      怎么使用 esbuild

      middleware

      热更新
    
    18. 常见构建工具对比

      webpack、parcell、esbuild、vite、rollup

  - [ ] react 及相关依赖技术栈的理解

      1. react 各个版本的变化
      
      2. 谈谈你对 hooks 的理解 
      
      3. legacy && concurrent
      
      4. 谈谈你对 fiber tree 的理解
      
      5. 谈谈你对 react-router 的理解
      
      6. 谈谈你对 redux、mobx 的理解

          redux 和 mobx 的对比
      
      7. 谈谈你对 diff 算法的理解
      
      8. 如果判断 dom 节点是否发生了移动? 如何移动 dom 节点？ 
      
      9.  useSyncExternalStore 的原理?
      
      10. 谈谈你对 react 严格模式的理解？


  - [x] 前端监控技术的理解

      1. 谈谈你们是怎么做异常监控的?

        微前端异常处理闭环

        异常处理三要素: 异常详情、异常上下文、通知

        异常类型、异常处理

        异常上下文

      2. 性能监控  

        性能指标

        性能数据

        性能面板

        如何做性能优化



      3. 谈谈你们是如何做性能监控的？

        如果做性能监控?

        性能监控有哪些指标? 这些指标应该怎么优化?

        Sentry 是如何做性能监控的？

        本地的话，你还可以通过 lighthouse、performance 面板对性能问题进行监控

        那线上的话怎么处理?  知道了性能监控指标？

        Sentry 的 performance 面板该怎么用?

        出现性能问题，该怎么通过给开发人员? 可以创建一个 alert，发到指定人员的邮箱

        通过性能监控， Sentry 可以追踪应用程序性能，测试吞吐量和延迟等指标

        Apdex，application performance index，应用性能指标，用于根据应用程序响应时间跟踪和衡量用户满意度。分数越高，代表用户满意度越高，最高可到 1.0，即 100% 的用户有满意的的体验。该指标提供了一个标准来判断应用性能。

        Apdex 的计算方式:
        - T， 规定一个响应时间的阈值；
        - Satisfactory， 当响应时间 <= T 时， 表示用户满意；
        - Tolerable， T < 响应时间 <= 4T, 表示用户可以接受；
        - Frustrated， T > 4T, 表示用户无法忍受；
        - 计算过程： (满意数量 + 接受数量 / 2) / 所有的数量；  这个公式很好理解，Tolerable，有些用户可以接受，就有些用户不可以接受，所有要除以 2。

        failure_rate, 不成功事务的失败率。Sentry 将状态不是 ok、cancelled、unknown 的事务视为失败。

        Throughput， 吞吐量：
        - Total - 总的吞吐量；
        - TPM - 每分钟的平均事务数
        - TPS - 每秒钟的平均事务数


        Latency， ？：
        - Average Transaction Duration，平均事务响应时间，给定事务的所有时间的平均响应时间；
        - P50 阈值，表示 50% 的事务响应时间大于指定阈值；
        - P75 阈值，表示 25% 的事务响应时间大于指定阈值；
        - P95 阈值，表示 5% 的事务响应时间大于指定阈值；
        - P99 阈值，表示 1% 的事务响应时间大于指定阈值
  
         


        Sentry 定义的性能指标:
        - LCP: [2.5 s, 4s, 4s];
        - FID: [100ms, 300ms, 300ms];
        - CLS: [0.1, 0.25, 0.25];
        - FP: [1s, 3s, 3s];
        - FCP: [1s, 3s, 3s];
        - TTFB: [100ms, 200ms, 600ms];




  

  - [ ] csr、ssr 渲染技术的理解

    1. 对 CSR、SSR、SSG、ISG 的理解

      ISG 使用的时候，要配合 动态路由 + getStaticProps + getStaticPaths 一起使用。
    
    2. 同构: 代码同构、数据同构、路由同构

      代码同构: 前后端使用同一套代码，都使用多页面打包。只不过用于 server 端的代码需要配置成 commonjs 规范。

      数据同构: 数据只请求一次。

      路由同构: client 还是路由懒加载那一套，借助 history； server 端通过中间件，找到请求 url 对应的 js 文件。

      使用服务端渲染时，导航栏要每一个页面中都要有。导航栏中配置路由导航信息。
    
    3. 组件脱水、注水
    
    4. next.js 的工作机制

      构建(client + server) + 启动

    5. getStaticProps、getStaticPaths、getServerSideProps  
    
    6. 动态路由

      动态路由 + getStaticProps、getStaticPaths、getServerSideProps

    7. 浅层路由
    
    8. 一些关键的 manifest.json 文件
    
    9. 代码中如何区分 client 和 server 端 

      由于 client 和 server 使用不同的 webpack 配置，所以可以定义一个变量 __client，然后通过 definePlugin 給 client 设置 true，给 server 设置为 false。

  - [ ] ts 技术的理解


  - [ ] lerna 技术的理解

- 前端知识
  - [x] [微前端](../micro%20frontend/micro-frontend.md)
  - [x] [react](../react/react-study.md)
  - [x] [构建工具](../build%20tools/readme.md)
  - [x] [ssr](../react-ssr/react-ssr.md)
  - [x] [ts](../ts/ts-study.md)
  - [x] [前端监控](../other/sentry.md)
  - [x] [基础知识]()
  - [x] [lerna](../lerna/lerna.md)
  - [x] [其他]()
  
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