1. 为什么要有 rollup ？

    仅仅是因为打包出来的代码很干净吗？

    软件开发时，我们通常会将一个项目拆分为小的模块，这样可以消除无法预知的相互影响、减低问题的复杂性，而且为什么要这样做并没有答案，大家都是默认这样做的。

    但是遗憾的时候， javascript 历史上并支持这样做，没有类似 java、c++ 的 module 功能。

    随着 ES6 module 的出现，我们可以在 js 代码中使用 import 和 export。但是此规范一开始仅在浏览器中支持，并未在 node 中最终确定。

    通过 rollup，我们可以使用 esm 来编写代码，然后编译回现有的 cjs、amd、iife 格式。这意味着我们可以面向未来变编程。



2. rollup 简单了解

    - rollup 是一个 js 模块打包器，可以将小段的 js 代码打包成大而复杂的 lib 库或者应用代码；
    - 对 es6 中的 module 使用了新的标准化格式，而不是以前的特殊解决方案，如 cjs 和 amd；
    - 由于 es6 module 在编译阶段就可以知道模块的依赖的关系，提供了 tree shaking 的功能，更好的优化代码体积；
    - 兼容性，可以通过插件导入 cjs 模块；
    - 支持 esm、cjs、umd 格式发布 lib，通过 package.json 的 main 字段可以使用 lib 中 cjs、umd 包；通过 module 字段可以使用 lib 中的 esm 包；

3. rollup 的应用场景

    一般只是用来开发 lib 吗？

    有没有开发模式？

4. rollup 常用 api 以及配置项

    rollup 提供两个 api - rollup 和 watch。

    其中，rollup 用于 build。执行 rollup 会返回一个 promise 对象，它解析为一个 bundle 对象。通过 bundle 对象的 generate、write 方法，可以将打包构建的包放置到指定位置。

    watch 可以用来监听某个文件的变化，然后重新发起 build。

5. rollup 配置项整理

    rollup 在 build 时，会先执行 rollup 方法返回一个 promise 对象。promise 对象的值为一个 bundle 对象，执行 bundle 对象的 generate 方法会生成要输出的代码。

    执行 rollup 方法时，会有一个 inputOptions 的入参；执行 generate 方法时，会有一个 outputOptions 入参。

    **inputOptions**:
    - **核心属性**
      - input，打包的入口配置, 可以是一个字符串(单入口文件打包)、一个字符串数组(多入口文件打包)、一个对象(多入口文件打包);
      - external, 配置不参与打包的文件，可以是一个匹配 id 的正则表达式、一个包含 id 的数组、一个入参为 id 返回值为 true 或者 false 的函数；
      - plugins, 打包时用到的插件；
    - **高级属性**
      - cache，是否开启缓存。监听模式下(仅用于监听模式下？)使用，如果模块没有变化就不解析；
      - maxParallelFileReads，读取文件的并发数，默认为 20；
      - onwarn
      - preserveEntrySignatures
      - strictDeprecations
    - **危险属性**
      - acorn
      - acornInjectPlugins
      - context
      - moduleContext
      - preserveSymlinks
      - shimMissingExports
      - treeshake
    - **实验性属性**
      - experimentalCacheExpiry,
      - perf

    **outputOptions**:
    - **核心属性**
      - dir, 放置生成的 bundle 的目录，适用于多入口文件打包；
      - file，生成的 bundle 的文件名及目录，适用于单入口文件打包；
      - format，指定生成的 bundle 的格式： amd、cjs、es、iife、umd、system；
      - globals, 指定 iife 模式下全局变量的名称；
      - name，指定 iife 模式下赋值的变量；
      - plugins，输出时使用的插件；
    - **高级属性** 
      - assetFileNames
      - banner
      - chunkFileNames
      - compact
      - entryFileNames
      - extend
      - externalLiveBindings
      - footer
      - hoistTransitiveImports,
      - inlineDynamicImports

            懒加载模块是否内联。

            默认情况下，懒加载模块会自动分离为一个单独的 async chunk。如果 inlineDynamicImports 为 ture，懒加载模块会合并到 importor module 中。

            inlineDynamicImports 不能和 manualChunks 一起使用，否则会报错。
            
      - interop,
      - intro,
      - manualChunks
  
            自定义 chunk 分离规则，类似于 webpack 的 splitChunks 规则，将匹配的 module 分离到指定 name 的 chunks 中。

            manualChunks 可以是一个对象，也可以是一个函数。如果是一个对象，key 为自定义 chunk 的 name， value 是一个 id 数组，表示要分配到自定义 chunk 的 module。

            如果是一个函数，入参为 module id，返回值为自定义 chunk 的 name。 rollup 会遍历模块依赖图，将匹配 manualChunks 函数的 module 分配到对应的自定义 chunks 中。


      - minifyInternalExports,
      - outro,
      - paths,
      - preserveModules,
      - preserveModulesRoot,
      - sourcemap,
      - sourcemapExcludeSources,
      - sourcemapFile,
      - sourcemapPathTransform,
      - validate,
    - **危险属性** 
      - amd,
      - esModule,
      - exports,
      - freeze,
      - indent,
      - namespaceToStringTag,
      - noConflict,
      - preferConst,
      - sanitizeFileName,
      - strict,
      - systemNullSetters


