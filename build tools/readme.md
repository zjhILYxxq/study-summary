#### 构建工具的前世今生

1. **常见的构建工具**

    Ant + YUI tool: YUI tool 是 07 年左右出现的一个代码打包工具，和 java 的 ant 配合使用，压缩混淆 css 和 js 代码。由于当时的先后端还没分离，是后端主导前端，因此前端的代码都是嵌入到后端的项目里去的。

    grunt / gulp: 运行在 node 环境上的自动化工具，将构建过程分解为一个个任务，如解析 html、解析 js、es 6 代码转换、less / saas 转换、代码压缩混淆等。grunt 每完成一个任务，会把结果存到本地磁盘中，下一个任务执行时再从磁盘中读取上一次任务的结果。gulp 有文件流的概念，它再也不把每一步构建的结果存放到磁盘中去，而是存放在内存中，这样的话在构建的下一个步骤能够直接在内存中读取上一步构建的结果，大大加快了构建的速度。

    webpack / rollup / parcel: 静态模块打包器，以入口文件为起点构建一个模块依赖图，得到模块之间的依赖分析，然后将模块依赖图分离为多个 bundle。这几个构建工具各有优势。parcel 号称零配置；webpack 大而全，生态丰富，适合日常项目使用； rollup 推崇 ESM 模块标准开发，打包出来的代码干净，适用于组件库开发；

    esbuild / vite: 新一代的静态模块打包器。esbuild 基于 go 语言实现，代码直接编译成机器码(不用像 js 先解析为字节码)，更快。 vite 开发模式下借助浏览器对 ESM 的支持，采用 nobundle 的方式进行构建，能提供极致的开发体验；生产模式下借用 rollup 就行构建；


2. **js 模块化的发展史和构建工具的发展**

    - **青铜时代**

        javascript 设计之初，并没有 module 的概念，语言层面无法实现 module 之间的相互隔离、相互依赖关系，只能由开发人员手动处理。

        早起的 web 开发的情况:
        - 通过定义对象、iife(或者闭包) 方式实现隔离。
        - 通过手动确定 script 的加载顺序确定模块之间的依赖关系。
        - jsp 开发模式，没有专门的前端，html、js、css 代码会由后端人员开发。

        为了节省网络带宽和保密，需要对前端代码做压缩混淆处理。

        这个时候，构建工具是 Any + YUI tool。


    - **白银时代**

        chrome v8 引擎 和 node 的横空出世，给前端带来了更多的可能。

        js 模块化有了新的发展:
        1. commonjs 规范，适用于 node 开发；
        2. amd、cmd 规范，适用于浏览器；
        3. umd，兼容 amd、cjs，代码可以执行在浏览器、node 端；
        4. ES6 module 出现(这个时候还不是很成熟)；

        此外还出现了 less / sass、 es6、 jslint、 eslint、ts 等新的东西， 前端角色也逐渐独立，发挥越来越重要的作用。

        有了 node 提供的平台，大量的工具开始涌现:
        - requirejs 提供的 r.js 插件，可以分析 amd 模块依赖关系、合并压缩 js、优化 css；
        - less / sass 插件，可以将 less / sass 代码转化为 css 代码；
        - babel，可以将 es6 转化为 es5；
        - ts，将 ts 编译为 js；
        - jslint / eslint，代码检查；
        - ...

        这个时候，我们可以使用 grunt / gulp，将上面的构建过程拆分为一个个小的任务，自动处理它们。

    - 黄金时代

        angular / vue / react 三大框架和 webpack 的使用，奠定了现在的前端开发模式 - 组件模块化。

        同时 es6 moudle 规范也被更多的浏览器接受。

        webpack 是一个静态模块打包器，以入口文件为起点构建一个模块依赖图，得到模块之间的依赖分析，然后将模块依赖图分离为多个 bundle。再构建模块依赖图的过程中，会使用 loader 处理一个个模块，将它们转化为浏览器可以是识别的 js、css、图片、音视频等。

        随着时间的发展， webpack 逐步发展，同时也迎来诸多对手。

        webpack1
           |
           |
        rollup 出现(推崇 ESM 标准，可以实现 tree shaking, 打包出来的代码更干净)
           |
           |
        webpack2(也实现了 tree shaking, 但是配置太繁琐了)
           |
           |
        parcel (号称 0 配置)
           |
           |
        webpack4(通过 mode 确定 development 和 production 模式，各个模式有自己的默认配置)
           |
           |
        webpack5(持久化缓存、module federation)

        esbuild(采用 go 语言开发，比 webpack 更快)

        vite(开发模式采用 nobundle，更好的开发体验)




