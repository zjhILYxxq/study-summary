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

- [x] **React 的理念 - 快速响应**

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



- [x] **React 架构**

    React16(及后续版本)架构可以分为三层：

    - **Scheduler(调度器)**：根据任务的优先级调度任务，高优先级的任务优先进入 Reconciler；
  
    - **Reconciler(协调器)**：更新 fiber tree，找出变化的 fiber node，并收集 fiber node 变化导致的副作用(对应 react 更新的 render 阶段)；
  
    - **Renderer(渲染器)**：处理 Reconciler 工作过程中收集的副作用，更新 dom 节点并处理组件生命周期方法(对应 react 更新的 commit 阶段)；


- [x] **react 工作过程**


    jsx -> react element -> fiber tree -> dom tree

    react 更新的工作过程:
    1. 调用 setState 方法，创建一个 update 对象收集到对应的 updateQueue 中，根据触发 setState 的上下文，定义 update 的优先级；
    2. 为更新创建一个调度任务，添加到 react 的 taskQueue 中；
    3. 依次遍历 taskQueue 中的任务，开始 react 协调；
    4. 开始协调时，要确定本次协调要处理的更新优先级(根据 lane 处理)；
    5. 从根节点开始遍历 fiber tree，不需要协调的 fiber node 直接跳过，需要协调的 fiber node，则执行对应组件的 render 方法；
    6. 将 fiber node 的子节点和 render 方法返回的 react element 做 diff 算法比较，确定子节点是否需要更新已经更新产生的副作用‘
    7. fiber tree 协调结束，进入 commit 阶段，处理协调 fiber tree 产生的副作用；
    8. 副作用处理完毕，浏览器开始渲染更新以后的 fiber tree；


    fiber tree 在协调过程中，随时可以打断，所以就有了可中断的 concurrent 模式。


- [x] **legacy 模式和 concurrent 模式**

    legacy 模式： fiber tree 的协调过程不可中断；

    concurrent 模式: fiber tree 的协调过程可以中断；react 任务处理时会分配一个 5ms 的时间片，时间片到期，react 就会让出主线程，然后在下一个时间片继续 fiber tree 的协调；

- [x] **concurrent 模式下的副作用**

    由于 concurrent 模式下，高优先级的更新可以中断低优先级更新，所以会发生低优先级更新下组件重复渲染的情况。

    此时，如果在类组件的 componentWillMount、componentWillUpdate、componentWillReceiveProps 等方法中有副作用的代码，那么就可能给最终的结果带来不可预测的问题。

    另外， concurrent 模式下，高优先级的 state 会重复计算，如果 state 的计算过程也存在副作用，那么也会有问题。

    副作用：
    - 组件重复协调引发的副作用；
    - update 重复处理引发的副作用；

- [x] **react 更新的的三层 loop**

    三层 loop:
    - 事件循环: eventLoop, 基于 messageChannel 宏任务去请求时间片；
    - react 任务调度: workLoop，遍历 taskQueue(基于最小堆实现，优先级最高的任务添加到堆顶), 处理堆顶任务；
    - fiber tree 协调调度: workInPropgressLoop，每一个 react 任务，都有一个 workInPropgressLoop 来处理 fiber tree 的协调。 fiber tree 每次协调时都是根节点开始，采用深度优先遍历，确定要更新的 fiber node 以及收集更新产生的副作用。

    fiber tree 协调结束以后就进入 commit 阶段，开始处理副作用。处理完毕以后，react 会立即开始处理下一个 task(时间片没有到期)。

- [x] 双缓存 fiber tree

    fiber tree 在做协调时，实际存在两颗 fiber tree： current fiber tree 和 workInProgress fiber tree。

    current fiber tree 对应当前的页面结构， wokrInProgress fiber tree 是协调过程中生成的 new fiber tree，协调结束以后 workInProgress fiber tree 会作为下一次更新的 current fiber tree。

    为什么要存在两颗 fiber tree?
  
    双缓存 fiber tree 最大的意义，就是为了支持 concurrent 模式下高优先级更新可以中断低优先级更新。
    
    当低优先级的更新的协调过程进行到一半时，先让出主线程；此时有高优先级的更新进来，就需要重置原来的 workInProgress fiber tree。

