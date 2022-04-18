#### 微前端相关
- [x] 微前端介绍(简介、优势、挑战、常用技术方案)；
- [x] 微前端常用的技术方案及对比(切换子应用时的用户体验；)
- [x] 使用 single-spa 是子应用的改造；
- [x] single-spa 的工作过程；
- [x] single-spa： application 模式和 parcel 模式；
- [x] application 模式下子应用切换的原理；
- [x] single-spa 如何实现子应用通信；
- [x] single-spa 的缺点；
- [x] qiankun 是如何优化 single-spa 的；
- [x] qiankun 的工作过程 - html entry；
- [x] qiankun 是如何实现 js 隔离的；
- [x] qiankun 是如何实现 css 隔离的；
- [x] qiankun 是如何实现子应用通信的？
- [x] qiankun 是如何处理副作用的？
- [x] qiankun 存在的问题
- [ ] qiankun 是如何处理 styled-component 样式的？
- [x] 使用 Web Component 实现微前端？
- [x] SaaS 如何落地微前端；
- [x] SaaS 主应用为什么采用 SSR 的技术方案？
- [x] SaaS 子应用如何使用 SSR；
- [x] SaaS 整个工作过程
- [x] lego 是怎么工作的
- [x] SaaS 首屏性能优化

#### 首屏性能优化
- [x] performance 关键 api；
- [x] 首屏性能指标；
- [x] 首屏性能指标如何计算；
- [x] 首屏性能指标如何优化；


#### react 相关
- [ ] MVVM 框架
- [x] react hook - 常用 api、对 hooks 的理解；
- [x] 逻辑复用
- [x] 自定义 hook(注意要 use 开头)；
- [x] 类组件生命周期方法
- [x] 类组件不安全的生命周期方法
- [x] csr & ssr
- [x] context 的用法、原理；
- [x] refs
- [x] 父组件使用子组件 dom 节点的方式；
- [x] 高阶组件 hoc ？
- [x] 严格模式
- [x] 受控组件 & 非受控组件
- [x] 懒加载
- [x] 组件强制更新的方式
- [x] 有了类组件，为什么还要函数组件？
- [x] react 的架构
- [x] react 更新的工作过程
- [x] legacy 模式和 concurrent 模式
- [x] concurrent 模式下的副作用
- [x] react 更新的三层 loop
- [x] 双缓存 fiber tree 以及存在的意义
- [x] react 任务的优先级
- [x] lane
- [x] diff 算法
- [x] diff 算法如何判断节点是否发生了移动
- [x] effect 收集和处理顺序
- [x] 调度器
- [x] 渲染器
- [x] 如何移动 dom 节点
- [x] useTransition
- [x] 父组件更新，子组件是否会更新？
- [x] react 和 vue 技术栈的对比
- [x] 路由原理
- [x] 使用 react-router 如何实现路由拦截？
- [x] redux
- [x] redux 的使用原理
- [x] mobx 的使用原理
- [x] react 全链路优化 ！！！
- [x] 虚拟列表 !!



#### webpack 相关
- [ ] 环境变量注入？？
- [x] webpack 常用配置项
- [x] webpack 工作过程
- [x] 模块依赖图
- [x] chunk 类型以及分离过程
- [x] bundle 构建
- [x] module hash、chunk hash、content hash、compilation hash；
- [x] 热更新
- [x] source-map
- [x] 打包构建分析
- [x] 打包构建优化
- [x] tree shaking
- [x] module federation 配置
- [x] module federation 工作原理
- [x] webpack hooks
- [x] loader 工作原理
- [x] 编写 webpack 插件；
- [x] babel-loader;
- [x] babel(ast) 可以做的事情 - 代码压缩混淆、代码检查、自动埋点、国际化、api 文档自动生成 等；
- [x] babel runtime 

#### next.js 相关
- [x] CSR、SSR、SSG、ISG;
- [x] SSR 涉及的代码同构、数据同构、路由同构；
- [x] next.js 工作原理
- [x] next.js 的 build 阶段
- [x] ISG 的工作原理
- [x] 数据获取；
- [x] getStaticProps
- [x] getStaticPaths
- [x] getServerSideProps
- [x] getStaticProps 和 getServerSideProps 的区别；
- [x] 动态路由及工作过程
- [x] 动态路由配合数据获取方法使用
- [x] 数据获取方法得到的数据浏览器端怎么获取
- [x] next/link及预提取功能
- [x] 浅层路由
- [x] 客户端如何找到路由对应的静态资源文件
- [x] 几个关键的 manifest.json 文件
- [x] next/router
- [x] 中间件 
- [x] SE0 ？？
- [x] 常用的 SEO 措施 ？？
- [x] Core Web Vitals ？？
- [x] 测量网页内容加载速度的指标 ？？
- [x] px2vw-view-loader
- [x] 样式处理

