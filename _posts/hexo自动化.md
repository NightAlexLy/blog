---
title: hexo auto shell
date: 2017-06-11 21:33:12
tag:
   - linux
   - shell
   - hexo
categories:
   - hexo  
   - shell
comments: false
---

#### 灵感 ####    

　　　     最近认证阿里云学生用户，参与ESC服务器9.9元/月的活动，准备先搭建一个博客网站，写写自已的心得以及经验。之前也搭建过网站，最后由于个人没时间（没时间是假的，就是懒。哈哈）的原因导致最后服务器到期，域名被回收。累觉不爱楽、
     　　　
　　　     新站准备通过Hexo来构建（Hexo是基于NodeJs），文章通过github托管。**通过脚本来实现自动更新，自动发布等功能**。也采用Linux别名的方式来简化命令。做一个效率猿，**不做重复的事情，不浪费时间**。
　　　     
     
#### linux 命令名 ####

　　　Linux下 给命令起别名是通过 alias命令  
　　　大致语法格式： alias  name= '  command  '  
　　　
　　　如果直接在console中键入别名命令，只能在本次环境中生效，当服务器重启或者关机等异常情况，配置的别名会丢失。一般都是保存至开机启动文件中，保证自已的别名不管在什么情况下都会生效。
　　　
　　　一般都会把别名命令存放至    **~/.bashrc**  文件中。 通过`source ~/.bashrc`让配置的别名生效。   

　　　如我在服务器中配置的命令别名：

```
	 alias vwc='vi /opt/blog/_config.yml'  #编辑站点文件
	 alias vwtc='vi /opt/blog/themes/next/_config.yml'  #编辑主题文件
	 alias cdblog='cd /opt/blog'    #切换到博客目录
	 alias hs='nohup hexo server -p 80 >/dev/null 2>&1 &'  #启动hexo
	 alias hst="sh /opt/blog/killhexo.sh "   #停止hexo
	 alias psh='ps -ef | grep hexo'   #查看hexo 进程
```

#### hexo cmd console ####

　　自已编写的hexo console  ，有点low。 多多包涵，哈哈。。。
   ![hexo console](http://infos.rtime.xin/hexo_console.png)        
　　　
　　　　大致功能：
　　　　　　　１.启动hexo服务
　　　　　　　２.关闭hexo服务
　　　　　　　 3.获得hexo pid
　　　　　　　 4. 自动更新
　　　　　　　 5. 自动部署github

　　　　shell：
```
#!/bin/bash

function initUI() 
{

	while [ true ]
	do
	     echo ""
	     echo "------------------------"
	     echo "-----   h  e  x  o -----"
	     echo "------------------------"

	     echo " 1. start    server "
	     echo " 2. shutdown server "
	     echo " 3. hexo pid        "
	     echo " 4. auto update     "
	     echo " 5. auto deploy     "
	     echo -n " Please enter :     "
	     
	     read num

	     if [ -z $num ];then
	       exit 0
	     elif  [ $num = 1 ];then
	      startServer
	     elif [ $num = 2 ];then
	      stopServer
	     elif [ $num = 3 ];then
	      getPID
             elif [ $num = 4 ];then
              autoUpdate
              startServer
             elif [ $num = 5 ];then
              autoDeploy
	     else
	      echo "Input error !!!!!!"
	     fi
	done 
}

function  startServer() 
{
   cd /opt/blog
   nohup hexo server -p 80 >/dev/null 2>&1 &  
   echo -n "start server sucess !!!  PID ::: " 
   getPID
}

function stopServer()
{
   ps -ef|grep hexo |grep -v grep | grep -v /bin/bash| awk '{print $2}' | xargs kill -9  >> /dev/null
   echo "stop hexo success !!! " 
}

function getPID()
{
  ps -ef | grep hexo | grep -v grep | grep -v /bin/bash |  awk '{print $2}' 
  echo ""
}

function autoUpdate()
{

  chkHexo=`ps -ef|grep hexo |grep -v grep | grep -v /bin/bash |awk '{print $2}'`
  if [[ -z $chkHexo ]];then
     echo " hexo server is stop !!! "
  else 
     stopServer
  fi
  
  echo ""
  cd /opt/blog
  rm -rf db.json
  hexo clean
  hexo generate

}


function autoDeploy()
{
   
  autoUpdate

/usr/bin/expect <<-EOF
  spawn hexo deploy
  expect "Username"
  send "$gitUn\r"      #github UserName
  expect "Password"   
  send "$gitPwd\r"     #github Password
  interact
  expect eof
EOF

  startServer

}

clear
initUI
```

#### 定时部署github ####

　　将`console shell`中`autoDeploy`的方法，独立于一个脚本(hexo-deploy.sh)中，通过Linux下的crontab定时器，配置指定的时间规则，定时执行脚本即可实现需求。

　　如我配置的每天23:30自动部署：

　　`30 23 * * * root "sh /opt/blog/hexo-deploy.sh >> /tmp/test.txt"`

- 遇到的坑
    
　　　 Q ： crontab内环境变量与Shell环境变量不一致？
　　　 A ： 比如，我在脚本中使用hexo命令，但是hexo命令在/usr/local/bin下面。crontab环境的PATH没有指定这个目录配置，导致这个命令差找不到。自动化操作一致不成功，解决办法是在`/etc/profile`中的PATH后面追加`:/usr/local/bin`。在脚本部署的头部添加`. /etc/profile`即可。   

　　　 Q：Linux命令自动交互？`expect command not found`  
　　　 A :  `yum install -y expect`   

　　　 Q：执行脚本，直接返回killed,脚本直接结束？
　　　 A：有可能`kill -9`的时候，杀死了不存在的进程或者异常进程导致。
