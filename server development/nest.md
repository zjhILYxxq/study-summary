#### express

#### egg

#### koa

#### nest

#### next

#### pm2

预备知识点: process、child_processes、cluster；

pm2 是一个守护进程管理器，能帮助我们管理项目，并保证项目时刻在线。

负载均衡 ？？

pm2-axon 是一个面向消息的 node.js 套接字库，深受 zeromq 的启发 ？？

rpc, remote procedure call protocol, 远程过程调用协议。

node 的 rpc 通信 - 调用其他进程或者机器上的函数。 rpc，用于进程间的通信 ？？ 所以 rpc 最关键的就是通信 ？？

pm2-axon-rpc

pm2-axon、pm2-axon-rpc 这两个 npm 包怎么用？

相关 npm 包: pm2-axon、 pm2-axon-rpc、@pm2/agent、@pm2/io、@pm2/js-api、@pm2/pm2-version-check？ 这些 npm 包都有什么用？

进程间通信: socket 文件和 tcp。如果进程都在本地，用 socket 文件效更高些，而且不占用端口号，权限也更好控制；如果进程在不同的服务器，使用 tcp。

IPC 进程间通信的方式:
- 管道/匿名管道 - pipe；
- 有名管道 - FIFO；
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







#### node

- `net` 模块

