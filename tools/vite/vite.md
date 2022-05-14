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

10. vite 本地服务启动以后使用到的几个中间件

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

11. vite 中 index.html、 js、 css 文件是怎么处理的？

12. HMR 

13. SSR  

14. 为什么 vite 会快

15. client 的模块缓存机制是怎么样子的？ 
    
    client 的模块缓存是浏览器自己实现的。

    相同的模块，client 只请求一次。




16. 如何自动打开浏览器？？

17. node 的进程管理

pm2 ??

