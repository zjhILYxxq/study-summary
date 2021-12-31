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


#### lerna 相关


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
  
   


