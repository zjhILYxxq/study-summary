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
    - 优点：能实现单页应用的用户体验；不需要对应有应用改造；子应用之间技术栈无关；多个子应用可以并存；对 seo 友好；不需要对现有子应用做改造；
    - 缺点: 实现复杂，需要对 node 有了解；子应用之间会相互影响；子应用之间通信、交互比较复杂；

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

    不管是 appliation 模式还是 parcel 模式，生命周期方法执行时，都要放回一个 promise 对象。 promise 状态变为 resolved，才真正mount/unmount。

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

    目前 saas 中微前端的实现方案: ssr + qiankun + module federation。

    其中，主应用采用 ssr 的方式渲染；子应用采用 csr + qiankun 的方式渲染；子应用之间交互采用 module federation。

    未来需要改进的地方：采用当前模式，首屏渲染较长； seo 不友好。 未来会考虑子应用首次加载的时候也采用 ssr 的方式。


#### webpack 相关

- [x] 常用的配置手段
  
    entry

    output： publicPath、path、filename、library(暴露的变量名)、libraryTarget(暴露变量的方式)

    resolve

    module

    optimization： splitChunks、minimize、usedExports、sideEffect 等；

    module

    plugin： miniCssExtractPlugin 等；

- [x] webpack 工作过程原理

    使用 webpack 时非常简单， 就是提供一个 webpack config，然后执行 webpack 提供的全局方法 webpack，就可以编译打包了。

    整个编译打包过程:
    - webpack 构建一个 compiler；
    - compiler 生成一个 compilation；
    - compilation 以入口文件为起点， 构建一个模块依赖图；
    - 将模块依赖图分离为 initial chunk、async chunks、runtime chunk 和 common chunks；
    - 获取各个 chunk 对应的 template，使用 generator 为每个 chunk 的 module 构建内容，然后再为 chunk 构建内容；
    - compiler 将 compilation 的 assets 输出到 output 指定位置；

    构建模块依赖图的过程:
    1. 解析入口文件路径，获取到入口文件的绝对路径(解析的过程中，会得到处理文件内容需要的 loader、parser、generator)；
    2. 为源文件构建 module 对象；
    3. 读取源文件内容，使用 loader 处理；
    4. 使用 parser 解析 loader 处理的内容(将内容处理为 ast， 收集依赖，静态依赖添加到 dependencies 中，动态依赖添加到 blocks)；
    5. 解析 dependencies、blocks 中收集的依赖，重复 2 - 5，直到所有的依赖处理完成；

    构建模块的过程:
    1. resolve - 先解析模块的路径，得到模块的绝对路径、loader、parser、generator；
    2. create - 创建一个 module 对象；
    3. build - 获取 loader 提供的方法、读取源文件内容、使用 loader 处理源文件内容、使用 parser 解析源文件内容、收集依赖、处理依赖；


    chunks 分类: 
    - initial chunk： 入口文件对应的 chunk；
    - async chunk： 异步 chunk，懒加载 module 对应的 chunk；
    - runtime chunk: 根据 optimizaiton.runtimeChunk: true 从 initial chunk 中分离出来，负责安装 chunk、安装 module、加载 lazy chunk；
    - normal chunk: 通过 optimization.splitChunks 策略分离出来的 chunks；

    分离 chunk 的过程:
    - 构建 initial chunk (多入口文件，会存在多个 initial chunk)；
    - 遍历模块依赖图， 通过 dependencies 连接的 module 都收集到 initial chunk 中， 通过 blocks 连接的 module 都收集到 async chunks 中；
    - 优化 initial chunk、async chunks 中的重复 module；
    - 使用 optimization.splitChunks 进行优化，分离第三方 module、被多个 chunk 共享的 module 到 common chunks 中；

    构建 bundle:
    - 根据 chunk 的类型，获取对应的 template；
    - 根据 output.filename 构建 bundle 的文件名；
    - 遍历 chunks 的 module， 使用 generator 为每一个 moudle 构建输出内容；
    - 根据模板，结合 module 的构建内容，构建 chunk 的输出内容；
    - 最后利用 node 提供的文件功能生成 bundle 文件并输出到指定位置；

    hash:
    - module hash: 根据每个 module 的源文件内容、模块 ID 生成；
    - chunk hash: 根据 chunk 的 name、所有 module 的 module hash 生成；
    - chunk contentHash：
      - chunk.contentHash.javascript： chunk 中所有 js 内容生成的 hash；
      - chunk.contentHash["css/mini-extract"]: chunk 中所有 css 内容生成的 hash；
    - compilation hash: 根据 chunk 对象的 chunk hash 信息生成；

    '[name].[hash].js' 中的 hash 使用的是 compilation hash，所有的 bundle 都一样；

    开发模式的热更新依赖 - websocket。

