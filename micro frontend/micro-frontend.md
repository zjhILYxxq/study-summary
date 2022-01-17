#### 微前端相关

- [x] **微前端的概念、优点、挑战、常用技术方案**

    概念: 将一个巨石应用，按照一定的规则拆分为不同的子应用，然后将多个子应用聚合为一个应用。

    优点: 独立、低耦合的仓库、子应用可独立开发/部署、迁移老的系统、子应用技术栈升级、团队技术成长；

    挑战: 子应用之间切换、应用之间相互隔离互不影响、子应用之间通信/交互、多个子应用并存、用户状态；

    常用的技术方案: 路由转发、iframe、ssr、single-spa、qiankun、webpack5 - module federation、web component；

    路由转发
    - 优点：实现简单；不需要现有应用做改造；技术栈无关；
    - 缺点: 子应用切换需要刷新浏览器，体验不好；多个子应用无法共存；子应用之间通信困难；子应用之间无法交互；局限性比较大；

    iframe
    - 优点： 实现简单； 不需要对现有应用做改造；技术栈无关；css、js 天然隔离，互不影响；多个子应用可以共存；不需要对现有子应用做改造；
    - 缺点： 每次切换应用，需要重新加载页面，用户体验不好； UI 不同步，dom 结构不共享； 子应用之间通信、交互非常复杂；对 SEO 不友好；

    ssr
    - 优点：不需要对应有应用改造；子应用之间技术栈无关；多个子应用可以并存；对 seo 友好；不需要对现有子应用做改造；
    - 缺点: 用户体验不好，子应用切换的时候需要刷新页面，重新走 SSR；实现复杂，需要对 node 有了解；子应用之间会相互影响；子应用之间通信、交互比较复杂；

    single-spa
    - 优点: 能实现单页应用的用户体验；子应用之间技术栈无关；多个子应用可以共存；生态丰富；
    - 缺点: 需要对现有子应用做改造，有一定的成本；使用复杂，关于子应用的加载、通信、隔离逻辑，都需要开发者自己实现；子应用之间相同资源重复加载；首屏加载较慢，需要先启动基座应用，再启动子应用；
  
    qiankun
    - 优点: 能实现单页应用的用户体验；子应用之间技术栈无关；多个子应用可以共存；生态丰富；使用简单，框架自身实现了子应用隔离、通信、加载的逻辑；
    - 缺点: 需要对子应用做改造；有一定的学习成本；相同资源重复加载；首屏加载缓慢，需要先启动基座应用，再启动子应用；子应用之间交互比较麻烦；

    module federation
    - 优点: 能实现单页应用的用户体验；多个子应用可以共存；相同资源不需要重复加载；子应用之间交互非常方便；
    - 缺点：项目打包依赖 webpack5； 有额外的学习成本；单独使用存在子应用互相影响的情况；

    web component:
    - 优点： css、js 天然隔离；技术栈无关；多个子应用可以共存；不需要对子应用改造；
    - 缺点： 浏览器兼容性问题、开发成本较高；

    最佳实践: ssr + qiankun + module federation;

- [x] **single-spa**

    single-spa 中，应用分为两类：主应用和子应用。子应用是需要聚合的应用，主应用用来聚合子应用。

    主应用会维护一个路由注册表，根据当前路由信息，获取对应的子应用的 js 脚本，然后通过 csr 的方式渲染页面；如果是已经访问过的子应用，则从缓存中获取子应用的 mount 方法，重新激活子应用。

    使用 single-spa 时， 需要对子应用做三个方面的改造：
    - 提供 mount、unmount、update 生命周期方法。其中，mount 在子应用时激活调用，调用时会通过 csr 的方式渲染页面；unmount 在子应用冻结时调用；
    - 打包构建的改造，将生命周期方法暴露给主应用(library、libraryTarget)，通过 publicPath，补全子应用资源加载路径；
    - 子应用路由改造，需要添加子应用前缀；

    single-spa 提供了两种模式： application 模式和 parcel 模式：
    - application 模式：子应用的切换由修改路由触发，整个切换过程由框架控制；应用场景：多个子应用聚合；
    - parcel 模式： 子应用/组件的挂载和卸载，由开发人员手动触发；应用场景：跨框架使用组件；

    不管是 appliation 模式还是 parcel 模式，生命周期方法执行时，都要放回一个 promise 对象。 promise 状态变为 resolved，才真正 mount/unmount。

    application 模式下子应用切换的原理:
    - pushState/replace/popstate,  hash/hashchange;
    - 执行 pushState/replaceState 触发 popstate 的方式: 重写原生的 pushState / repalceState 方法，执行时手动创建一个 popstate 类型的事件对象，然后通过 window.dispatchEvent 方法手动触发 popstate 事件；


    application 模式下的工作过程：
    - 主应用通过 registerApplication 方法注册子应用；
    - 主应用挂载完成以后，执行 start 方法，根据当前路由去选择子应用加载；
    - 获取到子应用的生命周期方法以后，执行子应用的生命周期方法，以 csr 的方式渲染子应用；
  
    子应用通信: 通过主应用传递的 customProps，以主应用为中介，进行通信；

    single-spa 的不足:
    - 复杂的子应用加载方式(子应用打包构建时生成一个 manifest 存储起来，主应用加载子应用时再根据 manifest 获取子应用的入口文件、css 内容)；
    - 子应用隔离、预加载、切换遗留的副作用、状态恢复，都需要开发人员自己去处理；
    
  