### build tools 总结

#### webpack 篇

- [x] **常用的配置手段**
  
    entry

    output： publicPath、path、filename、library(暴露的变量名)、libraryTarget(暴露变量的方式)

    resolve

    optimization： splitChunks、minimize、usedExports、sideEffect 等；

    module

    plugins： miniCssExtractPlugin 等；

- [x] **webpack 工作过程原理**

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

- [x] **模块热更新**

    热更新的触发的条件:
    - devServer.hot 配置项为 true；
    - 启用 inline 模式；
    - 必须声明 module.hot.accept(url, callback);

    热更新的工作过程:
    - 浏览器 构建 webSocket 对象， 注册 message 事件；
    - 服务端 监听到文件发生变化， 生成更新以后的 chunk 文件， chunk 文件中包含更新的 modules，然后通过 webSocket 通知 浏览器 更新；
    - 浏览器 构建的 webSocket 对象触发 message 事件，会收到一个 hash 值和一个 ‘ok’ 信息， 然后通过 动态添加 script 元素， 加载 新的 chunk 文件；
    - 根据 module id 在 应用缓存(installedModuled) 中 找到之前缓存的 module。 然后以找到的 module 为基础， 递归遍历 module.parent 属性， 查找定义 module.hot.accept 的 parent module。

        如果没有找到， 则 hmr 不起作用， 只能通过 重新加载页面 来显示更新。 在 递归过程 中， 我们会把遇到的 module id 存储起来。

    - 找到定义 module.hot.accept 的 parent module 之后， 根据第四步收集的 module id， 将 installedModules 中将对应的 module 清除， 然后根据 module.hot.accept(url, callback) 中的 url， 重新安装关联的modules

    - 执行我们注册的 callback；

- [x] **source-map**

    eval、cheap(只能映射到行，不能映射到列)、source-map(只能追踪到转换转换之前，比如压缩前的代码)、moudle(配合 source-map，可追踪到源代码)

    一般为 **module-cheap-source-map**

- [x] **tree shaking** 

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

- [x] **module federation 工作原理**

    module federation 的概念: 使用 module federation， 可以在一个 javascript 应用中动态加载另一个 javascript 应用的代码，并实现应用之间的依赖共享。

    对外提供组件的应用称为 remote 应用，使用别的应用的组件的应用称为 host 应用；

    使用 module federation 功能的配置:
    - name: 当前应用的别名；
    - filename: 供别的应用消费的远程文件名，一般为 remoteEntry；
    - library: 定义如何将输出内容包括给其他应用，配置和 output.library、output.libarayTarget 一样；
    - exposes：暴露组件；
    - remotes：使用别的应用暴露的组件，一般是加载别的应用提供的 remoteEntry 文件，格式为 obj@url；
    - shared: 配置多个应用之间的依赖共享；

    module federation 的工作原理：
    1. webpack 根据应用的 exposes、filename、shared 配置项打包生成一个 remoteEntry 入口文件、包含 exposes 组件的 js 文件、包含 shared 依赖的 js 文件；
    2. host 应用启动，初始化一个 sharedScope 对象，包含 host 应用可与别的应用共享的模块；
    3. host 应用加载 remote 应用的 remoteEntry，拿到 remoteEntry.js 暴露的变量，该变量包含一个 init 方法和一个 get 方法；
    4. host 执行执行 init 方法，用 host 应用的 sharedScope 初始化 remoteEntry 的 shareScope；
    5. host 应用执行 get 方法，从 host 应用中获取供外部使用的组件；

    remoteEntry 内部包含的模块本质上还是对外隔离的，会对外暴露一个变量，通过这个暴露变量的 get 方法才可以获取内部的模块。

    从 host 应用的 remotes 配置项就可以知道 remote 应用的 remoteEntry 链接以及暴露给外部的变量。


    子应用之间共享的原理：host 应用定义的 sharedScope，会通过 remote 暴露的变量的 init 方法，初始化 remote 应用的 sharedScope， 这样两者就可以共享了。

    shared 会有版本控制。

