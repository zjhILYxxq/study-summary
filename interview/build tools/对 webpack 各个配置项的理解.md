`Webpack` 官网里面罗列的配置项有 `entry`、`resolve`、`module`、`plugin`、`output`、`mode`、`cache`、`devServer`、`devtools`、`optimization`、`watch`、`externals`、`performance`、`node`、`stats` 等。

小编以为，要想更好的理解这些配置项，首先要对 `Webpack` 的工作机制有一个整体的认识。

`Webpack` 的整个工作过程可以归纳为: 以 `entry` 指定的入口文件为起点，分析源文件之间的依赖关系，构建一个模块依赖图，然后将这个模块依赖图拆分为多个 `bundles`，并输出到 `output` 指定的位置。

上面罗列的这些配置项的使用，贯穿了 `Webpack` 的整个工作过程。

<h4>entry</h4>

`entry`，告诉 `Webpack` 配置模块依赖图的起点。

`entry` 值的类型有三种，`string`、`string` 数组、对象。不同的类型，构建出来的模块依赖图各不相同。

如果是一个字符串，单页面单入口文件打包，会构建一个模块依赖图；如果是一个字符串数组，单页面多入口文件打包，会构建一个模块依赖图；如果是一个对象，多页面(多入口/单入口文件)打包，会构建多个模块依赖图。

如果大家对这段描述不太能理解，我们可以通过一个简单的 `demo` 给大家演示一下。

```
// util.1.js
export const func1 = () => console.log('func1');

// util.2.js
export const func2 = () => console.log('func2');

// index.1.js
import { func1 } from './util.1.js';
func1();

// index.2.js
import { func1 } from './util.1.js';
import { func2 } from './util.2.js';

func1();
func2();
```

<h4>resolve</h4>

`resolve`，配置源文件、第三方依赖包如何被解析，得到文件的绝对路径。

在日常开发中，用的比较多的配置项为 `resolve.alias` 别名配置和 `resolve.extensions` 扩展配置。

源文件的路径解析是构建模块依赖图最初始的环节。拿不到源文件的决定路径，就无法读取源文件、对源文件做 `transform`、解析源文件、分析依赖关系等。`resolve` 失败了，打包构建就立即会终止。

默认情况下，`Webpack` 会自动解析相对路径和第三方依赖路径。但如果我们在项目中使用了别名，`Webpack` 就需要借助 `resolve.alias` 配置项来解析路径了。另外，如果源文件 `url` 没有携带后缀，`webpack` 默认会使用 `.wasm`、`.mjs`、`.js`、`.json`, 如果这些默认的后缀都匹配，如 `.tsx`，那么打包构建会报错。

<h4>module</h4>

`module`，配置各个类型的源文件对应的 `loader`。

在构建模块依赖图时，`loader` 会将源文件中各种类型的源文件，如 `tsx`、`ts`、`jsx`、`vue`、`less`、`sass` 等，转换成浏览器可以支持的 `js`、`css` 等类型。

通常我们会在 `module.rules` 配置一系列规则，指定每种类型的文件，使用什么样的 `loader`。如 `.tsx` 类型的文件使用 `ts-loader`，`.scss` 类型的文件使用 `sass-loader`、`css-loader`、`style-loader` 等。

`loader` 本质上是一个函数，它的入参是代码字符串，返回的结果也是一个代码字符串。

`Webpack` 完成源文件绝对路径的解析以后，会根据解析出来的绝对路径去读取源文件的内容，然后作为入参传递给 `loader` 函数。`loader` 处理完以后会返回新的代码字符串，传递给下一个 `loader` 函数或者 `parser` 解析器。`loader` 转换，是 `Webpack` 打包构建时间久的原因之一。

当 `parser` 收到 `loader` 转换以后的内容以后，会将内容转换为一个 `AST` 对象，分析并收集源文件的依赖，然后对收集到的依赖继续做路径解析、内容读取、内容转换、依赖解析。这一套流程会一直持续到涉及的所有源文件都解析完成，构建出一个模块依赖图。

构建好的模块依赖图，各个模块之间是静态依赖还是动态依赖，各个模块的 `export` 是否有被使用都一清二楚。

<h4>optimization</h4>

模块依赖图构建完成以后，接下来要做的就是将模块依赖图拆分为多个 `bundle`。

这一过程，可以分成 `4` 个步骤:
1. 对模块依赖图做预处理 - `tree shaking`；
2. 初次分离，将模块依赖图分离为 `initial chunk` 和 `async chunks`；
3. 二次分离，分离 `common chunks`、`runtime chunk`、`custome chunks`；
4. 构建 `bundles`；

`optimization` 提供了很多配置项来指导 `Webpack` 做更好的完成上面四个步骤。

<h5>tree shaking</h5>

