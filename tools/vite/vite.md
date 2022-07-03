#### vite 学习问题

1. 为什么 package.json 中的 type 字段为 module ？

2.  vite 了解

    - 为什么选 vite

        vite 对比其他打包构建工具有什么优势吗？

        
    - 

3. vite 常用命令

    启用 development 模式的命令: vite、vite serve、vite dev；

    启用 production 模式的命令: vite build;

    vite preview 这个命令有什么用？

    vite optimize, 手动进行预加载依赖优化；


4. development 和 production 模式下 vite 的整个工作过程

    development 模式下的整个工作过程:
    - 解析 vite config 配置项。解析以后的 config 中的 plugins 为内部插件 + 三方插件 + 自定义插件，插件的顺序为 alias 插件、pre 插件、vite 核心插件、normal 插件、build pre 插件、post 插件、build post 插件。

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

5. vite 常用配置项了解 

    vite 的常用配置项:
    - build、server 模式下的公用配置项
      - root: 项目的根目录，即 index.html 所在的位置，可以是绝对路径，也可以是基于 vite.config.js 的相对路径, 默认值为 process.cwd();
      - base: 基础公共路径？？
      - mode: 默认，开发为 development，生产为 production；通过 mode 选项可以覆盖 serve 和 build 命令对应的默认模式；
      - define: 定义可替换的全局变量？？
      - plugins: 插件，对应 rollup 插件；
      - publicDir: 静态资源目录，build 结束以后会复制到 outDir 目录下；
      - cacheDir: 预构建文件的缓存目录，默认为 node_modules/.vite;
      - resolve: 文件解析配置，有 alias(别名配置)、dedupe、mainField 等；
      - css
      - json
      - esbuild
      - assetsInclude
      - logLevel
      - clearScreen
      - envDir:  .env 文件的根目录；
      - envPrefix: 环境变量的前缀，默认为 VITE_;
    - server 模式下的配置项
      - server
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
      - optimizeDeps
        - entries
        - exclude
        - include
        - esbuildOptions
    - build 模式下的配置项
      - build
        - target: 根据浏览器的兼容性，生成 bundle，默认值为 modules，即浏览器支持 esm；
        - polyfillModulePreload
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
    - 其他配置项
      - preview
      - ssr
      - worker

6. rollup 插件学习
   
    rollup 插件的一些约定:
    - 插件要有一个清晰的名称和 rollup-plugin-前缀；
    - 在 package.json 中要包含 rollup-plugin 关键字 (这个是什么意思呢？？)
    - 插件应该是被测试的
    - 尽可能的使用异步方法
    - 如果可能，请确保您的插件输出正确的源映射
    - 如果您的插件使用“虚拟模块”（例如用于辅助功能），请在模块 ID 前加上\0. 这可以防止其他插件尝试处理它 ？？

    rollup hook 根据执行的顺序类型：
    - async
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
      - **renderStart - async、parallel**；
      - **banner / footer / intro / outro - async、parallel**， ？？
      - **renderDynamicImport - async、parallel**
      - **augmentChunkHash - sync、sequential**
      - **resolveFileUrl / resolveImportMeta - sync、first**
      - **renderChunk - async、sequential**
      - **generateBundle - async、sequential**
      - **writeBundle - async、parallel**
      - **closeBundle - async、parallel**