- [ ] webpack5 - 持久化缓存？？





- [x] **打包构建分析**

    分析手段：
    - webpack 内置的 stats： 只知道构建时间、打包体积，不知道哪个阶段时间长、哪个模块体积大；
    - speed-measure-webpack-plugin： 打包总耗时、每个插件、loader 的耗时；
    - webpack-bundle-analyzer：可视化分析每个 bundle 以及 bundle 中包含的 module 及体积；

- [x] **常用的优化手段**

    构建速度优化:
    - 使用高版本的 webpack、node；
    - thread-loader；
    - 压缩代码时开启多进程；
    - DLL 预编译；
    - 利用缓存；
    - 缩小构建目标：缩小 loader 的使用范围 - exlcued、include；减少文件的搜索范围；减少文件解析的时间；
    - externals：指定不参与编译打包的类库；
    - esbuild、swc 重写编译、压缩过程等；

    构建体积优化:
    - 懒加载、合理的代码分离策略；
    - tree shaking；
    - externals；
    - 压缩图片；
  


- [x] **常用的 hooks**

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
  



- [x] **如何写一个 loader、plugin**

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


- [x] **babel**

    **babel** 做了什么： **语法转换**和 **api** 的 **polyfill**

    **babel** 用途:
    - **转义**, 将 es6、ts、flow 等到目标环境支持的 js；
    - **特殊的代码转换**，如埋点代码、自动国际化 等；
    - **代码的静态分析**，eslint、 api 文档自动生成工具、ts 检查、代码压缩混淆；

    **babel** 是 **source** 到 **source** 的转换，整体编译流程分为三步:
    - **parse**, 通过 parse 将源码转化为 AST，即抽象语法树；
    - **transform**， 遍历 AST，对 AST 各个节点做增删改；
    - **generate**，根据转换以后的 AST 生成目标代码，并生成对一个的 sourcemap;

    **AST** 是对源码的抽象，节点的类型包括**字面量**、**标识符**、**表达式**、**函数**、**模块语法**、**class** 语法等；

    **plugin**、**preset**、**babel api** 的关系： **babel** 在做 **transform** 操作时提供了一系列的 **api**，将这些 **api** 做封装就成了 **plugin**；再对 **plugin** 做封装，就成了 **preset**；

    **plugin**：一些函数，在 **babel** 做 **transform** 时使用。

    **babel(7)** 内置的 **plugin** 类型:
    - **syntax plugin**， **语法类型的 plugin**， 使得 parse 可以正确的将语法解析成 AST；
    - **transform plugin**，转换类型的 **plugin**， 用于转换 AST；
    - **proposal plugin**， 未加入语言标准特性的 AST 转换， 也是 **transform plugin**；

    **preset**：对 **plugin** 的封装，项目初始化的时候，会根据 **prest** 安装 **plugin**。

    **plugin**、**preset** 执行顺序:
    - **plugin** 从左到右执行；
    - **preset** 从右到左执行；
    - 先执行 **plugin**， 再执行 **preset**；

    **plugin**、**preset** 默认是一个字符串，如果需要添加配置项，那么就提供一个数组。数组的第一个元素为 plugin、preset 的名称，第二个参数是对应的配置项。

    **presets**:
    - **@babel/preset-env**, 用于编译 **es2015** 语法；
    - **@babel/preset-react**， 用于编译 **reat**；
    - **@babel/preset-jsx**, 用于编译 **jsx**；
    - **@babel/preset-typescript**， 用于编译 **ts**；
    - **@babel/preset-flow**， 用于编译 **flow**；

    **babel helpers**： 用于 **bable plugin** 逻辑复用的一些工具函数， 分为用于注入 **runtime** 代码的 **helper** 和用于简化 **AST** 操作的 **helper** 两种。

    babel runtime 里面放运行时加载的模块，会被打包工具打包到产物中。

    babel7： 通过 @babel/preset-env + plugin-proposal-xxx, 指定目标环境，做精确转换。

    babel-compat-table 提供了 es6 每个特性在不同版本中的支持版本；通过 browserslist query 可以查找满足条件的环境的版本。

    **@babel/preset-env** 的 配置项：
    - targets，指定环境版本；
    - modules，以特定的模块化来输出代码；
    - corejs， babel7 所使用的 polyfill， 版本 3 才支持；
    - useBuiltIns， 使用 polyfill 的方式：
      - entry，在入口处全部引入；
      - useage，在每个文件中引入用到的 polyfill， 不是全部引入；
      - false， 不引入；

    **AST** 实际能做的事情：
    - 自动埋点；
    - 自动国际化；
    - 自动生成 API 文档；
    - 类型检查；
    - eslint 检查；
    - 代码压缩混淆；
    - ...

    babel 是通过 @babel/preset-env 来做按需 polyfill 和转换的，原理是通过 browserslist 来查询出目标浏览器版本，然后根据 @babel/compat-data 的数据库来过滤出这些浏览器版本里哪些特性不支持，之后引入对应的插件处理。

    babel 处理兼容行问题有两种方案:
    
    - polyfill 方案；

        使用 @babel/preset-env + corejs@3 实现简单语法转换 + 复杂语法注入 api 替换 + 构造函数添加静态属性、实例属性 api，支持全量加载和按需加载；

        缺点：就是会造成全局污染，而且会注入冗余的工具代码；
        
        优点：可以根据浏览器对新特性的支持度来选择性的进行兼容性处理；

        > corejs2 不支持实例方法的 polyfill， corejs3 支持。

    - runtime 方案；

        使用 @babel/preset-env + @babel/runtime-corejs3 + @babel/plugin-transform-runtime, 实现简单语法转换 + 复杂语法注入 api 替换 + 构造函数添加静态属性、实例属性 api，仅按需加载；

        优点：解决了polyfill方案的那些缺点，
        缺点：不能根据浏览器对新特性的支持度来选择性的进行兼容性处理，造成一些不必要的转换，从而增加代码体积；

    polyfill 方案比较适合单独运行的业务项目，如果你是想开发一些供别人使用的第三方工具库，则建议你使用 runtime 方案来处理兼容性方案，以免影响使用者的运行环境。