在正式拆分模块依赖图前，`Webpack` 会先对模块依赖图做预处理。预处理主要做一件事情 - `tree shaking`, 将模块依赖图中没有用到的模块、模块中没有用到的 `deadcode` 移除掉。不过有一个前提哈，模块源代码要符合 `ESM` 规范。

做 `tree shaking`，要用到 `optimization` 中的 `minimize`(是否压缩 bundle 代码)、`usedExports`(是否标记模块中被使用的 exports)、`sideEffects`(是否可以将未使用的模块移除)这 `3` 个配置项。

`Webpack` 的 `tree shaking` 有两种 `level`: `module level` - 将未使用的 `module` 移除和 `statement level` - 将 `module` 中的 `deadcode` 移除。

在构建模块图的过程中，各个模块内部的 `export` 是否有被其他模块已经可以确定。如果一个模块内某个 `export` 没有被使用，那么这个 `export` 对应的 `deadcode` 是可以被移除的。如果一个模块的所有 `export` 都没有被使用，那么整个模块是可以被移除的。

好多小伙伴知道开启 `tree shaking`，需要把 `minimize`、`usedExports`、`sideEffects` 这三个属性一股脑设置为 `true`，但可能并不知道这里面还有一点小细节。

`tree shaking` 也是有一套配置规则的:
- 单单将 `optimization.sideEffects` 设置为 `true`, 只会开启 `module level` 的 `tree shaking`，并不会开启 `statement level` 的 `tree shaking`;
- 开启 `statement level` 的 `tree shaking`，需要将 `optimization.usedExports` 和 `optimization.minimize` 都设置为 `true`，缺一不可；
- 开启 `statement level` 的 `tree shaking`，和 `optimization.sideEffects` 没有关系，即使 `optimization.sideEffects` 为 `false`；

`Webpack` 在实现 `statement level` 的 `tree shaking` 时，会通过 `usedExports` 标记被使用的 `exports`，然后在最后压缩打包代码时，再一次借助 `AST` 分析代码，将未被标记的 `export`，也就是 `deadcode` 移除掉。如果只配置了 `usedExports` 为 `true`，没有配置 `minimize` 为 `true`，那么 `statement level` 的 `tree shaking` 是不会生效的。

<h5>初次分离 - initial chunk 和 async chunks</h5>

做完 `tree shaking` 以后，接下来就是将拆分模块依赖图。

`Webpack` 默认会将一个模块依赖图，根据模块之间的静态依赖和动态依赖，拆分成 `initial chunk` 和 `async chunk`。

`entry` 所在的 `chunk`，称为 `initial chunk`。从 `entry` 开始，沿着静态依赖能遍历到的所有模块，都会分配到 `initial chunk` 中。

需要动态加载的模块，遇到就会单独的为它构建一个新的 `async chunk`。以动态加载模块开始，沿着静态依赖能遍历到所有未分配的模块，都会分配到对应的 `async chunk` 中。

由于这一步是 `Webpack` 的默认操作，`optimization` 没有提供什么配置项。


<h5>二次分离 - common chunks、runtime chunk、custome chunks </h5>

分离好 `initial chunk` 和 `async chunks` 以后，`Webpack` 还提供了自定义分包策略，让开发人员根据实际需要进行分包, 对应的是 `optimization.splitChunks` 配置项。

首先先来看看这三种类型的 `chunk` 是怎样定义的。

`common chunks`，通用模块组成的 `chunk`。在拆分模块依赖图的过程中，如果一个模块被多个 `chunk` 使用，那么这个模块就会被单独的分离为一个 `common chunk`。这一项对应的配置项是 `optimization.splitChunks.minChunks`。`miniChunks`，指定模块被共享的次数，如果一个模块被共享的次数 `>= miniChunks`, 那么该模块就会被分离成一个单独的 `common chunk`。 `miniChunks` 默认值为 `1`， 共享一次，意味着只要一个模块同时存在于两个 `chunk` 中，那么这个模块就会被分离。这个配置项实际用于多页面打包，单页面打包没有任何用处。因为单页面打包，一个模块永远只属于一个 `chunk`，只有多页面打包才会出现一个模块被多个 `chunk` 公用的情况。

`runtime chunk`，运行时 `chunk`, 里面包含 `Webpack` 的自定义模块加载机制，对应的配置项为 `optimization.runtimeChunk`, 默认为 `false`。默认情况下，`Webpack` 的自定义模块加载机制是包含在 `initial chunk` 中的。如果配置 `optimization.runtimeChunk` 为 `ture`，那么这一套逻辑就会被单独分离为一个 `runtime chunk`。

`custome chunks`，用户自定义 `chunks`, 即开发人员自己配置分离的 `chunks`，对应的配置项为 `optimization.splitchunks.cacheGroups`。通过这个配置项，开发人员可以自定义分包策略，如把第三方依赖分离为 `vendors`。