7. vite 插件机制

    插件容器、插件类型、插件机制

    如何编写一个 vite 插件

    vite 插件需要的配置该如何传进来？？

    vite 中的插件根据执行顺序，可以分为三类： pre 类型、normal 类型、post 类型。 三种类型的插件的执行顺序为 pre、normal、post。

    通过 enforce 属性可以指定插件的执行顺序。如果未指定，默认为 normal。

    一个 vite 插件，常见的 hook 有哪些:
    - config， 可用于修改 vite config，用户可以通过这个 hook 修改 config；
    - resolvedConfig， 用于获取解析完毕的 config，在这个 hook 中不建议修改 config；
    - configureServer， 用于开 dev server 添加自定义 middleware



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

    自定义插件的 hooks 和 enforce 定义有什么讲究吗？

    在定义一个自定义 plugin 的 hooks 时，需要明确先知道你想要这个 plugin 在 vite 的哪个阶段执行，即需要定义哪些 hooks；然后再根据 hooks 的类型如 first、sequential、parallel 来决定 hook 的 enforce。parallel 类型的 hook 之间互不影响，所以对 enforce 没有要求；first 类型的 hook，前面的 hook 结果会影响后面的 hook 到底需不需要执行，一般设置为 normal、post，尽量不要设置为 pre(主要是怕影响到 vite 内部插件的执行，除非你有把握)；sequential 类型的 hook，前面的 hook 返回的结果会影响后面的 hook 的结果，可以设置为 pre、normal、post(要有把握)

    一般经验: hook 的 enforce 一般设置为 normal(post 也可以)，尽量不要设置为 pre(除非你有绝对的把握)；

    first 类型的 hook 一定要注意，如 resolveId、load、resolveDynamicImport，设置 enforce 时要谨慎；

8. vite 中间件

    vite 的中间件其实是一个函数，执行时会返回一个入参为 req、res、next 的 callback。

    vite 使用中间件的姿势： server.middlewares.use(someMiddleware(server));

    server.middlewares 其实一个 app 实例(对照 express ？？)

    其中， someMiddleware 会返回一个 callback。

    server 内部会维护一个 callback 的 list，当 client 发起请求时， callbackList 中收集的 callback 会按序触发。callback 在执行过程中，会根据 req 的 url 信息，做对应的逻辑判断操作。如果 url 不匹配，该 callback 会直接 return 结束掉。

    中间件其实是一系列函数。

    在实际应用中，会通过 http.createServer(callback) 创建一个 server 实例，然后执行 server.listen(port)。当 client 访问某个 url 时，触发 callback 的执行，然后根据 req 找到匹配的 url 的中间件，返回最终需要的结果。


9.  如何给 devServer 添加自定义 middleware

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

10. devServer 阶段 middlewares 的情况


     中间件列表如下(按照执行的先后顺序):
    - corsMiddleware
    - proxyMiddleware
    - viteBaseMiddleware,
    - servePublicMiddleware
    - transformMiddleware
    - serveRawFsMiddleware
    - serveStaticMiddleware
    - spaFallbackMiddleware
    - 三方插件 configureServer hook 中返回的 middlewares
    - indexHtmlMiddleware
    - vite404Middleware
    - errorMiddleware

11. 预构建

    vite 需要执行预构建的目的:
    - 将 commonjs 或者 umd 类型的依赖转化为 esm；
    - 将有很多内部模块的 esm 依赖关系转化为多个 模块(将多个 http 请求合并为单个 http 请求)；
    
12. 依赖预构建过程是怎么样的?

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

        > 使用 esbuild 做 build 时，不提供 outdir 配置项，会输出文件

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


13. 预构建的时候模块的依赖关系是怎么样获取到的？ 

    vite 在预构建的时候，巧妙的利用了 esbuild 的 build 能力，以 index.html 中的入口文件为 entry 去打包。

    在 esbuild 做 build 时，vite 提供了 onResolve hook，自定义依赖的解析过程，将三方依赖搜集起来，然后针对三方依赖做预构建。

14. esbuild 是怎么格式化 esm 模块的？

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

15. esbuild 是怎么将 cjs 模块格式化为 esm 模块的？

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


    

16. 预构建过程中的 hash 和 browserHash 是什么意思？

    hash，是预构建的标识符，有项目的 vite.config 和 .lock 文件内容生成。如果项目的依赖项或者 vite 配置项发生了变化，hash 值就会变化。hash 值发生变化，就需要重新预构建。

    browserHash 是根据 hash、依赖项、时间戳信息生成的。

    那 browserHash 有什么用呢？？

17. 用户发起请求时，如果预构建还没有完成，vite 是怎么处理的？ 

    用户发起请求时，如果预构建还没有完成，那么请求会被阻塞，知道预构建完成为止。(这个是现象)。

    具体原因呢？

18. esbuild 了解

19. virtual module 是什么东东？？ 

20. import.meta.glob 是什么东东？？ 

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



