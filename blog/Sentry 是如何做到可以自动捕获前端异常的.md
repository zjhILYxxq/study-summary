---
theme: cyanosis
---
我报名参加金石计划1期挑战——瓜分10万奖池，这是我的第 2 篇文章，[点击查看活动详情](https://s.juejin.cn/ds/jooSN7t "https://s.juejin.cn/ds/jooSN7t")

<h3>前言</h3>

自从知道了 `Sentry`、`Fundbug` 可用于异常监控之后，小编就一直对它们能自动捕获前端异常的机制非常感兴趣。最近为了解决 `Qiankun` 下 `Sentry` 异常上报不匹配的问题，小编特意去翻阅了一下 `Sentry` 的源代码，在解决了问题的同时，也对 `Sentry` 异常上报的机制有了一个清晰的认识，收获满满。

在这里，小编将自己学习所得总结出来，希望能给到同样对 `Sentry` 工作机制感兴趣的同学一些帮助。

本文的目录结构如下:

- **<a href="#1">常见的前端异常</a>**

- **<a href="#2">Sentry 如何配置前端异常监控</a>**

- **<a href="#3">Sentry 异常监控的原理</a>**

- **<a href="#4">结束语</a>**

<h3 id="1">常见的前端异常</h3>

在了解 `Sentry` 自动捕获异常的机制之前，小编先带大家了解一下常见的前端异常类型以及各自可以被捕获的方式。

前端异常可以分为以下几种类型:

- `js` 代码执行时异常；

- `promise` 类型异常；

- `资源加载`类型异常；

- `网络请求`类型异常；

- `跨域脚本`执行异常；

不同类型的异常，捕获方式不同。

<h4>js 代码执行时异常</h4>

`js` 代码执行异常，是我们经常遇到异常。这一类型的异常，又可以做细分:
- `Error`，最基本的错误类型，其他的错误类型都继承自该类型。通过 Error，我们可以自定义 Error 类型。
- `RangeError`: 范围错误。当出现堆栈溢出(递归没有终止条件)、数值超出范围(`new Array` 传入负数或者一个特别大的整数)情况时会抛出这个异常。
- `ReferenceError`，引用错误。当一个不存在的对象被引用时发生的异常。
- `SyntaxError`，语法错误。如变量以数字开头；花括号没有闭合等。
- `TypeError`，类型错误。如把 number 当 str 使用。
- `URIError`，向全局 `URI` 处理函数传递一个不合法的 `URI` 时，就会抛出这个异常。如使用 `decodeURI('%')`、`decodeURIComponent('%')`。
- `AggregateError`，把多个错误包装为一个错误，如 Promise.any([...]).cath(error => console.log(error.errors)), 这个 error 的类型就是 ArrregateError。
- `InternalError`， `js` 引擎内部的异常。这个异常我们基本很难碰到

- `EvalError`， 一个关于 eval 的异常，不会被 javascript 抛出。

domError, error 



<h3 id="2">Sentry 如何配置前端异常监控</h3>

<h3 id="3">Sentry 异常监控原理</h3>

<h3 id="4">结束语</h3>