- [x] react 任务的优先级 

    根据触发 react 更新的上下文，可以确定对应的 react 任务的优先级。

    react 任务的优先级:
    - 直接优先级，优先级最高，对应 click、input、forcus、blur 等操作；
    - 用户阻塞优先级，对应 scroll、mousemove 等操作；
    - 普通优先级，对应 setTimeout、网络请求、useTransition 等；
    - 低优先级，对应 Suspense ？
    - 空闲优先级，对应 OffScreen，类似于 vue 的 keep-alive;

- [x] lane

    lane, 赛道的意思。

    react 在触发更新时，会创建一个 update 对象，然后根据触发更新的上下文为这个 update 分配一个 lane。根据分配的 lane，就可以确定对应的 react 调度任务的优先级。

    当开始处理 react 调度任务协调 fiber tree 时，还会确定本次协调要处理的 lane。然后根据 lane，处理满足条件的 update 对象。

    fiber tree 协调中断时，会使用全局变量记录本次协调的  lane 以及正在处理的 fiber node。当获取到时间片以后，要重新计算协调的 lane。如果此次的 lane 的优先级比上次高，那么就说明有高优先级的更新进来，此时需要重置 workInProgress fiber tree；如果此次的 lane 的优先级没有上次高，那么就继续上次中断的协调。

- [x] **diff 算法**

    在协调过程中，如果组件节点的 render 方法被触发，返回新的 react element，那么就需要将组件节点原来的子节点和 react element 做对比，判断原来的子节点哪些可以复用，哪些需要新增，哪些需要新增。

    diff 算法实际上就是按序遍历 currrent fiber node list 和 new react element list，比较 key 和 type，判断 current fiber node 可不可用：
    - current fiber node list vs react element
      
      匹配的复用，不匹配的卸载；

    - current fiber node list vs react element list

      先按序遍历 current fiber node list 和 react element list，匹配复用，不匹配卸载；(要考虑 current fiber node list、 react element list 遍历完的情况)；

      key 出现不匹配时，将剩余的 current fiber node 转化为一个 map，继续遍历 react element；

    复用的 fiber node，如果是组件节点，如果未做优化，那是需要重新执行 render 方法的；如果是 dom 节点，要记录是否需要更新属性。

    diff 算法比较难的一点，是判断节点发生了移动。需要比较匹配的 current fiber node 的 index 对比上一个没有发生移动的节点 index，如果小，说明发生了移动。

    由于子节点是单链表的存在，所以只能从头节点开始遍历，不能首尾遍历。


- [x] **Scheduler - 调度器**

    维护一个 taskQueue，调度 react 更新任务。

    taskQueue 是一个最小堆。

  
- [x] **Render - 渲染器** 

    渲染器工作内容就是 fiber tree 协调结束以后，处理副作用。

    处理副作用的过程:
    - dom 操作之前, 此时 dom tree 还没有更新；
    - dom 操作，更新 dom tree、卸载不需要的组件、更新 ref 等；
    - dom 操作之后， componentDidMount、componentDidUpdate、useLayoutEffect；
    - 浏览器渲染完成以后， useEffect；

    如何移动 dom 节点: 找到该节点之后不需要移动的 dom 节点。如果能找到，使用 insertBefore 移动 dom 节点；如果不能找到，使用 appendChild 移动 dom 节点。

- [x] **useTransition**

    useTransition 实现防抖节流：
    - 防抖：高优先级更新中断低优先级更新、可中断的协调；
    - 节流：任务有最大延迟时间；
    

- [x] 父组件更新的时候，子组件是否会更新

    父组件更新的时候，子组件默认会更新。

    原因是 props 发生了变化。

    可以使用 React.memo、shouldComponentUpdate 来判断子组件是否需要更新。

- [x] react 和 vue 技术栈的对比

    - 响应式更新原理不同

        vue 是典型的观察订阅模式， data 属性是 Subject， 维护一个 dep 列表。组件实例是 Observer。组件实例会根据计算属性、监听属性、render 方法创建一个 render watcher、多个 user warcher、多个 lazy watcher，并将这些 watcher 添加到对应的数据属性的 deps 类别中。当数据属性发生变化时，通知 deps 中的 watcher 去执行 run 方法来更新。

        react 是通过 setState 触发更新。

    - vnode tree 处理的过程不同

        vue 是从发生更新的节点开发， react 是从根节点开始。

    - vue 更新调度没有优先级的概念，而 react 有;



