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

3. 可以使用 **'next/link'** 提供的 **Link** 组件实现**客户端路由**之间的切换

    **Link** 组件的属性:
    - **href！**,要导航的 **url 字符串**或者 **URL 对象**;
    - **as?**, 用于动态路由 ？？
    - **passHref?**, 是否强制 **Link** 将 **href** 送给 **child**, 当 **Link** 的 **child** 是一个自定义组件时非常有用，默认为 **false**;
    - **prefetch?**， 在后台预取页面，默认为 **true**; (预提取页面?? 仅在生产环境中使用??);
    - **replace?**, 是否使用 **replace** 模式, 默认为 **false**；
    - **scroll?**, 导航以后上否回到页面顶部，默认为 **true**;
    - **shallow?**, 更新当前页面的路由而不重新执行 getStaicProps、getServerSideProps、getInitialProps， 默认为 false;
    - **locale?**, 提供不同的语言环境？

4. 使用 **next/link** 提供的 Link 的组件可以实现预提取功能。

    nextjs 在 build 阶段下，会将 pages 目录下的每一个文件解析成一个 js 文件。客户端切换路由时会通过懒加载的方式去加载对应的 js 文件。

    如果在页面中使用了 next/link 提供的 Link 组件，默认情况下会在 Link 组件的 useEffect 中向 server 端预提取对应的 js 文件。

    如果我们设置了 Link 的 prefetch 属性为 false，那么只会在 Link 组件的 onMouseEnter 事件触发时，向 server 端预提取对应的 js 文件。

5. 可以通过 **'next/router'** 实现手动切换路由 


6. 一个 **next** 项目，可以在根目录下添加一个 **next.config.js** 文件， 覆盖 **next** 默认的配置 - **defaultConfig**。

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

7. nextjs 会根据 pages 目录下每一个组件文件，会打包生成一个 js 文件和 对应的 html 文件；

8. SSR 同构

    **代码同构**: 服务端和客户端供用同一份代码，但是打包方式不一样。其实，不管是客户端还是服务端代码，都是多页面打包。但不同的时候，服务端使用的代码需要配置为 commonjs 加载方式，即 chunkLoading: 'require',chunkFormat: 'commonjs'。

    要明白代码同构的意思，首先要明白服务端渲染，只有首屏的时候，是服务端根据路由直接吐给 client 对应的页面结构，然后应用直接以 spa 的形式运行。所以代码必须要两份，一份用于服务端渲染，一份用于客户端渲染。客户端渲染的代码，是单页面打包，entry 为 pages 目录下的 index.tsx 文件。server 端使用的代码，需要多页面打包，每一个页面都打包一份，供 server 端使用。

    如何做 node 和浏览器端代码的区分: 通过 **globalThis.window**；

    **数据同构**: 前后端都能获取数据，且只获取一次。给组件提供一个静态方法，服务端渲染时获取数据；脱水以后的组件返回给客户端时，同时将数据返回给客户端。客户端渲染时，如果组件定义了静态方法，就使用服务端直出的数据渲染；

    **路由同构**: 客户端还是基于 router 机制是懒加载对应的 js 文件； 服务端的路由同构是 build 时建立路由和js 的映射关系， ssr 时通过路由找到对应的 js 文件，然后走 renderToString 直出组件；输出 html 时，添加 run-time、路由对应的 js 文件 等。




9.  通过 next/router 切换页面时，都是懒加载，会根据路径，去 window.__BUILD_MANIFEST 变量中查找路径对应的 js 文件；

10. nextjs 项目在构建的时候，会生成一个 _buildManifest.js 文件， 该文件会在客户端页面加载的时候执行，给 window 对象注入 __BUILD_MANIFEST 变量。

    __BUILD_MANIFEST 变量包含路由和对应的 js 文件的映射关系；

11. next/dist/client/next.js 是 nextjs 应用客户端的入口文件。 应用启动以后，渲染首屏，会采用 ReactDOM.hydrate 方法；跳转页面，采用 React.render 渲染；

    每次切换路由时，都会通过 React.render 从根节点开始渲染。

12. next/dist/pages/_app.js 会返回一个 App 组件，该 App 组件会作为 react 应用的根组件;

    _app.js 就是打包 chunk 文件中的 _app 文件，在 mian.js 文件之后执行；

13. 组件脱水 & 注水

    利用 react-dom-server  提供的 renderToString、 renderToNodeStream 方法可以给 react 组件脱水，将 react 组件转化为转化为实际的 dom 结构，不绑定时间，不触发组件的 componentDidMount、effect；

    组件注水，就是使用 react-dom 提供的 hydreate 方法，给组件对应的 dom 节点绑定事件，并触发生命周期方法；

