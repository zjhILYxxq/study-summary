#### SSR & CSR & React SSR

SSR: 服务端渲染；

CSR: 客户端渲染；

React SSR

#### 同构

同构，前后端公用一套代码。

#### hydrate、renderToNodeStream、 renderToString

采用流的话，可以边读边输出，可以要让页面更快的展现，缩短首屏展现时间。


#### 数据预提取

根据 path 找到组件，找到组件以后，执行组件的静态方法，获取数据，等得到数据以后，将数据传递给组件


#### 组件脱水 & 组件注水

#### 数据脱水 & 数据注水


#### react-helmet 组件

作用: 帮助和定制你的页面 title 以及 meta 信息， 支持服务端和客户端渲染

#### css 资源处理

#### 按需渲染

#### 直出数据不渲染问题


#### next.js 知识点

1. 在 **next.js** 中， **pages** 目录下每一个 **react 组件**都相当于都是一个**页面**；
2. **页面**与基于**路径名**的**路由**关联;

    页面 '/pages/index' 对应的路由为 '/';

    页面 '/pages/posts/xxx.js' 对应的路由为 '/posts/xxx';

3. 可以使用 **'next/link'** 提供的 **Link** 组件实现**客户端路由**之前的切换？？

    **Link** 组件的属性:
    - **href！**,要导航的 **url 字符串**或者 **URL 对象**;
    - **as?**, 用于动态路由 ？？
    - **passHref?**, 是否强制 **Link** 将 **href** 送给 **child**, 当 **Link** 的 **child** 是一个自定义组件时非常有用，默认为 **false**;
    - **prefetch?**， 在后台预取页面，默认为 **true**; (预提取页面?? 仅在生产环境中使用??);
    - **replace?**, 是否使用 **replace** 模式, 默认为 **false**；
    - **scroll?**, 导航以后上否回到页面顶部，默认为 **true**;
    - **shallow?**, 更新当前页面的路由而不重新执行 getStaicProps、getServerSideProps、getInitialProps， 默认为 false;
    - **locale?**, 提供不同的语言环境？

4. 可以通过 **'next/router'** 实现手动切换路由 


5. 一个 **next** 项目，可以在根目录下添加一个 **next.config.js** 文件， 覆盖 **next** 默认的配置 - **defaultConfig**。

    ```
    // next.config.js

    module.export = {
        distDir: 'build',
        ...
    }
    ```
    常用的配置项如下(待整理):

    ```
    module.exports = {
        // 环境变量，可在代码中通过 process.env 进行访问
        env: { ... },
        // 为应用程序设置路径前缀
        basePath: '',
        // 重写
        rewrites: () => { ... },
        // 重定向
        redirects: () => { ... },
        // 自定义标题
        headers: () => { ... },
        // 自定义页面扩展
        pageExtensions: [xxx],
        // 支持 CDN 前缀
        assetPrefix: '',
        // 自定义的 webpack 配置
        webpack: () => { ... }
        // 使用 gzip 来压缩呈现的内容和静态文件
        compress: true,
        // 仅限服务器的运行时配置
        serverRuntimeConfig: { ... },
        // 客户端和服务端都可以访问的运行时配置 ？？
        publicRuntimeConfig: { ... },
        // 是否添加 x-powered-by 标题
        poweredByHeader: false,
        // 是否为每一页生成 etag(缓存策略)
        generateEtags: false,
        // 自定义构建目录
        distDir: '',
        // 配置构建 ID
        generateBuildId: () => { ... },
        // ESlint 相关配置
        eslint: { ... }
        // 导出路径图
        exportPathMap: () => { ... },
        // 是否开启严格模式
        reactStrictMode: false,

        ...
    }

    ```


#### next.js 学习问题
1. 如果 **Link** 的 **child** 是一个**功能组件(自定义组件)**，需要使用 **React.forwardRef** 包裹，为什么？？
2. 动态路由??
3. 客户端路由和服务端路由??
4. next.js 是一个怎么样的工作过程??
5. 浅层路由 shallow route 是一个什么东东?? 

     - 浏览器输入一个 url， server 根据路由找到对应的组件(入口组件以及匹配路由的组件 ？？)，然后生成一个 html 文件返回给客户端；
     - 客户端基于 react hydrate 模式渲染页面；
     - 客户端页面跳转，如果客户端路由匹配，客户端渲染；如果客户端不匹配，服务端渲染?? 是这样的吗？？

6. SSR 模式下的路由机制 ??
7. esc module （vite 的原理 ？？）


