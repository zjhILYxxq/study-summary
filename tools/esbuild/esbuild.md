1. esbuild 常用 api

    esbuild 的目标产物默认为浏览器。如果需要修改如改为 node，可修改 platform 配置项。

    esbuild api 的使用方式有三种： cli、js、go。比较常用的为 js、cli。

    esbuild 中两个主要的 api: transform 和 build。 根据字面意思，transfrom 用于内容转换，build 用于文件打包构建。

    使用 transform 时可传入的参数:
    - 

    使用 build 时可传入的参数:
    
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
    

2. esbuild 常用配置项

3. esbuild 插件使用

4. 自定义 esbuild 插件 
