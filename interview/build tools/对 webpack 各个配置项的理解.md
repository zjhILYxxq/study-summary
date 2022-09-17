---
theme: cyanosis
---

<h3>前言</h3>

相信不少小伙伴都有听说过这样一个名词 - `Webpack` 配置工程师。😂，都需要设置专门的岗位去维护了，可见 `Webpack` 的配置是有多么复杂。

现实也确实如此。发展到现在 `5.x` 版本， `Webpack` 已经有 `18+` 大类的配置项，再加上大类中各种小的配置项，那就更多了。复杂的配置项，给新人入门 `Webpack` 带来了极大的门槛。光弄懂 `Webpack` 怎么用、熟练使用各个配置项就需要花费很长的功夫，更别提要了解其内部工作机制了。而且要吐槽一下，官方文档写的是真不咋地，好多配置项的用法都没说清楚。

小编一开始接触 `Webpack` 的时候，也是一脸懵逼，看着那么多的配置项，不知所措。但为了能在项目中更好的使用 `Webpack`，只能硬着头皮去看官网文档，一个一个的去试各种配置项。如果看官网文档还不理解，就去尝试看源码中这个配置项是怎么工作的，来理解它在实际工作中该怎么用。

在学习和日常使用过程中，小编发现 `Webpack` 的各个配置项，理解起来也有一定的脉络可循的。本文，小编会根据自己的一些理解和社区存在的大量资料，对 `Webpack` 配置项做一番梳理，希望能给到小伙伴们一些帮助。

本文的目录结构如下:
- <a>Webpack 的各个配置项</a>
- <a>结束语</a>
- <a>传送门</a>


<h3>Webpack 的各个配置项</h3>

`Webpack` 官网里面罗列的配置项有 `entry`、`resolve`、`module`、`plugin`、`output`、`mode`、`cache`、`devServer`、`devtools`、`optimization`、`watch`、`externals`、`performance`、`node`、`stats` 等。

小编以为，要想更好的理解这些配置项，首先要对 `Webpack` 的工作机制有一个整体的认识。

