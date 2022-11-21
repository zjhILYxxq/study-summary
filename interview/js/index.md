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
 



- [x] 从输入 url 到页面展示

- [x] es6 module 和 commonjs

- [x] 跨域

- [x] xss 和 csrf

- [x] dom2.0

- [x] 闭包

- [x] eval 和 new Function 的区别

    eval中的代码执行时的作用域为当前作用域。它可以访问到函数中的局部变量。
    
    new Function中的代码执行时的作用域为全局作用域，不论它的在哪个地方调用的。

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
      - 避免回流、重绘 - 批量操作 `dom tree`，给 `dom` 节点设置高度、宽度，频繁操作的 `dom` 节点脱离文档流；
      - 增量渲染 - 避免一次性渲染太多节点；
      - 虚拟列表
      - `react` 的 `useMemo`、`memo`、`shouldComponentUpdate`；
      - 选择合适的渲染策略: `csr` / `ssr` / `ssg` / `hydate` 等；

- [x] `preload` 和 `prefetch`

    `preload` 是一种声明式的资源请求方式，用于提前加载一些首屏需要的资源，不会阻塞 `onload` 事件；

    `prefetch` 是利用浏览器空闲时间去加载浏览器将来可能用来的资源的一种机制。

    简单来说，`preload` 可以用于优化首屏性能，`prefetch` 用于优化懒加载性能。