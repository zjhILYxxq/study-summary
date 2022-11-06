1. 缓存顺序: Service Worker、 Memory Cahce、 Disk Cache、 Push Cache；

2. 性能提升最有效的策略: 缓存，以空间换时间

3. http2、http3、http1.1;

4. 异常 dedupe、异常聚合(异常指纹，name + message + 追踪栈)

5. 关心的异常

    从没有出现过的异常；

    波动报警: 
    - 错误数 - js error 的总和；
    - 错误率 - 发生 js error 的 PV / 总 PV * 100%；
    - 影响用户数 - 发生 js error 的 UV；
    - 影响用户率 - 发生 js error 的 UV 和总的 UV；

    服务不稳定: 请求成功率 = 请求成功数 / (请求成功数 + 请求失败数)

6. 整体视角

    监控:
    - 业务数据，PV、UV、自定义事件，了解站点的访问情况；
    - 站点性能，FP、FCP、LCP、FID、CLS、DOM ready、loaded；
    - 服务稳定性，请求成功率， 4xx 占比， 5xx 占比；
    - 可用性，js 错误率、白屏数、静态资源错误率；
    - 可交互性，请求耗时情况；

7. 如何检测白屏？

    采用 mutationObserver 监听 dom tree 节点的变化

    页面截屏： 将 dom 节点转化为 canvas，然后获取到内容再上传？

    再获取这个页面相关的异常报错、首屏上报数据，定位到底是哪一步操作导致了白屏；

8. 前端做监控，可以用到的几个 api

    `IntersectionObserver`，监听一个元素和可视区域相交部分的比例，然后在可视比例达到某个阈值的时候触发回调，可以在图片懒加载、监控元素是否可见时使用。

    `MutationObserver`, 监听对元素属性的修改、元素子节点的变化。(监控对象变化，可以使用 Object.defineProperty 或者 proxy)。

    `ResizeObserver`, 监听元素大小的变化。

    `PerformanceObserver`, 性能监控。

    `ReportingObserver`, 可以监听过时的 api、浏览器干预如删除广告、替换大图片等报告等的打印。




