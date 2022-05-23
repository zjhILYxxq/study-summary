#### vite 学习问题

1. 为什么 package.json 中的 type 字段为 module ？

2. vite 常用配置项了解



3. vite 插件机制

    插件容器、插件类型、插件机制

    如何编写一个 vite 插件

    vite 插件需要的配置该如何传进来？？

4. 预编译构建过程是怎么样的?

5. 预构建的时候模块的依赖关系是怎么样获取到的？ 

6. esbuild 工作原理是咋样的? 

7. 预构建主要是将依赖的三方库从 cjs 转化为 esm。 

    过程和 webpack 打包类似。根据指定的入口文件，做依赖分析？，提取类似 runtime、common 包，将 cjs 包内容外面包裹一层 es6 实现。？？

8. 每次启动时，如何判断需要是否需要预构建？上一次预构建的内容是否可以使用？

    vite 开发模式下，如果设置 server.force 为 true，那么每次启动的时候都会预构建。

    如果设置 server.force 为 false，开发模式每次启动时，会先检查原来的预构建是否发生变化。如果没有预构建的内容，那么进行预构建；如果有预构建内容，则需要检查原来的预构建内容是否可用。

    如何判断预构建内容是否发生了变化：检查 vite.config.js 和 .lock 文件的内容是否发生了变化。如果没有变化，说明上一次的预构建内容可以使用。

    具体检查的过程: 通过 .lock 文件的内容和 vite.config.js 的内容，生成一个 md5 码。如果 .lock 文件的内容和 vite.cofig.js 的内容没有发生变化，md5 码也不会发生变化，原来的预构建内容就可以使用了。

9.  第一次启动本地服务的时候，会先去判断需不需要进行预构建，然后启动本地服务。如果不需要预构建，直接使用上一次预构建的数据；如果需要，那么会在本地服务启动以后，立刻进行预构建。

10. 项目中的业务代码是否支持 commonjs 写法 ？

    目前看是不支持的。预构建的时候也不会对 cjs 模块进行处理。

11. vite 本地服务启动以后使用到的几个中间件

    中间件列表如下(按照执行的先后顺序):
    - corsMiddleware
    - proxyMiddleware
    - viteBaseMiddleware,
    - servePublicMiddleware
    - transformMiddleware
    - serveRawFsMiddleware
    - serveStaticMiddleware
    - spaFallbackMiddleware
    - indexHtmlMiddleware
    - vite404Middleware
    - errorMiddleware

12. vite 中 index.html、 js、 css 文件是怎么处理的？

    先去请求 index.html 文件。html 文件的处理：添加 @vite/client、/@react-refresh， 其中 @vite/client 主要用于建立 ws 连接，@react-refresh 用于热更新。

    下一步，请求 @vite/client、@react-refresh、/src/main.tsx。其中 main.tsx 是应用指定的入口文件，作为 js 文件。

    main.tsx 需要经过转换，才能返回给客户端。整个转换处理过程经历 resolve、load、transform 三个过程，即解析、加载、转换。

    解析，即解析相对路径，获取 main.tsx 的绝对路径；

    加载，读取 main.tsx 对应的源代码字符串；

    转换，先通过 loader 将 jsx 写法转化为 react.createElement 写法；然后再分析文件中的依赖，第三方依赖 import x froom 'xxx' 中的相对路径和输出结果转化为预构建生成的依赖的路径和输出结果，并且还要添加热更新相关逻辑代码；

    最后将转换以后的内容返回给客户端。

    vite 在做转化的时候有个比较巧妙的处理。 main.tsx 依赖的静态文件，并不是在下次请求的时候才转换处理。在对 main.tsx 做转换处理后，server 端会继续对 main.tsx 依赖的文件继续做转换处理，然后先缓存起来。等到客户端请求到达 server 端时，直接使用缓存。即 main.tsx 开始转换以后，server 端会一直工作，把所有的静态依赖全部转换完毕。

    css 文件的处理过程和 webpack 也相同，即使用对应的 loader 先将 saas、less 写法转化为 css 写法，然后将样式文件转换成一段 js 代码。这一段 js 代码会执行 @vite/client 提供的 updateStyle 方法，通过动态添加 style 标签的方式添加到 html 页面中。