- [x] **懒加载使用 prefetch**

- [x] **AST 相关**

    以 **babel** 为例，babel 编译代码是 **source to source** 的转换， 整个过程分为三步:
    - **parser**，通过解析器进行词法分析，将**源码**转化为 **AST** 对象；
    - **transform**， 遍历 **AST**， 对 **AST** 进行增删改查；
    - **generate**，生成器，将 **AST** 转化为目标代码，并生成 **source-map**;


    **AST** 是对**源码**的抽象，**字面量**、**标识符**、**表达式**、**语句**、**class**、**module** 都有自己的 **AST**。

    AST 节点的类型:
    - **字面量**， **literal**， 具体可分为 stringLiteral、numberLiteral、booleanLiteral、RegExpLiteral 等；
    - **标识符**， **Identifier**， 表示变量名、属性名、参数名等各种声明和引用的名字；
    - **语句**， **statement**，代码中可独立执行的语句，如 break、if、forIn、while 等，具体可以分为：BreakStatement、ReturnStatement、BlockStatement、TryStatement、forInStatement、fowStatement、WhileStatement、DoWhileStatement、SwitchStatement、WiehStatement、IfStatement 等；
    - **声明语句**， **Declaration**， 是一种特殊的语句，表示声明一个变量、函数、class、import、export 等，具体可以分为： VariableDeclaration、FunctionDeclaration、ClassDeclaration、ImportDeclararion、ExportDeclaration 等；
    - **表达式**， **Expression**，执行完以后有表达式，常见的 Expression 有 ExpressionStatement、ArrayExpression、AssignmentExpression、FunctionExpression、ClassExpression、CallExpression 等；
    - **Programe**, 代表整个源码的节点， body 属性代表程序体；
    - **Directive**， 代码中的指令部分；
    - **Comment**, 注释节点；


    表达式 - 有返回值，有的表达式可单独作为语句使用；
    语句 - 可单独执行；
    声明语句 - 特殊的语句，声明变量、函数、class、import、export 等；


    **AST** 节点的公共属性:
    - **type**, **AST** 节点的类型；
    - **start**、**end**、**loc** 源码字符串的**开始**、**结束**、**行列号**；
    - 其他节点


    AST 结构是如何遍历的？

    一个日常的源代码文件对应的 **AST** 结构:
    - 最外层是一个 **Programe** 节点， **body** 属性代表程序体；
    - **body** 内部第一层一般为**声明语句**，如 **ImportDeclaration**、**ExportDeclarction**、**ClassDelaration**、**FunctionDelaration**、**VarliableDelarction**，如果有语句执行，还会有 **IfStatement**、**WhileStatement**、**ExpressionStatement**；
    - 接下来就是各个 AST 节点内部的结构；