- [x] tree shaking 

    webpack 提供了两种级别的 tree shaking: modules-levels 和 statements-level。

    modules-level， 移除未使用的 module，要配置 optimization.sideEffects 为 true， 即开启 tree shaking；

    statements-level，移除 module 中未使用的 module，需要配置 optimization.useExports: true， optimization.minimize: true;

    tree shaking 的理论依据: 
    - js 代码执行前要先编译，生成 ast 和执行上下文；根据 ast 生成字节码； 执行生成的字节码；
    - es6 - module 在 js 代码的编译阶段就可以知道模块的依赖关系

    这两者使得 webpack 可以在打包过程中，静态分析源文件内容，确定模块之间的依赖关系以及模块被使用的 export， 移除未使用的模块以及模块中未使用的 export。

    tree shaking 的过程：
    - 模块依赖图构建完成以后， 每个模块都会知道依赖的模块以及依赖模块中的 export；
    - 预处理模块依赖图，确定每个模块被使用的 export；如果 module 没有 export 被使用，那么 module 就会从模块依赖图中移除；
    - 将模块依赖图分离为 chunk，为每个 chunk 构建内容，这个阶段会标记使用到的 export；
    - 压缩混淆代码时，将未使用的 export 移除；

    ```
    "./example.2.js":((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, {
            "funcB": () => /* binding */ funcB,   // 这个过程就是在标记使用的 export
            "funcD": () => /* binding */ funcD
        });
            const funcB = () => {
                console.log('funcB');
            }

            const funcC = () => {
                console.log('funcC');
            }

            const funcD = () => {
                console.log('funcD');
            }

            const funcE = () => {
                console.log('funcE');
            }
        })
    }

    ```





- [x] 打包构建分析

    分析手段：
    - webpack 内置的 stats： 只知道构建时间、打包体积，不知道哪个阶段时间长、哪个模块体积大；
    - speed-measure-webpack-plugin： 打包总耗时、每个插件、loader 的耗时；
    - webpack-bundle-analyzer：可视化分析每个 bundle 以及 bundle 中包含的 module 及体积；

- [x] 常用的优化手段

    构建速度优化:
    - 使用高版本的 webpack、node；
    - thread-loader；
    - 压缩代码时开启多进程；
    - DLL 预编译；
    - 利用缓存；
    - 缩小构建目标：缩小 loader 的使用范围 - exlcued、include；减少文件的搜索范围；较少文件解析的时间；
    - externals：指定不参与编译打包的类库；

    构建体积优化:
    - 懒加载、合理的代码分离策略；
    - tree shaking；
    - externals；
    - 压缩图片；

