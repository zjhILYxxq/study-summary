### WebRTC 学习笔记

**WebRTC**，全称 **Web Real-Time Communication**， **网页实时通信技术**。

建立 **WebRTC** 会话的流程:
1. 获取本地媒体(关键 api - navigator.getUserMedia);
2. 在浏览器和对等端(其他浏览器或者终端)之间建立**对等连接**(关键技术 - RTCPeerConnection、ICE - Interactive Connectivity Establishment，交互式连接建立技术、 NAT - Netwrok Address Transition 打洞？？)；
3. 将媒体和数据通道关联至第二步建立的连接(关键技术 - RTCSessionDescription，会话描述)；
4. 交换会话描述；

获取**本地媒体**的方式: **navigator.getUserMedia()**


**WebRTC** 相关协议:
- **应用层协议**:
  - **HTTP**: 超文本传输协议，Hyper-Text Transport Protocol;
  - **WebSocket**；
  - **RTP**: 实时传输协议， Real-time Transport Protocol；
  - **SRTP**: 安全 RTP，Secure Real-time Transport Protocol；
  - **SDP**: 会话描述协议， Session Description Protocal
  - **ICE**: 交互式连接建立协议， Interactive Connectivity Establishment，打洞？
  - **STUN**: NAT 会话穿透使用工具协议， Session Traversal Utilities for NAT
  - **TURN**: STUN 协议的扩展，用于在 ICE 打洞失败时提供媒体中继？？
- **传输层协议**:
  - **TLS**: 传输层安全协议， Transport Layer Security；
  - **TCP**: 传输控制协议，Transmission Control Security；
  - **DTLS**: 基于 UDP 运行的 TLS；
  - **UDP**: 用户数据报协议， User Datagram Protocol;
  - **SCTP**: 流控制传输协议， Stream Control Transport Protocol；
- **网络层协议**:
  - **IP**: 网络协议， Internet Protocol;


**WebRTC** 中的**媒体流(mediaStram)**:
- **麦克风音频流**(从手机发出);
- **应用程序共享视频流**(从手机发出);
- **前置摄像头视频流**(从手机发出);
- **后置摄像头视频流**(从手机发出);
- **网络摄像头视频流**(从电脑发出);
- **立体声音频流**(从电脑发出)；

**WebRTC** 中多方会话采用的体系模型:
- **全网状模型**，每个浏览器均与其他浏览器建立全网状的对等连接，不需要媒体服务器基础架构、延迟低且质量高，但不适用于大型的多方会议；
- **集中式媒体服务器**， 每个浏览器均与媒体服务器建立单个对等连接，可支持大型的多方会议；


**RTCPeerConnect**， **WebRTC** 的对等连接。

**RTCSessionDescription**， 会话描述对象。

**媒体协商**，是指通信中的双方进行**通信**并就可以接受的**媒体会话**达成一致的过程。整个过程也称之为**提议/应答**交换。

**提议**，一方向另一方发送其支持并要设置的**媒体类型和功能**；

**应答**，指示在所提议的媒体类型和功能中，哪些是支持并可接受的；

当浏览器 M 的用户决定与浏览器 L 的用户通信时，浏览器 M 的 Javascript 将针对其需要的**媒体**提供**基于约束的描述**、**请求媒体数据**并获取**用户许可**。**用户授予的许可**必须绑定到**网页所在的域**，并且不能扩展到网页上的弹出窗口和其他框架，这一点非常重要。

当**提议/应答**交换完成以后，即可开始**打洞**，并最终交换媒体数据包。


#### 本地媒体

**轨道**，**MediaStreamTrack** 是 **WebRTC** 中的**基本媒体单元**。**MediaStramTrack** 在 **User Agent** 中表示一段媒体源，比如音轨或者视频。





#### MediaDevices API - 媒体设备

- **navigator.mediaDevices.enumerateDevices**： 返回一个可用的**媒体输入/输出设备**的列表

    关键信息：
    - **媒体输入/输出设备**，包括麦克风、耳机、摄像头等。设备的类型分为三种，**audioinput** - 麦克风； **audiooutput** - 耳机、扬声器； **videoinput** - 摄像头；
    - **可用**，意味着麦克风、摄像头的权限控制为允许；


    **enumerateDevices** 返回的是一个 **MediaDeviceInfo - 设备描述对象**的列表。

