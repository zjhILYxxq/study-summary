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

#### esbuild 篇

- [x] **esbuild 的常用 api**

   esbuild api 的使用方式有三种： cli、js、go。比较常用的为 js、cli。

   esbuild 提供了两个 api 供大家使用：transform 和 build。

   transfrom，即转换的意思，通过这个 api 可以将 ts、jsx、tsx 格式的内容转化为 js 格式的内容。 transfrom 只负责文件内容转换，并不会生成一个新的文件。

   build，即构建的意思，根据指定的单个或者多个入口，分析依赖，并使用 loader 将不同格式的内容转化为 js 内容，生成一个 bundle 文件。 build 过程肯定包含了 transform 过程。


   这两个 api 的使用方式:
   ```
   const res = await esbuild.transform(code, options) // 将 code 转换为指定格式的内容

   esbuild.build(options) // 打包构建
   ```
  
- [x] **esbuild 使用 transform、build 时的常用配置项**

   使用 transfrom、build 时都可传入的参数:

   - **define**, 用常量表达式替换指定全局标识符；
    
   - **format**, bundle 输出文件的格式，有三种 iife、cjs、esm，即立即执行函数、commonjs、ESModule；

        platform 为 browser 时， format 默认为 iife。

        platform 为 node 时， format 默认为 cjs

   - **loader**，用于配置指定类型文件的解释方式(对比 webpack 的 loader)

   - **minify**, 压缩代码

   - **target**, 根据设定的目标环境，生成对应的 js、css 代码；
  
   - **banner**, 给生成的 js、css 代码头部添加指定的字符串；
  
   - **footer**, 给生成的 js、css 代码底部添加指定的字符串；
  
   - **globalName**， 需配合 format: 'iife' 使用，将生成的 iife 代码的结果赋值给 globalName 指定的变量；
  

   使用 build 时可传入的独有参数:

    - **entryPoints**, 指定打包构建的入口文件

        entryPoints 可以是一个数组，也可以是一个对象。

        如果 entryPoints 是一个数组，当数组元素只有一个时，是单入口打包，生成的 bundle 只有一个；当数组元素有多个时，是多入口打包，生成的 bundle 有多个。

        > 注意，如果是多入口打包，不能使用 outfile 配置项，只能使用 outdir 配置项。

        当 entryPoints 是一个对象时，key 为 outfile 的文件名， value 为入口文件的文件名。

    - **entryNames**，用于控制每个入口文件对应的输出文件的文件名，可通过带有占位符的模板配置输出路径；

        entryNames 的一般格式为 '[dir]/[ext]/[name]-[hash]'

        其中， dir 会基于 outBase 解析为入口文件的目录；ext 对应为 outExtension； name 为入口文件的文件名； hash 为 bundle 内容对应的 hash。 


    - **bundle**, 是否将依赖内联到 entry file 中;

        如果未显示指定 bundle 的值为 true，那么依赖项不会内联到 entry file 中。

        当 bundle 设置为 true 时，如果依赖的 url 不是一个静态定义的字符串，而是运行时生成，那么该依赖不会内联到 entry file 中。

        即 bundle 是编译时操作，不是运行时操作。

    - **external**, 构建时指定不内联到 entry file 中的依赖；
  
    - **outdir**, 指定构建内容的输出文件夹；
  
    - **outfile**, 指定构建内容的输出名称，如果是多入口打包构建，则不能使用，此时必须是 outdir；

    - **platform**, 默认情况下构建内容是为浏览器准备的，代码格式为 iife，也可指定为 node

        什么情况下，为浏览器准备代码时，代码格式为 esm ？？
    
    - **serve**，主要用于开发模式下修改文件以后，自动重新 build；

        serve 是 esbuild 提供的一个新的 api。

    - **sourcemap**, 配置生成 sourcemap 文件，可选的值为 true、'linked'、'inline'、'external'、'both'；

        'linked'，生成一个 .map 文件，在 bundle 中有一个 link 指向生成的 .map 文件；

        'inline'， .map 文件的内容内联的 bundle 中；

        'external'，生成 .map 文件，但是 bundle 中没有 link 指向生成的 .map 文件；

        'both'， 'inline' 和 'external' 的聚合，生成一个独立的 .map 文件，bundle 中有自己内联的 .map 内容；

        true，等同于 'linked';

    - **splitting**， 代码分离；

        esbuild 的代码拆分功能并不完善，目前仅支持将多入口文件的共同依赖、动态依赖拆分出来，而且 format 必须是 esm。

        不支持自定义代码分离。

    - **watch**，监听文件的变化，然后重新 esbuild；
  
    - **write**，用于配置 build 内容是直接写入文件系统还是写入内存缓存区 - buffers

        默认为 ture，直接写入指定文件中。

        如果配置为 false，则写入内存缓存区中，通过 js 代码可读取构建内容。

    - **assetNames**，静态资源的输出配置，和 entryNames 一样；
  
    - **chunkNames**，代码分离生成的 chunk 的输出配置，需要配合 splitting 一起使用；

    - **conditions**，条件配置，在解析三方依赖包时用到

        使用时，需配合三方依赖包 package.json 中的 exports 字段 ？？

    - **keepName**, 需要配合 minify 一起使用，压缩的时候保留函数的 name；
  
    - **resolveExtensions**，路径后缀名扩展；

        在解析 url 时，如果 url 没有后缀名， esbuild 会默认使用 .ts、.tsx、.jsx、.js、.css、.js。

        通过 resolveExtensions 可以添加 esbuild 没有的后缀名。

        > 解析的时候，需要拿到文件的绝对路径去读取文件内容。如果 url 没有后缀名，我们就需要给 url 添加正确的后缀，才能争取读取文件。此时就需要我们通过 resolveExtensions 指定 esbuild 没有提供的后缀名。

    - **treeShaking**，配置是否开启 tree shaking 功能。
  