- [x] **qiankun**

    qiankun 是在 single-spa 的基础上做了二次开发，提供了通用的子应用加载、通信、预加载方案，并通过技术手段实现了 js / css 的隔离、副作用的清理、状态恢复。

    qiankun 和 single-spa 的用法基本相同，也分 application 和 parcel 模式，子应用的改造也完全一样。

    子应用加载 - html entry:
    - 获取子应用的入口 html 文件；
    - 解析 html 文件，拿到 js 脚本、css 脚本；
    - 获取外部样式表，将外部样式表和内部样式表都添加到新生成的 html 模板中，将新生成的 html 模板添加到当前 html 页面中；
    - 手动触发 js 脚本的执行，拿到子应用生命周期方法，以 csr 的方式渲染子应用；
  
    js 隔离 - sandbox：
    - 为每一个对象创建唯一的类 window 对象；
    - 将 js 脚本使用一个立即执行函数包裹， 将类 window 对象作为 js 脚本执行的全局变量

        ```
        (function(window) { ... })(fakeWindow)
        ```
    - 通过 eval 方法手动触发 js 脚本；
  
    qiankun 的 sandbox：
    - proxySandbox - 基于 proxy 实现： 先创建一个类 window 对象，然后构建类 window 对象的 proxy 拦截对 fakeWindow 对象的读写(直接写到 fakeWindow；读时先读 fakeWindow，再读原生 window)；
    - snapshotSandbox - 快照沙盒: 子应用激活时，先把当前的 window 对象的可枚举属性拷贝一份，window 对象作为子应用的全局对象；子应用冻结时，对比 window 和 fakeWindow， 缓存发生变化的属性；子应用再次激活时，会先根据上次缓存的变化的属性恢复之前的状态；

    css 隔离：
    - 严格隔离 - 基于 web component 的 shadow dom 实现；

        ```
        const shadow = element.createShadowRoot();

        const shadow = element.attachShadow({ mode: true });
        ```
    - scoped 样式隔离 - 给样式添加属性选择器；
  
    动态添加的 script、style，也会做隔离，原因是 qinakun 对 appendChild 方法做了拦截，重写了 appendChild 方法，然后对 js、css 做隔离。

    副作用的清理： 
    - sandbox 隔离，没有副作用；
    - dom 节点都是添加到子应用对应的 html 片段中，子应用卸载， html 片段会移除；
    - 重写 setTimeout、setInterval、appendChild、addEventListener 等方法，这些方法执行时会返回一个 destory 方法；子应用卸载时会触发 distory 方法。

    子应用的状态恢复：
    - sandbox 机制会给子应用恢复状态；
    - 动态添加的样式会一直缓存，每次子应用激活时都重新添加；

    子应用通信： 基于发布订阅模式实现。主应用构建一个 state，并维护一个 deps；子应用可以通过 onGlobalStateChange 订阅 state 的变化，并通过 setGlobalState 修改 state。

    子应用可以预加载。


- [x] **saas 关于微前端的最佳实践** 

    原来的项目中实现微前端的方式: SSR, 每次切换子应用时通过 a 标签 href 的方式切换应用，每次都需要重新加载页面，体验很差。

    目前 SaaS 中微前端的实现方案: ssr + qiankun + module federation, 整个应用看起来就想一个 spa 应用。

    其中，主应用采用 ssr 的方式渲染；子应用采用 csr + qiankun 的方式渲染；子应用之间交互采用 module federation。

    未来需要改进的地方：采用当前模式，首屏渲染较长； seo 不友好。 未来会考虑子应用首次加载的时候也采用 ssr 的方式。

    本地调试 lego 的原理：
    - 先起本地应用；
    - 再起一个 express 应用，代理到指定环境，html 使用指定环境的；js、css 使用本地的代码；

    将子应用也改为 ssr 的方式:

    - 将子应用做改造

        根据需要给每个组件添加数据获取方法。

    - 子应用 build 时采用两种方式:
      - 一种方式为单入口文件打包，打包出来的 bundles 用作 CSR；
      - 另一种方式为多入口文件打包，将路由中的每一个页面的 index 作为入口文件打包，为每一个页面生成一个 bundles；

      将打包好的文件上传 cdn；

    - 服务端渲染时先配置好各个子应用在 cdn 上静态资源的位置。

        根据客户端访问路由，找到子应用具体页面的打包文件，执行，执行 js 文件，得到组件。

        根据组件的数据获取方法，获取数据，然后作为 props 传入 组件方法，返回组件的 react element。

        然后使用 react.renderToString 将组件的 react element 转化为字符串；

        将渲染完毕的字符串，通过 application/json 类型的 script 标签添加到 html 页面中

    - 主应用渲染完毕以后

        在 useEffect 回调方法中，获取预渲染的组件字符串，添加到子应用的挂载节点下，然后再通过 qiankun 加载子应用。

    子应用的改造:
    - 子应用的 index 中要支持 render 和 hydrate 两种模式；
    - 对每一个页面组件都需要改造；
    - 对打包构建需要改造；

        