21. vite 的预构建是如何将依赖的第三方包从 cjs 格式转化为 esm 格式的？

    过程和 webpack 打包类似。根据指定的入口文件，做依赖分析？，提取类似 runtime、common 包，将 cjs 包内容外面包裹一层 es6 实现。？？

22. 每次启动时，如何判断需要是否需要预构建？上一次预构建的内容是否可以使用？

    vite 开发模式下，如果设置 server.force 为 true，那么每次启动的时候都会预构建。

    如果设置 server.force 为 false，开发模式每次启动时，会先检查原来的预构建是否发生变化。如果没有预构建的内容，那么进行预构建；如果有预构建内容，则需要检查原来的预构建内容是否可用。

    如何判断预构建内容是否发生了变化：检查 vite.config.js 和 .lock 文件的内容是否发生了变化。如果没有变化，说明上一次的预构建内容可以使用。

    具体检查的过程: 通过 .lock 文件的内容和 vite.config.js 的内容，生成一个 md5 码。如果 .lock 文件的内容和 vite.cofig.js 的内容没有发生变化，md5 码也不会发生变化，原来的预构建内容就可以使用了。

23. 第一次启动本地服务的时候，会先去判断需不需要进行预构建，然后启动本地服务。如果不需要预构建，直接使用上一次预构建的数据；如果需要，那么会在本地服务启动以后，立刻进行预构建。

24. 项目中的业务代码是否支持 commonjs 写法 ？

    纯业务代码，一般建议采用 esm 写法。如果引入的三方组件或者三方库采用了 cjs 写法，vite 在预构建的时候就会将 cjs 模块转化为 esm 模块。

    如果非要在业务代码中采用 cjs 模块，那么我们可以提供一个 vite 插件，定义 load hook，在 hook 内部识别是 cjs 模块还是 esm 模块。如果是 cjs 模块，利用 esbuild 的 transfrom 功能，将 cjs 模块转化为 esm 模块。

25. vite 本地服务启动以后使用到的几个中间件

   

26. vite 中 index.html、 js、 css 文件是怎么处理的？

    先去请求 index.html 文件。html 文件的处理：添加 @vite/client、/@react-refresh， 其中 @vite/client 主要用于建立 ws 连接，@react-refresh 用于热更新。

    下一步，请求 @vite/client、@react-refresh、/src/main.tsx。其中 main.tsx 是应用指定的入口文件，作为 js 文件。

    main.tsx 需要经过转换，才能返回给客户端。整个转换处理过程经历 resolve、load、transform 三个过程，即解析、加载、转换。

    解析，即解析相对路径，获取 main.tsx 的绝对路径；

    加载，读取 main.tsx 对应的源代码字符串；

    转换，先通过 loader 将 jsx 写法转化为 react.createElement 写法；然后再分析文件中的依赖，第三方依赖 import x froom 'xxx' 中的相对路径和输出结果转化为预构建生成的依赖的路径和输出结果，并且还要添加热更新相关逻辑代码；

    最后将转换以后的内容返回给客户端。

    vite 在做转化的时候有个比较巧妙的处理。 main.tsx 依赖的静态文件，并不是在下次请求的时候才转换处理。在对 main.tsx 做转换处理后，server 端会继续对 main.tsx 依赖的文件继续做转换处理，然后先缓存起来。等到客户端请求到达 server 端时，直接使用缓存。即 main.tsx 开始转换以后，server 端会一直工作，把所有的静态依赖全部转换完毕。

    css 文件的处理过程和 webpack 也相同，即使用对应的 loader 先将 saas、less 写法转化为 css 写法，然后将样式文件转换成一段 js 代码。这一段 js 代码会执行 @vite/client 提供的 updateStyle 方法，通过动态添加 style 标签的方式添加到 html 页面中。


27. 依赖后面的 v=xxx、t=xxx 是什么意思？

    使用 vite 时我们会发现，三方依赖，请求路径会添加一个 v=xxxx 的请求参数；内部依赖，请求路径会添加一个 t=xxx 的请求参数。

    其中，v 是版本信息， t 是时间戳信息。

    如果不加请求参数，同样的请求 url， 浏览器只会请求一次；请求参数不同，浏览器会就会任务请求 url 不相同，这样就会再次请求。