#### rollup 篇

- [x] **为什么要有 rollup**

   原因:
   - webpack 作为构建工具，用在 lib 开发方面，打包出来的代码包含大量的冗余代码；
   - 推崇 ESM 模块规范，在打包过程中可以实现 tree shaking (其他构建工具的 tree shaking 功能都借鉴了 rollup)；
   - 浏览器对 ESM 规范的支持，使得在生产环境直接使用 ESM 规范的代码也是可以的；

   rollup 的应用场景:
   - 组件库开发；
   - 如果浏览器对 esm 规范完全支持，可以使用 rollup 打包应用，vite 的 production 打包就是基于 rollup 实现的。

- [x] **rollup api 的使用**

   rollup 提供两个 api - rollup 和 watch。

   rollup 用于 build。执行 rollup 会返回一个 promise 对象，它解析为一个 bundle 对象。通过 bundle 对象的 write 方法，可以将打包构建的包放置到指定位置。

   用法如下:

   ```
   const rollp = require('rollup');

   rollup.rollup(inputOptions).then(bundle => {
      bundle.write(outputOptions);
   });

   ```

   watch 可以用来监听某个文件的变化，然后重新发起 build。
  
- [x] **rollup 常用配置项 - input options 和 output options**

   rollup 的配置项分为两个部分：

   - 执行 rollup.rollup 时需要传入的 inputOption；
- 
   - 执行 bundle.write 是需要传入的 outputOption；

   常用的 inputOption:

   - input，打包的入口配置, 可以是一个字符串(单入口文件打包)、一个字符串数组(多入口文件打包)、一个对象(多入口文件打包);
   
   - external, 配置不参与打包的文件，可以是一个匹配 id 的正则表达式、一个包含 id 的数组、一个入参为 id 返回值为 true 或者 false 的函数；
      
   - plugins, build 时用到的插件；

   常用的 outputOption:

   - dir, 放置生成的 bundle 的目录，适用于多入口文件打包；
  
   - file，生成的 bundle 的文件名及目录，适用于单入口文件打包；
  
   - format，指定生成的 bundle 的格式： amd、cjs、es、iife、umd、system；
  
   - globals, 指定 iife 模式下全局变量的名称；
  
   - name，指定 iife 模式下赋值的变量；
  
   - plugins，输出时使用的插件；
  
   - assetFileNames, 给静态文件 assets 命名的模式，默认为 'assets/[name]-[hash][extname]'；
  
   - banner / footer，要添加到 chunk code 顶部/尾部位置的注释字符串；
  
   - chunkFileNames, 给分离的 chunk 命名的模式，默认为 '[name]-[hash].js'；
  
   - entryFileNames，initial chunk 的命名规则，默认为 '[name].js'；
  
   - inlineDynamicImports
  
      懒加载模块是否内联。

      默认情况下，懒加载模块会自动分离为一个单独的 async chunk。如果 inlineDynamicImports 为 ture，懒加载模块会合并到 importor module 中。

      inlineDynamicImports 不能和 manualChunks 一起使用，否则会报错。

   - intro / outro, 要添加到 chunk code 顶部 / 尾部的代码，可用于变量注入。
   
   - manualChunks
  
      自定义 chunk 分离规则，类似于 webpack 的 splitChunks 规则，将匹配的 module 分离到指定 name 的 chunks 中。

      manualChunks 可以是一个对象，也可以是一个函数。如果是一个对象，key 为自定义 chunk 的 name， value 是一个 id 数组，表示要分配到自定义 chunk 的 module。

      如果是一个函数，入参为 module id，返回值为自定义 chunk 的 name。 rollup 会遍历模块依赖图，将匹配 manualChunks 函数的 module 分配到对应的自定义 chunks 中。

      分配到 manualChunks 中的 modules 中如果存在懒加载 module，懒加载 module 也会单独分离到 async chunk 中
   
   - preserveModules,

      rollup 默认的 chunk 分离规则将模块依赖图分离为尽可能少的 chunk。一个单页应用最后的分离结果为:一个 main chunk，多个懒加载 module 为 async chunk，多个根据 manualChunks 规则生成自定义 chunks。

      而 preserveModules 的分离过程正好相反。如果将 preserveModules 设置为 true， rollup 会将每个 module 分离为一个单独的 chunk。

      preserveModules 需要配合 format 一起使用。

   总的来说，inputOptions 中最关键的是: input、externals、plugins； outputOptions 中比较关键的是: dir、file、format、plugins、preserveModules 等。
  
