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

    lerna bootstrap 命令的执行过程:
    1. 建立各个 packages 之间的依赖关系，找到各个 packages 依赖的其他 packages
    2. 使用 childProcess.exec 执行 npm install xxx / yarn add xxx 命令来安装依赖的包;
    3. 基于 node 的 fs.symlink 的方式，根据 packages 之间的依赖关系，建立软链接( 和 npm link 的原理一样，软链接可以理解为应用的快捷访问方式，)

    npm link 的工作过程(是这样吗):
    - 在被引用的 package 中，执行 npm link 命令，在 /user/local/lib/node_modules 中建立一个软链接；
    - 在引用的 package 中， 执行 npm link xxx 命令，在本地 node_modules 中建立一个软链接；
  
- 确定每个 packages 的 versions


    使用的命令为 lerna versions

    lerna version 命令的主要工作是标识出上一个 tag 版以来发生更新的 package， 然后为这些包迅速出版本，在用户完成选择之后修改相关包的版本信息，并且将相关的变动 commit，然后打上 tag 推送到 git remote。

    lerna version 命令的执行过程:
    1. 检查当前 git 分支的信息(检验本地是否有 commit、分支是否正常、分支的远程分支是否存在、当前分支是否允许), 如果没有 commit，则无法进行，返回异常；
    2. 拿到上次的打的 tag；
    3. 检查哪个 packages 发生变化(使用 git diff 命令，对比上一次的 tag，判断 packages 是否发生变化);
    4. 获取需要更新的 version，并由用户确认；
    5. 更新 packages 的 versions，并更新依赖的 versions(固定模式下，更新所有的 packages；独立模式下，更新变化的 packages 的 versions);
    6. 使用 git tag 打标记；
    7. 使用 git push 命令 push；


    独立模式下， package2 依赖 package1， package1 版本更新时，即使 package2 没有发生变化，也需要更新版本；

  
- 发包
  
    使用的命令是 lerna publish，将需要发布的包，发布到 npm registry。

    ```
    lerna publish    // lerna version + lerna publish from-git

    lerna publish from-git  // 发布当前 commit 中打上 annoted tag version 的包

    lerna publish from-packges  // 发布 package 中 pkg.json 上的 version 在 registry(高于 latest version)不存在的包
    ```

- 执行每个 packages 包的 script 脚本

    使用的命令是 lerna run script

    ```
    lerna run build // 执行每个 packages 的 build 脚本
    ```
    


### 固定模式/独立模式

固定模式: 将所有 packages 的版本绑定到一起， 任何包发生重大改动都会导致所有包具有新的版本；

独立模式: 独立模式，允许维护者分别为每个 package 更新版本；

```
lerna init  // 采用固定模式；

lerna init --independent // 采用独立模式；
```

### Q & A 
1. lerna init 命令执行的时候， --independent、 --exact 参数有什么用
2. 软链接和硬链接?
3. 包相关的生命周期方法?
4. 为什么要打 tag ？

    检查哪个 packages 是否发生变化，需要对比上一次的 tag