- [x] module federation 工作原理

    module federation 的概念: 使用 module federation， 可以在一个 javascript 应用中动态加载另一个 javascript 应用的代码，并实现应用之间的依赖共享。

    对外提供组件的应用称为 remote 应用，使用别的应用的组件的应用称为 host 应用；

    使用 module federation 功能的配置:
    - name: 当前应用的别名；
    - filename: 供别的应用消费的远程文件名，一般为 remoteEntry；
    - library: 定义如何将输出内容包括给其他应用，配置和 output.library、output.libarayTarget 一样；
    - exposes：暴露组件；
    - remotes：使用别的应用暴露的组件，一般是加载别的应用提供的 remoteEntry 文件，格式为 obj@url；
    - shared: 配置多个应用之间的依赖共享；

    module federatio 的工作原理：
    1. webpack 根据应用的 exposes、filename、shared 配置项打包生成一个 remoteEntry 入口文件、包含 exposes 组件的 js 文件、包含 shared 依赖的 js 文件；
    2. host 应用启动，初始化一个 sharedScope 对象，包含 host 应用可与别的应用共享的模块；
    3. host 应用加载 remote 应用的 remoteEntry，拿到 remoteEntry.js 暴露的变量，该变量包含一个 init 方法和一个 get 方法；
    4. host 执行执行 init 方法，用 host 应用的 sharedScope 初始化 remoteEntry 的 shareScope；
    5. host 应用执行 get 方法，从 host 应用中获取供外部使用的组件；

    remoteEntry 内部包含的模块本质上还是对外隔离的，会对外暴露一个变量，通过这个暴露变量的 get 方法才可以获取内部的模块。

    从 host 应用的 remotes 配置项就可以知道 remote 应用的 remoteEntry 链接以及暴露给外部的变量。


    子应用之间共享的原理：host 应用定义的 sharedScope，会通过 remote 暴露的变量的 init 方法，初始化 remote 应用的 sharedScope， 这样两者就可以共享了。

    shared 会有版本控制。

- [x] 常用的 hooks

    compiler 几个常用的 hooks(按照执行顺序排列):
    - initialize: compiler 完成初始化以后触发；
    - beforeRun: compiler 的 run 方法执行之前触发；
    - run: compiler 的 run 方法执行之后触发；
    - beforeCompile: compilation param 构建以后触发；
    - compile: beforeCompile 触发以后，compilation 创建之前触发；
    - compilation: compilation 对象创建以后触发，此时我们可以订阅 compilation 的 hooks；
    - make: 开始构建模块依赖图是触发，接下来都是 compilation 在工作，创建模块依赖图、分离 chunks、打包输出内容；
    - afterCompilte: compilation 工作结束时触发；
    - emit: 输出打包文件到指定目录之前触发；
    - afterEmit：输出打包文件到指定目录之后触发；
    - assetEmitted: 输出打包文件到指定目录之后触发， 可获取输出文件的路径、大小等；
    - done： 本次编译打包正常结束时触发；
    - failed： 本次编译打包失败时触发；


    compilation hooks:
    - buildModule： module 构建之前触发；
    - succeedModule：module 构建完成之后触发；
    - finishModules： module 依赖图构建完成之后触发；
    - seal: 模块依赖图构建完成，开始分离 chunks 时触发；
    - afterOptimizeAssets: 优化完每个 chunk 内包含的 assets 时触发；
    - ...

    比较关键的 hooks:
    - compiler：run、 compilation、make、 afterEmit、done、failed 等；
    - compilation： seal、 afterOptimizeAssets；

    如果我们想要订阅 compilation 的 hooks， 我们需要先订阅 compiler 的 compilation hook。 compiler 创建 compilation 以后，会触发 compilation hook，我们就可以在 callback 中订阅 compilation 的 hooks。
  