#### lerna 相关
- [x] lerna 常用命令
- [x] lerna boostrap
- [x] lerna version
- [x] lerna publish
- [x] 固定模式/独立模式
- [x] npm 包生成可执行文件


#### ts 相关
- [x] 基础类型
- [x] any、unknow、never 类型
- [x] 元祖类型
- [x] interface(可选、只读、任意属性、继承)
- [x] 函数重载(多个连续函数定义实现函数重载)
- [x] 联合类型 & 交叉类型
- [x] 类型保护
- [x] 可辨识联合类型 ？？
- [x] type 及 type 和 interface 的区别
- [x] 字面量类型
- [x] 泛型 & 泛型约束
- [x] extends 关键字
- [x] 泛型分发
- [x] 阻止泛型分发 - 元祖类型
- [x] infer 类型推断
- [x] 索引类型: 索引查询、索引访问、索引遍历
- [x] 内置工具类型: 
    - Partial
    - Readonly
    - Pick
    - Record
    - Exclude(泛型分发)
    - Extract(泛型分发)
    - Omit
    - Paramters
    - ReturnType


#### 业务相关
- [x] aicc 核心业务
    - 外呼、呼入逻辑；
    - 检测通讯情况(延时、抖动、丢包)
    - aicc 外呼异常排查机制；
    - 设备检测功能(浏览器、麦克风、网络检测、网速检测、检测麦克风、耳机可用)；
    - 坐席状态同步；
    - 坐席听到远程的声音(拿到 peerConnection 的 remoteStream 流，赋值给 audio)
- [x] ssr 微信认证流程；
- [x] ssr 项目的 head 配置、打包配置、px2vw、样式处理、项目启动；
- [x] 修改 antd 样式前缀(通过 less-loader 修改)




#### 基础知识
- [ ] CROS 跨域
- [x] 盒模型、标准盒模型、IE 盒模型；
- [x] BFC
- [x] 浮动元素的影响及消除
- [x] css 选择器
- [x] css 布局
- [x] 移动布局: rem 布局、vw布局
- [x] css 居中
- [x] css 优化：压缩、继承、雪碧图等；
- [x] 样式表放在底部 - 白屏
- [x] 浏览器打开一个页面，进程数；
- [x] 从 url 到页面 - 注意要先看本地缓存
- [x] 渲染进程工作过程
- [x] 重排、重绘 、合成
- [x] 事件循环 - eventLoop
- [x] 宏任务 & 微任务
- [x] requestAnimationFrame
- [x] 作用域 & 作用域链
- [x] 闭包的表现形式、原因
- [x] 数组常用方法以及改变数组本身的方法
- [x] slice 和 splice 的区别
- [x] call、apply、bind
- [x] js 数据类型
- [x] 垃圾回收 ？？
- [x] TCP 可靠传输的原理
- [x] 三次握手、四次挥手
- [x] 异步 js - async 和 defer
- [x] DOMContentLoaded 和 load
- [x] DOM 和 CSSDOM
- [x] 解析白屏及优化措施
- [x] 优化页面
- [x] xss、csrf 及如何防御
- [x] https 加密
- [x] web woker
- [x] 本地缓存
- [x] 浏览器缓存机制
- [x] DOM2.0
- [x] es6 module 和 commonjs
- [x] 普通函数和箭头函数
- [x] 判断数据类型
- [x] 数组方法
- [x] 跨域
- [x] 终止一个 ajax 请求
- [x] toB 和 toC
- [x] iframe 的缺点
- [x] 普通函数和箭头函数的区别
- [x] 继承

#### 算法
- [x] 排序算法 - 堆排序、快速排序、冒泡排序；
- [ ] 动态回归 - 零钱兑换、股票、打家劫舍、爬楼梯、
- [x] dfs、bfs - 岛屿问题
- [x] 滑动窗口 - 子串问题
- [x] 抢红包
- [x] 链表问题
- [x] n 数之和问题 - 左右指针
- [x] 防抖 - 
- [x] 节流 - 连续操作，只处理一次
- [x] 图片懒加载
- [x] 数组拍平

#### 其他
- [x] 自动化构建
- [x] docker
- [x] 版本管理
- [x] 灰度控制、小流量
- [ ] toB 和 toC
