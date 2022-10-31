- [x] Event Loop

    `javascript` 是用于实现网页交互逻辑的，涉及到 dom 操作，如果多个线程同时操作需要做同步互斥的处理，为了简化就设计成了单线程，但是如果单线程的话，遇到定时逻辑、网络请求又会阻塞住。

    可以加一层调度逻辑。把 `js` 代码封装成一个个的任务，放在一个任务队列中，主线程就不断的取任务执行就好了。

    每次取任务执行，都会创建新的调用栈。

    其中，定时器、网络请求其实都是在别的线程执行的，执行完了之后在任务队列里放个任务，告诉主线程可以继续往下执行了。

    因为这些异步任务是在别的线程执行完，然后通过任务队列通知下主线程，是一种事件机制，所以这个循环叫做 Event Loop。

    但是，现在的 Event Loop 有个严重的问题，没有优先级的概念，只是按照先后顺序来执行，那如果有高优先级的任务就得不到及时的执行了。所以，得设计一套插队机制 - 宏任务和微任务

- [x] 浏览器缓存策略
- [x] 从输入 url 到页面展示
- [x] es6 module 和 commonjs
- [x] 跨域
- [x] xss 和 csrf
- [x] dom2.0
- [x] 闭包