---
title: Linux下开机自启动
date: 2018-05-15 20:33:12
tag:
   - linux   
categories:  
   - linux  
comments: false
---

　　今天服务器宕机，重启系统。应用没有自动恢复（启动），导致服务中断一段时间。抽空研究了下Linux的自启动方式。                            

　　服务器信息：                      
　　　Operting System Type :  GNU/Linux            
　　　Check OS Release Version and Name :                 
　　　Check Acrhitecture :  x86_64                  
　　　Check Kernel Release :  3.10.0-693.21.1.el7.x86_64                  
　　　Check Hostname :  VM_165_68_centos                 

#### /etc/rc.local####

　　**最简单暴力的方式**                   

    编辑 /etc/rc.local文件  [vi /etc/rc.local]               
```
　　# custom startup
    # 启动tomcat服务， 准备下面服务的方式，但是实践下来没有成功
　　cd /opt/package/tomcat-7.0.86/bin/ && ./startup.sh >> /tmp/tomcat.log 
　　# 启动Nginx服务
　　/usr/local/bin/nginx >/dev/null 2>&1 &
　　# 启动Docker服务
　　systemctl restart docker.service
　　# 启动Docker Redis服务
　　/usr/bin/docker run -p 6379:6379 -v $PWD/data:/data  -d redis:3.2 redis-server --appendonly yes
```

#### 服务的方式####

　　**需要有一定的脚本基础。**                       
　　cd /etc/rc.d/init.d                           
　　创建服务对应的脚本：                    
　　touch service               

　　编写服务对应的脚本(如下示例Nginx)：           
```
  其中'要替换成`

#!/bin/sh
# chkconfig : 345 86 14
# description:
NGINX_DIR=/usr/local/nginx
export NGINX_DIR
case $1 in
     'start')
        echo "start nginx...."
        $NGINX_DIR/sbin/nginx
        ;;
     'reload')
        echo "Reload nginx configuration...."
        kill -HUP `cat $NGINX_DIR/logs/nginx.pid`
        ;;
     'stop')
        echo "stopping nginx...."
        kill -15 'cat $NGINX_DIR/logs/nginx.pid'
        ;;
     'list')
        ps aux | egrep '(PID|nginx)'
        ;;
     'testconfig')
        $NGINX_DIR/sbin/nginx -t
        ;;
     'version')
        $NGINX_DIR/sbin/nginx -v
        ;;
     'tailLog')
        tail -f $NGINX_DIR/logs/error.log
        ;;
     'catLog')
        cat $NGINX_DIR/logs/error.log
        ;;
     *)
echo "usage: 'basename $0' {start | reload | stop | list | testconfig | version | tailLog | catLog}"
esac

```

　　添加服务        
　　`chkconfig add service`            

　　设置启动               
　　`chkconfig service on`                 

```

chkconfig 帮助文档

chkconfig --help

chkconfig version 1.7.4 - Copyright (C) 1997-2000 Red Hat, Inc.
This may be freely redistributed under the terms of the GNU Public License.

usage:   chkconfig [--list] [--type <type>] [name]
         chkconfig --add <name>
         chkconfig --del <name>
         chkconfig --override <name>
         chkconfig [--level <levels>] [--type <type>] <name> <on|off|reset|resetpriorities>

chkconfig --list

jenkins         0:off   1:off   2:on    3:on    4:on    5:on    6:off
mysql           0:off   1:off   2:on    3:on    4:on    5:on    6:off
netconsole      0:off   1:off   2:off   3:off   4:off   5:off   6:off
network         0:off   1:off   2:on    3:on    4:on    5:on    6:off


运行级别0：系统停机状态，系统默认运行级别不能设为0，否则不能正常启动
运行级别1：单用户工作状态，root权限用户，用于系统维护，禁止远程登陆
运行级别2：多用户状态(没有NFS)
运行级别3：完全的多用户状态(有NFS)，登陆后进入控制台命令行模式
运行级别4：系统未使用，保留
运行级别5：X11控制台，登陆后进入图形GUI模式
运行级别6：系统正常关闭并重启，默认运行级别不能设为6，否则不能正常启动

```


#### 对比####

　　首先从实践的角度上肯定是第一种比较方便的。第二种需要一定的脚本能力，发现问题能够及时排查解决。              

#### 资料####

- [linux开机自启动的几种方法](https://blog.csdn.net/aggressive_snail/article/details/50640187)
- [linux设置开机自启动](https://www.cnblogs.com/ssooking/p/6094740.html)
- [linux教程：[4]配置Tomcat开机启动](https://jingyan.baidu.com/article/6525d4b1382f0aac7d2e9421.html)