#### Performance API 的使用

**Performance** 接口可以获取到当前页面中与性能相关的信息。该类型的对象可以通过 **window.performance** 来获得。

常用的 **API**：

- **performance.navigation**

    **performance.navigation** 提供了与页面**导航操作**相关的信息，包括页面是加载还是刷新、发生了多少次重定向。

    即通过 **performance.navigation.type**, 就可以知道触发页面加载的动作：
    - **0**，点击链接、直接输入 url、脚本操作(直接操作 href) 等；
    - **1**，点击刷新按钮、Location.reload()'
    - **2**，通过 history 访问；
    - **255**， 其他方式；

    此外，通过 **performance.navigation.redirectCount** 还可以知道到达这个页面之间**重定向**了多少次。


- **performance.timing**


- **performance.getEntries()**

    通过 **performance.getEntries()**，可以获取 **web 页面**整个**生命周期**中各个操作的**开始时间**和**耗时时间**，包括**服务端响应时间**、**FP 时间**、**资源请求时间**、**接口请求时间**。

    常见的操作类型如下:
    - **导航类型 - navigation**，通过 **navigation** 可以获取如下时间:
      - **unloadEventStart** - **前一个页面卸载事件开始**的时间；
      - **unloadEventEnd** - **前一个页面卸载事件**结束的时间；
      - **fetchStart** - 浏览器准备好使用 http 抓取文档的时间，发生在检查本地缓存之前；
      - **domainLookupStart** - DNS 域名查询开始的时间；
      - **domainLookupEnd** - DNS 域名查询完成的时间；
      - **connectStart** - TCP 开始建立的时间；
      - **connectEnd** - TCP 完成建立的时间；
      - **requestStart** - **html 页面开始请求的时间**
      - **responseStart** - **html 页面响应的开始时间**
      - **responseEnd** - **html 页面响应的结束时间**
      - **domLoading** - 开始解析 dom 树的时间；
      - **domInteractive** - dom 树解析完成的时间，此时可以操作 dom 树；
      - **domContentLoadedEventStart** - **DomContentLoaded** 事件开始时间；
      - **domContentLoadedEventEnd** - **DomContentLoaded** 事件结束时间；
      - **domComplete** - dom 树解析完成，所有的资源也准备就绪；
      - **loadEventStart** - **loaded** 事件开始时间；
      - **loadEventEnd** - **loaded** 事件结束时间；
      - **type** - **导航类型**， 值为 **navigate**、**reload**、**back_forward**、**prerender** 等；

    - **资源类型 - resource**，包括**接口请求**、**静态资源获取**、**DNS 域名解析** 等，可获取**开始时间**、**耗时时间**、**请求资源大小** 等；
    - **渲染类型 - paint**, 包括 **FP**、**FCP**、**LCP** 等。
    - **长任务类型 - longtask**， 可以获取长任务(超过 50 ms) 的**开始时间**、**耗时时间**；
    - 

    通过 **performance.getEntriesByType()**、**performance.getEntriesByName()** 可以获取指定类型的 **PerformanceEntry**。
  
  
- **performance.now()**

    用于计算从**浏览器开始导航**到**当前调用**经过的时间，是一个相对时间。

    和 Date.now() 的对比：
    - 精度高，可到微妙；
    - 相对时间，不受本地始终影响；




#### 几个关键指标的计算

- **FP** - **First Paint**，页面在导航后首次呈现出不同于导航前内容的时间点，通过 **performance.getEntriesByName('first-paint')** 可以获取 FP 的时间；

- **FCP** - **First Contentful Paint**，首次绘制任何文本、图像、非空白 canvas 或者 SVG 的时间点，通过 **performance.getEntriesByName('first-contentful-paint')** 可以获取 FCP 的时间；

- **LCP** - **Largest Contentful Paint**，最大内容绘制，通过 **PerformanceObserver** 监听 **largest-contentful-paint** 可以获取 **LCP** 时间；

- **FID** - **First Input Delay**， 首次输入延迟，用于测量从用户第一次与页面交互到浏览器对交互做出响应，并且开始处理事件处理程序所经过的时间，通过 PerformanceObserver 监听 **first-input** 可以获取 LCP 时间；

- **TTFB** - **首字节时间**， 可以用过 **responseStart - fetchStart** 获取；
  
- **TTI** - **time to interactive**, 可交互时间，计算方式： 安静窗口期之前最后一个长任务的结束时间，如果没有长任务，则为 FCP；

    长任务监听： performanceObserver 监听 longtast；

    安静窗口期：没有长任务且不超过两个正在处理的网络 get 请求(通过拦截 xhr、fetch、mutationObserver 监听)；

    计算方式： 建立一个缓存池，启动的请求添加到缓存池中，结束的请求移除缓存池。当缓存池中的中请求小于 3 且没有长任务时，建立一个 5s 的定时器。5s 之后，如果请求还是 2 且没有长任务，那么就找到了安静窗口，然后再找到安静窗口之前的最后一个长任务。

- **TBT** -  **FCP** 和 **TTI** 之间的总时间；
  
- **CLS** - **累积布局偏移**， 通过 **PerformanceObserver** 监听 **layout-shift** 可以获取；


#### 几个关键指标的优化方式





#### DomContentLoaded 和 loaded

**domLoading** - **dom 树开始解析**， 解析到一半的 dom 树也会渲染；

**domInteractive** - **整个 dom 树解析完成**， 所有的 js 脚本全部执行完毕。

**DomContentLoaded** - **dom 树解析完成就可以触发 DomContentLoaded 事件**

**domComplete** - **dom 树解析完成，资源请求完毕**

**onload** - **dom 树解析完成，资源请求完毕即可触发 onload 事件**。

**async 异步脚本**没有顺序，加载完毕之后会立即执行，且会阻塞 dom 树的解析；

**defer 异步脚本**有顺序，不会阻塞 dom 树的解析；