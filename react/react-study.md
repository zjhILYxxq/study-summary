### react 相关知识总结

涉及 react api 使用、react 原理、 react-router、redux、 mobx、react 优化等知识；

#### react 基础知识

- [x] hooks api 的使用

  常用的 hooks
  - **useState**: 
  
    通过 useState 可以给函数组件添加状态 state 以及用于修改 state 的 setState。 
    
    state 更新时，不会像类组件一样做合并操作，只会进行替换操作。

    如果 state 更新依赖于之前的 state，可以在使用 setState 时传入一个 function callback。 该 function callback 触发时，入参为上一个 state。此时，我们就可以根据上一次的 state 返回新的 state。

  - **useReducer**: 

    如果一个函数组件中存在多个 state，我们可以通过 useReducer 将多个 state 合并为一个。

    使用 useReducer 时要注意传入的 reducer 是一个纯函数，最好不要修改入参，否则在 strict 模式或者 concurrent 模式下，可能会出现不期望的副作用。
    
  - **useEffect**

    useEffect 可用于处理 props、state 状态变化引发的副作用。

    条件 effect - 做浅比较。

    useEffect 的 callback 执行时会返回一个 destory 方法，供函数组件下一次触发 useEffect 时触发。

    > 本质上可以这样理解， useState 的出现，使我们可以为函数组件添加 state， useEffect、useLayoutEffect 则给我们提供了处理由 props、state 状态变化引发的自定义副作用的机会。


  - **useLayoutEffect**

    useLayoutEffect 也可用于处理 state 状态变化引发的副作用。

    和 useEffect 不同的是， useLayoutEffect 在浏览器开始渲染之前触发，而 useEffect 则在浏览器完成渲染之后触发。

    如果我们想对更新完成以后的 dom 结构做调整，可以在 useLayoutEffect 中做处理。

  - **useMemo**

    和 vue 的计算属性一样，可以用于复杂计算的缓存。

  - **useCallback**

    使用 useCallback，可以像 useMemo 一样，返回一个缓存的函数。

  - **useRef**

    useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数。返回的 ref 对象可以在组件的整个生命周期内保持不变。

    使用 useRef， 我们帮助函数组件获取 dom 节点、类组件实例，也可以创建一个在组件生命周期内保持不变的变量。


  - **useContext**

      使用 useContext， 可以获取一个 context 对象的当前值。

      使用 useContext 的函数组件，必须被对应的 Context.Provider 包裹。

  - **useImperativeHandler**

      使用 ref 时自定义暴露给父组件 ref.current 的值。

      useImerativeHandler 一般会配合 React.forwardRef 使用，当然也可以配置 ref callback 使用。
  
  - **useTransition**

    React18 新定义的 hook，使用时可以开启 concurrent 模式。

  - **封装自定义 hook**


- [x] 类组件生命周期方法使用

    **mount** 阶段的生命周期方法:
    - **constructor**

      构造函数，用于创建一个类组件实例对象；构建的类组件实例一直存在于类组件整个生命周期内。

    - **static getDerivedStateFromProps**

      根据传入的 props 计算 state。

    - **render**
      
      render 阶段(或者协调阶段)触发，执行以后返回一个 react element， 用于生成类组件对应的 fiber tree；

    - **componentDidMount**: 
      
      commit 阶段触发，类组件对应的 dom 节点添加到 dom tree 之后，浏览器开始渲染之前触发；


    **update** 阶段的生命周期方法:

    - **static getDerivedStateFromProps**

      根据传入的 props 重新计算 state

    - **shouldComponentUpdate**

      可以根据 shouldComponentUpdate 的返回值，决定 render 方法是否需要执行。

      如果返回 true，render 方法重新执行，返回新的 react element，然后要走 diff、副作用处理；

      如果返回 false，render 方法不需要执行，组件不需要更新。

      PureComponent 默认实现了 shouldComponentUpdate 方法，会对 props、state 做浅比较。

    - **render**

    - **getSnapshotBeforeUpdate**

        更新 dom tree 之前调用。

        > componentDidMount、componentDidUpdate、useLayoutEffect 是更新 dom tree 之后调用。 useEffect 是浏览器完成渲染以后调用。

    - **componentDidUpdate**

        commit 阶段触发，类组件对应的 dom 节点添加到 dom tree 之后，浏览器开始渲染之前触发。

        componentDidUpdate 方法内部调用组件实例的 setState 方法，会出现死循环现象。

    组件卸载: **componentWillUnmount**

    错误边界: **static getDerivedStateFromError**、**componentDidCatch**

    不安全的是生命周期方法: **componentWillMount**、**componentWillUpdate**、**componentWillReceiveProps**、**getDerivedStateFromProps**。

    这几个生命周期方法都在 render 方法之前触发，在 concurrent 模式下，组件可能会发生二次渲染。如果这些方法中存在引发副作用的代码，那么最后会导致不可预知的错误。



- [x] csr & ssr

    csr，客户端渲染，使用 ReactDOM.render 方法； ssr, 服务端渲染，使用 ReactDOM.hydrate 方法。

    render 和 hydrate 方法的区别: render 方法会把容器节点的所有子节点移除；而 hydreate 方法会保留容器节点的所有子节点，然后在协调阶段判断 dom 节点是否可以使用。

    ssr 服务端需要用到的几个方法:
    - renderToString - 将 react 元素渲染为一个 html 字符串；



