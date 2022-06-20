1. 为什么要有 rollup ？

    仅仅是因为打包出来的代码很干净吗？

    软件开发时，我们通常会将一个项目拆分为小的模块，这样可以移除意外的交互、减低问题的复杂性，而且为什么要这样做并没有答案，大家都是默认这样做的。

    但是遗憾的时候， javascript 历史上并支持这样做，没有类似 java、c++ 的 module 功能。

    随着 ES6 module 的出现，我们可以在 js 代码中使用 import 和 export。但是此规范一开始仅在浏览器中支持，并未在 node 中最终确定。

    通过 rollup，我们可以使用 esm 来编写代码，然后编译回现有的 cjs、amd、iife 格式。这意味着我们可以面向未来变编程。



2. rollup 简单了解

    - rollup 是一个 js 模块打包器，可以将小段的 js 代码打包成大而复杂的 lib 库或者应用代码；
    - 对 es6 中的 module 使用了新的标准化格式，而不是以前的特殊解决方案，如 cjs 和 amd；
    - 由于 es6 module 在编译阶段就可以知道模块的依赖的关系，提供了 tree shaking 的功能，更好的优化代码体积；
    - 兼容性，可以通过插件导入 cjs 模块；
    - 支持 esm、cjs、umd 格式发布 lib，通过 package.json 的 main 字段可以使用 lib 中 cjs、umd 包；通过 module 字段可以使用 lib 中的 esm 包；