14. 动态路由 ？
    
15. pre-rendering 预渲染

    预渲染有两类:
    - 静态生成，即 nextjs 应用在 build 阶段就生成路由对应的 html 页面，所有的请求都对应一个页面，可以被 cdn 缓存；
    - 服务端渲染，服务端应用启动以后，根据客户端发起的请求，动态生成页面; 
  
  
16. 渲染策略：客户端渲染 - CSR、静态生成 - SSG、增量静态再生 - ISR、服务端渲染 - SSR；

    CSR - client side render, 客户端渲染；

    SSR - server side render， 服务端渲染；

    SSG - server static generate， 服务端静态页面生成；

    ISR - Incremental Static Regeneration， 增量静态再生；

    
17. 数据获取方法 - getStaticProps、getStaticPaths、getServerSideProps

    getStaticProps: 用于 SSG， 在构建时获取数据, 获取的数据将用于组件的脱水；

    getStaticPaths: 用于 SSG， 根据数据指定动态路由预渲染页面；

    getServerSideProps: 用于 SSR，获取每个请求的数据 ？



18. getStaticProps 是如何工作的？

    在 build 阶段， next.js 调用 renderToString 方法将组件变为字符串之前，会执行组件定义的 getStaticProps 方法，将 getStaticProps 方法返回的结果作为组件的 props 传递给组件。

    getStaticProps 返回的结果包含的属性:
    - props, object，作为组件的 props，是一个可序列化的对象；
    - revalidate，boolean， 默认为 false， 涉及静态增量再生 - ISR；
    - notFound，boolean，可选，如果为 true，会返回 404；
    - redirect，object，设置重定向；

    当用户再次访问预渲染页面时，会向服务端请求一个 json 文件，内部包含 getStaticProps 的结果。
  
    

19. ISR - 增量静态再生(Incremental Static Regeneration)

    有时候，我们可能有大量的页面，而在 build 阶段你生成所有的页面是不可能的。
    
    ISR，提供了一种创建站点以后，仍然可以创建或者更新静态页面的方式。

    使用 revalidate 属性以后的页面请求过程如下:
    - 初始请求和 revalidate 时间内，请求的页面是构建阶段生成的页面；
    - revalidate 窗口过后，请求的页面依旧是原来的页面；
    - 站点重新生成页面；
    - 重新生成页面成功，使用新的页面；生成页面失败，使用原来缓存的页面；

    revalidate 的工作机制:
    1. build 阶段生成一个静态页面；
    2. 站点启动后，首次请求时使用缓存的静态页面；
    3. 到了 revalidate 指定时间以后，再次请求页面，会生成一个新的静态页面;


    注意，上面的请求不是通过 next/router 请求，而是要向服务端发送请求。

    如果我们发起的请求对应的静态文件还没有生成， server 端会生成一个渲染页面，并缓存起来。


20. getStaticPaths 是如何工作的？

    如果需要预渲染使用动态路由的页面，这应该使用 getStaticPaths。

    getStaticPaths 的工作机制: pages 目录下文件的命名采用了动态路径，且定义了 getStaticPaths、getStaticProps，在 build 阶段，会先执行 getStaticPaths 方法将动态路径转化为静态路径，然后在根据静态路径生成静态页面；

    getStaticPaths 返回的结果结构如下:
    - paths， 确定哪些路径将被预呈现，是一个数组；
    - fallback，决定了如果请求的页面没有如果没有，该如果处理。

    fallback 为 false，返回 404；

    fallback 为 true，则先生成对应的静态页面，后放回 getStaticProps 的数据，开发可以通过 router.isFallback 来显示中间状态来优化(先返回不含数据的页面，再返回数据)；

    fallback 为 'blocking', 和 SSR 相同，给客户端返回包含数据的页面；


21. getServerSideProps 是如何工作的? 

    (猜测，待验证)！

    如果组件中定义了 getServerSideProps 方法，那么 build 阶段， 组件就不会生成一个 .html 文件，而是会生成一个 .js 文件。

    当站点启动以后，客户请求页面时，站点会根据请求路径去找到对应的 js 文件，然后先执行 getServerSideProps 方法，获取数据，然后再将数据作为 props 传递给组件。通过 renderToHtml 方法，给组件脱水，然后生成一个 html 内容字符串，返回到客户端。



