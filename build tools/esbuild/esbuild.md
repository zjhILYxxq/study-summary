1. esbuild 常用 api

    esbuild 的目标产物默认为浏览器。如果需要修改如改为 node，可修改 platform 配置项。

    esbuild api 的使用方式有三种： cli、js、go。比较常用的为 js、cli。

    esbuild 中两个主要的 api: transform 和 build。 根据字面意思，transfrom 用于内容转换，build 用于文件打包构建。

    使用 transform 时可传入的独有的参数:
    - 

    使用 build 时可传入的独有参数:

    - **entryPoints**, 指定打包构建的入口文件

        entryPoints 可以是一个数组，也可以是一个对象。

        如果 entryPoints 是一个数组，当数组元素只有一个时，是单入口打包，生成的 bundle 只有一个；当数组元素有多个时，是多入口打包，生成的 bundle 有多个。

        > 注意，如果是多入口打包，不能使用 outfile 配置项，只能使用 outdir 配置项。

        当 entryPoints 是一个对象时，key 为 outfile 的文件名， value 为入口文件的文件名。

    - **entryNames**，用于控制每个入口文件对应的输出文件的文件名，可通过带有占位符的模板配置输出路径；

        entryNames 的一般格式为 '[dir]/[ext]/[name]-[hash]'

        其中， dir 会基于 outBase 解析为入口文件的目录；ext 对应为 outExtension； name 为入口文件的文件名； hash 为 bundle 内容对应的 hash。 


    - **bundle**,是否将依赖内联到 entry file 中;

        如果未显示指定 bundle 的值为 true，那么依赖项不会内联到 entry file 中。

        当 bundle 设置为 true 时，如果依赖的 url 不是一个静态定义的字符串，而是运行时生成，那么该依赖不会内联到 entry file 中。

        即 bundle 是编译时操作，不是运行时操作。

    - **external**, 构建时指定不内联到 entry file 中的依赖；
  
    - **inject**，
  
    - **outdir**, 指定构建内容的输出文件夹；
  
    - **outfile**, 指定构建内容的输出名称，如果是多入口打包构建，则不能使用，此时必须是 outdir；

    - **platform**, 默认情况下构建内容是为浏览器准备的，代码格式为 iife，也可指定为 node

        什么情况下，为浏览器准备代码时，代码格式为 esm ？？
    
    - **serve**，主要用于开发模式下修改文件以后，自动重新 build；

        serve 是 esbuild 提供的一个新的 api。

        具体使用？？

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

    - **allowOverwrite**, 这个有啥用 ？？
  
    - **metafile**, 通过这个配置，可以获得输出的 bundle 内部包含的源文件及对应的依赖

        vite 是通过 metafile 来分析依赖图中的三方依赖吗？？

    - **assetNames**，静态资源的输出配置，和 entryNames 一样；
  
    - **chunkNames**，代码分离生成的 chunk 的输出配置，需要配合 splitting 一起使用；

    - **conditions**，条件配置，在解析三方依赖包时用到

        使用时，需配合三方依赖包 package.json 中的 exports 字段 ？？

    - **incremental**， 配置增量构建；

        增量构建 ？？

    - **keepName**, 需要配合 minify 一起使用，压缩的时候保留函数的 name；


    - **mainFields**,


    - **preserveSymlinks**
  
    - **publicPath**
  
    - **pure**
  
    - **resolveExtensions**，路径后缀名扩展；

        在解析 url 时，如果 url 没有后缀名， esbuild 会默认使用 .ts、.tsx、.jsx、.js、.css、.js。

        通过 resolveExtensions 可以添加 esbuild 没有的后缀名。

        > 解析的时候，需要拿到文件的绝对路径去读取文件内容。如果 url 没有后缀名，我们就需要给 url 添加正确的后缀，才能争取读取文件。此时就需要我们通过 resolveExtensions 指定 esbuild 没有提供的后缀名。

    - **treeShaking**




    使用 transfrom、build 时都可传入的参数:

    - **define**, 用常量表达式替换指定全局标识符；
    
    - **format**, bundle 输出文件的格式，有三种 iife、cjs、esm，即立即执行函数、commonjs、ESModule；

        platform 为 browser 时， format 默认为 iife。

        platform 为 node 时， format 默认为 cjs

    - **loader**，用于配置指定类型文件的解释方式(对比 webpack 的 loader)


    - **minify**, 压缩代码

        使用 minify 压缩代码时要注意的？？

    - **target**, 根据设定的目标环境，生成对应的 js、css 代码；
  
    - **banner**, 给生成的 js、css 代码头部添加指定的字符串；
  
    - **footer**, 给生成的 js、css 代码底部添加指定的字符串；
  
    - **globalName**， 需配合 format: 'iife' 使用，将生成的 iife 代码的结果赋值给 globalName 指定的变量；

2. transform 和 build 的对比    

    transfrom，即转换的意思，通过这个 api 可以将 ts、jsx、tsx 格式的内容转化为 js 格式的内容。 transfrom 只负责文件内容转换，并不会生成一个新的文件。

    build，即构建的意思，根据指定的单个或者多个入口，分析依赖，并使用 loader 将不同格式的内容转化为 js 内容，生成一个 bundle 文件。 build 内部肯定使用了 transform。


3. 自定义 esbuild plugin：

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

4. esbuild 的限制 

    - 无法修改 ast，防止暴露过多的 api 而影响性能；
  
    - 不支持自定义代码拆分；
  
    - 产物无法降级到 es5 之下；

5. 为什么 esbuild 快 

    - Go 语言开发，可以多线程打包，代码直接编译成机器码(不用先解析为字节码)；
    - 可充分利用多核 cpu 优势；
    - 高效利用缓存？？