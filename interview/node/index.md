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

6. `npm` 包管理工具的运行相关原理

    用户在终端输入一个命令后，整个执行过程如下:
    - 先判断命名是否包含了路径。如果命令中已经存在了路径，则会直接读取该路径下的命令文件执行。
    - 如果命名不包含路径，则判断是否是内部命令、外部命令。所谓内部命令，就是这该命令常驻内存，直接执行即可（例如：cd、ls），外部命令就是指命令的代码在磁盘中，在执行时需要先把磁盘中的命令代码读入内存才能执行。
    - 如果不是内部命令，也不是外部命令，则要根据环境变量 PATH 中指定的路径去查找对应的命令文件(通过 `/usr/bin/env` 获取环境变量)

    `npm` 全局安装： 
    - 将包安装到 `/usr/local/lib/node_modules` 目录下；
    - 在 `/usr/local/bin` 目录下新增命令文件；

    `npm` 包生成可执行文件
    1. 生成一个 `js` 文件，首行 `#!/usr/bin/env node` (动态去查找 `node` 来执行当前命令)
    2. 在 `package.json` 文件的 `bin` 配置项指向第一步的 `js` 文件；
    3. 这样全局安装的时候，就会在 `/usr/local/bin` 生成一个可执行文件；

    `npx` 的特点:
    - 可以自动检查命令是否在 `node_modules/.bin` 目录中或者是否在系统环境变量 `PATH` 配置的目录路径中;
    - 执行相关模块命令时会先进行依赖安装，但会在安装成功并执行完相关命令代码后便删除此依赖，从而避免了全局安装带来的问题;

    `npm run xx` 的原理： 
    - npm run 会创建一个 shell 脚本，package.json 文件的 scripts 选项中自定义的脚本内容就会在这个新创建的 shell 脚本中运行；
    - 把当前目录下的 node_modules/.bin 目录路径添加到系统环境变量 PATH 中，这样 Shell 脚本的命令解析器就可以查找当前目录中的 node_modules/.bin 目录中的命令了；
    - 执行结束后，再将 PATH 变量恢复原样；
    - 通过命令执行对应的应用程序，然后输出结果；

    `npm link`： 
    - 将包安装到 `/usr/local/lib/node_modules` 目录下；
    - 在 `/usr/local/bin` 目录下新增命令文件；

    `npm install` 发生了什么:
    - 先执行 `preinstall hook`； 
    - 读取 `npm` 配置，即 `.npmrc` 文件，优先级顺序为: 项目级的 .npmrc 文件 > 用户级的 .npmrc 文件 > 全局的 .npmrc 文件 > npm 内置的 .npmrc 文件；
    - 然后检查项目根目录中有没有 `package-lock.json` 文件，如果有 `package-lock.json` 文件，则检查 `package-lock.json` 文件和 `package.json` 文件中声明的版本是否一致。一致，直接使用 `package-lock.json` 文件中的信息，从缓存或从网络仓库中加载依赖。不一致，则根据 `npm` 版本进行处理。
    - 如果没有 `package-lock.json` 文件，则根据 `package.json` 文件递归构建依赖树，然后按照构建好的依赖树下载完整的依赖资源，在下载时会检查是否有相关缓存。有，则将缓存内容解压到 `node_modules` 目录中。没有，则先从 `npm` 远程仓库下载包资源，检查包的完整性，并将其添加到缓存，同时解压到 `node_modules` 目录中。
    - 生成 `package-lock.json` 文件。
    - 执行 `postinstall hook`。

    构建依赖树时，首先将项目根目录的 `package.json` 文件中 `dependencies` 和 `devDependencies` 选项的依赖按照首字母（@排最前）进行排序，排好序后 `npm` 会开启多进程从每个首层依赖模块向下递归获取子依赖。这样便获得一棵完整的依赖树，其中可能包含大量重复依赖。在 `npm3` 以前会严格按照依赖树的结构进行安装，因此会造成依赖冗余。 从 `npm3` 开始默认加入了一个 `dedupe` 的过程。它会遍历所有依赖，将每个依赖 安装在根目录的 `node_modules `文件夹中，当发现有重复依赖时，则将其丢弃。这就是所谓依赖扁平化结构处理。


    扁平化结构，会带来幽灵依赖问题。幽灵依赖: 项目中使用了一些没有被定义在项目中的 `package.json` 文件中的包。

    `npm`、`yarn`、`pnpm` 的对比：
    - `npm2` 是通过嵌套的方式管理 `node_modules` 的，会有同样的依赖复制多次的问题;
    - `npm3+` 和 `yarn` 是通过铺平的扁平化的方式来管理 `node_modules`，解决了嵌套方式的部分问题，但是引入了幽灵依赖的问题，并且同名的包只会提升一个版本的，其余的版本依然会复制多次。
    - `pnpm` 则是用了另一种方式，不再是复制了，而是都从全局 `store` 硬连接到 `node_modules/.pnpm`，然后之间通过软链接来组织依赖关系。
  