22. getStaticProps 和 getServerSideProps 的区别

    两者之间的区别:
    1. getStaticProps 用于 SSG， getServerSideProps 用于 SSR；
    2. 使用 getStaticProps，组件经过 build 阶段会生成一个 .html 文件； 而使用 getServerSideProps，组件经过 build 阶段会生成一个 .js 文件(实际上只是做了一下编译)；
    3. 站点启动以后，如果是 SSG，直接请求 html 页面；如果是 SSR，还需要根据路由找到对应的 js 文件，然后再执行 getServerSideProps 方法，将返回的结果作为 props 传递给组件，然后触发 renderToHtml 方法，给组件脱水，然后返回 html 字符串；

    getStaticProps 和 getServerSideProps 不能共存，即一个页面要么是 SSG， 要么是 SSR;




23. SSG & 动态路由
    
    如果是动态路由，且定义了 getStaticProps，则必须定义 getStaticPaths，否则会抛出异常(这个比较好理解，如果定义了 getStaticProps，说明需要走 SSG，如果此时不定义 getStaticPaths，拿不到完整的路径，就无法走 SSG 了);

    如果不是动态路由，但定义了 getStaticPaths，也会抛出异常(这是一个没有意义的操作，当然要报错了！！)

    如果没有定义 getStaticProps， 只定义了 getStaticPaths, 也会抛出异常。(动态路由，默认走的是 SSR。定义 getStaticPaths，说明想走 SSG，此时不定义 getStaticProps,那当然报错了)


24. getStaticProps、getServerSideProps 返回的结果如何在 client 获取？

    首次加载页面时，getStaticProps、getServerSideProps 返回的结果会通过一个 id 为 __NEXT_DATA__， 类型为 application/json 的 script 标签诸如到 html 页面中。 

    当客户端首屏渲染时，会通过 document.getElementById('__NEXT_DATA__').textContent 的方式读取 getStaticProps、getServerSideProps 的结果，然后通过 props 诸如到组件中。

    
25. SSR & 动态路由 




26. 动态路由的工作机制 

    在 nextjs 中，我们可以通过将 [] 添加到 pages 下页面的文件名中，来定义动态路由， 如 pages 目录下文件的文件名为 [pid].js

    我们可以通过 'pages/post/[...pid].js' 的方式，来匹配 /post/xx/xx/xx 的路径，但不能匹配 /post 的路径；

    通过 'pages/post/[[...pid]].js' 的方式，可以匹配 /post/xx/xx/xx, 包括 /post 的路径

    动态路由的工作过程:
    - 在 build 阶段，生成一个静态 html 文件；
    - 站点启动以后，根据请求的路由，返回对应的 html 文件；
    - 初始化全局的 router 对象，访问的路由会回去对应的动态路由，解析出路由中的动态参数，存到 router 对象的 query 中；
    - 给页面对应的组件注水，组件渲染过程中可以从全局的 router 对象中获取到动态路由中的参数；


    使用 getStaticProps、getStaticPaths 以后，动态路由的参数在 build 阶段就可以被解析出来，在组件脱水过程中使用;

    如果动态路由使用了 getServerSideProps, 那么在 build 阶段，动态路由不会生成一个 html 文件，只会生成一个 js 文件。当站点启动后，根据客户端访问的路径，找到对应的 js 文件，先执行 getServerSideProps 方法，再对组件脱水，生成一个 html 字符串返回给客户端。给组件脱水的时候，动态路由参数也会被解析。
    
27. nextjs 路由匹配的的先后顺序

    预定义静态路由 > 动态路由 > 捕获所有路由



28. 浅层路由

    浅层路由，是指导航到同一页面但不调用 getStaticProps、getServerSideProps 方法。

    如果一个页面，定义了 getStaticProps、getServerSideProps、getInitialProps 方法，那么每次导航到该页面时，会触发上述这些方法。

    其中， getStaticProps 只会触发一次， getServerSideProps 每次都会触发

    如果导航的时候设置了 shallow 为 true，那么导航到该页面的时候，则不会触发上述方法。



29. server router 是什么东东？？ client 端路由？ server 端路由？
    















30. next.js 内置的 _app.tsx 组件

    在 next.js 项目中，我们在 pages 中定义的每一个组件，在 build 阶段，外面都会包裹一个内置的组件 App

    这个 App 组件有什么用




31. 页面是否有 middleware ？？ 

32. 如何实现 404

    自己实现一个 404 页面。

    通过中间件，读取 route-manifest.json 文件，判断当前路由是否有页面。没有的话重定向到 404 页面。


