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