- [x] context
  
    使用 context 可以进行跨组件通信。

    context 的用法：
    - 使用 createContext 方法定义一个 Context；
    - 使用 Context.Provider 包裹使用 context 的组件， value 为供子组件使用的值；
    - 子组件可以通过 contextType、useContext、Context.Consumer 的方式使用 Context。

    context 的原理:
    - 在父组件中，通过 setState 的方式修改 Context.value，触发更新；
    - Context.Provider 更新，找到使用 Context 的子组件，标记更新；
    - 子组件更新；

  
- [x] refs

  父组件获取子组件 dom 节点的方式:

  - 子组件是类组件：
    - 父组件获取子组件实例，再通过子组件实例获取子组件的 dom 节点；
    - ref callback - 将父组件给 ref callback 通过 props 传递给子组件，让子组件 dom 节点的 ref 属性值为 ref callback；
  
  - 子组件是函数组件(不能给函数组件添加 ref 属性):
    - ref callback；
    - forwardRef;
    - forwardRef + useImperativeHandler；


  > 注意哦，不能给函数添加 ref 属性。



- [x] 高阶组件

    高阶组件，实质是一个纯函数，传入一个组件， 返回一个新组件，不改变传入的组件。
    
    使用高阶组件时， 应该注意以下关键点:
    
    1. 高阶组件是一个纯函数，不要对传入的组件进行修改。应该提供一个容器组件包裹传入的组件，在容器组件上做对应的修改。
    
    2. 如果传入的源组件有静态方法， 应将源组件的静态方法复制到容器组件。
    
    3. 不要在 render 方法和函数式组件方法中使用 HOC。
    
        在 render 或者函数式组件方法中使用 HOC， 父组件每次更新时，会先卸载更新前的 HOC， 删除对应的 dom 节点， 然后挂载新的 HOC，将对应的 dom 节点添加到 dom 树中，而不是对子组件做局部更新， 还造成不必要的子组件重新渲染。
        
        可以这么理解，在 render 方法中使用 HOC， 父组件每次更新时， HOC 组件的 componentWillUnmount、 componentDidMount 都会触发， componentDidUpdate 永远不会触发。
        
    4. 通过 refs 转发和 props 将 HOC 上的 ref 传递到源组件。
    
        方式如下:
        ```
        function HocComponent(Component) {
            class Component1 extends React.Component {
                ...
                render() {
                    return <Component ref={props.forwardRef} />
                }
            }
            return React.forwardRef ((props, ref) => {
                return <Component1 forwardRef= {ref} />
            })
        }
        ```
        传递方式为: 先通过 refs 转发将 HOC 组件标签上的 ref 传递给容器组件，然后容器组件通过 props 将 ref 传递给 源组件。

- [x] 严格模式 

    严格模式的意义：
    - 检查不安全的、过时的 api；
    - 帮助我们检查副作用： 严格模式下通过重复执行函数体、类组件生命周期方法等来帮我们检查代码是否有副作用(只适用于开发模式);



- [x] 受控组件&非受控组件 

    区别在于获取表单元素的值的方式。

    受控组件: 表单元素的值和 state 关联，通过 state 获取表单元素的值。

    非受控组件: 表单元素的值和 state 不关联，通过表单元素获取表单元素的值。非受控组件一般配合 ref 使用。


- [x] 懒加载

    React.lazy + React.Suspense


- [x] 组件强制更新的方式

    组件强制更新的方式:
    - 类组件主动调用 forceUpdate；
    - 使用的 context 的值发生了变化；
    - shouldComponentUpdate 返回 ture(多此一举)；
    - React.memo 返回 ture(多此一举)；

- [x] 既然有了类组件，为什么还要给函数组件提供 hook？

    使用类组件实现 HOC 比较麻烦。要写 constructor、生命周期方法等。

    类组件测试不方便？

    类组件还需要 babel-loader 转义？









#### react 原理

- [x] React 的理念 - 快速响应

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



- [x] React 架构

    React16(及后续版本)架构可以分为三层：

    - **Scheduler(调度器)**：根据任务的优先级调度任务，高优先级的任务优先进入 Reconciler；
  
    - **Reconciler(协调器)**：更新 fiber tree，找出变化的 fiber node，并收集 fiber node 变化导致的副作用(对应 react 更新的 render 阶段)；
  
    - **Renderer(渲染器)**：处理 Reconciler 工作过程中收集的副作用，更新 dom 节点并处理组件生命周期方法(对应 react 更新的 commit 阶段)；

- [ ] react 工作原理

    虚拟节点树的链表化，是得协调过程可以随时打断。


- [ ] legacy 模式和 concurrent 模式



- [ ] diff 算法




- [ ] 副作用处理


- [ ] 父组件更新的时候，子组件是否会更新

    父组件更新的时候，子组件默认会更新。

    原因是 props 发生了变化。

    可以使用 React.memo、shouldComponentUpdate 来判断子组件是否需要更新。



#### react-router 相关





#### react 状态管理相关






#### react 优化相关

- [ ] react 项目全链路优化



- [ ] 常用的优化手段

    类组件 - shouldComponentUpdate

    函数组件 - React.memo




#### 其他

- [ ] 为什么 react hooks 不能出现在 if 等逻辑块中?

























































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

#### concurrent 模式下 setTimeout 中的更新是批量的更新吗

#### react-router



#### react 渲染过程是否可以使用 增量渲染 ？？

增量渲染， 将浏览器渲染过程拆分 ？？

react 协调过程是否可以放在 web worker 中 ？？