- [x] **自定义 esbuild plugin**

   自定义一个 esbuild plugin:

    ``
    {
        name: 'xxx',
        setup: (build) => {
            build.onResolve({ filter: '', namespace: '' }, args => { ...});
            build.onLoad({ filter: '', namespace: ''}, args => { ... });
            build.onStart(() => { ... });
            build.onEnd(() => { ... });
        }
    }
    ```

    plugin 的 hooks：

    - **onResolve**

        解析 url 是调用，可自定义 url 如何解析。如果 callback 有返回 path，后面的 callback 将不会执行。

        所有的 onResolve callback 将按照对应的 plugin 注册的顺序执行。

    - **onLoad**

        加载模块时调用，可自定义模块如何架子啊。 如果 callback 有返回 contents，后面的 callback 将不会执行。

        所有的 onLoad callback 将按照对应的 plugin 注册的顺序执行。


    - **onStart**

        每次 build 开始时都会触发，没有入参，因此不具有改变 build 的能力。

        多个 plugin 的 onStart 并行执行。

    - **onEnd**

        每次 build 结束时会触发，入参为 build 的结果，可对 result 做修改。

        多个 plugin 的 onEnd 是按序执行的。
  
- [x] esbuild 的优缺点

   优点：快。

   缺点：
   - 无法修改 ast，防止暴露过多的 api 而影响性能；
   - 不支持自定义代码拆分(拆分出来的 chunk： initial chunk、async chunk、runtime chunk)
   - 产物无法降级到 es5 之下；

- [x] esbuild 快的原因

   - Go 语言开发，可以多线程打包，代码直接编译成机器码(不用先解析为字节码)；
   - 可充分利用多核 cpu 优势；
   - 高效利用缓存？？

#### vite 篇

- [ ] vite 的用法

   启用 development 模式的命令: vite、vite serve、vite dev；

   启用 production 模式的命令: vite build；

   vite optimize, 手动进行预加载依赖优化；

    vite preview 这个命令有什么用？？

- [x] vite 的常用配置项

   build、server 模式下的公用配置项：

   - root: 项目的根目录，即 index.html 所在的位置，可以是绝对路径，也可以是基于 vite.config.js 的相对路径, 默认值为 process.cwd();
   - base: 基础公共路径？？
   - mode: 默认，开发为 development，生产为 production；通过 mode 选项可以覆盖 serve 和 build 命令对应的默认模式；
   - define: 定义可替换的全局变量
   - plugins: 插件，对应 rollup 插件；
   - publicDir: 静态资源目录，build 结束以后会复制到 outDir 目录下；
   - cacheDir: 预构建文件的缓存目录，默认为 node_modules/.vite;
   - resolve: 文件解析配置，有 alias(别名配置)、dedupe、mainField 等；
   - css 相关配置
   - json 相关配置
   - esbuild 相关配置
   - envDir:  .env 文件的根目录；
   - envPrefix: 环境变量的前缀，默认为 VITE_;
  
   server 模式下特有的配置项：

   - server， 开发服务配置
     - host
     - port
     - strictPor
     - https
     - open
     - proxy
     - cors
     - headers
     - force
     - hmr
     - watch
     - middlewareMode
     - base
     - fs
     - origin
   - optimizeDeps，预构建配置项
     - entries
     - exclude
     - include
     - esbuildOptions
   
   build 模式下独有的配置项

   - build
     - target: 根据浏览器的兼容性，生成 bundle，默认值为 modules，即浏览器支持 esm；
     - ourDir: 指定 output 输出的文件夹目录；
     - assetsDir: 指定生成 assets 的文件夹目录；
     - assetsInlineLimit: 静态文件大小，小于指定值的将内联为 base64 url；
     - cssCodeSplit: 启动/禁用 css 代码拆分。启用后，异步块中导入的 css 将内联到异步块中并在加载时插入。如果禁用，整个项目中的 css 代码将会被提取到单个文件中。
     - cssTarget: 此选项允许用户为 CSS 缩小设置不同的浏览器目标，而不是用于 JavaScript 转换的浏览器目标, 默认值通 build.target.
     - sourcemap: 是否成成 sourcemap 文件。
     - rollupOptions, rollup 工具的配置项，分为 inputOptions 和 outputOptions，其中 inputOptions 用于构建模块依赖图，outputOptions 用于将模块依赖图分离为 chunks 并输出到指定位置；
     - commonjsOptions, ?
     - dynamicImportVarsOptions, ?
     - lib: 构建为 lib，必须指定 entry;
     - manifest, 是否生成一个 manifest 文件；
     - minify， 是否压缩；


- [x] development 和 production 模式下 vite 的工作过程

   development 模式下的整个工作过程:

    - 解析 vite config 配置项。
         
         解析以后的 config 中的 plugins 为内部插件 + 三方插件 + 自定义插件，插件的顺序为 alias 插件、pre 插件、vite 核心插件、normal 插件、build pre 插件、post 插件、build post 插件。

         在这个过程中，每个 plugin 的 config hook 会触发，更新 vite config；

    - 基于 http.createServer 创建一个 server 实例；
  
    - 创建一个文件监听器 watcher，用于监听文件的变化；
  
    - 依次执行各个 plugin 的 configureServer hook，收集要给 server 要添加的自定义 middlewares；
  
    - 给 server 添加 middlewares；
  
    - 启动 server；

    - 依次执行各个 plugin 的 buildStart hook，做准备工作，如初始化、清理缓存工作；
  
    - 预构建优化；
  
    - 客户端开始请求入口文件，server 端收到请求，依次执行 middleware，返回请求的文件内容；

        不同的文件，处理逻辑也不相同。

        如果是 .html 类型的文件，先将 html 文件解析为 ast 对象，然后找到入口文件 - main.tsx；

        如果是 js/ts/tsx/jsx/cjs 文件，先通过 plugin 的 resolveId hook，解析为绝对路径；然后再通过 plugin 的 load hook 加载源文件，然后再通过 plugin 的 transform hook 做源文件做转换(jsx -> js, tsx -> js, ts -> js)、找到模块的依赖模块，然后再对依赖模块做同样的处理；

        如果是 css/less/ 文件，处理过程和 js 一样。


    production 模式下整个工作过程:

    - 解析整个构建操作需要的配置项。vite 通过读取 vite.config.js 的方式来获取构建操作需要的配置项 - build。
  
    - 确定构建操作的入口文件
      - 如果有 build.lib.entry, 选择 build.lib.entry 作为入口文件；
      - 如果配置了 ssr，选择 ssr 对应的文件作为入口文件；
      - 如果配置了 rollupOption.input， 选择 input 作为入口文件；
      - 选择 index.html 中的 main.js 文件作为入口文件；
  
    - 调用 rollup.rollup, 构建模块依赖图，返回一个 bundle；
  
    - 执行 bundle.write 方法，将模块依赖图分离为 chunks 并输出到指定位置(或者调用 bundle.generate 方法)； 

    不管是 development 还是 production 模式，浏览器端都是通过 ESM 加载 js 代码。

- [x] vite 的 plugin 类型及如何实现一个自定义 plugin

   vite 插件定义和 rollup 插件基本相同。

   vite 中的插件根据执行顺序，可以分为三类： pre 类型、normal 类型、post 类型。 三种类型的插件的执行顺序为 pre、normal、post。

   通过 enforce 属性可以指定插件的执行顺序。如果未指定，默认为 normal。

   一个 vite 插件，常见的 hook 有哪些:

   - config， 可用于修改 vite config，用户可以通过这个 hook 修改 config；
  
   - resolvedConfig， 用于获取解析完毕的 config，在这个 hook 中不建议修改 config；
  
   - configureServer， 用于开 dev server 添加自定义 middleware；

   开发阶段需要的插件(按先后顺序排列):
   - vite:pre-alias plugin - 提供 resolvedId hook， ？？
   - alias plugin - 提供 buildStart hook 和 resolvedId hook，用于解析静态依赖和动态依赖的 url；
   - pre 类型的三方 plugin - 这一类型的 plugin 应该提供什么样的 hook ？？
   - vite:modulepreload-polyfill plugin - 提供 resolvedId hook 和 load hook， ？；
   - vite:resolve plugin - 提供 resolvedId hook 和 load hook
   - vite:optimized-deps plugin - 提供 load hook
   - vite:html-inline-proxy plugin - 提供 resolveId hook 和 load hook；
   - vite:css plugin, 提供 buildStart hook、transform hook；
   - vite:esbuild plugin， 提供 buildEnd hook、 transform hook；
   - vite:json plugin， 提供 transform hook；
   - vite:wasm plugin， 提供 resolveId hook、load hook；
   - vite:worker plugin， 提供 buildStart hook、load hook、transform hook、renderChunk hook
   - vite:asset plugin， 提供 buildStart hook、load hook、renderChunk hook、 generateBundle hook
   - normal 类型的三方 plugin
   - vite:define plugin，提供 transform hook
   - vite:css-post plugin， 提供 buildStart hook、load hook、renderChunk hook、 generateBundle hook
   - vite:worker-import-meta-url plugin， 提供 transform hook
   - post 类型的三方 plugin
   - vite:client-inject plugin， 提供 transfrom hook
   - vite:import-analysis plugin， 提供 transfrom hook

   在定义一个自定义 plugin 的 hooks 时，需要明确先知道你想要这个 plugin 在 vite 的哪个阶段执行，即需要定义哪些 hooks；然后再根据 hooks 的类型如 first、sequential、parallel 来决定 hook 的 enforce。parallel 类型的 hook 之间互不影响，所以对 enforce 没有要求；first 类型的 hook，前面的 hook 结果会影响后面的 hook 到底需不需要执行，一般设置为 normal、post，尽量不要设置为 pre(主要是怕影响到 vite 内部插件的执行，除非你有把握)；sequential 类型的 hook，前面的 hook 返回的结果会影响后面的 hook 的结果，可以设置为 pre、normal、post(要有把握)

   一般经验: hook 的 enforce 一般设置为 normal(post 也可以)，尽量不要设置为 pre(除非你有绝对的把握)；

   first 类型的 hook 一定要注意，如 resolveId、load、resolveDynamicImport，设置 enforce 时要谨慎；

  
- [x] vite 的预构建过程及原理

   vite 需要执行预构建的目的:
   - 将 commonjs 或者 umd 类型的依赖转化为 esm；
   - 将有很多内部模块的 esm 依赖关系转化为多个 模块(将多个 http 请求合并为单个 http 请求)；
  

   整个预构建过程:

   1. 先判断需不需要进行预构建；

      vite 内部会通过 config.optimizeDeps.disabled 配置项判断需不需要进行预构建。但是 optionmizeDeps.disabled 并没有开放给用户，所以使用 vite 的时候，开发环境下默认开启预构建；

   2. 判断是否可以使用上一次预构建的内容，如果不可以使用，就需要重新进行依赖预构建；

      如果没有缓存的预构建内容，即没有 /node_modules/.vite/deps，那么就需要重新进行预构建；

      如果有缓存的预构建内容，但是 config.server.force 的值为 true，需要强制进行依赖预构建；

      如果有缓存的预构建内容，且 config.server.force 为 false，就需要判断上一次的预构建内容是否可用。

      有几个源来决定 vite 是否需要重新进行预构建:
      - package.json 中的 dependencies 列表；
      - lockfile；
      - vite.config.js
        
      vite 会通过一个有 .lock 文件内容和 vite.config 内容生成的 hash 值来判断项目的依赖项是否发生了变化。如果 .lock 文件或者 vite.config 配置项内容发生了变化，那么 hash 就会变化，那么就需要重新进行依赖预构建。

   3. 找到项目中需要进行预构建的文件

      依赖预构建比较关键的一步，需要预构建的文件，如 react、react-dom、optimization.include 指定的需要强制预构建的文件 等。
        
      vite 会通过 esbuild 以入口文件(一般为 index.html)为起点做扫描，找到项目依赖的第三方库。

      具体的扫描过程为：
      1. 从 index.html 中找到整个项目的入口 js 文件；
      2. 使用 esbuild 提供的 build api，做打包；
      3. 使用 esbuild 打包时，提供 onResolved hook，在解析依赖的 url 时，将三方依赖收集起来；

      > 使用 esbuild 做 build 时，不提供 outdir 配置项，不会输出文件

      通过 esbuild 的扫描，我们就可以找到整个项目所依赖的三方库，然后就可以进行预构建了。

    4. 对第三步找到需要预构建的文件，开始预构建

      具体的构建过程如下:
      1. 根据依赖文件的 url 读取文件内容；
      2. 分析文件内容，获取 import 和 export；
      3. 使用 esbuild 提供的 build api，做打包， outdir 为 node_modules/.vite/.dep;
      4. 使用 esbuild 打包时，提供 onLoad hook，根据第二步得到的 import 和 export，判断模块是 cjs 还是 esm；

         如果是 cjs 模块，需要对文件内容做格式化，变为 export default require('xxxx');

         如果是 esm 模块，则不需要做太复杂的格式化处理；

   5. 预构建的内容输出到 node_modules/.vite/.dep 目录下；


- [x] vite 在预构建过程中是如何获取到依赖的三方模块的

   vite 在预构建的时候，巧妙的利用了 esbuild 的 build 能力，以 index.html 中的入口文件为 entry 去打包。

   在 esbuild 做 build 时，vite 提供了 onResolve hook，自定义依赖的解析过程，将三方依赖搜集起来，然后针对三方依赖做预构建。

- [x] 二次预构建

   二次预构建，本地服务运行的时候，发现有新的第三方依赖没有预构建，此时要重新进行预构建，然后通知客户端去重新刷新页面。

   当动态依赖的 url 在运行时才能确定，此时动态 url 有第三方依赖时，这个第三方依赖是无法在第一次预构建的时候扫描出来的，这就导致会发生再次预构建。

   (这种情况下 webpack 是怎么处理的？？)

   动态依赖:

   ```
   import objectAssign from "object-assign";
   console.log(objectAssign);

   // main.tsx
   const importModule = (m) => import(`./locales/${m}.ts`);
   importModule("zh_CN");
   ```

   静态依赖: 通过 plugin 添加三方依赖。

   二次预构建的过程：
   1. vite 服务运行时，解析依赖，发现是第三方依赖，而且新发现的第三方依赖没有重新预构建；
   2. 把新发现的未预构建的第三方依赖，收集起来；
   3. 重新进行预构建；
   4. 通知客户端重新刷新页面；

   如何处理二次预构建：
   1. 使用 vite-plugin-package-config、vite-plugin-optimize-persist 这两个插件

      vite-plugin-package-config 提供了 config hook， 使得 vite 可以在初始化 config 时从 package.json 读取 vite 配置项合并到 config 中。

      vite-plugin-optimize-persist 提供了 configureServer hook，添加自定义 middleware， 可以在发现有新的未进行预构建的第三方依赖时，将其写到 package.json 中。

      通过这样的操作，当下一次开发服务器启动以后，不会发生二次预构建了。

      注意， vite 的 2.9 版本不适合。

   2. vite3.0 修复了首屏时的二次预构建。

      为什么首屏时出现未预构建的第三方依赖，会触发二次构建，但是不会重新load 页面？ 为什么呢？

      懒加载的二次构建，会重新 load 页面；

      vite 是如何区分是首屏的第三方依赖还是懒加载的第三方依赖

      为什么在 vite:resolve 和 vite:import-analysis 插件中都有处理未预构建的第三方依赖？

      一个原则: 本地服务启动以后，请求的第三方文件，必须是预构建完成以后才会返回。首屏的时候，如果部分预构建，部分未预构建，已经预构建的内容也不会先返回，而是会等二次预构建完成以后才返回，所以首屏不会发生重新 load 页面。

      如果是懒加载，触发二次预构建，然后重新 load 页面。

      二次预构建的发生过程:
      - 客户端发起请求；
      - 服务端收到请求；
      - 解析 url；
      - 对解析以后的 url 做 load 和 transform 操作；
      - transform 时，会分析 importer 和 exportor，然后将装换以后的内容返回给客户端；
      - 解析 importer，然后重复第三步；

      解析的时候，如果发现是未预构建的第三方依赖，则收集起来，等到所有的静态依赖全部解析完毕，重新进行预构建。

      客户端发起请求时，如果此时客户端正在进行二次预构建，那么请求会被阻塞，直到预构建完成为止。

      二次预构建，会影响首屏响应速度和懒加载速度。




      

      
   



- [x] esbuild 是怎么格式化 esm 模块的？

   esbuild 会简单的对 esm 模块做处理

    ```
    // example.1.js
    export const func1() {...}

    export default func() { ...}

    // 格式化为
    const func1() {...}
    const example_1_default() {...}
    export {
        func1,
        example_1_default
    } 
    ```

    ```
    import func, { func1} from './example.1';

    // 格式化为 
    import { func1, example_1_default } from './example.1;
    ```

- [x] esbuild 是怎么将 cjs 模块格式化为 esm 模块的？

   首先是 cjs 模块。

   一个 cjs 模块，常见的格式为:

   ```
   const func = () => { console.log('func') };
    
   // 格式一
   exports = func;

   // 格式二
   module.exports = func;
    ```

   将 cjs 模块，转化为 esm 模块的方式为给 cjs 模块代码变为一个函数，执行这个函数并将返回的结果通过 exports 导出，如下:
   
   ```
   functon require() {
      let mod = { exports: {} };
      (function(exports, mod) {
         const func = () => { console.log('func') };
         exports = func;
      })(mod.exports, mod);
      return mod;
   }
   export default require();
   ```
   这样一个 cjs 模块就被格式化为 esm 模块。
  
- [x] vite 的中间件原理

   vite 的中间件其实是一个函数，执行时会返回一个入参为 req、res、next 的 callback。

   vite 使用中间件的姿势： server.middlewares.use(someMiddleware(server));

   server.middlewares 其实一个 app 实例(对照 express ？？)

   其中， someMiddleware 会返回一个 callback。

   server 内部会维护一个 callback 的 list，当 client 发起请求时， callbackList 中收集的 callback 会按序触发。callback 在执行过程中，会根据 req 的 url 信息，做对应的逻辑判断操作。如果 url 不匹配，该 callback 会直接 return 结束掉。

   中间件其实是一系列函数。

   在实际应用中，会通过 http.createServer(callback) 创建一个 server 实例，然后执行 server.listen(port)。当 client 访问某个 url 时，触发 callback 的执行，然后根据 req 找到匹配的 url 的中间件，返回最终需要的结果。

- [x] 如何给 devServer 添加自定义 middleware

   我们可以通过给一个自定义插件定义 configureServer hook，来给 devServer 添加自定义 middleware。

   在 vite config 解析完成以后，vite 会遍历 plugins 列表，依次执行 plugin 的 configureServer hook。执行 configureServer 时，入参是 server。通过 server.middlewares.use((req, res, next) => { ... }), 即可给 devServer 添加自定义 middleware。

   configureServer hook 的格式:

   ```
   {
      name: 'xxx',
      configureServer: (server) => {
         return () => {
            server.middlewares.use((req, res, next) => {
               ...
            })
         }
      }
   }
   ```

   自定义 middleware 会在 http middleware 之前执行，这样我们就可以使用自定义内容替换掉 index.html。

- [x] 预构建过程中的 hash 和 browserHash 是什么意思？

   hash，是预构建的标识符，有项目的 vite.config 和 .lock 文件内容生成。如果项目的依赖项或者 vite 配置项发生了变化，hash 值就会变化。hash 值发生变化，就需要重新预构建。

   browserHash 是根据 hash、依赖项、时间戳信息生成的。

   那 browserHash 有什么用呢？？

- [x] 用户发起请求时，如果预构建还没有完成，vite 是怎么处理的？ 

   用户发起请求时，如果预构建还没有完成，那么请求会被阻塞，知道预构建完成为止。(这个是现象)。

- [x] import.meta.glob

   vite 支持使用特殊的 import.meta.glob 函数从文件系统中导入多个模块。

   具体的用法如下:

   ```
   const modules = import.meta.glob('./dir/*.js');

   // 转义为:
   const modules = {
      './dir/foo.js': () => import('./dir/foo.js'),
      './dir/bar.js': () => import('./dir/bar.js')
   }
   ```

   import.meta.glob 导入模块时，默认是懒加载，即动态依赖。

   如果想将 import.meta.glob 导入的模块作为静态依赖，可以这样配置:

   ```
   const modules = import.meta.glob('./dir/*.js', { eager: true })
   ```
- [x] 项目中的业务代码是否支持 commonjs 写法 ？

   纯业务代码，一般建议采用 esm 写法。如果引入的三方组件或者三方库采用了 cjs 写法，vite 在预构建的时候就会将 cjs 模块转化为 esm 模块。

   如果非要在业务代码中采用 cjs 模块，那么我们可以提供一个 vite 插件，定义 load hook，在 hook 内部识别是 cjs 模块还是 esm 模块。如果是 cjs 模块，利用 esbuild 的 transfrom 功能，将 cjs 模块转化为 esm 模块。

- [x] vite 中 index.html、 js、 css 文件是怎么处理的

   先去请求 index.html 文件。html 文件的处理：添加 @vite/client、/@react-refresh， 其中 @vite/client 主要用于建立 ws 连接，@react-refresh 用于热更新。

   下一步，请求 @vite/client、@react-refresh、/src/main.tsx。其中 main.tsx 是应用指定的入口文件，作为 js 文件。

   main.tsx 需要经过转换，才能返回给客户端。整个转换处理过程经历 resolve、load、transform 三个过程，即解析、加载、转换。

   解析，即解析相对路径，获取 main.tsx 的绝对路径；

   加载，读取 main.tsx 对应的源代码字符串；

   转换，先通过 loader 将 jsx 写法转化为 react.createElement 写法；然后再分析文件中的依赖，第三方依赖 import x froom 'xxx' 中的相对路径和输出结果转化为预构建生成的依赖的路径和输出结果，并且还要添加热更新相关逻辑代码；

   最后将转换以后的内容返回给客户端。

   vite 在做转化的时候有个比较巧妙的处理。 main.tsx 依赖的静态文件，并不是在下次请求的时候才转换处理。在对 main.tsx 做转换处理后，server 端会继续对 main.tsx 依赖的文件继续做转换处理，然后先缓存起来。等到客户端请求到达 server 端时，直接使用缓存。即 main.tsx 开始转换以后，server 端会一直工作，把所有的静态依赖全部转换完毕。

   css 文件的处理过程和 webpack 也相同，即使用对应的 loader 先将 saas、less 写法转化为 css 写法，然后将样式文件转换成一段 js 代码。这一段 js 代码会执行 @vite/client 提供的 updateStyle 方法，通过动态添加 style 标签的方式添加到 html 页面中。

- [x] 依赖后面的 v=xxx、t=xxx 是什么意思

   使用 vite 时我们会发现，三方依赖，请求路径会添加一个 v=xxxx 的请求参数；内部依赖，请求路径会添加一个 t=xxx 的请求参数。

   其中，v 是版本信息， t 是时间戳信息。

   如果不加请求参数，同样的请求 url， 浏览器只会请求一次；请求参数不同，浏览器会就会任务请求 url 不相同，这样就会再次请求。


- [x] pre-transform

   vite 在做转化的时候有个比较巧妙的处理。 main.tsx 依赖的静态文件，并不是在下次请求的时候才转换处理。在对 main.tsx 做转换处理后，server 端会继续对 main.tsx 依赖的文件继续做转换处理，然后先缓存起来。等到客户端请求到达 server 端时，直接使用缓存。即 main.tsx 开始转换以后，server 端会一直工作，把所有的静态依赖全部转换完毕。

   一个文件的依赖分为静态依赖和动态依赖。

   静态依赖的形式为： import xx from 'xxxx'

   动态依赖的形式为： import('xxx').then(res => {...})。

   只有静态依赖才会进行 pre-transform，动态依赖不会 pre-transfrom。 动态依赖只有真正请求的时候才会 transfrom。

   其实很好理解，如果我的动态依赖是放在 if 块中，那么如果这一段代码一直没有触发， 那么就不需要请求，也不需要 transform。

- [x] import.meta

   import.meta 是一个给 javascript 模块暴露特定上下文的元数据属性的对象，它包含了这个模块的信息，如果这个模块的的 url。

   import.meta对象是由ECMAScript实现的，它带有一个null的原型对象。这个对象可以扩展，并且它的属性都是可写，可配置和可枚举的。

   即每个 esm 模块都有一个 import.meta, 通过 import.meta 可以访问这个模块的元数据信息。

- [x] 热更新

   HMR 工作分为两个部分： client 和 server 端。

    - client

        vite 在对 html 做 transform 操作时，会给 html 添加一个 @vite/client 的请求。
        
        当执行 @vite/client 代码时，会建立一个 ws 连接。

        更新策略: 全量更新、局部更新

        局部更新 -> 通知 react 的 fiberNode 重新更新；

        全量更新 -> window.location.reload

        css 更新： 移除原来的 style 标签，重新添加新的 style 标签

    - server

        需要一个 wsServer 和 watcher，其中 wsServer 用于推送消息， watcher 用于监听文件变化。

        不同的文件，处理策略也不相同:
        - index.html， 全量更新，window.location.reload();
        - main.tsx，全量更新， window.location.reload();
        - 页面、组件，局部更新，直接更新发生变化的页面、组件；
        - 样式，局部更新，直接更新发生变化的样式文件；
        - 工具方法，找到使用工具方法的组件，更新
        - 图片， 局部更新，找到使用图片的组件，更新


    vite 在处理每个组件的时候，会给每个组件添加一个 import.meta.hot.accept() 的方法，意味着每个组件都有热更新处理逻辑。客户端获取的组件对应的 js 代码以后，会执行 import.meta.hot.accept 方法，

    vite 在处理每个组件的时候，会给每个组件添加如下逻辑代码：
    - 添加 createHotContext 方法，创建一个 hot 对象；
    - 添加  RefreshRuntime.register 逻辑，注册需要热更新的组件；
    - 添加 import.meta.hot.accept() 逻辑，给每个 hot 对象添加依赖(如果依赖发生变化，就要热更新)；
    - 添加 RefreshRuntime.performReactRefresh() 逻辑，开始进行热更新；


    vite 热更新的过程分为两个阶段：
    - 应用加载阶段

        应用加载阶段，涉及的过程如下：
        - 建立 ws 连接，注册 onmessage 事件；(这一段逻辑有 @vite/client 提供)
        - 获取每个组件对应的 js 文件，并执行。
         
            在执行 js 的过程中，会先执行 createHotContext 方法，创建一个 hot 对象。创建好的 hot 对象会添加到模块的 import.meta 属性上。每个 esm 模块都有自己的 import.meta 属性，都有自己的 hot 对象。通过 hot 对象提供的 accept 方法，可以收集依赖。

            然后执行 @react/refresh 提供的 register 方法。 register 即注册的意思， @react/refresh 会提供一个全局的 map 存储每一个模块的 id 和对应的 export。应用初次加载的时候，map 中会收集加载过程中的个个模块。当某个模块发生热更新时，会重新加载对应的 js 文件，重新执行 register 方法。这个时候，由于 map 中已经存在对应的 id。基于这个，我们就可以判断该模块是热更新的模块，需要重新渲染。

            借着，执行 import.meta.hot.accept 方法，收集依赖。 accept 一般接受两个参数，第一个参数 deps 是一个数组，第二个参数是一个 callback。当 deps 中的文件发生变化时，当前模块需要热更新，需要重新获取 js 文件，然后重新渲染。 vite 处理以后的 react 组件使用 accept 方法时，没有入参，意味着 deps 是自己。执行 accept 方法，对创建一个 mod 对象，收集到 map 中。

            最后执行 RefreshRuntime.performReactRefresh() 方法。由于是应用加载，不需要重新渲染，所以 performReactRefresh 什么也没有做。



    - 文件修改阶段

        当 server 端某个文件发生变化时，触发 watcher 监听，此时 server 端的操作：
        - 遍历模块依赖图，找到变化文件以及对应的边界(path 为边界文件的路径、acceptedPath 为发生变化的文件的路径)；
        - 根据发生变化的文件，确定 clienet 是局部热更新还是全局加载。
            
            如果边界文件是 main.tsx，通知 client 通过 window.location.reload 的方式更新；

            如果边界文件是某个组件，通过 client 进行热更新。

            sever 端会通过 wsServer 向 client 推送消息。

        - client 收到局部更新的消息以后，会根据 path 从 map 中找对应的 mod。如果 mod 的 deps 匹配 acceptedPath，那么就会触发当前 mod 的热更新。

            模块热更新时，会先 fetch 最新的 js 文件，然后执行，重新 register，最后执行 performReactRefresh 方法。 performReactRefresh 方法就是通过调用 react 提供的 scheduleRefresh 方法来触发 react 更新。在协调过程中，react 会将发生更新的模块对应的 fiberNode 的组件方法替换成最新的组件方法，然后更新页面。

        
        简单来说，就是应用启动阶段，每个组件都会构建一个 hot 对象和 mod 对象，mod 对象会收集依赖。server 端文件发生变化以后，会确定变化文件对应的边界文件，然后通知边界文件去做热更新。边界文件的模块收到消息以后，重新去加载 js 文件拿到最新的组件函数方法，然后触发 react 更新。在 react 更新过程中，模块对应的 fibeNode 会使用返回的新的组件函数方法。


- [x] qiankun 下怎么对接 vite 项目

   qiankun 下对接 vite 项目的两个难点:
    - vite 项目需要把 qiankun 需要的生命周期方法暴露到全局变量下；
    - vite 打包出来的代码是 esm 格式，无法在 qiankun 沙箱下执行；

    方案一:

    vite 项目单独处理 - 采用 web component 的形式处理。

    具体方式: 
    - 将子应用分为两种类型 - qiankun 子应用和 vite 子应用；
    - 设置路由拦截， qiankun 子应用不做处理； vite 子应用采用 web component 形式渲染；

    这种模式的问题：两类子应用切换的时候要做好子应用 effect 的处理和重新激活时状态恢复。

    方案二:

    vite 项目不采用 esm 格式打包。 

    但是如果不采用 esm 格式，打包出来的代码只有一个，懒加载就会失效。

    所以这个时候要在 rollup 的 renderChunk hook、 generateBundle 做处理，将 bundle 转化成类似于 webpack 的格式。？？
    
    https://github.com/tengmaoqing/vite-plugin-qiankun/blob/master/src/index.ts


    方案三: 开发环境使用 vite， 生产环境直接使用 webpack。

- [x] vite 升级过程中遇到的问题

   1. vite.config.js 中使用 es6 语法报错问题处理；

   2.  路径无法解析问题 - 没有使用别名，也没有使用相对路径

      在项目开发过程中，我们 import 文件会存在以下几种形式:
      - import header from '../components/header.tsx', 相对路径， 这种情况下 vite 会自动将相对路径解析为绝对路径；
      - import header from '@/components/header.tsx'，路径别名， 其中 @ 为 src 的别名，这种情况下 vite 会通过 resolve.alias 配置项将 path 解析为绝对路径；
      - import header from 'components/header.tsx', 其中 components 为 src 目录下的一级目录，这种情况也比较常见，需要配置 tsconfig.json 中的 baseUrl；这种情况下，可以通过一个自定义 vite 插件来解析该路径
  
   3. 项目中的环境变量处理问题

      通过 define 配置项可以定义要替换的全局变量。

        ```
        define: {
            'process.env.API_ENV': JSON.stringify(process.env.API_ENV),
            // 正确的格式
            'process.env.API_ENV': '"test"',
            // 不正确的格式
            'process.env.API_ENV': 'test'
        }
        ```
   4. less 文件处理和 antd 修改前缀

        配置 css.preprocessorOptions 如下:

        ```
          css: {
            preprocessorOptions: {
                less: {
                    modifyVars: {   '@ant-prefix': 'byfe-scrm-ant' },
                    javascriptEnabled: true,
                },
            }
        },
        ```

- [x] client 的模块缓存机制是怎么样子的？ 
    
   client 的模块缓存是浏览器自己实现的。

   相同的模块，client 只请求一次。

- [x] 环境变量 

   在 vite 中，环境变量会通过  import.meta.env 的形式暴露给客户端源代码。

   即我们可以在自己的代码中，通过 import.meta.env 来获取环境变量。

   环境变量通常从 process.env 中获取。

   vite 是默认不加载 .env 文件的，我们可以通过 vite 提供的 loadEnv 函数来加载指定的 env 文件。

- [x] 既然浏览器已经支持 esm 模块，为什么生产环境依旧需要打包

   尽管原生 ESM 现在得到了广泛支持，但由于嵌套导入会导致额外的网络往返，在生产环境中发布未打包的 ESM 仍然效率低下（即使使用 HTTP/2）。为了在生产环境中获得最佳的加载性能，最好还是将代码进行 tree-shaking、懒加载和 chunk 分割（以获得更好的缓存)。

   此外还要考虑浏览器兼容性。

- [x] 为什么 vite 会快

   和 webpack 对比，为什么 vite 的冷启动、热启动、热更新都会快？

    使用 webpack 时，从 yarn start 命令启动，到最后页面展示，需要经历的过程：
    - 以 entry 配置项为起点，做一个全量的打包，并生成一个入口文件 index.html 文件；
    - 启动一个 node 服务；
    - 打开浏览器，去访问入 index.html，然后去加载已经打包好的 js、css 文件；

    在整个工作过程中，最重要的就是第一步中的全量打包，中间涉及到构建模块依赖图(涉及到大量度文件操作、文件内容解析、文件内容转换)、chunk 构建，这个需要消耗大量的时间。尽管在二次启动、热更新过程中，在构建模块依赖图中可以充分利用缓存，但随着项目的规模越来越大，整个开发体验也越来越差。

    使用 vite 时， 从 yarn start 命令启动，到最后的页面展示，需要经历的过程：
    - 进行预构建，提前将项目的三方依赖格式化为 esm 模块；
    - 启动一个 node 服务；
    - 打开浏览器，去访问 index.html；
    - 基于浏览器已经支持原生的 ES 模块, 逐步去加载入口文件以及入口文件的依赖模块(加载过程中，会对文件做使用 loader 处理)；

    在第四步中，vite 需要逐步去加载入口文件以及入口文件的依赖模块，但在实际应用中，这个过程中涉及的模块的数量级并不大，需要的时间也较短。而且在分析模块的依赖关系时， vite 采用的是 esbuild，比 webpack 采用 js 要快一些。

    综上，开发模式下 vite 比 webpack 快的原因：
    - vite 不需要做全量的打包，这是比 webpack 要快的最主要的原因；
    - vite 在解析模块依赖关系时，利用了 esbuild，更快；
    - 充分利用缓存；

- [x] 常见的打包工具对比

    目前前端比较常见的打包工具： webpack、parcel、vite、esbuild、rollup 等

    parcel：
    - 特性：零配置，支持 js/jsx/tsx、css、html、vue、图片等文件类型，支持 code splitting、tree shaking、压缩、devServer、 hmr、hash 等；
    - 优点：零配置；在 js、css 的转译上使用了 Rust，效率提升；
    - 缺点：扩展性不强，不太适合有大量定制化需求的项目；


    rollup:
    - 特性: Rollup 推崇 ESM 模块标准开发，这个特点借助了浏览器对 ESM 的支持；
    - 优点: 打包的代码比起 webpack 来干净的很多，是作为组件库开发的优选；生态丰富；
    - 缺点: 和 webpack 一样，分离模块依赖关系借助 acorn，速度较慢；浏览器兼容性问题；

    vite：
    - 特性：开发模式下借助浏览器对 ESM 的支持，采用 nobundle 的方式进行构建，能提供极致的开发体验；生产模式下借用 rollup 就行构建；
    - 优点：开发模式下应用启动比 webpack 很快；
    - 缺点：目前生态还不如 webpack；也有一定的上手成本；本地开发模式启动以后，首屏、懒加载响应速度对比 webpack 会慢；二次预构建会对开发体验造成影响；

    webpack:
    - 优点: 大而全；生态丰富;配置多样、灵活；
    - 缺点: 上手成本较高；随着项目规模的变大，构建速度越来越慢；无法打包出符合 esm 规范的代码；开发组件库时，最后的打包结果汇中冗余代码较多；

    esbuild：
    - 特性: Go 语言开发，可以多线程打包，代码直接编译成机器码(不用先解析为字节码)，可充分利用多核 cpu 优势；
    - 优点：快；
    - 缺点: 无法修改 ast，防止暴露过多的 api 而影响性能；不支持自定义代码拆分；产物无法降级到 es5 之下；

- [x] 为什么 Vite 初次请求比较慢，而二次请求是会快？

    初次请求比较慢，是因为 server 需要对请求的文件做实时转换。

    二次请求比较快，是因为使用了缓存策略。当再次请求的文件没有发生变化，且 server 端已经有缓存，那么会返回 304 使用本地缓存。

- [x] 使用 Vite 时如何解决开发环境和生产环境产物不一致问题？ 

    知道有这个问题，目前我们的部分项目开发环境开发环境使用 Vite， 生产环境是用 Webpack，运行还比较好，目前看是没有问题的。

    解决方案:

    - 开发环境和生产环境都使用 Esbuild 打包

    - 使用 ESM CDN(如 esm.sh, 保证第三方依赖都一致)。

    esm.sh 只是一个把 npm package 转成 es module 的 CDN 服务，方便在浏览器里面使用 npm 包，比如 react。(也借助了 esbuild 的能力)。

    