33. 几个关键的 manifest.json 

    server/pages-manifest.json

    build-manifest.json

    routes-manifest.json 用于获取路由信息

34. nextjs 项目构建的时候，分为 client 端构建和 server 端构建

    client 构建是采用 webpack， 是一个多入口文件打包， 入口文件为 pages 文件夹下的目录，打包以后的内容会输出到 /static/chunks/pages 目录下，一个页面对应一个 js 文件；

    server 端构建的话，会采用 SSG 和 SSR。 如果是 SSG，会生成一个 html 页面； 如果是 SSR，会生成一个 js 文件。

35. nextjs 的工作过程

    分成两个阶段： build 阶段和 start 阶段。

    build 阶段，nextjs 会将 pages 目录下文件通过 webpack 进行多入口文件打包，生成对应的 js 文件，输出到 static 目录下；同时根据 pages 目录下的文件生成对应的 html / js 文件，输出到 server/pages 目录下。

    start 阶段，启动 node 服务，根据客户端请求，返回对应的 html 内容。






36. SEO

    SEO, 搜索引擎优化。 SEO 的目标是创建一种策略，以提高您在搜索引擎结果中的排名位置。

    常用的 SEO 措施:
    - robots.txt， 添加在项目的根目录文件下，指示爬虫可以访问和爬取哪些页面和文件;
    - 站点地图 - sitemap，是与 google 交流的最简单的方式，它可以用来指明属于您网站的网址以及更新时间，以便 google 可以轻松检测新内容并更有效的抓取您的网站。
    - 合理的 URL 结构，语义化、符合逻辑且一致的模式、有关键字、不基于参数；
    - 合理的渲染策略，如 SSR、SSG、ISG;
    - 合理的元数据，标题、描述；
    - 合理的内容结构，如标题、内部链接等；
    - core web vitails, 使用 LCP、FID、CLS 衡量加载、交互、视觉稳定性；


    Core Web Vitals，是 Web Vitals 的一个子集，由三个衡量加载、交互性和视觉稳定性的指标组成:
    - LCP - 最大内容绘制， Largest Contentful Paint，在视口中获取页面上最大元素所需的时间，对应加载；
    - FID - 首次输入延迟， First Input Delay， 发生用户交互到最终调用事件处理程序的时间；
    - CLS - 累积布局偏移， Cumulatetive Layout Shift，网站整体布局稳定性的度量， 对应视觉稳定性；

    使用浏览器开发者工具提供的 LightHouse 功能可以测量网站的 Core Web Vitals；

    改善 Core Web Vitals:
    - next/image, 按需优化、延迟加载图像、避免  cls；
    - 动态导入， 有助于改善 FID，主要是考虑首屏时如果有大量的 js 文件需要加载执行，用户交互无法及时响应，此时就需要使用动态导入；
    - next/dynamic, 组件的动态导入；
    - next/font, 优化字体;





37. 测量网页内容加载速度的指标

    load

    DOMContentLoaded

    FCP - First Content Paint， 首次内容绘制，页面从开始加载到页面内容的任何部分在屏幕上完成渲染的时间；

    FMP - First Meaningful Paint， 首次有效绘制

    LCP - Largest Content Paint， 最大内容绘制， 根据页面首次开始加载的时间点来来报告可视区域内可见的最大图像或文本块完成渲染的相对时间；

    影响 LCP 的四个主要因素:
    - 缓慢的服务器响应速度；
    - js 和 css 的渲染阻塞；
    - 资源加载时间；
    - 客户端渲染；

    改进 LCP:
    - 预加载重要资源、延迟加载非关键资源、缓存资源；
    - 优化图像、字体、css；
    - 优化关键渲染路径；
    - 优化 js(缩小体积、懒加载等);
  
    
38. SWR


39. next/image、next/font、 next/script



#### next.js 学习问题


1. 如果 **Link** 的 **child** 是一个**功能组件(自定义组件)**，需要使用 **React.forwardRef** 包裹，为什么？？
2. 动态路由??
3. 客户端路由和服务端路由??
4. next.js 是一个怎么样的工作过程??
5. 浅层路由 shallow route 是一个什么东东?? 

     - 浏览器输入一个 url， server 根据路由找到对应的组件(入口组件以及匹配路由的组件 ？？)，然后生成一个 html 文件返回给客户端；
     - 客户端基于 react hydrate 模式渲染页面；

6. SSR 模式下的路由机制 ??
7. esc module （vite 的原理 ？？）
8. 