#### react-router 相关

- [x] **路由原理**

    hash 模式: onhashchange + 修改 hash;

    history 模式: popstate + pushState/replaceState

    pushState/replaceState 并不会触发 popstate 事件。我们可以重写 pushState、replaceState， 自定义一个 popState 事件，然后通过 window.dispatch 主动触发。

    history 模式需要服务端的支持，否则会返回 404。

- [x] **使用 react-router 如何实现路由拦截**

    整个应用级的路由拦截：重写 pushState、replace 方法，传入一个 callback， 根据 callback 的返回值做页面跳转；

    页面级的路由拦截: 最外层组件使用错误边界，子组件在 render 方法执行之前通过 componentWillUpdate、componentWillMount 方法识别当前路由，然后通过抛出异常的方式中断当前渲染，然后在父组件中根据错误信息重新跳转页面；





#### react 状态管理相关

- [ ] **redux**

    redux 的关键对象:
    - state - 全局数据；
    - store - 存储全局数据的地方，通过 store.getState() 获取数据；
    - action - 调用 diapatch 修改 state 传入的对象；
    - reducer - 纯函数，接受一个旧的 state 和 action， 返回一个新的 state；

    使用 redux 的三大原则:
    - 单一数据源， 一个 react 应用只有一个 store；
    - state 是只读的，只能通过 dispatch 修改 state；
    - reducer 是纯函数；



- [x] **redux 的使用过程**

    使用过程:
    - 通过 createStore 方法，传入一个 reducer，返回一个 store 对象；
    - 调用 store 的 dispatch 方法修改 state；

    通过 dispatch 方法修改 state 时，会把所有的 reducer 执行一遍。

    其他:
    - applyMiddleware ??
    - compose ??
    - combineReducers??

- [x] **redux 的使用原理**

    redux 需要配合 react-redux 使用。

    使用 react-redux 时，react-redux 会将包装我们的组件，生成一个 HOC。 HOC 的更新方法，会通过 store.subscribe 方法添加到 store 对象的 listeners 列表中。

    当我们通过 dispatch 方法修改 state 时，会遍历 store 的 listeners 列表，触发 HOC 组价的更新方法。

- [x] **mobx 的使用**

    mobx 定义一个 store， store 里面有 state，和可以更改 state 的 action。

    mobx-react 用于将 react 组件包装为一个 HOC， react 组件内部使用 store 的 state 时，会将 hoc 的更新方法收集到 state 的依赖列表中。

    当 state 发生变化时，依次触发依赖列表中 hoc 的更新方法。

#### react 优化相关

- [x] react 项目全链路优化

    - webpack 构建优化：优化打包速度、体积；
    - 路由优化，懒加载；
    - react 组件优化: 
      - React.memo、shouldComponentUpdate、PureComponent、组件的更新渲染不要引起不相关的组件的渲染；
      - useMemo、useCallback 重复计算等；
      - 增量渲染，防止由于节点太多，导致 fiber tree 协调、 浏览器渲染时间过长，可以采用 setTimeout 时间分片，也可以使用 requestAnimationFrame(浏览器渲染时间占大头)；
      - 虚拟列表；
    - 网络优化: CDN、浏览器缓存策略、preload、prefetch、子应用资源年预加载、图片压缩、文件压缩等；
    - 部署优化(k8s、rancher 优化 等);  
    - 其他： 数据缓存等；

    虚拟列表的关键:
    - 给虚拟列表容器定义一个初始高度, 内部使用一个很高的元素，使得容器有滚动条；
    - 添加一个列表容器，绝对定位， top 为 0；
    - 根据容器的高度，列表元素的高度，计算可渲染的数量，再加上一些缓存数量；
    - 给容器元素绑定 onScroll 事件；
    - 滚动，计算虚拟列表容器元素的 scrollTop，根据 scrollTop，计算当前的起始元素和终止元素，并设置列表容器的 top；





#### 其他

- [ ] 为什么 react hooks 不能出现在 if 等逻辑块中?
- [ ] vue 和 react 的对比？

























































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








