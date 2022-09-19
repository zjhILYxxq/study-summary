---
theme: cyanosis
---

本文为稀土掘金技术社区首发签约文章，14天内禁止转载，14天后未获授权禁止转载，侵权必究！

<h3>前言</h3>

在上一篇文章 [如何快速成为一名熟练的 Webpack 配置工程师 - 上篇](https://juejin.cn/post/7144934998884220958) 中 ，小编完成了对 `entry`、`resolve`、`module`、`optimization`、`output` 这 `5` 个配置项的梳理。这 `5` 个配置项，基本上对应了 `Webpack` 构建打包过程的各个关键阶段。只要配置好这 `5` 个配置项，就可以用 `Webpack` 顺利完成打包构建工作。

本文，小编会继续对剩下的配置项进行梳理，其中着重介绍 `plugins`。

本文的目录结构如下:

- **<a href="#1">Webpack 配置项详解</a>**
  - **<a href="#1-1">plugins</a>**
- 
  - **<a href="#1-2">cache</a>**
  - **<a href="#1-3">externals</a>**
  - **<a href="#1-4">mode</a>**
  - **<a href="#1-5">devtool</a>**
  - **<a href="#1-6">devServer</a>**
  - **<a href="#1-7">其他配置项</a>**
- **<a href="#2">结束语</a>**



<h3 id="1">Webpack 配置项详解</h3>

本章节，小编会继续给大家梳理剩下的几个配置项: `plugins`、`cache`、`external`、`mode`、`devtool`、`devserver` 等。

这些配置项都属于功能性配置，可以帮助我们更好的使用 `Webpack` 完成打包构建工作。

<h4 id="1-1">plugins</h4>

可以这么说，配置 `entry`、`resolve`、`module`、`optimization`、`output`，只是可以让我们用 `Webpack` 顺利完成打包构建工作。整个过程对我们来说是一个黑盒。如果我们想介入打包过程，做一些自定义操作，那么就要用到 `plugins` 这个配置项了。

`plugins`，给我们提供了介入 `Webpack` 打包构建的机会。

`Webpack` 在整个打包构建过程，一共提供了 `130+` 的 `hooks`。这些 `hooks` 可以分为 `Compiler`、`Compilation`、`ContextModuleFactory`、`JavascriptParser`、`NormalModuleFactory` 五大类。这五大类 `hooks` 基本上涵盖打包构建过程的各个生命周期,通过这些 `hooks`，我们可以在期望的某个阶段做一些自定义操作。

在这里，小编要对这五类的 `hooks` 稍微介绍一下，让大家对这几类 `hooks` 有个认识。

`Webpack` 在做实际打包构建时，内部会先创建一个编译器 `compiler` 实例。`compiler` 在 `Webpack` 打包过程中负责做配置项初始化、打包构建准备、将 `bundles` 输出到 `output` 指定位置等工作。对应的， `Webpack` 提供了 `Compiler` 类型的 `hooks`，如 `initialize`、`beforeRun`、`run`、`beforeCompile`、`compile`、`shouldEmit`、`emit` 等，通过这些 `hooks`，我们可以介入 `Webpack` 初始化配置项、输出 `bundles` 等阶段。

真正负责构建模块依赖图、分离模块依赖图、构建 `bundle` 内容工作的是 `compiler` 构建的一个实例对象：编译过程 - `compilation`。我们可以通过开发模式来更好的理解这两个实例的区别。开发模式下，每次修改源文件，`Webpack` 都会重新做打包构建。在这整个过程中，`Webpack` 只会构建一个 `compiler`，做一次配置项初始化工作，每次打包构建时，都会创建一个新的 `compilation` 来做模块依赖图构建、分离、`bundle` 内容构建。 对应的，`Webpack` 提供了 `Compilation` 类型的 `hooks`，让我们来介入模块依赖图的构建、分离等阶段，如 `buildModule`、`finishModules`、`seal`、`optimize`、`recordHash` 等。

`compilation` 在做模块依赖图构建的时候，会根据源文件创建一个 `module` 对象，并借助 `AST` 来解析 `module` 的依赖关系。对应的，`Webpack` 也提供了 `ContextModuleFactory` / `NormalModuleFactory` 和 `JavascriptParser` 类型的 `hooks`，让我们来介入 `module` 构建和依赖解析的过程。

`plugin` 的工作原理非常简单，可以直接用`订阅/发布`设计模式来理解。通过 `Webpack` 提供的 `tap`、`tapAsync`、`tapPromise` 这几个 `api`，我们可以给需要的 `hook` 注册 `callback`，然后等 `Webpack` 运行到我们选择的阶段时，就会触发 `callback`。

举个 🌰:

```
    class CustomePlugin {
        constructor(option) {
            ...
        }

        apply(compiler) {
            compiler.hooks.initialize.tap('CustomePlugin', (compiler) => {
                ...
            });
        }
    }
```

在这个 🌰 中，我们订阅了 `initiallize hook`。当 `compiler` 对象构建并完成初始化以后，就会触发 `initiallize hook` 注册的 `callback`。

定义一个自己需要的 `plugin`，还是蛮简单的。只要像上面 🌰 一样，定义一个 `plugin class`，在 `class` 中定义一个 `apply` 方法，然后在 `apply` 方法中订阅想要的 `hook` 就可以了。

不过这里面有一些门道是我们需要注意的: 

- 首先，`Webpack` 提供的 `hook` 分为 `Compiler`、`Compilation`、`ContextModuleFactory`、`JavascriptParser`、`NormalModuleFactory` 五大类。不同类型的 `hooks`，可订阅的时机不同。

    `Compiler` 类型的 `hooks`，需要在 `compiler` 对象创建完成以后才可订阅。 `compiler` 创建好以后，`Webpack` 会依次执行 `plugin` 配置项中各个插件实例的 `apply` 方法，订阅 `Compiler` 类型的 `hooks`。

    `Compilation` 类型的 `hook`，需要在 `compilation` 对象构建完成以后才可以订阅。要订阅 `Compilation` 类型的 `hooks`，我们需要先订阅 `compiler` 的 `compilation hook`， 等 `compilation` 创建以后，会触发 `compiler` 的 `compilation hook` 的 `callback`，`compilation` 对象会做为 `callback` 的入参，在 `callback` 中我们就可以订阅 `Compilation` 类型的 `hooks`。

    同理，`ContextModuleFactory / NormalModuleFactory` 类型的 `hook`，需要在 `contextModuleFactory / normalModuleFactory` 对象构建完成以后才可以订阅。要订阅 `ContextModuleFactory / NormalModuleFactory` 类型的 `hook`, 我们需要先订阅 `compiler` 的 `contextModuleFactory / normalModuleFactory hook`， 等 `contextModuleFactory / NormalModuleFactory` 对象创建以后，会触发 `compiler` 的 `contextModuleFactory / NormalModuleFactory hook`,`contextModuleFactory / normalModuleFactory` 对象会做为 `callback` 的入参，在 `callback` 中我们就可以订阅 `ContextModuleFactory / NormalModuleFactory`  类型的 `hooks`。

    `JavascriptParser` 类型的 `hooks`，需要 `parser` 对象构建完成以后才可以订阅。要订阅该类型的 `hooks`，我们需要先订阅 `compiler` 的 `normalModuleFactory` 的 `hook`， 在 `normalModuleFactory hook` 的 `callback` 中，订阅 `normalModuleFactory` 对象的 `parser hook`，在 `parser hook` 的 `callback` 中，才可以订阅 `JavascriptParser` 类型的 `hooks`。

    说实话，这一块的逻辑还是蛮复杂的，大家在实际项目中自己写 plugin 时，一定要找准 hook 的订阅时机。

- 其次，`Webpack` 提供的 `hook` 可以分为 `sync hook` 和 `async hook` 中两大类。这两大类 `hook`，又可具体细分为 `SyncHook`、`SyncBailHook`、`SyncWaterfallHook`, `SyncLoopHook` , `AsyncParallelHook`, `AsyncParallelBailHook`, `AsyncSeriesHook`, `AsyncSeriesBailHook`, `AsyncSeriesWaterfallHook` 这 9 小类。不同类型的 `hook`，订阅方式也不相同。

    要区分一个 `hook` 是 `sync` 还是 `async`，关键要看这个 `hook` 的 `callback` 的内部是不是可以出现异步代码，如 `xhr`、`setTimeout`、`Promise` 等。如果可以出现异步代码，那就是 `async hook`，否则就是 `sync hook`。

    在解释为什么 `Webpack` 要提供 `sync` 和 `async` 两种类型的 `hook`之前，我们要先了解一点前置知识。
    
    `Webpack` 在打包构建过程中，如果完成了某个阶段，就会依次执行该阶段 `hook` 对应的 `callback`。`callback` 执行的顺序，和订阅时的顺序保持一致，即哪个 `plugin` 先订阅，对应的 `callback` 先执行。等所有的 `callback` 处理完毕，才会进入下一个阶段。

    如果 `callback` 内部全部是同步代码，刚刚提到的完全没有问题，`Webpack` 会依次处理完所有 `callback`，然后顺利进入下一个阶段。这种情况下，我们可以直接使用 `sync hook`，通过 `tap` 这种方式订阅。
    
    举个 🌰:

    ```
    // initialize 是 sync hook， 直接使用 tap 订阅
    compiler.hooks.initialize.tap('CustomePlugin', (compiler) => {
        ...
    });

    ```
    如果 `callback` 中有异步代码，如果不做特殊处理，那么 `callback` 就有可能不会正确处理，甚至会出现 `Webpack` 构建过程进入下一个阶段的情况。这时，我们就要使用 `async hook` 来处理这种情况了。

    常见的异步代码，可以分为 `promise` 类型和非 `promise` 类型，对应的 `async hook` 也提供了 `tapPromise` 和 `tapAsync` 这两种方式订阅。

    再举个 🌰:

    ```
    compiler.hooks.run.tapAsync('CustomePlugin', (compiler, callback) => {
        setTimeout(() => {
            ...
            callback();
        });
    });

    compiler.hooks.run.tapPromise('CustomePlugin', (compiler) => {
        return Promise.resolve(1).then((res) => {
            ...
        });
    });
    ``` 

    要注意哦，通过 `tapAsync` 订阅 `async hook` 时，回调函数的最后一个入参，必须时 `callback`，而且 `callback` 必须在异步代码执行完毕以后调用； 使用 `tapPromise` 时，必须要返回一个已经注册 `onFullfilled` 的 `promise` 对象。只有这样才能保证回调函数按序执行，`Webpack` 可以顺利进入下一个阶段。

    了解完 `sync `和 `async` 这两大类 `hook` 之后，我们再来了解一下细分的 `9` 小类 `hook`。

    这 `9` 种类型，是基于订阅同一种 `hook` 的 `callback` 的不同处理方式来划分的，具体如下:
    - `series`, 顺序，所有 `callback` 按订阅 `hook` 的顺序按序执行。`sync` 对应的是 `SyncHook`，`async` 对应的是 `AsyncSeriesHook`。如果是 `AsyncSeriesHook`，会在上一个 `callback` 的异步代码执行完毕以后，才会处理下一个 `callback`。
    - `bail`, 熔断，如果某一个 `callback` 有返回非 `undefined` 的值，那么后面的所有 `callback` 都不处理。`sync` 对应 `SyncBailHook`, `async` 对应 `AsyncSeriesBailHook`、`AsyncParallelBailHook`。
    - `waterfall`, 瀑布，上一个 `callback` 的返回值会作为下一个 `callback` 的入参。 `sync` 对应 `SyncWaterfallHook`, `async` 对应 `AsyncSeriesWaterfallHook`。
    - `parallel`, 并行，只有在 `async hook` 中使用，`AsyncParallelHook`。`callback` 可并行执行，即不用等上一个 `callback` 的异步代码执行，就可以开始处理下一个 `callback`。
    - `noop`，逐次循环处理 `callback`，直到所有的 `callback` 返回 `undefined`，只有在 `sync hook` 中使用，`SyncLoopHook`。

有了这两点说明，相信大家对如何写一个合适的自定义 `plugin`，有初步的认识了吧。


<h4 id="1-2">cache</h4>

`cache`，配置 `Webpack` 将打包构建过程中生成的 `module`、`chunk` 缓存起来, 供二次构建使用。

使用 `cache`，可以有效提升二次构建的速度。

<h4 id="1-3">externals</h4>

`externals`，配置 `Webpack` 选择不参与打包构建的资源，可有效提升打包构建速度和减小 `bundle` 体积。

通常，如果应用程序中引入了第三方依赖，`webpack` 会自动把第三方依赖也打包到 `bundle` 中。在运行 `bundle` 代码时，会先运行第三方依赖代码，拿到第三方依赖的 `exports`，然后使进行下一步操作。

如果使用了 `externals` 配置项指定不参与编译打包的第三方依赖，那我们在运行打包以后的 `bundle` 代码时，由于 `bundle` 并没有第三方依赖代码，直接使用第三方依赖的 `export` 是会报错的。此时我们必须先加载好第三方依赖代码。

使用 `externals` 配置项时， 会受到 `output.libraryTarget` 配置项的影响。

举个 🌰，如果 `output.libraryTarget` 的值为 `'var'`, 应用程序会通过一个变量来获取第三方依赖的输出结果，此时当前上下文环境 - `window` 中必须存在已定义变量。

对应的打包代码如下:

```
// main.js
(function(modules){
    ...
        
    return __webpack_require__(__webpack_require__.s = "./src/main.js");
        
}({
    'main': {
        ...
        var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("react")
        ...
    },
    'react': (function(module, exports) {
        module.exports = React;   // React 变量在使用 main.js 前，必须已经存在 window 中
    })
}))
```


<h4 id="1-4">mode</h4>

`mode`, 配置 `Webpack` 的工作模式。

`Webpack` 的工作模式有两种：`development` 和 `production`。各种模式都有各自的默认配置项。

比如:
- `devTool`，`production` 模式下默认为 `false`，不生成 `.map` 文件；`development` 模式下为 `eval`，使用 `eval` 包裹代码块。
- `optimization.minimize`，`production` 模式下默认为 `true`，`bundle` 文件会被压缩；`development` 模式下默认为 `false`，不压缩 `bundle` 文件。
- `optimization.moduleIds`, `production` 模式下默认为 `natural`，`module id` 为数字；`development` 模式下默认为 `named`，`module id` 为源文件 `url`。
- `optimization.chunkIds`, `production` 模式下默认为 `natural`，`chunk id` 为数字；`development` 模式下默认为 `named`，`chunk id` 中会包含 `module` 的文件名。

`mode` 是 `webpack4` 新出现的配置项，减少了开发人员人员的心智负担。

<h4 id="1-5">devtool</h4>

`devtool`, 配置 `Webpack` 在是否在打包过程中生成 `.map` 文件和生成什么样的 `.map` 文件。`.map` 文件不仅可以在本地开发时帮助我们调试源文件代码，还可以在线上环境出现问题时帮助我们快速定位问题出现在源文件的哪个位置，非常有用。


`devtool` 的配置项，多达 `27` 种，看着难以记忆，但找到了窍门以后就非常简单了。

`devtool` 的各个配置项，其实是由 `source-map`、`cheat`、`module`、`inline`、`hidden`、`eval`、`nosource` 这 7 个关键字组合生成的。

这几个关键字各自的含义如下：

- `source-map`, 只有 `devtool` 中包含 `source-map` 关键字，才会生成 `.map` 文件;
- `cheap`, 需要配合 `source-map` 一起使用，`.map` 文件中只包含行映射关系，没有列映射关系，常用于减小 `.map` 文件的体积；
- `module`, 需要配合 `source-map`、`cheap` 一起使用，可以将 `bundle` 代码映射到源文件代码，即 loader 处理前的代码；
- `inline`, 需要配合 `source-map` 一起使用，不单独生成 `.map` 文件，`.map` 文件作为 `DataUrl` 嵌入 `bundle` 中；
- `hidden`, 需要配合 `source-map` 一起使用, 会生成 `.map` 文件，但不会在 `bundle` 文件中添加 `.map` 文件的引用注释；
- `nosources`, 需要配合 `source-map` 一起使用, 会生成 `.map` 文件，但是 `sourcesContent` 的内容为空，可以帮忙定位到代码对应的原始位置，但无法映射到源代码;
- `eval`，使用 `eval()` 包裹模块代码，配合 `source-map` 一起使用时，`source-map` 文件会内联到 `bundle` 中；

这些关键字的组合规则如下:

```
[inline-|hidden-|eval-][nosource-][cheap-[module-]]source-map
```
通过上面的组合规则，我们可以将上面 7 个关键字根据实际需要自由组合成需要的配置项。

如：
- `cheap-module-source-map`，生成只有行映射、没有列映射的 `.map` 文件，调试时 `bundle` 代码可以映射到源文件;

- `source-map`, 生成包含行映射、列映射的 `.map` 文件，调试时 `bundle` 代码会映射到转换之前的代码;

- `cheap-source-map`,  生成只有行映射、没有列映射的 `.map` 文件，调试时 `bundle` 代码会映射到转换之前的代码;

- `eval-nosources-cheap-source-map`, 以 `eval` 包裹模块代码 ，且 `.map` 映射文件中不带源码,也不带列映射;

- ...

开发模式下，常用的配置项为 `cheap-module-source-map`、 `cheap-module-eval-source-map`。

生产模式下，`devtool` 默认是为 `false`，不生成 `.map` 文件。但是我们通常会接入类似 `Sentry` 的异常监控，需要我们将 `.map` 文件上传到 `Sentry` 方便我们定位问题，这就要求 `devtool` 需要配置为 `source-map`。这样做又会带来一个新的问题，就是源代码会暴露给外部用户。

针对这个问题，我们可以分 `4` 步来处理他，先完成打包构建，然后上传 `.map` 到 `Sentry`，然后再将 `.map` 文件移除，最后将删除 `.map` 文件以后的静态资源放置到合适的位置。这样就既可以保证源码不被暴露，又可以很方便的定位线上问题。

<h4 id="1-6">devServer</h4>

开发模式下，我们会启动一个本地服务 `webpack-dev-server` 来进行本地开发，而 `devServer` 配置项就是用来指引 `wepack-dev-server` 工作的。

`devServer` 中最受人关注的是 `HMR` 配置项。

要正常使用 `HRM` 功能，需要三个前置条件:
- `devServer.hot` 配置项为 `true`；
- 启用 `inline` 模式；
- 模块中必须声明 `module.hot.accept(url, callback)`;

这里有的小伙伴们可能会有疑惑，自己在本地开发的时候，源文件里面并没有声明 `module.hot.accept(url, callback)`，为什么 `HMR` 还是可以正常运行呢?

答案很简单。这是因为我们在使用 `react / vue` 开发项目时，会使用对应的 `loader` 处理源文件。处理过程中，`loader` 会给源文件自动添加 `module.hot.accept(url, callback)` 逻辑。这一点，大家可以打开浏览器的源代码自己去看看噢。

<h4 id="1-7">其他配置项</h4>

剩下几个配置项，如 `target`、`performance`、`node`、`stats` 等，由于在实际项目中用的比较少，本文就不再做介绍了。如果有小伙伴感兴趣，可以自行去官方文档了解哦噢。


<h3 id="2">结束语</h3>

到这里，关于 `webpack` 配置项梳理的下篇就结束了。结合上篇，我们一共梳理了常用的 `11` 种配置项的用法，并对 `optimization`、`plugins` 做了比较深入的介绍, 希望能给到大家新的认识。



