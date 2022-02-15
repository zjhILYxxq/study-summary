### WebRTC 学习笔记

**WebRTC**，全称 **Web Real-Time Communication**， **网页实时通信技术**。

建立 **WebRTC** 会话的流程:
1. 获取本地媒体(关键 api - navigator.getUserMedia);
2. 在浏览器和对等端(其他浏览器或者终端)之间建立连接(关键技术 - RTCPeerConnection、ICE - Interactive Connectivity Establishment，交互式连接建立技术、 NAT - Netwrok Address Transition 打洞？？)；
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


