---
title: Eclipse远程debug 
date: 2018-07-23 18:30:12
tag:
   - java
   - debug
categories:
   - java
   - eclipse
comments: false
---

####  添加远程debug参数 ####

tomcat在catalina.sh中添加如下内容：

```
CATALINA_OPTS="-Xdebug  -Xrunjdwp:transport=dt_socket,address=8000,server=y,suspend=n"(不要换行，要在同一行)
```

windows 环境添加如下内容：
```
Set  “CATALINA_OPTS=-Xdebug  -Xrunjdwp:transport=dt_socket,address=8000,server=y,suspend=n"
```
####  验证环境变量是否生效 ####

![debug](http://ore2d9chp.bkt.clouddn.com/java_debug.png)

或者

![debug](http://ore2d9chp.bkt.clouddn.com/java_debug2.png)

#### Eclipse配置Debug ####

![debug](http://ore2d9chp.bkt.clouddn.com/java_debug3.png)

Debug Configurations中，做如下配置

![debug](http://ore2d9chp.bkt.clouddn.com/java_debug4.png)

配置成功后，启动服务。

在程序需要调试的地方添加断点，发起请求。即可进行远程调试。

点击如下按钮，可以断开连接

![debug](http://ore2d9chp.bkt.clouddn.com/java_debug5.png)