- [x] 如何写一个 loader、plugin  

    loader 本质上一个函数，用于将其他类型的文件，转化为浏览器可以识别的文件类型。

    自己写一个 Plugin:
    - 创建一个 class，需要提供实例方法 - apply

        apply 方法在触发时， 会传入一个 compiler 对象，然后我们可以在 apply 内部，通过 compiler.hooks.xxxx.tap('插件名称', callback) 的形式订阅 compiler 的 hooks。当到了 compiler 的某个阶段时，触发该阶段的对应的 hook，执行对应的 callback；
    - 在 webpack 的 plugins 配置项中提供 Plugin 对应的实例；
    - 在 compiler 构建初始化的过程中，会触发 plugin 实例的 apply 方法，订阅指定的 compiler 的 hook； 

    写一个可替换打包文件内容中指定字符串的 Plugin:
  
    ```
        class ReplacePlugin {
            constructor(option) {

            }

            apply(compiler) {
                compiler.hooks.compilation.tap('ReplacePlugin', (compilation, compilationParams) => {
                    compilation.hooks.afterOptimizeAssets.tap('ReplacePlugin', (assets) => {
                        Object.keys(assets).forEach(key => {
                            assets[key] = new OriginalSource(assets[key].source().replace(/https:\/\/reactjs/, 'zjh'));
                        })
                    });
                });
            }
        }
    ```


#### next.js 相关

- [x] CSR、SSR、SSG、ISR

    CSR - client side render, 客户端渲染；

    SSR - server side render， 服务端渲染；

    SSG - server static generate， 服务端静态页面生成；

    ISR - Incremental Static Regeneration， 增量静态再生；

- [x] 组件脱水 & 注水

    利用 react-dom-server  提供的 renderToString、 renderToNodeStream 方法可以给 react 组件脱水，将 react 组件转化为转化为实际的 dom 结构，不绑定时间，不触发组件的 componentDidMount、effect；

    组件注水，就是使用 react-dom 提供的 hydreate 方法，给组件对应的 dom 节点绑定事件，并触发生命周期方法；

- [x] pre-rendering 预渲染

    预渲染有两类:
    - 静态生成，即 nextjs 应用在 build 阶段就生成路由对应的 html 页面，所有的请求都对应一个页面，可以被 cdn 缓存；
    - 服务端渲染，服务端应用启动以后，根据客户端发起的请求，动态生成页面; 

- [x] 数据获取方法 - getStaticProps、getStaticPaths、getServerSideProps

    getStaticProps: 用于 SSG， 在构建时获取数据, 获取的数据将用于组件的脱水；

    getStaticPaths: 用于 SSG， 根据数据指定动态路由预渲染页面；

    getServerSideProps: 用于 SSR，获取每个请求的数据;

- [x] getStaticProps 是如何工作的？

    在 build 阶段， next.js 调用 renderToString 方法将组件变为字符串之前，会执行组件定义的 getStaticProps 方法，将 getStaticProps 方法返回的结果作为组件的 props 传递给组件。

    getStaticProps 返回的结果包含的属性:
    - props, object，作为组件的 props，是一个可序列化的对象；
    - revalidate，boolean， 默认为 false， 涉及静态增量再生 - ISR；
    - notFound，boolean，可选，如果为 true，会返回 404；
    - redirect，object，设置重定向；

    当用户再次访问预渲染页面时，会想服务端请求一个 json 文件，内部包含 getStaticProps 的结果。

- [x] getStaticPaths 是如何工作的？

    如果需要预渲染使用动态路由的页面，这应该使用 getStaticPaths。

    getStaticPaths 的工作机制: pages 目录下文件的命名采用了动态路径，且定义了 getStaticPaths、getStaticProps，在 build 阶段，会先执行 getStaticPaths 方法将动态路径转化为静态路径，然后在根据静态路径生成静态页面；

    getStaticPaths 返回的结果结构如下:
    - paths， 确定哪些路径将被预呈现，是一个数组；
    - fallback，决定了如果请求的页面没有如果没有，该如果处理。

    fallback 为 false，返回 404；

    fallback 为 true，则先生成对应的静态页面，后放回 getStaticProps 的数据，开发可以通过 router.isFallback 来显示中间状态来优化(先返回不含数据的页面，再返回数据)；

    fallback 为 'blocking', 和 SSR 相同，给客户端返回包含数据的页面；

