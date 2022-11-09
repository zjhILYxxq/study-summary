1. `node` 的 `eventLoop`

    浏览器的 `eventLoop` 只分了两层优先级，一层是宏任务，一层是微任务，宏任务之间没有再划分优先级，微任务之间也米有再划分优先级。

    `node eventLoop` 的宏任务之间是有优先级的，分为 5 级: `Timers`、`Pending`、`Poll`、`Check`、`Close`。

    除了宏任务，`node eventLoop` 也对微任务划分了优先级，`process.nextTick` 优先处理，其他微任务后处理。

    `Timer` 阶段, 执行一定数量的定时器，优先级最高，如 `setTimeout`、`setInterval` 的 `callback`。

    `Pending` 阶段， 执行 `I/O` 或者网络异常回调。

    `Poll` 阶段， `I/O` 或者网络回调。

    `Check` 阶段，执行 `setImmediate` 的回调。

    `Close` 阶段，执行 `close` 事件的回调。

    ```

    setImmediate(() => {
        console.log('setImmediate 1');
        Promise.resolve(1).then(() => {
            console.log('promise 2');
        })
    });

    setImmediate(() => {
        console.log('setImmediate 2');
    });
    ```

    针对上面一段代码，`node 11` 版本之前，会输出 `setImmediate 1`、`setImediate 2`、`promise 2`，`node 11` 版本之后会输出 `setImmediate 1`、`promise 2`、`setImmediate 2`。

    即 `Node.js` 的 `Event Loop` 流程在 `node11` 之前是执行当前阶段的一定数量的宏任务（剩余的到下个循环执行），然后执行所有微任务，一共有 `Timers`、`Pending`、`Poll`、`Check`、`Close` 这 `5` 个阶段; 而在 `node11` 之后，是处理完一个宏任务之后，如果发现有微任务，要先处理所有的微任务。

2. `pm2` 的工作原理

    `pm2` 是一个守护进程管理器，可以帮助我们管理和保持应用程序在线。

    `pm2` 在工作的时候，涉及的进程分为三类: 
    - 执行 `pm2` 命令的进程 - `Satan` 进程;
    - 守护进程 - `God`
    - 服务进程

    其中， `Satan` 进程通过 `rpc` 和 `God` 进程进行通信， `God` 进程和服务进程通过 `process` 和 `child_process` 之间通过管道进行通信。

    守护进程的作用:
    - 进程后台常驻；
    - 监听异常；
    - 工作进程管理调度；
    - 进程挂掉后重启；

3. 如何创建一个子进程

    创建子进程，需要用到 `child_process` 模块。

    `child_process` 模块提供了 `4` 个方法来创建子进程:
    - `spawn`， 启动一个子进程来执行命令；
    - `exec`，启动一个子进程来执行命令，和 `spwan` 不同的是可以在回调中获取子进程的状况；
    - `execFile`, 和 `exec` 类似, 不过没有创建一个 shell；
    - `fork`，创建一个 `node` 进程来执行可执行文件，并且在主子进程间建立了通信通道，让主子进程可以使用 `process` 模块基于事件进程通讯.

4. 进程间通信机制

    `IPC` 进程间通信的方式:
    - 管道/匿名管道 - `pipe`；
    - 具名管道 - `FIFO`；
    - 信号 - `Singal``；
    - 消息队列；
    - 共享内存；
    - 信号量；
    - 套接字 - `Socket`。

    进程间通信: `socket` 文件和 `tcp`。如果进程都在本地，用 `socket` 文件效更高些，而且不占用端口号，权限也更好控制；如果进程在不同的服务器，使用 tcp。

5. 僵尸进程和孤儿进程

    僵尸进程: 子进程退出以后，父进程没有获取子进程的状态信息，子进程中保存的进程号/退出状态/运行时间等都不会被释放，进程号会一直被占用。

    孤儿进程: 父进程已经退出，子进程还在运行。

6. `libuv`

    在 `Node.js` 里面，实现 `event loop` 的就是 `libuv`，它是一个异步 `IO` 库，负责文件和网络的 `io`，提供了事件形式的异步 `api`。

    