28. 静态依赖和动态依赖

    一个文件的依赖分为静态依赖和动态依赖。

    静态依赖的形式为： import xx from 'xxxx'

    动态依赖的形式为： import('xxx').then(res => {...})。

    只有静态依赖才会进行 pre-transform，动态依赖不会 pre-transfrom。 动态依赖只有真正请求的时候才会 transfrom。

    其实很好理解，如果我的动态依赖是放在 if 块中，那么如果这一段代码一直没有触发， 那么就不需要请求，也不需要 transform。


29. import.meta

    import.meta 是一个给 javascript 模块暴露特定上下文的元数据属性的对象，它包含了这个模块的信息，如果这个模块的的 url。

    import.meta对象是由ECMAScript实现的，它带有一个null的原型对象。这个对象可以扩展，并且它的属性都是可写，可配置和可枚举的。

    即每个 esm 模块都有一个 import.meta, 通过 import.meta 可以访问这个模块的元数据信息。

30. HMR 的整个工作过程是咋样的？

    热更新的时候，没有修改的文件会重新 transform 吗？

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


    
31. SSR

32. 为什么 vite 会快

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





33. 既然浏览器已经支持 esm 模块，为什么生产环境依旧需要打包

    尽管原生 ESM 现在得到了广泛支持，但由于嵌套导入会导致额外的网络往返，在生产环境中发布未打包的 ESM 仍然效率低下（即使使用 HTTP/2）。为了在生产环境中获得最佳的加载性能，最好还是将代码进行 tree-shaking、懒加载和 chunk 分割（以获得更好的缓存)。

34. worker 配置项是什么东东？？

35. 环境变量 

    在 vite 中，环境变量会通过  import.meta.env 的形式暴露给客户端源代码。

    即我们可以在自己的代码中，通过 import.meta.env 来获取环境变量。

    环境变量通常从 process.env 中获取。

    vite 是默认不加载 .env 文件的，我们可以通过 vite 提供的 loadEnv 函数来加载指定的 env 文件。

36. client 的模块缓存机制是怎么样子的？ 
    
    client 的模块缓存是浏览器自己实现的。

    相同的模块，client 只请求一次。



37. 如何自动打开浏览器？？

38. vite 的 build 是一个怎么样的过程 

    vite 的 build 过程是基于 rollup 实现的。

39. 为什么使用 vite build 打包出的代码会把入口文件的 export 丢失？

40. 常见的打包工具对比

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
    - 缺点：目前生态还不如 webpack；也有一定的上手成本；

    webpack:
    - 优点: 大而全；生态丰富；
    - 缺点: 上手成本较高；随着项目规模的变大，构建速度越来越慢；

    esbuild：
    - 特性: Go 语言开发，可以多线程打包，代码直接编译成机器码(不用先解析为字节码)，可充分利用多核 cpu 优势；
    - 优点：快；
    - 缺点: 无法修改 ast，防止暴露过多的 api 而影响性能；不支持自定义代码拆分；产物无法降级到 es5 之下；











41. node 的进程管理

pm2 ??

22. vite 升级过程中遇到的问题？

1. vite.config.js 中使用 es6 语法报错问题处理；

2. 路径无法解析问题 - 没有使用别名，也没有使用相对路径

    在项目开发过程中，我们 import 文件会存在以下几种形式:
    - import header from '../components/header.tsx', 相对路径， 这种情况下 vite 会自动将相对路径解析为绝对路径；
    - import header from '@/components/header.tsx'，路径别名， 其中 @ 为 src 的别名，这种情况下 vite 会通过 resolve.alias 配置项将 path 解析为绝对路径；
    - import header from 'components/header.tsx', 其中 components 为 src 目录下的一级目录，这种情况也比较常见，需要配置 tsconfig.json 中的 baseUrl；这种情况下，可以通过一个自定义 vite 插件来解析该路径
  

3. qiankun 下怎么对接 vite 项目？

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

    所以这个时候要在 rollup 的 renderChunk hook、 generateBundle 做处理，将 bundle 转化成 iife 格式。？？
    
    https://github.com/tengmaoqing/vite-plugin-qiankun/blob/master/src/index.ts



    方案三: 开发环境使用 vite， 生产环境直接使用 webpack。