- [x] **rollup 的 plugin 机制及如何实现一个自定义 plugin**

   rollup 插件的一些约定:

    - 插件要有一个清晰的名称和 rollup-plugin-前缀；
  
    - 在 package.json 中要包含 rollup-plugin 关键字 (这个是什么意思呢？？)
  
    - 插件应该是被测试的
  
    - 尽可能的使用异步方法
  
    - 如果可能，请确保您的插件输出正确的源映射


    - 如果您的插件使用“虚拟模块”（例如用于辅助功能），请在模块 ID 前加上\0. 这可以防止其他插件尝试处理它 ？？

   一个自定义插件的格式为：

   ```
   {
      name: 'rollup-plugin-xxxx',
      options: () => { ... },
      resolveId: () => { ... },
      load: () => { ... },
      ...
   }
   ```

   rollup hook 根据执行的顺序类型：
    - async，异步 hook；
  
    - first - 如果有多个 plugin 实现了这个 hook，这些 hook 会按序执行，直到一个 hook 返回不是 null 或者 undefined 的值，即如果某个 hook 返回不是 null 或者 undefined 的值，那么后续的同类型的 hook 就不会执行了。
  
    - sequential - 如果有多个 plugin 实现了这个 hook，这些 hook 会按照 plugin 的顺序按序执行。如果一个 hook 是异步的，那么后续的 hook 会等待当前 hook 执行完毕才执行。上一个 hook 返回的结果会作为下一个 hook 的入参。

    - parallel - 如果有多个 plugin 实现了这个 hook，这些 hook 会按照 plugin 的顺序按序执行。如果一个一个 hook 是异步的，那么后续的 hook 将会并行执行，而不是等待当前的 hook，即 parallel 类型的 hook 之间不相互依赖。

      针对 parallel 的 hook，vite(或者 rollup) 会采用一个 promise.all，等所有的 parallel hook 处理完毕以后，开始处理下一类型的 hook。


   rollup hook 根据执行的阶段可以分为：
    
   - **build hook**，构建阶段的 hook(按照执行顺序):
  
      - **options - async、sequential**，构建阶段的第一个 hook，可用于修改或者替换配置项 options，唯一一个无法访问插件上下文的 hook；
  
      - **buildStart - async、parallel**，各个插件可以通过这个 hook 做一些准备工作，如初始化一些对象、清理一些缓存等；
  
      - **resolveId - async、first**，自定义解析器，用于解析模块的绝对路径；
  
      - **resolveDynamicImport - async、first**，为动态导入定义自定义解析器
  
      - **load - asnyc、first**，自定义加载器，根据 resolveId 返回的路径去加载模块；
  
      - **transform - async、sequential**，对模块做转换操作，一般的操作是生成 AST，分析 AST，收集依赖，做代码转换等；
  
      - **moduleParsed - async、parallel**，模块已经解析完毕，接下来需要解析静态依赖/动态依赖；
  
      - **buildEnd - async、parallel**，rollup 完成 bundle 调用，即模块依赖图构建完成；
  
   - **output generation hook**，输出阶段的 hook(按照执行顺序)：
  
     - **outputOptions - sync、sequential**，输出阶段的第一个 hook，可用于修改或者替换 output 配置项；
     
     - **renderStart - async、parallel**，类似于 buildStart hook，做一些准备工作；
     
     - **banner / footer / intro / outro - async、parallel**，在源文件的头部 / 底部添加注释、代码；
     
     - **renderDynamicImport - async、parallel**
     
     - **augmentChunkHash - sync、sequential**
     
     - **resolveFileUrl / resolveImportMeta - sync、first**
     
     - **renderChunk - async、sequential**, 每个 chunk 的内容构建完成触发；
     
     - **generateBundle - async、sequential**，所有 chunk 的内容构建完成触发；
     
     - **writeBundle - async、parallel**，将每个 chunk 的内容输出到指定位置以后触发；
     
     - **closeBundle - async、parallel**，rollup 结束工作时触发；
  
   build 阶段，用的较多的 hook - options、resolveId、load、transform。

   generate 阶段， 用的较多的 hook - outputOptions、renderChunk、generateBundle。