在这里，先推荐两篇文章: [重新认识 Webpack: 旧时代的破局者](https://juejin.cn/book/7115598540721618944/section/7115598759844642816)和[如何理解 Webpack 配置底层结构逻辑](https://juejin.cn/book/7115598540721618944/section/7116186197902229517)。这是范文杰大佬的掘金小册 - [Webpack5 核心原理与应用实践](https://juejin.cn/book/7115598540721618944) 的前两个章节(给大佬点赞)。本来小编是想自己先给大家梳理一下 `Webpack` 的背景和工作机制的，但是发现大佬总结的更棒、更全面，就直接借花献佛了。还没有了解的小伙伴，可以先去看看，如果对自己胃口，可以去购买噢。


这里总结一下，`Webpack` 的整个工作过程可以归纳为: 以 `entry` 指定的入口文件为起点，分析源文件之间的依赖关系，构建一个模块依赖图，然后将这个模块依赖图拆分为多个 `bundles`，并输出到 `output` 指定的位置。

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

`resolve`，配置源文件、`npm` 包如何被解析，得到绝对路径。

在日常开发中，用的比较多的配置项为 `resolve.alias` 别名配置和 `resolve.extensions` 扩展配置。

源文件的路径解析是构建模块依赖图最初始的环节。拿不到源文件的决定路径，就无法读取源文件、对源文件做 `transform`、解析源文件、分析依赖关系等。`resolve` 失败了，打包构建就立即会终止。

默认情况下，`webpack` 会自动解析相对路径和第三方依赖路径。但如果我们在项目中使用了别名，`webpack` 就需要借助 `resolve.alias` 配置项来解析路径了。另外，如果源文件 `url` 没有携带后缀，`webpack` 默认会使用 `.wasm`、`.mjs`、`.js`、`.json`, 如果这些默认的后缀都匹配，如 `.tsx`，那么打包构建会报错。

<h4>module</h4>

`module`，配置各个类型的源文件对应的 `loader`。

在构建模块依赖图时，`loader` 会将源文件中各种类型的源文件，如 `tsx`、`ts`、`jsx`、`vue`、`less`、`sass` 等，转换成浏览器可以支持的 `js`、`css` 等类型。

通常我们会在 `module.rules` 配置一系列规则，指定每种类型的文件，使用什么样的 `loader`。如 `.tsx` 类型的文件使用 `ts-loader`，`.scss` 类型的文件使用 `sass-loader`、`css-loader`、`style-loader` 等。

`loader` 本质上是一个函数，它的入参是代码字符串，返回的结果也是一个代码字符串。

`webpack` 完成源文件绝对路径的解析以后，会根据解析出来的绝对路径去读取源文件的内容，然后作为入参传递给 `loader` 函数。`loader` 处理完以后会返回新的代码字符串，传递给下一个 `loader` 函数或者 `parser` 解析器。`loader` 转换，是 `Webpack` 打包构建时间久的原因之一。

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

在正式拆分模块依赖图前，`Webpack` 会先对模块依赖图做预处理。预处理主要做一件事情 - `tree shaking`, 将模块依赖图中没有用到的模块、模块中没有用到的 `deadcode` 移除掉。有一个前提哈，模块源代码要符合 `ESM` 规范。

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

在分离 `async chunks` 时有一个限制条件 - `optimization.splitchunks.maxAsyncRequests`, 异步


<h5>二次分离 - common chunks、runtime chunk、custome chunk </h5>

分离好 `initial chunk` 和 `async chunks` 以后，`Webpack` 还提供了自定义分包策略，让开发人员根据实际需要进行分包, 对应的是 `optimization.splitChunks` 配置项。

首先先来看看这三种类型的 `chunk` 是怎样定义的。

`common chunks`，通用模块组成的 `chunk`。在拆分模块依赖图的过程中，如果一个模块被多个 `chunk` 使用，那么这个模块就会被单独的分离为一个 `common chunk`。这一项对应的配置项是 `optimization.splitChunks.minChunks`。`miniChunks`，指定模块被共享的次数，如果一个模块被共享的次数 `>= miniChunks`, 那么该模块就会被分离成一个单独的 `common chunk`。 `miniChunks` 默认值为 `1`， 共享一次，意味着只要一个模块同时存在于两个 `chunk` 中，那么这个模块就会被分离。这个配置项实际用于多页面打包，单页面打包没有任何用处。因为单页面打包，一个模块永远只属于一个 `chunk`，只有多页面打包才会出现一个模块被多个 `chunk` 公用的情况。

`runtime chunk`，运行时 `chunk`, 里面包含 `Webpack` 的自定义模块加载机制，对应的配置项为 `optimization.runtimeChunk`, 默认为 `false`。默认情况下，Webpack 的自定义模块加载机制是包含在 initial chunk 中的。如果配置 optimization.runtimeChunk 为 ture，那么这一套逻辑就会单独分离为一个 `runtime chunk`。

`custome chunks`，用户自定义 `chunks`, 即开发人员自己配置分离的 chunks，对应的配置项为 `optimization.splitchunks.cacheGroups`。通过这个配置项，开发人员可以自定义分包策略，如把第三方依赖分离为 `vendors`。

在分离 `common chunks` 和 `customer chunks` 时，Webpack 规定了一些限制条件。如果不满足这些限制条件，分包就会失败。

这些限制条件如下:
- `chunks`, 选定二次分离的范围，默认值为 `async`, 即对 `async chunks` 做二次分离。也可配置为 `initial`(对 `initial chunk` 做二次分离)和 `all`(对 `async chunks` 和 `initial chunk` 做二次分离)。一般配置为 `all`。
- `maxAsyncRequests`, 异步加载时允许的最大并行请求数, 可以理解为如果 `maxAsyncRequests` 为 `n`，那么可以最多从 `async chunks` 里二次分离出 `n - 1` 个 `common/customer chunks`。如果超出这个限制，分包失败。
- `maxInitialRequests`, 入口点处的最大并行请求数, 可以理解为如果 `maxInitialRequests` 为 `n`，`runtime chunk` 为 `m`( `optimization.runtime` 为 `ture`，`m = 1`； 为 `false`，`m` = `0`)，从 `initial chunk` 分离出的 `async chunks` 数量为 `k`，那么最多可以 `initial chunk` 中分离出 `n - m - k - 1` 个 `common/customer chunks`。如果超出这个限制，分包失败。
- `minSize`, 分出来的 `common/custome chunk` 的最小体积。如果小于 `minSize`，分包失败。
- `minSizeReduction`, 对 `initial chunk` 和 `async chunks` 做二次分离时，如果 `initial chunk` 和 `async chunks` 减小的体积小于 `minSizeReduction`，分包失败。 

很多时候，我们配置了 `optimization.splitchunks.cacheGroups`，却没有分离出相应的包，这个时候就要看看是不是收到了上面的限制条件的影响。

<h5>构建 bundle</h5>

分离好 `chunks` 以后，接下来 `Webpack` 会根据 `chunks` 构建输出的 `bundle`。 构建时，`webpack` 会先为每个 `chunk` 包含的模块构建内容，然后根据模块的内容，生成 `chunk` 的内容。

在这个过程中，`optimization` 中有两个配置项很重要 - `moduleIds` 和 `chunkIds`。这两个配置项，决定了最后的 `bundle` 文件名。

通常我们会在 `output.filename` 配置项中设置 `bundle` 文件的文件名，常用配置为 `[name].[chunkhash:8].js`，而 `moduleIds` 和 `chunksIds` 会影响 `name` 和 `chunkhash` 值。

`chunkIds`，指定每一个 `chunk id` 的命名方式，直接回影响 `name` 的值。举个 🌰，如果 `chunkIds` 为 `'named'`，那么 `async chunk` 的 `name` 就是源文件的文件名；如果 `chunksIds` 为 `'natural'`, 那么 `async chunk` 的 `name` 是一个数字。

`moduleIds`，指定一个 `module id` 的命名方式，规则和 `chunksId` 一样，会直接影响 `chunkhash` 的值。 `chunkhash` 是由 `chunk`中包含的模块的 `id`、模块的内容、`chunk id` 生成的一个 `md5`，变更 `module id` 的命名规则，就会改变 `chunkhash` 的值。

构建好内容、确定好文件名以后，如果配置了 `optimization.minimize` 为 `ture`， `Webpack` 会对构建内容做压缩处理。做完这一步，`Webpack` 就会把内容输出到 `output` 配置项指定的位置。

<h4>output</h4>

`output`, 用于配置 `webpack` 如何输出 `bundle` 内容, 包括确定 `bundle` 文件名、指定输出位置、如何对外暴露变量等，是 `Webpack` 打包构建的最后一环

`output.filename`, 指定 initial 类型的 bundle 的文件名，常用配置 `[name].[chunkhash:8].js`。

`output.chunkFilename`, 指定非 initial 类型的 bundle 的文件名，常用配置为 `[name].[chunkhash:8].chunk.js`。

`output.path`, 指定 `bundle` 的输出目录，即打包后文件在硬盘中的存储位置, 是一个绝对路径。

`output.library`, 常用与组件库开发，将入口文件的返回值赋值给 `library` 指定的变量。

`output.libraryTarget`, 常和 `output.library` 一起使用，配置如何暴露 `library`。

`output.publicPath`, 对页面里面引入的资源的路径做对应的补全。

在这里，我们只列举这几个常用的配置项，其他配置项用的比较少，就不一一介绍了。

<h4>plugin</h4>

<h4>cache</h4>

<h4>externals<h4>

<h4>mode</h4>

`mode`, 配置 `Webpack` 的工作模式。

`Webpack` 的工作模式有两种：`development` 和 `production`。各种模式都有各自的默认配置项。如 `devTool`，`production` 模式下默认为 `false`，不生成 `.map` 文件；`development` 模式下为 `eval`，使用 `eval` 包裹代码块。

`mode` 是 `webpack4` 新出现的配置项，减少了开发人员人员的心智负担。

<h4>devtool</h4>


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


<h4>cache</h4>

<h4>externals</h4>



<h4>devServer</h4>




<h3>结束语</h3>





<h3>传送门</h3>

