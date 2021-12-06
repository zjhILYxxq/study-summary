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
        // 自定义的 webpack4 配置
        webpack: () => { ... },
        // 自定义的 webpack5 配置
        webpack: () => { ... },
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

6. nextjs 会根据 pages 目录下每一个组件文件，会打包生成一个 js 文件和 对应的 html 文件；

7. 通过 next/router 切换页面时，都是懒加载，会根据路径，去 window.__BUILD_MANIFEST 变量中查找路径对应的 js 文件；

8. nextjs 项目在构建的时候，会生成一个 _buildManifest.js 文件， 该文件会在客户端页面加载的时候执行，给 window 对象注入 __BUILD_MANIFEST 变量。

    __BUILD_MANIFEST 变量包含路由和对应的 js 文件的映射关系；

9. next/dist/client/next.js 是 nextjs 应用客户端的入口文件。 应用启动以后，渲染首屏，会采用 ReactDOM.hydrate 方法；跳转页面，采用 React.render 渲染；

    每次切换路由时，都会通过 React.render 从根节点开始渲染。

10. next/dist/pages/_app.js 会返回一个 App 组件，该 App 组件会作为 react 应用的根组件;

    _app.js 就是打包 chunk 文件中的 _app 文件，在 mian.js 文件之后执行；

11. 组件脱水 & 注水

    利用 react-dom-server  提供的 renderToString、 renderToNodeStream 方法可以给 react 组件脱水，将 react 组件转化为转化为实际的 dom 结构，不绑定时间，不触发组件的 componentDidMount、effect；

    组件注水，就是使用 react-dom 提供的 hydreate 方法，给组件对应的 dom 节点绑定事件，并触发生命周期方法；

12. 动态路由 ？
    
13. pre-rendering 预渲染

    预渲染有两类:
    - 静态生成，即 nextjs 应用在 build 阶段就生成路由对应的 html 页面，所有的请求都对应一个页面，可以被 cdn 缓存；
    - 服务端渲染，服务端应用启动以后，根据客户端发起的请求，动态生成页面；每次请求都生成页面？
  
14. 客户端渲染 - CSR、静态生成 - SSG、服务端渲染 - SSR；

    CSR - client side render, 客户端渲染；

    SSR - server side render， 服务端渲染；

    SSG - server static generate， 服务端静态页面生成；
    
15. 数据获取方法 - getStaticProps、getStaticPaths、getServerSideProps

    getStaticProps: 用于 SSG， 在构建时获取数据, 获取的数据将用于组件的脱水；

    getStaticPaths: 用于 SSG， 根据数据指定动态路由预渲染页面；

    getServerSideProps: 用于 SSR，获取每个请求的数据 ？



16. getStaticProps 是如何工作的？

    在 build 阶段， next.js 调用 renderToString 方法将组件变为字符串之前，会执行组件定义的 getStaticProps 方法，将 getStaticProps 方法返回的结果作为组件的 props 传递给组件。

    getStaticProps 返回的结果包含的属性:
    - props, object，作为组件的 props，是一个可序列化的对象；
    - revalidate，boolean， 默认为 false， 涉及静态增量再生 - ISR；
    - notFound，boolean，可选，如果为 true，会返回 404；
    - redirect，object，设置重定向；
  
    

17. ISR - 增量静态再生(Incremental Static Regeneration)

    ISR，提供了一种创建站点以后，仍然可以创建或者更新静态页面的方式。

    使用 revalidate 属性以后的页面请求过程如下:
    - 初始请求和 revalidate 时间内，请求的页面是构建阶段生成的页面；
    - revalidate 窗口过后，请求的页面依旧是原来的页面；
    - 站点重新生成页面；
    - 重新生成页面成功，使用新的页面；生成页面失败，使用原来缓存的页面；

    ISR 的工作机制是怎么样的？？

18. getStaticPaths 是如何工作的？

    如果需要预渲染使用动态路由的页面，这应该使用 getStaticPaths。

    getStaticPaths 的工作机制: 

19. getServerSideProps 是如何工作的?  

20. getStaticProps 和 getServerSideProps 的区别？

21. server router 是什么东东 ?? 

22. next.js 内置的 _app.tsx 组件

    在 next.js 项目中，我们在 pages 中定义的每一个组件，在 build 阶段，外面都会包裹一个内置的组件 App

    这个 App 组件有什么用？？


23. 页面是否有 middleware ？？ 

24. 几个关键的 manifest.json 

    server/pages-manifest.json

    build-manifest.json

    routes-manifest.json

25. nextjs 项目构建的时候，分为 client 端构建和 server 端构建

    client 构建是采用 webpack， 是一个多入口文件打包， 入口文件为 pages 文件夹下的目录，打包以后的内容会输出到 /static/chunks/pages 目录下，一个页面对应一个 js 文件；




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
8. 