- [x] **rollup 的整个工作过程**

   rollup 整个工作过程如下：
    - 执行 rollup.rollup 方法，入参为 input options
  
      - 初始化 input options。依次触发 input plugins 中各个 plugin 的 options hook，更新 input options；
  
      - 构建一个模块依赖图实例，初始化 plugin 驱动、acorn 实例、module loader，这个时候模块依赖图还是一个空的对象；
  
      - 依次触发 input plugins 中各个 plugin 的 buildStart，做一些初始化工作、缓存处理问题；
  
      - 开始构建模块依赖图；
  
          构建模块依赖图的具体过程:
          1. 解析入口模块的 id，得到入口模块的绝对路径(通过 resolveId hook 来解析)
          2. 根据解析的路径创建一个 module 对象；
          3. 触发 load hook 来加载 module 的源文件；
          4. 将源文件内容解析为 ast 对象；
          5. 遍历 ast 对象，收集静态依赖和动态依赖，其中静态依赖收集到 module 对象的 sources 数组中，动态依赖收集到 module 对象的 dynamicImport 数组中; 同时还可以知道依赖的 import 有没有被使用(被使用的 import 会被收集到 module 的 includedImports 中);
          6. 遍历 module 对象的 sources、dunamicImport 数组，解析依赖模块的路径；
          7. 依次触发 input plugins 中各个 plugin 的 moduleParsed hook；
          8. 重复 2 - 7 步骤，直到所有的模块解析完成

          静态依赖模块，会收集到 importer 模块的 dependencies 列表中；动态依赖模块会收集到 importer 模块的 dynamicDependencies 列表中。

          静态依赖会收集到 importor module 的 sources 列表中，动态依赖会收集到 importor module 的 dynamicImport 列表中；同样的 importer 模块的 id 也会收到到静态依赖模块的 importers 和动态依赖模块的 dynamicImporters 中。这样模块依赖图就构建完成了。

      - 模块排序(这里为什么要排序??)
  
      - 返回一个带 generate、write 方法的 bundle 对象；
  
    - 执行 bundle.write 方法，入参为 output options；
  
      - 初始化 output option。依次触发 output plugin 的 outputOptions hook， 更新 output otions；
  
      - 构建一个 Bundle 实例，入参为 input options、output options、output 插件引擎、graph(模块依赖图)；
  
      - 执行 bundle 实例的 generate 方法, 及模块依赖图分离为 chunks；

         整个过程如下：

         - 先创建一个空的 outputBundle 对象；
  
         - 依次触发 output plugin 的 renderStart hook(作用应该类似于 buildStart hook，做一些初始化、缓存清理工作)；
         - 将模块依赖图分离为 chunks，具体过程为:
  
           1. 根据 output.manualChunks 规则，建立一个 map，key 为 module 对象，value 为自定义 manualChunks 的 name；
   
           2. 确定 chunk 分离规则。
          
               如果 output.inlineDynamicImports 为 ture，所有的 module 会分离为一个 chunk；如果 output.preserveModules 为 ture，每个 module 会分离为一个单独的 chunk (配合 output.format 使用)；如果 output.inlineDynamicImports、output.preserveModules 都为 false，那么就将模块依赖图分离为 entry chunks、dynamic chunks、自定义 manual chunks。

           3. 根据 chunk 分离规则，确定 chunk 以及 chunk 包含的 module。

               如果 output.inlineDynamicImport 为 ture，chunk 只有一个，对应的 module 列表收集了所有的 module；

               如果 output.preserveModules 为 true (output.inlineDynamicImport 为 false)，module 有多少个， chunk 就有多少个，chunk 的 module 列表只有一个 module；

               如果 output.inlineDynamicImport 和 output.preserveModules 为 false，chunk 分离过程为：
               
               - 先根据 output.manualChunks 创建 manual chunks，把属于他们的 module 添加到对应的 manual chunks 中；
  
               - 以模块依赖图的入口模块为起点，分析模块依赖图，找到懒加载 modules 以及 module 和  importor module 的映射关系(去掉已经分离到 manualChunks 中的 modules)；
  
               - 找到每一个 module 和其对应的 entry modules(包含 static entry modules 和 dynamic entry modules)；
       
               - 根据 module 和对应的 entry modules，将 modules 分离为 initial chunks 和 dynamic chunk;
          
                  如果 module 的 importor module 包含 static entry modules 和 dynamic entry module，那么该 module 会分配打到 initial chunk 中。

                  在这一过程中，如果 module 的 importor module 并没有使用该 module 的 exports，那么该 module 并不会添加到 chunk 中，这样就做到了 module 级别的 tree shaking。

                
        
      - 遍历分离好的 chunks，给每个 chunk 中收集的 modules 排序，然后构建 chunk 实例，建立一个 map，收集 module 和 chunk 的映射关系；
  
      - 遍历 chunks，确定每个 chunk 依赖的 static chunks 和 dynamic chunks，static chunks 需要先加载，dynamic 需要 懒加载；
  
      - 为每个 chunk 绘制内容，即根据 chunk 中收集的 modules 构建 chunk 实际的内容:
  
        - 依次触发 output plugin 的 banner hook、footer hook、intro hook、outro hook，返回需要添加到 chunk 中的 banner、footer、intro、outro；
  
        - 根据每个 chunk 收集的 modules，找到每个 chunk 对外的 exports；
  
        - 对每个 chunks 做预处理，确定每个 chunk 中要移除的 module 以及 chunk 中每个 module 要移除的 exports；(有些 module 在分配到 chunk 的时候就可以确定是否被移除掉)；
  
        - 给每一个 chunk 分配 id；

        - 为每一个 chunk 根据收集的 module 构建内容，并依次触发 renderChunk hook；
  
        - 所有 chunk 的内容构建完毕，依次触发 output plugin 的 generateBundle hook；
  
      - 将构建好的每一个 bundle，通过 fs.writeFile 输出到 outdir 指定位置；
  
      - 依次触发 output plugin 的 writeBundle hook， 整个 build 过程结束；


- [x] **rollup 是如何确定每个 module 的 exports 是否被使用的**

    分析一个 module 的 ast 时，就可以知道这个 module 的 exports 和 dependence modules 及用到的 dependence module 的 exports。

    然后根据 dependence modules 的 exports 和被使用到的 exports，就可以确认 module 的哪一个 exports 没有被使用。如果某个 module 的所有 exports 都没有被使用，那么该 modules 就可以从 chunks 的 modules 列表中移除，或者在分配 chunks 就不会添加到 chunks 中去。

- [x] **rollup 的 treeshaking**

    rollup 基于 es6 module 实现了 module level 和 statement level 的 tree shaking：

    - 在将模块依赖图分离为 chunk 时，如果一个 module 被 importor module 依赖，但是它的 exports 并没有被使用，那么该 module 不会添加到 chunk 中，实现了 module level 的 tree shaking；
  
    - 一个 module 的 exports，如果没有被其他 module 使用到，那么在构建 chunk 内容时就会被移除掉，实现了 statement level 的 tree shaking；




#### vite 篇


#### esbuild 篇


#### 其他构建工具








