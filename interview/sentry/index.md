1. 缓存顺序: Service Worker、 Memory Cahce、 Disk Cache、 Push Cache；

2. 性能提升最有效的策略: 缓存，以空间换时间

3. http2、http3、http1.1；

4. 做前端监控，要考虑哪些细节？

    要监控哪些内容、监控添加方式、监控的数据怎么上报、上报的数据要不要进行预处理、上报的数据怎么存储、上报的数据怎么使用、通知开发人员、

    要监控哪些内容:
    - 业务数据，PV、UV、自定义埋点数据，统计页面的访问情况、功能使用情况；
    - 站点性能，FCP、LCP、FID、CLS、dom ready、loaded；
    - 服务稳定性，请求成功率、4xx 客户端异常情况、5xx 服务端异常情况；
    - 可用性，js 异常情况、白屏、静态资源错误数；
    - 可交互性，请求耗时情况；
    - 自定义监控

    监控添加的方式:
    - 侵入式，直接在业务代码里面添加监控相关代码；
    - 非侵入式，直接引入监控相关 SDK 就可以使用相关功能；

    监控数据如何获取:
    - 业务数据，在业务代码里面添加相关代码；
    - js 异常数据、静态资源错误，可以通过 window.onerror 和 window.onunhandleRejection 获取然后上报；
    - 性能数据，可以通过 performance 和 performanceObserver 获取然后上报；
    - 接口请求相关数据，可以通过拦截 xhr、fetch 获取然后上报；
    - 请求耗时情况，可以通过 performance 获取然后上报；

    监控数据如何上报:
    - `ajax` 接口请求，缺点：会有跨域问题、会影响主线程、应用关闭时请求会丢失(如果变成同步接口，则会影响下一个页面的加载)；
    - `jsonp` 请求，通过图片发起请求，不会有跨域问题，缺点: 携带的数据会有限制、应用关闭时发起请求也会影响下一个页面的加载；
    - `sendBeacon` 异步发送数据，可能很好的解决应用关闭请求丢失问题，而且不会影响下一个页面的加载；


    上报数据时的处理，主要是针对异常数据:
    - 相同的异常，不连续上报， name + message + 追踪栈信息，生成异常指纹，相同的异常不连续上报；
    - 上报以后的数据做聚合处理，通过 name + message + 追踪栈信息，生成异常指纹，相同的异常做聚合处理；

    上报的数据怎么存储: mysql / mangoDB 等；

    上报的数据怎么使用:
    - 异常，通过 sourcemap，查看异常在源文件的位置，然后根据用户的历史操作记录，定位、复现问题；
    - 性能，通过监控平台的性能面板，找到性能较差的步骤，然后做对应的优化；

    上报的异常如何通知开发人员:
    - 配置告警规则，通过 webhook 推送给消息群的负责人(这个需要手动维护)；
    - 根据发异常的源文件、行、列信息，通过 git 提交信息，找到相关的开发人员，然后发邮件推送？？

    告警规则怎么设置(或者说上报的异常都要推送给开发人员?)：
    - 从没有出现过的异常；
    - 波动异常:
      - 异常数 - js error 总和；
      - 异常率 - 发生 js error 的 pv / 总的 pv；
      - 影响用户数 - 发生 js error 的 uv；
      - 应用用户率 - 发生 js error 的 uv / 总的 uv；
      - 接口成功率 - 请求成功数 / 请求成功数 + 请求失败数；

    如何监控白屏:
    - 通过 mutationObserver 监控某个 dom 节点，是否有出现 dom 节点没有子节点的情况。
    - 观察一段时间，看这段时间内用户有没有进行页面交互行为，有没有出现静态资源加载的异常，如果没有页面交互行为，并伴随着有静态资源加载的异常，那么大概率是出现了白屏。
    - 将当前页面的快照、首屏加载情况上报上报；(页面快照，可以通过 canvas 实现，或者直接把 dom 结构上报)。
    - 通知开发人员去查看。

    前端监控涉及的一些 observer:
    - `IntersecionObserver`, 监听元素可视区域的变化，可用于懒加载、监控元素是否可见；
    - `MutationObserver`, 监听元素属性、子节点的变化；
    - `PerformmanceObserver`, 性能监控，可获取 lcp、fid、cls、long-task 等；
    - `ResizeObserver`， 监听元素大小的变化；
    - `ReportingObserver`, 监听过时 api、浏览器干预时打印信息；

    内存泄漏如何监控
    - 先上报用户内存的情况，然后通过监控平台的用户的汇总情况，计算一个平均值出来，然后设定一个阈值；
    - 超过阈值，则告警，然后根据上下文情形复现，修复问题；


















