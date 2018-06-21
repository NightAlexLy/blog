
---
title: Hexo Daemon 
date: 2017-06-14 14:15:12
tag:
   - hexo
   - nginx
   - shell  
categories:  
   - hexo  
comments: false
---

#### 前提####

　　今天中午的时候发现自已网站突然不能访问了，我猜肯定是后台的`hexo`服务异常自动kill掉了。果然登录服务器`ps -ef | grep hexo`查看进程，果然发现hexo的进程不在了。由于我将输出的日志指向了`/dev/null`（Linux下的垃圾回收箱）。排查不了错误信息，只能思考有什么方法保证网站一直正常访问。
　　
　　Hexo后台启动命令：`hexo server &`
　　
　　**大致方法**
　　-  通过守护脚本的方式，检测进程是否存在，如果不存在则启动
　　- forever让nodejs应用后台执行
　　- 通过nginx反向代理静态文件的方式
　　
#### 守护脚本####

```
	#! /bin/sh
	#进程名字可修改
	PRO_NAME=hexo
	 
	while true ; do
	 
	#    用ps获取$PRO_NAME进程数量
	  NUM=`ps aux | grep ${PRO_NAME} | grep -v grep |wc -l`
	#  echo $NUM
	#    少于1，重启进程
	  if [ "${NUM}" -lt "1" ];then
	    echo "${PRO_NAME} was killed"
	    hexo server &
	#    大于1，杀掉所有进程，重启
	  elif [ "${NUM}" -gt "1" ];then
	    echo "more than 1 ${PRO_NAME},killall ${PRO_NAME}"
	    killall -9 $PRO_NAME
	    hexo server &
	  fi
	#    kill僵尸进程
	  NUM_STAT=`ps aux | grep ${PRO_NAME} | grep T | grep -v grep | wc -l`
	 
	  if [ "${NUM_STAT}" -gt "0" ];then
	    killall -9 ${PRO_NAME}
	    hexo server &
	  fi
	done
	 
	exit 0
```

#### ｎpm ｆorever####

　　项目地址：[foreverjs/forever](https://github.com/foreverjs/forever)
　　资料：
　　　　[Hexo快速搭建](https://zhuanlan.zhihu.com/p/21518843)
　　　　[Hexo博客后台运行技巧](http://www.tuijiankan.com/2015/05/08/hexo-forever-run/)
　　-  **安装步骤**：

```
	
	[sudo] npm install forever -g
	
	cd /path/to/your/project  #hexo根目录
	[sudo] npm install forever-monitor
	
	#检查forever是否安装完成
	forever   #返回帮助文档
```

　　-  **`forever`基础命令**：

```
	$ sudo npm install forever -g   #安装
	$ forever start app.js          #启动
	$ forever stop app.js           #关闭
	$ forever start -l forever.log -o out.log -e err.log app.js   #输出日志和错误
```


　　- **守护`Hexo`**：
　　在`Hexo`的根目录`/opt/blog`下创建app.js文件。
　　添加如下内容：

```
	var spawn = require('child_process').spawn;
	free = spawn('hexo', ['server', '-p 4000']);/* 其实就是等于执行hexo server -p 4000*/
	
	free.stdout.on('data', function (data) {
		console.log('standard output:\n' + data);
	});
	
	free.stderr.on('data', function (data) { 
		console.log('standard error output:\n' + data);
	});
	
	free.on('exit', function (code, signal) {
		console.log('child process eixt ,exit:' + code);
	});
```
　　- **启动`forever`**：

```
	forever --minUptime 10000 --spinSleepTime 26000 start app.js
	
	## minUptime、spinSleepTime可填可不填，不填默认也会有，参数的意思可以直接去forever上查询。
```

　　- **验证**：
　　　-  检查forever是否监控进程(  `forever list`  )
　　　-  查看hexo进程号
　　　-  kill 掉Hexo进程( `kill -9 pid` )
　　　- 重新查看hexo进程号
　　**如果两次的pid不一样,表示`hexo`进程不存在时，会自动重启、**
　　
　　![forever test](http://infos.rtime.xin/forever_test.png)

#### Nginx静态化####

　　[Hexo静态化Host尝试](http://www.tuijiankan.com/2015/05/26/change_hexo_to_static/)
　　
　　通过`hexo g`会生成整个站点静态文件，默认存放在`blog`的`public`目录。
　　采用Nginx指向本地静态资源目录的方式暴露服务。Nginx默认启动会创建两个线程，一个Master process（对请求分配），一个work process（处理每个请求）。对请求的透传处理，不作任何处理。所以相对于其他容器而言更加稳定，并且访问静态资源的效率上会比部署在一般容器中更快。

　　**Nginx部署**
		
　　[linux环境下安装nginx教程](http://jingyan.baidu.com/album/1974b2898f5eadf4b1f774de.html?picindex=6)
　　[linux下安装nginx](http://www.cnblogs.com/kunhu/p/3633002.html)
　　[Installing nginx on CentOS 6.4](https://codybonney.com/installing-nginx-on-centos-6-4/)
```
	yum install pcre* -y
	yum install openssl* -y
	yum install zlib -y
	yum install zlib-devel -y
	yum install wget -y 
	
	cd /opt
	wget http://nginx.org/download/nginx-1.13.0.tar.gz
	cp nginx-1.13.0.tar.gz /usr/local
	cd /usr/local
	tar -zxvf nginx-1.13.0.tar.gz
	mv nginx-1.13.0 nginx
	
	./configure --prefix=/usr/local/nginx
	make && make install 
	ln -s /usr/local/nginx/sbin/nginx /usr/local/bin/nginx
	
	#启动
	nginx
	
	#浏览器直接访问http://localhost/即可访问到Nginx的静态页面
	#因为Nginx默认占用80端口,所以必须以root用户启动
```
　　**编辑Nginx配置文件**
　　　- 静态文件的方式
```
	server {
	  listen 80;
	  server_name rtime.xin www.rtime.xin notes.rtime.xin;
	  if ($host != 'www.rtime.xin' ) {
	        rewrite ^/(.*)$ http://www.rtime.xin/$1 permanent;
	    }
	  location / {
	    root /opt/blog/public;
	    index index.html index.htm;
	  }
	}
```
　　　- 端口的方式

```
	server {
	  listen 80;
	  server_name rtime.xin www.rtime.xin notes.rtime.xin;
	  #access_log /var/log/nginx/log/host.access.log main;
	  location / {
	    proxy_pass              http://127.0.0.1:4000/;
	    proxy_redirect          off;
	    proxy_set_header        X-Real-IP       $remote_addr;
	    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
	  }
	}
```

　　建议还是采用`静态资源代理`的方式。效率上可以直接秒杀通过反向代理hexo服务的方式。但是***存在缺陷是public目录必须是最新的***、所以每次编写完文章之后，必须执行`hexo g`,生成最新的静态资源。

#### 遇到的问题####

　　Q ： **nginx 1.9.5 ./configure: error: invalid option "–with-http_spdy_module"？？**
　　A：nginx 1.9.5 已经没有了 --with-http_spdy_module ，取代的是 --with-http_v2_module


#### 后续待完成####

-  Nginx开机自启动
-  Forever命令开机自启动
- 二级域名映射-Nginx
- 阿里云添加80监控

