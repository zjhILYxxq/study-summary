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
      - inlineDynamicImports,
      - interop,
      - intro,
      - manualChunks,
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

7. rollup 和 webpack 的简单对比

8. rollup 读取文件时采用多线程，默认为 20 个?

    这个？？