- **navigator.mediaDevices.getUserMedia**： 返回可以使用的**媒体输入 - mediaStream**， 里面包含了**请求的媒体类型的轨道 - mediaStramTrack**。

    **mediaStramTrack** 表示单一的**媒体流**，可以是**音频**，也可以是**视频**，但只能是两者中的一种。如果是**音频**，称为 **audio track - 音轨**；如果是视频，称为 **video track - 视频轨**。

    **mediaStream** 用于将多个 **mediaStreamTrack** 打包到一起。一个 **mediaStram** 可包含多个 **mediaStreamTrack**。

    通过 **mediaStream.getTrack()** 方法可以获取 **mediaStream** 内部包含的 **mediaStreamTrack**。


#### 信令

在**实时通信**中， **信令**的主要作用体现在四个方面：
- **协商媒体功能和设置** - 通过**信令通道**交换**候选地址**，然后开始 **ICE 打洞**，建立**对等连接**？？
- **标识和验证会话参与者的身份** - 信令通道提供参与者的标识，可进行身份验证；
- 控制媒体会话、指示进度、更改会话和终止会话？
- 当会话双方同时尝试建立或更改会话时，实施双占用分解 - **Glare Resolution** ？？
  
上面这四个是什么东东...

**信令**是 **Web 浏览器**和 **Web 服务器**之间的一种事物。 ？？

**信令**，最重要的功能在于，在参与**对等连接**的两个浏览器之间交换**会话描述协议(SDP - Session Description Protocl)**对象中包含的信息。

SDP 中包含的信息：
- **媒体类型**(音频、视频、数据)；
- **所用的编解码器**(Opus、G.711 等)；
- **用于编解码器的各个参数或设置**；
- **有关带宽的信息**；


**候选地址**:**IP 地址或 UDP 端口**，浏览器可从中接收潜在媒体数据包 ？？

注意，只有通过信令通道交换候选地址以后，才能开始 ICE 打洞。没有信令功能，就无法建立对等连接。

**双占用问题**：当**通信会话**的双方**同时**尝试建立或者更改会话时，就会出现双占用问题。而通过信令可双占用分解？？

**WebRTC** 要求在两个浏览器之间建立**双向信令通道**， 通常有三种方式用于传输 WebRTC 信令：
- **HTTP 轮询**， 也称之为 RESETful 信令；
- **WebSocket**， 需要一个 WebSocket 服务器(浏览器之间无法直接开通 WebSocket， 浏览器实施的是 HTTP 用户代理功能，而不是 HTTP 服务器功能)；
- **数据通道**也可以传输信令(前提是通过 HTTP 轮询或者 WebSocket 传输信令建立连接)？？；


#### 对等媒体

**WebRTC** 采用独特的**对等媒体流**，**语音**、**视频**、**数据**的连接都直接在**两个浏览器**之间建立。

由于 **NAT( Network Address Translation)** 和**防火墙**的存在，导致建立对等连接存在一定的实施难度，此时就需要借助 **STUN** 和 **TURN** 服务器来建立**对等连接**。

NAT ？？ 防火墙？？  STUN？？  TURN？？

不采用 **WebRTC** 的媒体流： 借助 Web 服务器，对带宽要求很高，可扩展性较低。

采用 **WebRTC** 的媒体流： 通过 **RTCPeerConnection** 建立浏览器之间的对等连接，低延迟、数据包丢失率低。

**NAT: 让多部设备共享同一 IP 地址，负责维护私有 IP 地址、端口号与公共 IP、端口号之间的映射表**。

**打孔技术，通常可在位于不同 NAT 之后的两个浏览器之间建立直接对等会话**。

**如果两个浏览器都位于同一个 NAT 之后，则打孔技术通常可建立一个永不延伸到 NAT 之外的连接**。

STUN 服务器 ？？

TURN 服务器 ？？









#### 对等连接和提议/应答协商

**WebRTC** 标准定义了两组主要的功能： **媒体捕获**和**媒体传输**。

**对等连接**和**提议/应答协商**的概念是建立 **WebRTC 对等媒体和数据**的核心。