- [x] getServerSideProps 是如何工作的? 

    (猜测，待验证)！

    如果组件中定义了 getServerSideProps 方法，那么 build 阶段， 组件就不会生成一个 .html 文件，而是会生成一个 .js 文件。

    当站点启动以后，客户请求页面时，站点会根据请求路径去找到对应的 js 文件，然后先执行 getServerSideProps 方法，获取数据，然后再将数据作为 props 传递给组件。通过 renderToHtml 方法，给组件脱水，然后生成一个 html 内容字符串，返回到客户端。

- [x] getStaticProps 和 getServerSideProps 的区别

    两者之间的区别:
    1. getStaticProps 用于 SSG， getServerSideProps 用于 SSR；
    2. 使用 getStaticProps，组件经过 build 阶段会生成一个 .html 文件； 而使用 getServerSideProps，组件经过 build 阶段会生成一个 .js 文件(实际上只是做了一下编译)；
    3. 站点启动以后，如果是 SSG，直接请求 html 页面；如果是 SSR，还需要根据路由找到对应的 js 文件，然后再执行 getServerSideProps 方法，将返回的结果作为 props 传递给组件，然后触发 renderToHtml 方法，给组件脱水，然后返回 html 字符串；

    getStaticProps 和 getServerSideProps 不能共存，即一个页面要么是 SSG， 要么是 SSR;

- [x] 动态路由的工作机制 

    在 nextjs 中，我们可以通过将 [] 添加到 pages 下页面的文件名中，来定义动态路由， 如 pages 目录下文件的文件名为 [pid].js

    我们可以通过 'pages/post/[...pid].js' 的方式，来匹配 /post/xx/xx/xx 的路径，但不能匹配 /post 的路径；

    通过 'pages/post/[[...pid]].js' 的方式，可以匹配 /post/xx/xx/xx, 包括 /post 的路径

    动态路由的工作过程:
    - 在 build 阶段，生成一个静态 html 文件；
    - 站点启动以后，根据请求的路由，返回对应的 html 文件；
    - 初始化全局的 router 对象，访问的路由会回去对应的动态路由，解析出路由中的动态参数，存到 router 对象的 query 中；
    - 给页面对应的组件注水，组件渲染过程中可以从全局的 router 对象中获取到动态路由中的参数；


    使用 getStaticProps、getStaticPaths 以后，动态路由的参数在 build 阶段就可以被解析出来，在组件脱水过程中使用;

    如果动态路由使用了 getServerSideProps, 那么在 build 阶段，动态路由不会生成一个 html 文件，只会生成一个 js 文件。当站点启动后，根据客户端访问的路径，找到对应的 js 文件，先执行 getServerSideProps 方法，再对组件脱水，生成一个 html 字符串返回给客户端。给组件脱水的时候，动态路由参数也会被解析。

- [x] 浅层路由

    浅层路由，是指导航到同一页面但不调用 getStaticProps、getServerSideProps 方法。

    如果一个页面，定义了 getStaticProps、getServerSideProps、getInitialProps 方法，那么每次导航到该页面时，会触发上述这些方法。

    其中， getStaticProps 只会触发一次， getServerSideProps 每次都会触发

    如果导航的时候设置了 shallow 为 true，那么导航到该页面的时候，则不会触发上述方法。


- [x] next.js 相关知识点

    在 **next.js** 中， **pages** 目录下每一个 **react 组件**都相当于都是一个**页面**。

    **页面**与基于**路径名**的**路由**关联：

    - 页面 '/pages/index' 对应的路由为 '/';

    - 页面 '/pages/posts/xxx.js' 对应的路由为 '/posts/xxx';

    nextjs 会根据 pages 目录下每一个组件文件，会打包生成一个 js 文件和 对应的 html 文件。

    next/dist/client/next.js 是 nextjs 应用客户端的入口文件。 应用启动以后，渲染首屏，会采用 ReactDOM.hydrate 方法；跳转页面，采用 React.render 渲染。每次切换路由时，都会通过 React.render 从根节点开始渲染。



