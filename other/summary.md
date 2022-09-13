



#### next.js 相关

- [x] CSR、SSR、SSG、ISR

    CSR - client side render, 客户端渲染；

    SSR - server side render， 服务端渲染；

    SSG - server static generate， 服务端静态页面生成；

    ISR - Incremental Static Regeneration， 增量静态再生；

- [x] 组件脱水 & 注水

    利用 react-dom-server  提供的 renderToString、 renderToNodeStream 方法可以给 react 组件脱水，将 react 组件转化为转化为实际的 dom 结构，不绑定事件，不触发组件的 componentDidMount、effect；

    组件注水，就是使用 react-dom 提供的 hydreate 方法，给组件对应的 dom 节点绑定事件，并触发生命周期方法；

- [x] pre-rendering 预渲染

    预渲染有两类:
    - 静态生成，即 nextjs 应用在 build 阶段就生成路由对应的 html 页面，所有的请求都对应一个页面，可以被 cdn 缓存；
    - 服务端渲染，服务端应用启动以后，根据客户端发起的请求，动态生成页面; 

- [x] 数据获取方法 - getStaticProps、getStaticPaths、getServerSideProps

    getStaticProps: 用于 SSG， 在构建时获取数据, 获取的数据将用于组件的脱水；

    getStaticPaths: 用于 SSG， 根据数据指定动态路由预渲染页面；

    getServerSideProps: 用于 SSR，获取每个请求的数据;

- [x] getStaticProps 是如何工作的？

    在 build 阶段， next.js 调用 renderToString 方法将组件变为字符串之前，会执行组件定义的 getStaticProps 方法，将 getStaticProps 方法返回的结果作为组件的 props 传递给组件。

    getStaticProps 返回的结果包含的属性:
    - props, object，作为组件的 props，是一个可序列化的对象；
    - revalidate，boolean， 默认为 false， 涉及静态增量再生 - ISR；
    - notFound，boolean，可选，如果为 true，会返回 404；
    - redirect，object，设置重定向；

    当用户再次访问预渲染页面时，会想服务端请求一个 json 文件，内部包含 getStaticProps 的结果。

- [x] getStaticPaths 是如何工作的？

    如果需要预渲染使用动态路由的页面，这应该使用 getStaticPaths。

    getStaticPaths 的工作机制: pages 目录下文件的命名采用了动态路径，且定义了 getStaticPaths、getStaticProps，在 build 阶段，会先执行 getStaticPaths 方法将动态路径转化为静态路径，然后在根据静态路径生成静态页面；

    getStaticPaths 返回的结果结构如下:
    - paths， 确定哪些路径将被预呈现，是一个数组；
    - fallback，决定了如果请求的页面没有如果没有，该如果处理。

    fallback 为 false，返回 404；

    fallback 为 true，则先生成对应的静态页面，后放回 getStaticProps 的数据，开发可以通过 router.isFallback 来显示中间状态来优化(先返回不含数据的页面，再返回数据)；

    fallback 为 'blocking', 和 SSR 相同，给客户端返回包含数据的页面；

- [x] getServerSideProps 是如何工作的? 

    (猜测，待验证)！

    如果组件中定义了 getServerSideProps 方法，那么 build 阶段， 组件就不会生成一个 .html 文件，而是会生成一个 .js 文件。

    当站点启动以后，客户请求页面时，站点会根据请求路径去找到对应的 js 文件，然后先执行 getServerSideProps 方法，获取数据，然后再将数据作为 props 传递给组件。通过 renderToHtml 方法，给组件脱水，然后生成一个 html 内容字符串，返回到客户端。

- [x] getStaticProps 和 getServerSideProps 的区别

    两者之间的区别:
    1. getStaticProps 用于 SSG， getServerSideProps 用于 SSR；
    2. 使用 getStaticProps，组件经过 build 阶段会生成一个 .html 文件； 而使用 getServerSideProps，组件经过 build 阶段会生成一个 .js 文件(实际上只是做了一下编译)；
    3. 站点启动以后，如果是 SSG，直接请求 html 页面；如果是 SSR，还需要根据路由找到对应的 js 文件，然后再执行 getServerSideProps 方法，将返回的结果作为 props 传递给组件，然后触发 renderToHtml 方法，给组件脱水，然后返回 html 字符串；

    getStaticProps 和 getServerSideProps 不能共存，即一个页面要么是 SSG， 要么是 SSR;

- [x] 动态路由的工作机制 

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

- [x] 浅层路由

    浅层路由，是指导航到同一页面但不调用 getStaticProps、getServerSideProps 方法。

    如果一个页面，定义了 getStaticProps、getServerSideProps、getInitialProps 方法，那么每次导航到该页面时，会触发上述这些方法。

    其中， getStaticProps 只会触发一次， getServerSideProps 每次都会触发

    如果导航的时候设置了 shallow 为 true，那么导航到该页面的时候，则不会触发上述方法。


- [x] next.js 相关知识点

    在 **next.js** 中， **pages** 目录下每一个 **react 组件**都相当于都是一个**页面**。

    **页面**与基于**路径名**的**路由**关联：

    - 页面 '/pages/index' 对应的路由为 '/';

    - 页面 '/pages/posts/xxx.js' 对应的路由为 '/posts/xxx';

    nextjs 会根据 pages 目录下每一个组件文件，会打包生成一个 js 文件和 对应的 html 文件。

    next/dist/client/next.js 是 nextjs 应用客户端的入口文件。 应用启动以后，渲染首屏，会采用 ReactDOM.hydrate 方法；跳转页面，采用 React.render 渲染。每次切换路由时，都会通过 React.render 从根节点开始渲染。



