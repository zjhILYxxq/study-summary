### npm 包生成可执行文件

1. 生成一个 js 文件，首行 #!/usr/bin/env node (动态去查找 node 来执行当前命令)
2. 在 package.json 文件的 bin 配置项指向第一步的 js 文件；
3. 这样全局安装的时候，就会在 /usr/local/bin 生成一个可执行文件；


### lerna 常用命令

常用命令:

- 初始化一个的使用 lerna 管理的仓库(新建或者更新原来的仓库);
  
    ```
    lerna init   // 默认 version 为 0.0.0 ？？

    lerna init --independent   // 使用独立的版本控制模式？？ 什么意思？？

    lerna init --exact   // 什么意思？？


    ``` 

    lerna init 命令的处理过程:
    - 执行 git init 命令, 初始化一个 git 仓库；
    - 创建/更新 package.json 文件，主要是在 devDependencies 中添加 lerna 依赖；
    - 创建/更新 lerna.json 文件, 比较关键的一项是 version，表示 lerna 管理的 packages 的版本；
    - 创建一个 packages 目录；

    
- 创建一个使用 lerna 管理的 package

    ```
    lerna create <name> [loc] 
    ```

- 给 lerna 管理的 package 添加依赖

    ```
    lerna add <pkg> [globs]

    lerna add module-1 packages/prefix-*        // 给所有前缀为 prefix 的 packages 安装 module-1 依赖，添加到 dependencies 中
    lerna add module-1 --scope=module-2         // 给 module-2 安装 module-1 依赖，添加到 depedencies 中
    lerna add module-1 --scope=module-2 --dev   // 给 module-2 安装 module-1 依赖，添加到 devDependencies 中
    lerna add module-1 --scope=module-2 --peer  // 给 module-2 安装 module-1 依赖，添加到 peerDependencies 中
    lerna add module-1                          // 给除了 module-1 以外的所有 packages 添加 module-1 依赖
    lerna add module-1 --no-bootstrap           
    lerna add babel-core                        // 给所有的 packages 添加 babel-core
    ```

    如果 package-1 依赖 package-2，那么可以执行如下命令:

    ```
    leran add package-1 --scope=package-2  --no-bootstrap  // 将 package-1 添加到 package-2 的 depedencies 中，不建立 link 关系，即 package-2 的 node_modules 中没有 package-1

    lerna add package-1 --scope-package-2  // 将 packge-1 添加到 package-2 中，并 link， 即 package-2 的 node_modules 中会有 packge-1
    

    ```

- 链接本地包

    ```
    lerna bootstrap
    ```
    
    除了链接本地包，lerna bootstrap 还会安装剩余的包依赖项
  
- lerna version
  
- lerna publish


### 固定模式/独立模式

固定模式: 将所有 packages 的版本绑定到一起， 任何包发生重大改动都会导致所有包具有新的版本；

独立模式: 独立模式，允许维护者分别为每个 package 更新版本；

```
lerna init  // 采用固定模式；

lerna init --independent // 采用独立模式；
```

### Q & A 
1. lerna init 命令执行的时候， --independent、 --exact 参数有什么用？
2. 