在分离 `common chunks` 和 `customer chunks` 时，Webpack 规定了一些限制条件。如果不满足这些限制条件，分包就会失败。

这些限制条件如下:
- `chunks`, 选定二次分离的范围，默认值为 `async`, 即对 `async chunks` 做二次分离。也可配置为 `initial`(对 `initial chunk` 做二次分离)和 `all`(对 `async chunks` 和 `initial chunk` 做二次分离)。一般配置为 `all`。
- `maxAsyncRequests`, 异步加载时允许的最大并行请求数, 可以理解为如果 `maxAsyncRequests` 为 `n`，那么可以最多从 `async chunks` 里二次分离出 `n - 1` 个 `common/customer chunks`。如果超出这个限制，分包失败。
- `maxInitialRequests`, 入口点处的最大并行请求数, 可以理解为如果 `maxInitialRequests` 为 `n`，`runtime chunk` 为 `m`( `optimization.runtime` 为 `ture`，`m = 1`； 为 `false`，`m` = `0`)，从 `initial chunk` 分离出的 `async chunks` 数量为 `k`，那么最多可以 `initial chunk` 中分离出 `n - m - k - 1` 个 `common/customer chunks`。如果超出这个限制，分包失败。
- `minSize`, 分出来的 `common/custome chunk` 的最小体积。如果小于 `minSize`，分包失败。
- `minSizeReduction`, 对 `initial chunk` 和 `async chunks` 做二次分离时，如果 `initial chunk` 和 `async chunks` 减小的体积小于 `minSizeReduction`，分包失败。 

很多时候，我们配置了 `optimization.splitchunks.cacheGroups`，却没有分离出相应的包，这个时候就要看看是不是受到了上面的限制条件的影响。

大多情况下， `Webpack` 会默认帮我们把一个应用分离为 `initial chunk`、`async chunks`、`vendors chunk`，如果还需要更定制化的分包，可以自行调整上面提到的配置项。

<h5>构建 bundle</h5>

分离好 `chunks` 以后，接下来 `Webpack` 会根据 `chunks` 构建输出的 `bundle`。 构建时，`webpack` 会先为每个 `chunk` 包含的模块构建内容，然后根据模块的内容，生成 `chunk` 的内容。

在这个过程中，`optimization` 中有两个配置项很重要 - `moduleIds` 和 `chunkIds`。这两个配置项，决定了最后的 `bundle` 文件名。

通常我们会在 `output.filename` 配置项中设置 `bundle` 文件的文件名，常用配置为 `[name].[chunkhash:8].js`，而 `moduleIds` 和 `chunksIds` 会影响 `name` 和 `chunkhash` 值。

`chunkIds`，指定每一个 `chunk id` 的命名方式，直接回影响 `name` 的值。举个 🌰，如果 `chunkIds` 为 `'named'`，那么 `async chunk` 的 `name` 就是源文件的文件名；如果 `chunksIds` 为 `'natural'`, 那么 `async chunk` 的 `name` 是一个数字。

`moduleIds`，指定一个 `module id` 的命名方式，规则和 `chunksId` 一样，会直接影响 `chunkhash` 的值。 `chunkhash` 是由 `chunk`中包含的模块的 `id`、模块的内容、`chunk id` 生成的一个 `md5`，变更 `module id` 的命名规则，就会改变 `chunkhash` 的值。

构建好内容、确定好文件名以后，如果配置了 `optimization.minimize` 为 `ture`， `Webpack` 会对构建内容做压缩处理。做完这一步，`Webpack` 就会把内容输出到 `output` 配置项指定的位置。

<h4>output</h4>

`output`, 用于配置 `webpack` 如何输出 `bundle` 内容, 包括确定 `bundle` 文件名、指定输出位置、如何对外暴露变量等，是 `Webpack` 打包构建的最后一环。

`output.filename`, 指定 `initial` 类型的 `bundle` 的文件名，常用配置 `[name].[chunkhash:8].js`。

`output.chunkFilename`, 指定非 `initial` 类型的 `bundle` 的文件名，常用配置为 `[name].[chunkhash:8].chunk.js`。

(这里要把命名规则再敞开讲讲。)

`output.path`, 指定 `bundle` 的输出目录，即打包后文件在硬盘中的存储位置, 是一个绝对路径。

`output.library`, 常用与组件库开发，将入口文件的返回值赋值给 `library` 指定的变量。

`output.libraryTarget`, 常和 `output.library` 一起使用，配置如何暴露 `library`。

(library、libraryTarget 也要讲讲)。

`output.publicPath`, 对页面里面引入的资源的路径做对应的补全。

在这里，我们只列举这几个常用的配置项，其他配置项用的比较少，就不一一介绍了。


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

