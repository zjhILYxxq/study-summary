---
theme: cyanosis
---

<h3>前言</h3>

在上一篇 [为什么有人说 vite 快，有人却说 vite 慢？](https://juejin.cn/post/7129041114174062628) 中，我们提到过开发模式下使用 `Vite` 会有首屏性能下降的负面效果。之所以会造成首屏性能下降，一方面是 `dev server` 需要完成预构建才可以响应首屏请求；另一方面是需要对请求文件做实时转换。

也许有的同学会问，是不是针对这两个方面做优化，就可以提升首屏性能呢？原则上这样是没有问题的，而且 `Vite` 也是这么做的。为了能更快的完成预构建和内容转换，`Vite` 另辟蹊径的借助了 `Esbuild` 能快速完成项目打包、文件转换的能力，性能提升非常明显。

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

- 可充分利用多核 cpu 优势；

<h4>关键 API - transfrom & build</h4>

`Esbuild` 并不复杂。它对外提供了两个 `API` - `transform` 和 `build`，使用起来非常简单。





<h4>plugin</h4>


<h3>Esbuild 在 Vite 中的巧妙使用</h3>

<h4>预构建</h4>

<h4>middlewares 中内容转换</h4>


<h3>结束语</h3>