- [x] 懒加载如何实现

    通过 next/router 切换页面时，都是懒加载，会根据路径，去 window.__BUILD_MANIFEST 变量中查找路径对应的 js 文件。

    nextjs 项目在构建的时候，会生成一个 _buildManifest.js 文件， 该文件会在客户端页面加载的时候执行，给 window 对象注入 __BUILD_MANIFEST 变量。

    __BUILD_MANIFEST 变量包含路由和对应的 js 文件的映射关系。

- [x] SEO

    SEO, 搜索引擎优化。 SEO 的目标是创建一种策略，以提高您在搜索引擎结果中的排名位置。

    常用的 SEO 措施:
    - robots.txt， 添加在项目的根目录文件下，指示爬虫可以访问和爬取哪些页面和文件;
    - 站点地图 - sitemap，是与 google 交流的最简单的方式，它可以用来指明属于您网站的网址以及更新时间，以便 google 可以轻松检测新内容并更有效的抓取您的网站。
    - 合理的 URL 结构，语义化、符合逻辑且一致的模式、有关键字、不基于参数；
    - 合理的渲染策略，如 SSR、SSG、ISG;
    - 合理的元数据，标题、描述；
    - 合理的内容结构，如标题、内部链接等；
    - core web vitails, 使用 LCP、FID、CLS 衡量加载、交互、视觉稳定性；


    Core Web Vitals，是 Web Vitals 的一个子集，由三个衡量加载、交互性和视觉稳定性的指标组成:
    - LCP - 最大内容绘制， Largest Contentful Paint，在视口中获取页面上最大元素所需的时间，对应加载；
    - FID - 首次输入延迟， First Input Delay， 发生用户交互到最终调用事件处理程序的时间；
    - CLS - 累积布局偏移， Cumulatetive Layout Shift，网站整体布局稳定性的度量， 对应视觉稳定性；

    使用浏览器开发者工具提供的 LightHouse 功能可以测量网站的 Core Web Vitals；

    改善 Core Web Vitals:
    - next/image, 按需优化、延迟加载图像、避免  cls；
    - 动态导入， 有助于改善 FID，主要是考虑首屏时如果有大量的 js 文件需要加载执行，用户交互无法及时响应，此时就需要使用动态导入；
    - next/dynamic, 组件的动态导入；
    - next/font, 优化字体;

- [x] 测量网页内容加载速度的指标

    load

    DOMContentLoaded

    FCP - First Content Paint， 首次内容绘制，页面从开始加载到页面内容的任何部分在屏幕上完成渲染的时间；

    FMP - First Meaningful Paint， 首次有效绘制

    LCP - Largest Content Paint， 最大内容绘制， 根据页面首次开始加载的时间点来来报告可视区域内可见的最大图像或文本块完成渲染的相对时间；

    影响 LCP 的四个主要因素:
    - 缓慢的服务器响应速度；
    - js 和 css 的渲染阻塞；
    - 资源加载时间；
    - 客户端渲染；

    改进 LCP:
    - 预加载重要资源、延迟加载非关键资源、缓存资源；
    - 优化图像、字体、css；
    - 优化关键渲染路径；
    - 优化 js(缩小体积、懒加载等);







#### lerna 相关

- [x] monorepo： 所有项目的代码放在一个仓库；

- [x] 常用的 lerna 命令

    比较常用的 lerna 命令:
    - lerna init - 初始化一个使用 lerna 管理的 git 仓库;
    - lerna create < name > - 创建一个使用 lerna 管理的 package；
    - lerna add < pkg > [globs] - 给 lerna 管理的 packages 添加依赖；
    - lerna bootstrap - 链接本地包、安装依赖；
    - lerna version - 确定每个 packages 的 versions；
    - lerna publish - 发布包；

    上面的几个常用命令，就基本涵盖了 lerna 的基本仓库:
    - 先初始化一个使用 lerna 管理的 git 仓库；
    - 创建需要通过 lerna 管理的 packages；
    - 给 packages 添加依赖；
    - 给 packages 安装依赖，建立 packages 之间的软链接；
    - packages 开发完成以后，确定每个 packages 的 version；
    - 发布包；

