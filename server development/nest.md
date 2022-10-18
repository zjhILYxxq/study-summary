#### express

#### egg

#### koa

#### nest

#### next

#### pm2

预备知识点: `process`、`child_processes`、`cluster`；

`pm2` 是一个守护进程管理器，能帮助我们管理项目，并保证项目时刻在线。

负载均衡 ？？

pm2-axon 是一个面向消息的 node.js 套接字库，深受 zeromq 的启发 ？？

`rpc`, `remote procedure call protocol`, 远程过程调用协议。

`node` 的 `rpc` 通信 - 调用其他进程或者机器上的函数。 rpc，用于进程间的通信 ？？ 所以 rpc 最关键的就是通信 ？？

`pm2-axon-rpc`

`pm2-axon`、`pm2-axon-rpc` 这两个 npm 包怎么用？

相关 npm 包: pm2-axon、 pm2-axon-rpc、@pm2/agent、@pm2/io、@pm2/js-api、@pm2/pm2-version-check？ 这些 npm 包都有什么用？

进程间通信: `socket` 文件和 `tcp`。如果进程都在本地，用 `socket` 文件效更高些，而且不占用端口号，权限也更好控制；如果进程在不同的服务器，使用 tcp。

`IPC` 进程间通信的方式:
- 管道/匿名管道 - pipe；
- 具名管道 - FIFO；
- 信号 - Singal；
- 消息队列；
- 共享内存；
- 信号量；
- 套接字 - Socket。
  
  通过 socket，进程间的通信可以在同一台机器，也可以不同机器上通过网络进行通信。

  套接字有 3 个属性: 域 ？ 端口号、协议

  域，套接字通信中使用的网络介质。通常有两种：AF_INET, 指的 internet 网络；AF_UNIX, 指的是 UNIX 文件系统；

  端口号，每一个基于 tcp / ip 通信的进程都被赋予了唯一的端口和端口号；

  协议类型，流套接字、数据报套接字、原始套接字

  套接字通信的建立：
  - server 端
    - 调用 socket 创建一个套接字；
    - 给套接字命名，然后等待客户的连接；
    - 调用 listen 来监听用户的接入；
    - 通过 accept 来接受客户的连接？它会创建一个与原有的命名套接不同的新套接字，这个套接字只用于与这个特定客户端进行通信，而命名套接字（即原先的套接字）则被保留下来继续处理来自其他客户的连接（建立客户端和服务端的用于通信的流，进行通信）？？
  - client 端
    - 调用 socket 创建一个套接字；
    - 将 server 端的命名套接字作为一个地址来调用 connect 与服务器建立连接；
    - 开始通信；


学习过程中遇到的问题:

1. 使用 `pm2` 的时候，为什么有时候会提示 `pm2` 的版本不一致，需要更新？

    第一次使用 pm2 的时候，创建守护进程时会在根目录 `.pm2` 下生成一个 `pub.sock` 和 `rpc.sock` 文件。

    后续执行 `pm2` 命令的时候，如果 `pm2` 的版本和生成 `pub.sock(rpc.sock)` 时候的 `pm2` 版本不一致，就会提示 `pm2` 版本不一致。

    这个问题很容易碰到，几乎只要升级 `pm2` 就会遇到。

    解决的办法:

    - 去掉 `.pm2` 文件夹下的 `pub.sock` 和 `rpc.sock` 文件，重新生成守护进程；
    - 使用 `pm2 update`、 `pm2 updatePM2` 命令， 盲测原理: 杀死原来的守护进程，删除掉 `pub.sock` 和 `rpc.sock` 文件，然后重新生成守护进程；
  
2. 









#### node

- `net` 模块

    `net` 模块提供了创建基于流的 `TCP` 或者和 `IPC` 相关的 `server`、`client` 的异步网络 `API`.

    `net` 模块在 `windows` 上使用具名管道支持 `IPC`，在其他操作系统上则使用 `UNIX` 域套接字。

    在 `UNIX` 上，本地域也称之为 `Unix` 域。路径是文件系统路径名。

    几个关键 `API`：
    - `net.Server`，继承自 `EventEmitter`，用于创建 `TCP` 或者 `IPC` 服务器。

        `server` 实例的事件:
        - `close`, `server` 关闭时触发；
        - `connection`, 建立新连接时触发；
        - `error`，发生错误时触发；
        - `listening`， 调用 `server.listen()` 后绑定 `server` 时触发；
        - `drop`，当连接达到 `server.maxConnections` 阈值时触发；

        `server.listen`, 启动服务器监听连接。一个 `server` 是 `TCP` 还是 `IPC` 服务器，取决于它监听的内容。如果监听的是一个路径，那么就是一个 `IPC` 服务器；如果监听的是一个端口号，那么就是一个 `TCP` 服务器。

        其他:
  
    - `net.Socket`, 继承自 `EventEmitter`，用于创建 `TCP` 套接字或者流式 `IPC` 端点。

        `socket` 实例的事件:
        - `close`, 套接字关闭时触发；
        - `connect`， 套接字成功建立连接时触发；
        - `data`， 套接字接收到数据时触发；
        - `drain`， 当写缓存区变空时触发；
        - `end`，当套接字的另一端发出传输结束时的信号时触发；
        - `error`，发生错误时触发；
        - `lookup`，在解析主机名但在连接之前触发；
        - `ready`， 套接字准备好时触发；
        - `timeout`，套接字因不活动而超时时触发；

        `socket.connect`, 在给定的套接字上启动连接。如果第一个参数是端口号，那么启动的是 `TCP` 连接；如果第一个参数是 `path` 字符串，那么启动的是 `IPC` 连接；

    - `net.createConnection`, 创建新的 `net.socket`, 并立即使用 socket.connect 发起连接。根据第一个入参的类型，来判断是 `TCP` 连接还是 `IPC` 连接。
    
    - `net.createServer`, 创建一个 TCP 或者 IPC server。

    使用 `net` 模块, 建立通信:
    - 建立一个 `server`；

        ```
        const net = require('net');
        const server = new net.Server();
        server.listen(9001, 'localhost');  // tcp 服务通信
        server.listen('xxx.socket');  // socket 文件通信

        server.on('connection', sock => {
            sock.write('123');
        });
        ```
    - 建立一个 `client`；

        ```
        const net = require('net');
        const client = new net.Socket();
        client.connect(9001);  // tcp 服务通信
        client.connect('xxx.sock');  // socket 文件通信

        client.on('data' => { ... });

        client.write('hello')
        ```

    一个 `net.Server` 实例可以对接多个 `net.socket` ？？

- `process` 模块

    关键 `api`：
    - `process.cwd()`, 返回当前 `node` 进程的工作目录；

- `child process` 模块

- `domain` 模块