13. 依赖后面的 v=xxx、t=xxx 是什么意思？

    使用 vite 时我们会发现，三方依赖，请求路径会添加一个 v=xxxx 的请求参数；内部依赖，请求路径会添加一个 t=xxx 的请求参数。

    其中，v 是版本信息， t 是时间戳信息。

    如果不加请求参数，同样的请求 url， 浏览器只会请求一次；请求参数不同，浏览器会就会任务请求 url 不相同，这样就会再次请求。

14. 静态依赖和动态依赖

    一个文件的依赖分为静态依赖和动态依赖。

    静态依赖的形式为： import xx from 'xxxx'

    动态依赖的形式为： import('xxx').then(res => {...})。

    只有静态依赖才会进行 pre-transform，动态依赖不会 pre-transfrom。 动态依赖只有真正请求的时候才会 transfrom。

    其实很好理解，如果我的动态依赖是放在 if 块中，那么如果这一段代码一直没有触发， 那么就不需要请求，也不需要 transform。


15. import.meta

    import.meta 是一个给 javascript 模块暴露特定上下文的元数据属性的对象，它包含了这个模块的信息，如果这个模块的的 url。

    import.meta对象是由ECMAScript实现的，它带有一个null的原型对象。这个对象可以扩展，并且它的属性都是可写，可配置和可枚举的。

    即每个 esm 模块都有一个 import.meta, 通过 import.meta 可以访问这个模块的元数据信息。

16. HMR 的整个工作过程是咋样的？

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


    
17. SSR

18. 为什么 vite 会快

    和 webpack 对比，为什么 vite 的冷启动和热启动都会快？

19. client 的模块缓存机制是怎么样子的？ 
    
    client 的模块缓存是浏览器自己实现的。

    相同的模块，client 只请求一次。











20. 如何自动打开浏览器？？

21. 常见的打包工具对比

    目前前端比较常见的打包工具： webpack、parcel、vite、esbuild、rollup 等

    parcel：
    - 特性：零配置，支持 js/jsx/tsx、css、html、vue、图片等文件类型，支持 code splitting、tree shaking、压缩、devServer、 hmr、hash 等；
    - 优点：零配置；在 js、css 的转译上使用了 Rust，效率提升；
    - 缺点：扩展性不强，不太适合有大量定制化需求的项目；

    rollup:
    - 特性: 
    - 优点：
    - 缺点:

    vite：
    - 特性：
    - 优点：
    - 缺点

    parcel:
    - 特性:
    - 优点:
    - 缺点

    esbuild：
    - 特性:
    - 优点：
    - 缺点:











22. node 的进程管理

pm2 ??

22. vite 升级过程中遇到的问题？

1. vite.config.js 中使用 es6 语法报错问题处理；

2. 路径无法解析问题 - 没有使用别名，也没有使用相对路径

    在项目开发过程中，我们 import 文件会存在以下几种形式:
    - import header from '../components/header.tsx', 相对路径， 这种情况下 vite 会自动将相对路径解析为绝对路径；
    - import header from '@/components/header.tsx'，路径别名， 其中 @ 为 src 的别名，这种情况下 vite 会通过 resolve.alias 配置项将 path 解析为绝对路径；
    - import header from 'components/header.tsx', 其中 components 为 src 目录下的一级目录，这种情况也比较常见，需要配置 tsconfig.json 中的 baseUrl；这种情况下，可以通过一个自定义 vite 插件来解析该路径
  

3. qiankun 下怎么对接 vite 项目？

    https://github.com/tengmaoqing/vite-plugin-qiankun/blob/master/src/index.ts




