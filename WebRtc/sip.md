### Sip.js 学习

**sip.js**, 一个简单而强大的 js 库，可以帮我们处理 **WebRTC** 和 **SIP** 信令。

### API 的使用

#### SimpleUser

通过 **SimpleUser** 类， 我们可以创建一个 **SimpleUser** 实例。通过这个 **SimplerUser** 实例，我们可以建立 **WebRTC 对等连接 - RTCPeerConnection**，在对等端之间传送**视频/音频/数据**。

**SimpleUser** 构建实例时的配置项 **options**:
- **aor??**
- **delegate: SimpleUser 代理配置项**
  
    **SimpleUser 代理配置项**，需要开发人员提供 **hooks**，在对等连接各个过程中触发。

    ```
    {
        onCallAnswered?: () => void,  // 当一个 session 会话被 answered 时触发；
        onCallCreated?: () => void,   // 当一个 session 会话被 created 时触发；
        onCallReceived?: () => void,  // 当收到一个 invite 呼入请求时触发；
        onCallHangup?: () => void,    // 当挂断一个 session 是触发；
        onCallHold?: () => void,      // 当 session 被 hold 或者结束 hold 时触发；
        onCallDTMFReceived?: (tone: string, during: number) => void,  // 收到一个传入的 dtmf 时触发？？ 对应的业务是什么？
        onMessageReceived?: (message: string): void,  // 收到一个 message 数据时触发；
        onRegistered?: () => void,   // simple user 注册成功触发；
        onUnregistered?: () => void,  // simple user 注销成功触发；
        onServerConnect?: () => void,  // simple user 连接服务器成功时触发；
        onServerDisconnnect?: () => void,  // simple user 断开服务器连接时触发；
    }
    ```

- **media: SimpleUser 媒体配置项**
- **reconnectionAttempts: 重连次数**
- **reconnectionDelay: 两次重连之间的延迟时间**；
- **userAgentOptions: 用户代理配置项**；


**SimplerUser** 实例方法:


**SimplerUser** 使用过程总结:


