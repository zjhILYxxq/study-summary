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




#### build tools 总结

