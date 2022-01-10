#### 组织静态资源

html：协商缓存;

js、css: 使用强缓存 + 内容 hash + 上 cdn;

#### 前端自动化构建

自动化构建 + 通知

了解一下 k8s + docker + rancher + gitlab ci/cd + 微信机器人

- gitlab  hook(husky)  ci/cd

- k8s 

- docker: 构建镜像，推送镜像， 保持环境一致性

    dockerfile 的配置:
    - FORM: 继承某个镜像
    - WORKDIR: 指定工作路径
    - COPY: 复制文件到指定的工作路径
    - EXPOSE: 将容器的端口暴露出去；
    - CMD: 执行命令；
    - RUN: 执行 npm 脚本？

- rancher: 根据镜像，生成容器

#### 其他

- 预发环境

- 版本管理 - 回滚: node 应用 - 容器回滚； 子应用 - 静态资源回滚；

- 灰度控制、小流量：发布多个版本，后端根据前端用户信息给出对应的 html 页面；