- [x] 懒加载如何实现

    通过 next/router 切换页面时，都是懒加载，会根据路径，去 window.__BUILD_MANIFEST 变量中查找路径对应的 js 文件。

    nextjs 项目在构建的时候，会生成一个 _buildManifest.js 文件， 该文件会在客户端页面加载的时候执行，给 window 对象注入 __BUILD_MANIFEST 变量。

    __BUILD_MANIFEST 变量包含路由和对应的 js 文件的映射关系。

- [x] SEO

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

- [x] 测量网页内容加载速度的指标

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







#### lerna 相关

- [x] monorepo： 所有项目的代码放在一个仓库；

- [x] 常用的 lerna 命令

    比较常用的 lerna 命令:
    - lerna init - 初始化一个使用 lerna 管理的 git 仓库;
    - lerna create < name > - 创建一个使用 lerna 管理的 package；
    - lerna add < pkg > [globs] - 给 lerna 管理的 packages 添加依赖；
    - lerna bootstrap - 链接本地包、安装依赖；
    - lerna version - 确定每个 packages 的 versions；
    - lerna publish - 发布包；

    上面的几个常用命令，就基本涵盖了 lerna 的基本仓库:
    - 先初始化一个使用 lerna 管理的 git 仓库；
    - 创建需要通过 lerna 管理的 packages；
    - 给 packages 添加依赖；
    - 给 packages 安装依赖，建立 packages 之间的软链接；
    - packages 开发完成以后，确定每个 packages 的 version；
    - 发布包；

- [x] 固定模式 / 独立模式

    使用 lerna init 初始化一个使用 lerna 管理的 git 仓库时， 有两种模式：固定模式和独立模式

    ```
    lerna init --independent   // 独立模式

    lerna init   // 默认为固定模式
    ```

    固定模式下， 所有 packages 的版本是绑定到一起的，任何包发生重大改动都会导致所有的包具有新的版本。

    独立模式下，允许维护者单独为每个 package 更新版本；


- [x] lerna bootstrap

    通过 lerna bootstrap 命令，可以会 packages 安装依赖，并链接本地包。

    lerna bootstrap 命令的执行过程:
    1. 建立各个 packages 之间的依赖关系，找到各个 packages 依赖的其他 packages
    2. 使用 childProcess.exec 执行 npm install xxx / yarn add xxx 命令来安装依赖的包;
    3. 基于 node 的 fs.symlink 的方式，根据 packages 之间的依赖关系，建立软链接( 和 npm link 的原理一样，软链接可以理解为应用的快捷访问方式，)

    npm link 的工作过程(是这样吗?):
    - 在被引用的 package 中，执行 npm link 命令，在 /user/local/lib/node_modules 中建立一个软链接；
    - 在引用的 package 中， 执行 npm link xxx 命令，在本地 node_modules 中建立一个软链接；

- [x] lerna version
  
    使用 lerna version 可以为每个 packages 确定 versions。

    lerna version 命令的主要工作是标识出上一个 tag 版以来发生更新的 package， 然后为这些包迅速出版本，在用户完成选择之后修改相关包的版本信息，并且将相关的变动 commit，然后打上 tag 推送到 git remote。

    lerna version 命令的执行过程:
    1. 检查当前 git 分支的信息(检验本地是否有 commit、分支是否正常、分支的远程分支是否存在、当前分支是否允许), 如果没有 commit，则无法进行，返回异常；
    2. 拿到上次的打的 tag；
    3. 检查哪个 packages 发生变化(使用 git diff 命令，对比上一次的 tag，判断 packages 是否发生变化);
    4. 获取需要更新的 version，并由用户确认；
    5. 更新 packages 的 versions，并更新依赖的 versions(固定模式下，更新所有的 packages；独立模式下，更新变化的 packages 的 versions);
    6. 使用 git tag 打标记；
    7. 使用 git push 命令 push；


    独立模式下， package2 依赖 package1， package1 版本更新时，即使 package2 没有发生变化，也需要更新版本；

    之所以要打 tag， 是为了检查哪个 packages 发生了变化。 git diff 命令需要用到上一次的 tag。

- [x] lerna publish

    需要发布的包，发布到 npm registry。

    ```
    lerna publish    // lerna version + lerna publish from-git

    lerna publish from-git  // 发布当前 commit 中打上 annoted tag version 的包

    lerna publish from-packges  // 发布 package 中 pkg.json 上的 version 在 registry(高于 latest version)不存在的包
    ```

- [x] lerna run xxx

    执行每个 packages 的 script 脚本


- [x] npm package 生成可执行文件 
  
    1. 生成一个 js 文件，首行 #!/usr/bin/env node (动态去查找 node 来执行当前命令)
    2. 在 package.json 文件的 bin 配置项指向第一步的 js 文件；
    3. 这样全局安装的时候，就会在 /usr/local/bin 生成一个可执行文件；



#### react 相关


#### 基础知识相关


#### 算法相关



#### 实际项目相关

百应项目整理:
- [ ] SaaS
- [ ] cc sdk 重构
- [ ] by-fe-ssr
- [ ] 业务包开发




#### 需要在额外了解的东西
- [ ] web component
- [ ] babel loader
- [ ] 软链接和硬链接
- [ ] 有时间 lerna 还需要多看看
- [ ] 有时间再看一下 ssr 的那本小册；
- [ ] esc module - vite;
  
   