6. rollup 工作原理梳理 

    rollup 整个工作过程如下：
    - 执行 rollup.rollup 方法，入参为 input options
      - 初始化 input options。依次触发 input plugins 中各个 plugin 的 options hook，更新 input options；
      - 构建一个模块依赖图实例，初始化 plugin 驱动、acorn 实例、module loader；
      - 依次触发 input plugins 中各个 plugin 的 buildStart，做一些初始化工作、缓存处理问题；
      - 开始构建模块依赖图；

          构建模块依赖图的具体过程:
          1. 解析入口模块的 id，得到入口模块的绝对路径(通过 resolveId hook 来解析)
          2. 根据解析的路径创建一个 module 对象；
          3. 触发 load hook 来加载 module 的源文件；
          4. 将源文件内容解析为 ast 对象；
          5. 遍历 ast 对象，收集静态依赖和动态依赖，其中静态依赖收集到 module 对象的 sources 数组中，动态依赖收集到 module 对象的 dynamicImport 数组中；
          6. 遍历 module 对象的 sources、dunamicImport 数组，解析依赖模块的路径；
          7. 依次触发 input plugins 中各个 plugin 的 moduleParsed hook；
          8. 重复 2 - 7 步骤，直到所有的模块解析完成

          静态依赖模块，会收集到 importer 模块的 dependencies 列表中；动态依赖模块会收集到 importer 模块的 dynamicDependencies 列表中。

          静态依赖会收集到 importor module 的 sources 列表中，动态依赖会收集到 importor module 的 dynamicImport 列表中；同样的 importer 模块的 id 也会收到到静态依赖模块的 importers 和动态依赖模块的 dynamicImporters 中。这样模块依赖图就构建完成了。

      - 模块排序？？ 这里为什么要排序
  
      - 返回一个带 generate、write 方法的 bundle 对象；
  
    - 执行 bundle.write 方法，入参为 option options；
      - 初始化 output option。依次触发 output plugin 的 outputOptions hook， 更新 output otions；
      - 构建一个 Bundle 实例，入参为 input options、output options、output 插件引擎、graph(模块依赖图)；
      - 执行 bundle 实例的 generate 方法,
        - 先创建一个空的 outputBundle 对象；
        - 依次触发 output plugin 的 renderStart hook(作用应该类似于 buildStart hook，做一些初始化、缓存清理工作)；
        - 
      - 依次触发 output plugin 的 writeBundle hook， 整个 build 过程结束；

7. rollup 和 webpack 的简单对比

8. plugin context - 插件上下文

    plugin context， 插件上下文，可以帮助插件的 hook 在执行过程中获取到一些上下文相关信息，如 module 信息、模块依赖图信息 等；

    plugin context 对象中包含的属性/方法:
    - addWatchFile, 监视模式下添加要监视的文件，当该文件更改时触发重新构建；
    - getCombinedSourcemap， 获取之前插件的所有源映射组合，该上下文函数只能在 transform hook 中使用；
    - getFileName，获取通过 emitFile 发出的文件的文件名；
    - getModuleIds，返回一个 iterator，可以用于获取当前模块依赖图中所有 module 的 id；
    - getModuleInfo，获取模块依赖图中模块的信息；
    - getAssetFileName，
    - getChunkFileName，
    - load ??
    - resolve ??
    - resolveId ??
    - emitFile ??
    - parse, 使用 Rollup 内部的 acorm 实例将代码解析为 AST；
    - setAssetSource

    plugin context， 插件上下文是用来干什么的？？

    plugin 提供的 hook 在被触发时，上下文为 plugin context 对象。在 plugin hook 执行过程中，this 指向 plugin context，可以通过 this 获取 plugin context 的属性/方法。

    rollup 的插件执行时，都会有一个 plugin context ？？

    rollup 插件和 vite 插件有什么区别 ？？

    


9.  rollup 读取文件时采用多线程，默认为 20 个?

    rollup 这一块儿是如何处理的
