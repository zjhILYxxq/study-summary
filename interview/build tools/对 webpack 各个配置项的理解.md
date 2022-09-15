<h3>前言</h3>


<h3>Webpack 的各个配置项</h3>

`Webpack` 常用配置项: `entry`、`resolve`、`module`、`plugin`、`output`、`mode`、`cache`、`devServer`、`devtools`、`optimization`

这些配置项的使用，贯穿了 `Webpack` 的整个工作过程。

<h4>entry</h4>

`entry`，配置模块依赖图的起点。

`entry` 值的类型有三种，`string`、`string` 数组、对象。不同的类型，构建出来的模块依赖图各不相同。

如果是一个字符串，单页面单入口文件打包，会构建一个模块依赖图，开始节点一个；如果是一个字符串数组， 单页面多入口文件打包，会构建一个模块依赖图，起始节点有多个；如果是一个对象，多页面(多入口/单入口文件)打包，会构建多个模块依赖图，各个模块依赖图的起始节点可以是一个，也可以是多个。

在中有一个配置项，大家可能一直不知道怎么用 ？？

要画个说明图吗？

<h4>resolve</h4>

`resolve`，配置源文件、npm 包如何被解析，得到绝对路径。

在日常开发中，用的比较多的配置项为 `resolve.alias` 别名配置和 `resolve.extensions` 扩展配置。

源文件的路径解析是构建模块依赖图最初始的环节。拿不到源文件的决定路径，就无法读取源文件、对源文件做 `transform`、解析源文件、分析依赖关系等。`resolve` 失败了，打包构建就立即会终止。

默认情况下，`webpack` 会自动解析相对路径和第三方依赖路径。但如果我们在项目中使用了别名，`webpack` 就需要借助 `resolve.alias` 配置项来解析路径了。另外，如果源文件 `url` 没有携带后缀，`webpack` 默认会使用 `.wasm`、`.mjs`、`.js`、`.json`, 如果这些默认的后缀都匹配，如 `.tsx`，那么打包构建会报错。

<h4>module</h4>

`module`，配置各个类型的源文件对应的 `loader`。

`loader` 会将源文件中各种类型的源文件，如 `tsx`、`ts`、`jsx`、`vue`、`less`、`sass` 等，转换成浏览器可以支持的 `js`、`css` 等类型。

通常我们会在 `module.rules` 配置一系列规则，指定每种类型的文件，使用什么样的 `loader`。如 `.tsx` 类型的文件使用 `ts-loader`，`.scss` 类型的文件使用 `sass-loader`、`css-loader`、`style-loader` 等。

`loader` 本质上是一个函数，它的入参是代码字符串，返回的结果也是一个代码字符串。

`webpack` 完成源文件绝对路径的解析以后，会根据解析出来的绝对路径去读取源文件的内容，然后作为入参传递给 `loader` 函数。`loader` 处理完以后会返回新的代码字符串，传递给下一个 `loader` 函数或者 `parser` 解析器。解析器会将转换以后的源文件转换为一个 `AST` 对象，然后分析源文件的依赖关系。`loader` 转换，是 `Webpack` 打包构建时间久的原因之一。

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

生产模式下，`devtool` 默认是为 `false`，不生成 `.map` 文件。但是我们通常会接入类似 `Sentry` 的异常监控，需要我们将 `.map` 文件上传到 `Sentry` 方便我们定位问题，这就要求 `devtool` 需要配置为 `source-map`。这样做又会带来一个新的问题，就是源代码会暴露给外部用户。针对这个问题，我们可以分 `4` 步来处理他，先完成打包构建，然后上传 `.map` 到 `Sentry`，然后再将 `.map` 文件移除，最后将删除 `.map` 文件以后的静态资源放置到合适的位置。


<h4>output</h4>

<h4>plugin</h4>

<h4>devServer</h4>

<h4></h4>





<h3>结束语</h3>


<h3>传送门</h3>

