- [x] Event Loop

    `javascript` 是用于实现网页交互逻辑的，涉及到 dom 操作，如果多个线程同时操作需要做同步互斥的处理，为了简化就设计成了单线程，但是如果单线程的话，遇到定时逻辑、网络请求又会阻塞住。

    可以加一层调度逻辑。把 `js` 代码封装成一个个的任务，放在一个任务队列中，主线程就不断的取任务执行就好了。

    每次取任务执行，都会创建新的调用栈。

    其中，定时器、网络请求其实都是在别的线程执行的，执行完了之后在任务队列里放个任务，告诉主线程可以继续往下执行了。

    因为这些异步任务是在别的线程执行完，然后通过任务队列通知下主线程，是一种事件机制，所以这个循环叫做 Event Loop。

    但是，现在的 Event Loop 有个严重的问题，没有优先级的概念，只是按照先后顺序来执行，那如果有高优先级的任务就得不到及时的执行了。所以，得设计一套插队机制 - 宏任务和微任务

- [x] 浏览器缓存策略

    [缓存机制](https://juejin.cn/post/6844904063193219080#heading-54)。

    应用的通用缓存配置:
    - 入口文件采用协商缓存(这里以前居然一直记的是不缓存，有点搞笑)；
    - 静态文件采用强缓存；

    要注意请求头和响应头里面的 `cache-control` 字段。

    响应头的 `cache-control` 字段:
    - `private`, 内容只能被缓存到浏览器中，不能缓存到代理服务器中；
    - `public`, 内容可以被缓存到浏览器、代理服务器中；
    - `no-cache`，协商缓存；
    - `no-store`，所有的内容都不可以被缓存；
    - `max-age`，强缓存；

    请求头的 `cache-control` 字段:
    - `no-cache`，忽略本地缓存，强制与服务器进行协商。

    强制刷新浏览器，会给请求头添加 `cache-control: no-cache` 字段。

- [ ] 前端鉴权认证

- [ ] 竞态问题

- [ ] 手写 promise
 



- [ ] 从输入 url 到页面展示

- [ ] es6 module 和 commonjs

- [ ] 跨域

- [ ] xss 和 csrf

- [ ] dom2.0

- [ ] 闭包

- [ ] eval 和 new Function 的区别

    eval中的代码执行时的作用域为当前作用域。它可以访问到函数中的局部变量。
    
    new Function中的代码执行时的作用域为全局作用域，不论它的在哪个地方调用的。

- [ ] 服务端流式渲染、三方同构渲染？？

- [ ] RSC、流渲染 

下午把性能优化、光神最近的博客看看

- [x] 前端性能优化

    前端的针对性优化:
    - 构建优化
      - 构建体积、速度的优化；
      - `tree shaking`、`code spliting`、`code preload`；
      - 将有繁重计算的 `javascript` 抽离到 `web worker`;
      - 在 `javascript` 中使用 `module/nomodule` 模式，即打包两份文件，一份符合 `esm` 规范，不使用 `babel` 处理源文件，一份使用 `babel` 处理，`index.html` 文件提供两个入口文件，即 `type="module"` 和 `type="nomodule"`,能够识别 `type="module"` 会自动忽略 `type="nomoudle"`;
      - 使用体积小巧的库，替换到之前添加的大型库，比如 `day.js` 替换 `moment.js`;
    - 资源请求优化
      - `gzip` 预压缩静态资源；
      - 对字体可以进行 `preload`、缓存到 `service worker` 中；
      - 静态资源如 `html`、`js`、`css`、图片压缩、`preload`；
      - `js` 异步加载；
      - 内联关键 `css`、`js`；
      - `pre-connect`、`pre-load`、`pre-fetch`;
      - 合理的浏览器缓存策略；
    - 页面渲染优化
      - 避免回流、重绘 - 批量操作 `dom tree`，给 `dom` 节点设置高度、宽度，频繁操作的 `dom` 节点脱离文档流,能用 `css` 实现的动画不要使用 `js` 实现；；
      - 增量渲染 - 避免一次性渲染太多节点；
      - 虚拟列表
      - `react` 的 `useMemo`、`memo`、`shouldComponentUpdate`；
      - 选择合适的渲染策略: `csr` / `ssr` / `ssg` / `hydate` 等；

- [x] `preload` 和 `prefetch`

    `preload` 是一种声明式的资源请求方式，用于提前加载一些首屏需要的资源，不会阻塞 `onload` 事件；

    `prefetch` 是利用浏览器空闲时间去加载浏览器将来可能用来的资源的一种机制。

    简单来说，`preload` 可以用于优化首屏性能，`prefetch` 用于优化懒加载性能。

- [x] `PWA`

    **PWA**, 即 **渐进式网页应用(progressive web app)**, 主要用于解决两个问题: **用户体验** 和 **用户留存**。

    **PWA** 可以将 **Web** 和 **App** 各自的优势融合在一起：**渐进式**、**可响应**、**可离线**、**实现类似 App 的交互**、**即时更新**、**安全**、**可以被搜索引擎检索**、**可推送**、**可安装**、**可链接**。

    **PWA** 不是特指某一项技术，而是应用了多项技术的 **Web App**。其核心技术包括 **App Manifest**、**Service Worker**、**Web Push**、**Credential Management API** ，等等。其核心目标就是 **提升 Web App 的性能，改善 Web App 的用户体验**。

    **关键技术**：
    - **App Manifest**

        **manifest** 的目的是将 **Web 应用程序** 安装到 **设备的主屏幕**，为用户提供更快的访问和更丰富的体验。
        
        部署一个 **manifest** 的方式:
        ```
        <link ref="manifest" href="./manifest.json">
        ```
        
        **manifest.json** 是一个 **json** 文件，关键属性:
        - **name**、**short_name** 应用名称
        - **description** 应用描述
        - **display** 显示模式 fullscreen(全屏显示)、standalone、minimal-ui(有浏览器地址栏)、browser(在浏览器中打开)
        - **scope** 定义此Web应用程序的应用程序上下文的导航范围。
        - **start_url** 指定用户从设备启动应用程序时加载的URL。
        - ...
        
        **浏览器** 识别到这个文件的存在，会根据自己的机制决定 **是否弹出添加到桌面对话框**，并在桌面上生成一个 **应用的图标**，通过点击 **桌面图标** 进入 **应用**。
        
        > **目前问题: 各大厂商支持度不够好，默认关闭，需要手动打开。**
    - **Service worker**

        **Service Worker** 是一个特殊的 **Web Worker**，独立于页面主线程运行，它能够 **拦截和处理网络请求**，并且配合 **Cache Storage API**，开发者可以 **自由的对页面发送的 HTTP 请求** 进行管理，这就是为什么 **Service Worker** 能让 **Web 站点离线** 的原因。
        
        **service worker** 的特征:
        - 无法操作 dom；
        - 只能使用 https 和 localhost；
        - 拦截全站的 fetch 请求；
        - 于主线程独立，不会阻塞主线程；
        - 不支持 xhr 和 localstorage；
        - 一旦被安装，就一直存在，直到卸载；
        
        Service worker 的实现依赖 **Cache API**、**fetch API**、**Promise**。
        
        **Service worker** 的使用过程:
        - **注册(register)**
            
            通过 **navigator.serviceWorker.register('./sw.js')** 注册 。
            
            **register** 返回一个 **promise** 对象，状态为 **pending**。 等 sw 注册成功以后， promise 对象的状态变为 resolved， 值为 **registration**。 通过 **registration**，可以访问 **sw** 的状态(installing、waiting、active)，可以手动卸载 sw。
            
        - **安装(install)**
        
            在 sw.js 文件中，我们首先要做的是 **监听 sw 注册成功** 以后抛出的 **install** 事件。
            
            在这个事件中，我们要做的就是 **缓存所有的静态文件**。
            
            ```
            self.addEventListener('install', function(e) {
                // 延长事件的寿命从而阻止浏览器在事件中的异步操作完成之前终止服务工作线程
                e.waitUntil(caches.open('v1').then(function(cache) {
                    return cache.addAll(['index.html'])
                }))
            })
            ```
        - **激活(active)**
        
            **安装成功** 后就会等待进入 **activate 阶段**。这里要注意的是，并不是install一旦成功就会立即抛出activate事件，如果当前页面已经存在service worker进程，那么就需要等待页面下一次被打开时新的 sw 才会被激活，或者在 **install** 中使用 **self.skipWaiting()** 跳过等待

            在这个事件中， 我们一般要检查并删除旧缓存。
            
            如下:
            ```
            self.addEventListener('active', function(e) {
                // 延长事件的寿命从而阻止浏览器在事件中的异步操作完成之前终止服务工作线程
                e.waitUntil(...)
            })
            ```
        - **更新(update)**
        
            如果 /sw.js 内容有更新，当访问网站页面时浏览器获取了新的文件，逐字节比对 /sw.js 文件发现不同时它会认为有更新启动 更新算法，于是会安装新的文件并触发 install 事件。
            
            但是此时已经处于激活状态的旧的 Service Worker 还在运行，新的 Service Worker 完成安装后会进入 waiting 状态。直到所有已打开的页面都关闭，旧的 Service Worker 自动停止，新的 Service Worker 才会在接下来重新打开的页面里生效。
            
            如果希望在有了新版本时，所有的页面都得到及时自动更新,可以在 install 事件中执行 **self.skipWaiting()** 方法跳过 **waiting 状态**，然后会直接进入 activate 阶段。接着在 activate 事件发生时，通过执行 **self.clients.claim()** 方法，更新所有客户端上的 Service Worker。
            
            在 activate 事件回调中执行 self.clients.claim  表示取得页面的控制权, 这样之后打开页面都会使用版本更新的缓存。
            
        - **自定义请求响应**
        
            当激活完毕后就可以在 **fetch**  事件中对站点作用范围下的所有请求进行 **拦截处理** 了。
            
            我们可以给 **service Worker** 添加一个 **fetch** 的事件监听器，接着调用 event 上的 **respondWith()** 方法来劫持我们的 **HTTP 响应**，然后你可以用自己的方法来更新他们。
            
            **Service Worker** 的工作方式也衍生出了几种不同的请求控制策略，**networkFirst**, **cacheFirst**, **networkOnly**, **cacheOnly** 和 **fastest**，对于不同类型的请求，我们应该采取不同的策略，静态文件，我们可以选择 cacheFirst 或者 fastest，甚至 cacheOnly，对于依赖后端数据的 AJAX 请求，我们应该选择 networkFirst 或者 networkOnly，保证数据的实时性。
            
        - **卸载(unregister)**
        
            sw 的卸载方式如下:
            
            ```
            navigator.serviceWorker.getRegistration('./serviceWorker').then(function(registration) {
                registration.unregister();
                // 删除缓存
            })
            ```
        
    - **Web Push**
    - **Credential Management**