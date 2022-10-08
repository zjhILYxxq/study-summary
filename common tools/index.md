1. patch-package

    把本地对第三方类库的修改，同步给其他的开发人员。

    操作流程：

    - 本地先安装 patch-package、postinstall-postinstall 到 devDependencies 中；
    - 修改完第三方类库以后，执行 npx patch-package xxx 命令，在本地生成一个 .patch 文件夹；
    - 在 package.json 的 scripts 中添加 "postinstall": "patch-package" 脚本；
    - commit 生成的 .patch 文件、修改的 package.json 文件；
    - 团队人员拉取代码，然后 yarn；