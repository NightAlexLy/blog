
---
title: Git 问题小结
date: 2018-07-24 21:16:12
tag:
   - git  
categories:  
   - git
comments: false
---

#### Git Status 中文乱码解决 ####

　　**现象：**　　
   ![hexo console](http://infos.rtime.xin/git_status.png)

　　**解决办法：**打开`Git Bash`，执行`git config --global core.quotepath false`

#### linux init git project ####

- GitHub上创建一个repositories项目,比如 ：https://github.com/NightAlexLy/doc.git
- 在自已的项目下面执行。 `git init`
- 将资源文件添加到git。`git add . `
- 提交 `git commit -m "log message`（自己的提交日志）"
- `git remote add origin https://github.com/NightAlexLy/doc.git`，在github上面添加origin
- `git push -u origin master`  ,将代码同步至github。
- 上面一步报错可能需要执行`git pull --rebase origin`

#### git提交每次都输入密码 ####

```
查看git origin的地址：  git remote -v

　git remote rm origin
　git remote add origin https://username:password@github.com/username/test.git
　git push origin master
```

#### git 错误: Unable to find remote helper for 'https'解决方法 ####

```
　vi /etc/profile
  添加"export PATH=$PATH:/usr/libexec/git-core"

  source /etc/profile

或者是安装问题

  make prefix=/usr all doc info ;# as yourself  
  make prefix=/usr install install-doc install-html install-info ;# as root  

```

#### git 回滚远程仓库提交 ####

```
  先通过  git log  查找要回退的 节点（commit_hash)


  git reset --hard commit_hash

  git push origin HEAD --force


```