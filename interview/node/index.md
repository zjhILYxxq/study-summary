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

    

2. pm2 的工作原理

3. 如何创建一个子进程

4. 进程间通信机制


