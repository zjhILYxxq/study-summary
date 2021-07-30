#### 一、React 的理念 - 快速响应

React 是构建**快速响应**的大型 Web 应用程序的首选。

日常开发中，制约**快速响应**的因素：
- CPU 瓶颈 - JS 线程和 GUI 渲染线程的互斥，导致大计算量的操作会使渲染线程延迟工作，导致页面掉帧，造成卡顿；
- IO 瓶颈 - 发送网络请求后，不能快速拿到结果导致不能快速响应；

解决方法：
- **CPU 瓶颈**

    一次 react 更新会经历两个阶段 - render 阶段和 commit 阶段。其中 render 阶段由于需要对 fiber tree 做 diff 比较，最有可能会耗时比较久导致阻塞渲染进程。

    
    为了解决这个问题，react 18 将原来同步的不可中断的 render 过程变为异步可中断的。具体是将一个完整的 render 过程分解到一系列小的时间片(5ms)内处理。如果时间片时间到期，render 阶段还没有结束，就让出线程给渲染进程，然后在下一个时间片段内继续中断的渲染过程。

- **IO 瓶颈** 
  
  Suspense 以及 useDeferedValue


关键：**将同步的更新变为可中断的异步更新**。



#### React 架构

React16(及后续版本)架构可以分为三层：
- **Scheduler(调度器)**：根据任务的优先级调度任务，高优先级的任务优先进入 Reconciler；
- **Reconciler(协调器)**：更新 fiber tree，找出变化的 fiber node，并收集 fiber node 变化导致的副作用(对应 react 更新的 render 阶段)；
- **Renderer(渲染器)**：处理 Reconciler 工作过程中收集的副作用，更新 dom 节点并处理组件生命周期方法(对应 react 更新的 commit 阶段)；


#### react element


#### fiber tree


#### fiber node

静态数据结构

动态工作单元

调度优先级

#### 双缓存

内存中构建并直接替换的技术叫作双缓存，主要是为了解决交互过程中的白屏问题？？

React 采用双缓存技术来完成 fiber tree 的构建和更新，对应 dom tree 的创建和更新。


#### 双缓存 fiber tree

React 中最多会同时存在两颗 fiber tree。 当前屏幕上显示的内容对应的 fiber tree 称为 current fiber tree (即 old fiber tree)，正在内存中构建的 fiber tree 称之为 workInProgress Fiber tree。

current fiber tree 中的 fiber node 称之为 current fiber node (即 old fiber node)， workInProgress fiber tree 中的 fiber node 称之为 workInProgress fiber node (即 new fiber node)， current fiber node 和 workInProgress fiber node 之间通过 alternate 属性连接。

fiber root node 的 current 指针指向 current fiber tree，更新完成以后，current 指针就会指向 workInProgress fiber tree，作为下一次的 current fiber tree。



#### 为什么要采用双缓存 fiber tree

双缓存 fiber tree 主要是为非阻塞渲染服务的。如果是阻塞同步渲染，其实 fiber tree 就足够了。但是如果是非阻塞渲染，就需要双缓存 fiber tree 了。

低优先级的更新在 render 过程中，如果有更高优先级的更新进来，就需要重置 workInProgress fiber tree。


#### 任务调度

优先级：
- 调度优先级
- react 优先级
- lane 优先级


#### Concurrent


#### diff 算法






#### requestIdleCallback

#### 如何理解 Concurrent 模式

Concurrent 模式是一组 React 新功能，可帮助应用响应，可以根据用户的设备性能和网速进行适当的调整。

阻塞渲染: 渲染一次更新，不能中断包括创建新的 DOM 节点和运行组件中代码在内的工作。

在分支上准备每一次更新？？

Concurrent 模式下加载异步组件/异步数据

Concurrent 模式中， React 可以同时更新多个状态 ？？

Concurrent 模式在内部使用不同的优先级，大致对应于人类感知研究中的交互级别






#### Suspense

对组件的 Suspense，组件懒加载

对数据的 Suspense，数据异步获取

Suspense 让组件"等待"某个异步操作，直到该异步操作结束即可渲染。


Suspense 不是一个数据请求的库，而是一个机制。这个机制是用来给数据请求库向 React 通信说明某个组件正在读取的数据当前仍是不可用的。通信之后，React 可以继续等待数据的返回，并更新 UI。

Suspense 将成为组件读取异步数据的主要方式 - 无论数据来自何方。

Suspense 可以做什么：
- 它能让数据获取库与 React 紧密结合；
- 它能让你有针对性地安排加载状态的展示；
- 它能够消除 race conditions

Suspense 让组件表达出他们正在等待已经发出获取行为的数据。

瀑布问题： waterfall - 本该并行发出的请无意中被串行发送出去


数据获取方式：
- Fetch-on-render: 渲染之后获取数据(useEffect 中获取数据)，可能导致瀑布问题；
- Fetch-then-render: 接到全部数据以后渲染(获取数据之前，我们什么也做不了)；
- Render as you fetch: 获取数据之后渲染(获取数据时就开始渲染；接收到全部数据后，迭代的渲染)；


通过 Suspense，我们可以更改加载状态的粒度并控制程序，而无需调整代码

resource 在数据请求之前无法获取

Suspense 消除 race condition

错误边界处理



#### useDeferedValue

返回一个延迟响应的值，通常用于在具有基于用户输入立即渲染的内容，以及需要等待数据获取的内容时，保持接口的可响应性。



#### 类组件的某些声明周期方法为什么是不安全的


#### 类组件 & 函数组件


#### 为什么要引入 hooks


#### hooks 是怎么设计的


#### Context


#### ref


#### 事件合成


#### portal


#### React 的最佳实践


#### mobx


#### redux

#### react-router