- [x] 固定模式 / 独立模式

    使用 lerna init 初始化一个使用 lerna 管理的 git 仓库时， 有两种模式：固定模式和独立模式

    ```
    lerna init --independent   // 独立模式

    lerna init   // 默认为固定模式
    ```

    固定模式下， 所有 packages 的版本是绑定到一起的，任何包发生重大改动都会导致所有的包具有新的版本。

    独立模式下，允许维护者单独为每个 package 更新版本；


- [x] lerna bootstrap

    通过 lerna bootstrap 命令，可以会 packages 安装依赖，并链接本地包。

    lerna bootstrap 命令的执行过程:
    1. 建立各个 packages 之间的依赖关系，找到各个 packages 依赖的其他 packages
    2. 使用 childProcess.exec 执行 npm install xxx / yarn add xxx 命令来安装依赖的包;
    3. 基于 node 的 fs.symlink 的方式，根据 packages 之间的依赖关系，建立软链接( 和 npm link 的原理一样，软链接可以理解为应用的快捷访问方式，)

    npm link 的工作过程(是这样吗?):
    - 在被引用的 package 中，执行 npm link 命令，在 /user/local/lib/node_modules 中建立一个软链接；
    - 在引用的 package 中， 执行 npm link xxx 命令，在本地 node_modules 中建立一个软链接；

- [x] lerna version
  
    使用 lerna version 可以为每个 packages 确定 versions。

    lerna version 命令的主要工作是标识出上一个 tag 版以来发生更新的 package， 然后为这些包迅速出版本，在用户完成选择之后修改相关包的版本信息，并且将相关的变动 commit，然后打上 tag 推送到 git remote。

    lerna version 命令的执行过程:
    1. 检查当前 git 分支的信息(检验本地是否有 commit、分支是否正常、分支的远程分支是否存在、当前分支是否允许), 如果没有 commit，则无法进行，返回异常；
    2. 拿到上次的打的 tag；
    3. 检查哪个 packages 发生变化(使用 git diff 命令，对比上一次的 tag，判断 packages 是否发生变化);
    4. 获取需要更新的 version，并由用户确认；
    5. 更新 packages 的 versions，并更新依赖的 versions(固定模式下，更新所有的 packages；独立模式下，更新变化的 packages 的 versions);
    6. 使用 git tag 打标记；
    7. 使用 git push 命令 push；


    独立模式下， package2 依赖 package1， package1 版本更新时，即使 package2 没有发生变化，也需要更新版本；

    之所以要打 tag， 是为了检查哪个 packages 发生了变化。 git diff 命令需要用到上一次的 tag。

- [x] lerna publish

    需要发布的包，发布到 npm registry。

    ```
    lerna publish    // lerna version + lerna publish from-git

    lerna publish from-git  // 发布当前 commit 中打上 annoted tag version 的包

    lerna publish from-packges  // 发布 package 中 pkg.json 上的 version 在 registry(高于 latest version)不存在的包
    ```

- [x] lerna run xxx

    执行每个 packages 的 script 脚本


- [x] npm package 生成可执行文件 
  
    1. 生成一个 js 文件，首行 #!/usr/bin/env node (动态去查找 node 来执行当前命令)
    2. 在 package.json 文件的 bin 配置项指向第一步的 js 文件；
    3. 这样全局安装的时候，就会在 /usr/local/bin 生成一个可执行文件；



#### react 相关


#### 基础知识相关


#### 算法相关



#### 实际项目相关

百应项目整理:
- [ ] SaaS
- [ ] cc sdk 重构
- [ ] by-fe-ssr
- [ ] 业务包开发











#### 需要在额外了解的东西
- [ ] web component
- [ ] babel loader
- [ ] 软链接和硬链接
- [ ] 有时间 lerna 还需要多看看
- [ ] 有时间再看一下 ssr 的那本小册；
- [ ] esc module - vite;
  
   


