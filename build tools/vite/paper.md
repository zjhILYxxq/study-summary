---
theme: cyanosis
---

<h3>前言</h3>

在上一篇 **[为什么有人说 vite 快，有人却说 vite 慢？](https://juejin.cn/post/7129041114174062628)** 中，我们提到过开发模式下使用 `Vite` 会有首屏性能下降的负面效果。之所以会造成首屏性能下降，一方面是 `dev server` 需要完成预构建才可以响应首屏请求；另一方面是需要对请求文件做实时转换。

也许有的同学会问，是不是针对这两个方面做优化，就可以提升首屏性能呢？原则上这样是没有问题的，而且 `Vite` 也是这么做的。为了能提升性能，`Vite` 另辟蹊径的借助了 `Esbuild` 能快速完成项目打包、文件转换的能力来进行预构建、内容转换，效果非常好。

今天小编就通过本文和大家一起聊一聊 `Vite` 是怎样利用 `Esbuild` 来提升性能的。

本文的目录结构如下:

- **<a href="1">初探 Esbuid</a>**
    - **<a href="1-1">什么是 Esbuild </a>**
    
    - **<a href="1-2">关键 API - transform & build</a>**
   
    - **<a href="1-3">plugin</a>**

- **<a href="2">Esbuild 在 Vite 中的巧妙使用</a>**
    
    - **<a href="2-1">预构建</a>** 
   
    - **<a href="2-2">middlewares 中内容转换</a>**

- **<a>结束语</a>**

<h3>初探 Esbuild</h3>

首先，小编先带大家简单了解一下 `Esbuild`，其官方地址是: **[Esbuild](https://esbuild.github.io/)**。

<h4>什么是 Esbuild </h4>

`Esbuild` 是一款基于 `Go` 语言开发的 `javascript` 打包工具，最大的一个特征就是快。

通过官网提供的一张图，我们可以清晰的看到 `Esbuild` 的表现是多么优秀:

同样规模的项目，使用 `Esbuild` 可以将打包速度提升 `10` - `100` 倍，这对广大一直饱受 `Webpack` 缓慢打包速度折磨的开发人员来说，简直就是福音。 

而 `Esbuild` 之所以能这么快，主要原因有两个:

- `Go` 语言开发，可以多线程打包，代码直接编译成机器码；

    `Webpack` 一直被人诟病构建速度慢，主要原因是在打包构建过程中，存在大量的 `resolve`、`load`、`transform`、`parse` 操作(详见 **[为什么有人说 vite 快，有人却说 vite 慢？- 快速的冷启动](https://juejin.cn/post/7129041114174062628#1-1)** )，而这些操作通常是通过 `javascript` 代码来执行的。要知道，`javascript` 并不是什么高效的语言，在执行过程中要先编译后执行，还是单线程并且不能利用多核 `cpu` 优势，和 `Go` 语言相比，效率很低。

- 可充分利用多核 `cpu` 优势；


<h4>关键 API - transfrom & build</h4>

`Esbuild` 并不复杂。它对外提供了两个 `API` - `transform` 和 `build`，使用起来非常简单。

`transfrom`，转换的意思。通过这个 api，我们可以将 `ts`、`jsx`、`tsx` 等格式的内容转化为 `js`。 `transfrom` 只负责文件内容转换，并不会生成一个新的文件。

`build`，构建的意思，根据指定的单个或者多个入口，分析依赖，并使用 `loader` 将不同格式的内容转化为 js 内容，生成一个或多个 `bundle` 文件。 

这两个 `API` 的使用方式:

```
const res = await esbuild.transform(code, options) // 将 code 转换为指定格式的内容

esbuild.build(options) // 打包构建
```

关于使用 `transform`、`build` 需要传入的具体配置项，本文就不详细说明了，官网对这一块儿有很详细的说明，感兴趣的同学可以去官网 - **[simple-options](https://esbuild.github.io/api/#simple-options)**、**[Advanced options](https://esbuild.github.io/api/#advanced-options)** 看看，也自己动手试试。


<h4>plugin</h4>

和 `Webpack`、`Rollup` 等构建工具一样，`Esbuild` 也提供了供外部使用的 `plugin`，使得我们可以介入构建打包过程。

> 在这里要说明一点，只有 `build` 这个 `API` 的入参中可以配置 `plugin`，`transform` 不可以。

一个标准的 `plugin` 的标准格式如下:

```
let customerPlugin = {
    name: 'xxx',
    setup: (build) => {
        build.onResolve({ filter: '', namespace: '' }, args => { ...});
        build.onLoad({ filter: '', namespace: ''}, args => { ... });
        build.onStart(() => { ... });
        build.onEnd((result) => { ... });
    }
}
```

其中，`setup` 可以帮助我们在 `build` 的各个过程中注册 `hook`。

`Esbuild` 对外提供的 `hook` 比较简单，总共 `4` 个:

- `onResolve`, 解析 `url` 时触发，可自定义 `url` 如何解析。如果 `callback` 有返回 `path`，后面的同类型 `callback` 将不会执行。所有的 `onResolve` `callback` 将按照对应的 `plugin` 注册的顺序执行。

- `onLoad`, 加载模块时触发，可自定义模块如何加载。 如果 `callback` 有返回 `contents`，后面的同类型 `callback` 将不会执行。所有的 `onLoad` `callback` 将按照对应的 `plugin` 注册的顺序执行。

- `onStart`, 每次 `build` 开始时都会触发，没有入参，因此不具有改变 `build` 的能力。多个 `plugin` 的 `onStart` 并行执行。

- `onEnd`, 每次 `build` 结束时会触发，入参为 `build` 的结果，可对 `result` 做修改。所有的的 `onEnd` 将按照对应的 `plugin` 注册的顺序执行。

正是有了 `onResolve`、`onLoad`、`onStart`、`onEnd`，我们可以在 `build` 过程中的解析 `url`、加载模块内容、构建开始、构建结束阶段介入，做自定义操作。

<h3>Esbuild 在 Vite 中的巧妙使用</h3>

了解了 `Esbuild` 的基本用法以后，小编就带大家一起来看看 `Vite` 是怎么利用 `Esbuild` 来做预构建和内容转换的。

<h4>预构建</h4>

先来回顾一下为什么要做预构建。

原因有两点:

- 将非 `ESM` 规范的代码转换为符合 `ESM` 规范的代码；

- 将第三方依赖内部的多个文件合并为一个，减少 `http` 请求数量；

要完成预构建，最关键的两点是找到项目中所有的第三份依赖和对第三方依赖做合并、转换。借助 Esbuild，Vite 很轻松的实现了这两个诉求。

- **寻找第三方依赖**

    寻找第三方依赖的过程非常简单，分为两步:

    1. 定义一个带 `onResolve hook` 和 `onLoad hook` 的 `esbuild plugin`；
   
    2. 执行 `esbuild` 的 `build` 方法做打包构建；

    和 Webpack、Rollup、Parcel 等构建工具一样，Esbuild 在做打包构建时也要构建模块依赖图 - module graph(具体过程可参考 **[为什么有人说 vite 快，有人却说 vite 慢？- 快速的冷启动](https://juejin.cn/post/7129041114174062628#1-1)** 中 Webpack 构建 module graph)。
    
    在构建 module graph 时，第一步就是解析模块的绝对路径，这个时候就会触发 onResolve hook。在 onResolve hook 触发时，会传入模块的路径。根据模块的路径，我们就可以判断出这个模块是第三方依赖还是业务代码。

    举个 🌰，

    ```
    // main.tsx

    import react from 'react';
    import CustomeComponent from './components/CustomeComponent';
    ...
    ```

    在对 main.tsx 的内容做 parser 操作时，能知道 main.tsx 依赖 react 和 CustomeComponent，然后开始解析 react 和 CustomeComponent。

    解析 react、CustomeComponent 时，会触发 onResolve hook，入参分别为 'react' 和 './components/CustomeComponent'。根据入参，我们可以很清楚的区分 'react' 是第三方依赖，'./components/CustomeComponet' 是业务代码。

    这样，esbuild 完成构建，项目中的第三方依赖也就收集完毕了。所有的第三方依赖会收集到一个 deps 列表中。
    

- **合并、转换第三方依赖**

    知道了项目中的第三方依赖以后，再做合并、转换操作就非常简单了。

    这一步， Vite 直接通过 esbuild 提供的 build 方法，指定 entryPoints 为收集到的第三方依赖，format 为 esm，再做一次打包构建。
    
    这一次，会对第三方依赖做合并、转换操作。打包构建完成以后，再把构建内容输出到 /node_modules/.vite/deps 下。


这样，通过两次 `esbuild.build`，预构建就完成了。

<h4>middlewares 中内容转换</h4>

Vite 中源文件的转换是在 dev server 启动以后通过 middlewares 实现的。

当浏览器发起请求以后，dev sever 会通过相应的 middlewares 对请求做处理，然后将处理以后的内容返回给浏览器。

middlewares 对源文件的处理，分为 resolve、load、transform、parser 四个过程：
1. resolve - 解析 url，找到源文件的绝对路径；
2. load - 加载源文件。如果是第三方依赖，直接将预构建内容返回给浏览器；如果是业务代码，继续 transform、parser。
3. transfrom - 对源文件内容做转换，即 ts -> js, less -> css 等。转换完成的内容可以直接返回给浏览器了。
4. parser - 对转换以后的内容做分析，找到依赖模块，对依赖模块做预转换 - pre transform 操作，即重复 1 - 4。

    pre transform 算是 Vite 做的优化点。预转换的内容会先做缓存，等浏览器发起请求以后，如果已经完成转换，直接将缓存的内容返回给浏览器。

Vite 在处理步骤 3 时，是通过 esbuild.transform 实现的，对比 Webpack 使用各个 loader 处理源文件，那是非常简单、快捷的。

<h3>结束语</h3>

有一说一，Vite 通过 Esbuild 来优化预构建和内容转换的思路非常棒，这也给我们以后处理同类问题提供了解决方案，真心给尤大点 👍🏻。

除了使用 Esbuild， Vite 内部还有很多可以拿出来单独讲的优化技巧，这个以后有机会小编可以再给大家详细说明。

最后说一句，如果本文对大家有帮助，那就给小编点个 👍🏻 吧。大家的支持，是小编前进的动力，😄。

