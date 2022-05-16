#### vite 学习问题

1. 为什么 package.json 中的 type 字段为 module ？

2. vite 配置项了解？ 

3. vite 插件机制是怎么样的？

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

9. 第一次启动本地服务的时候，会先去判断需不需要进行预构建，然后启动本地服务。如果不需要预构建，直接使用上一次预构建的数据；如果需要，那么会在本地服务启动以后，立刻进行预构建。

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


    vite 在处理每个组件的时候，会给每个组件添加一个 import.meta.hot.accept() 的方法，意味着每个组件都有热更新处理逻辑。当组件发生变换时



    
17. SSR

18. 为什么 vite 会快

    和 webpack 对比，为什么 vite 的冷启动和热启动都会快？

19. client 的模块缓存机制是怎么样子的？ 
    
    client 的模块缓存是浏览器自己实现的。

    相同的模块，client 只请求一次。









20. 如何自动打开浏览器？？


21. node 的进程管理

pm2 ??

