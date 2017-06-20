
---
title: Hexo 搭建
date: 2017-06-13 23:33:12
tag:
   - hexo   
categories:  
   - hexo  
comments: false
---

#### 前提####

　　最近准备搭建一个博客平台，也看了很多开源的博客框架。比如[Solo](https://github.com/b3log/solo)、[wordpress](https://wordpress.org/)等框架、自已曾经也在[cnblog](http://www.cnblogs.com/LuisYang/)发布过几篇文章、东写写西写写、杂乱无章的。后续可以写一个自动同步各平台的程序~~~

- Solo 是基于Java语言开发的，容器部署有tomcat、或者自带的Jetty等方式
- wordpress是基于PHP语言开发的
- Hexo是基于nodejs语言开发的
- cnblog应该是.net开发的、没研究过.推测、哈哈


#### Hexo####

　　Hexo 是一个快速、简洁且高效的博客框架。Hexo 使用 [Markdown](http://daringfireball.net/projects/markdown/)（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。


　　文档：[Docs](https://hexo.io/zh-cn/docs/)
　　主题：[Themes](https://hexo.io/themes/)
　　插件：[Plugins](https://hexo.io/plugins/)


#### 构建NodeJS环境####

　　本过程的安装环境：
```
	[root@luisyang tmp]# uname -a
	Linux luisyang 3.10.0-327.36.3.el7.x86_64 #1 SMP Mon Oct 24 16:09:20 UTC 2016 x86_64 x86_64 x86_64 GNU/Linux
```
　　下载[NodeJS](https://nodejs.org/en/download/)，我选择的是`Source Code`的版本。采用编译安装的方式。
　　
　　Linux下可以通过wget命令直接下载、不需要下载到本地，在上传到远程服务器。

```
	cd /opt
	wget https://nodejs.org/dist/v6.11.0/node-v6.11.0.tar.gz
```

　　解压安装：
	
```
	tar xvf node-v6.11.0.tar.gz
	cd node-v6.11.0
	./configure
	make
	make install
	cp /usr/local/bin/node /usr/sbin/
	
	查看当前安装的Node版本
	node -v

	查看当前安装npm版本    ---类似于Linux下面的yum
	npm -v
```

#### 构建Git环境####

　　`Github`提供通过[Github Pages](https://github.com/blog/272-github-pages)搭建个人主页。 `Hexo`的`deploy`命令可以将生成文章的静态文件部署到远程Github服务器。也可以通过`GitHub`动态管理维护自已的文章。
　　
　　基于这些前提、决定先在自已的Linux服务器`[CentOS 7]`中构建Git环境。   
　　
```
    //先安装git依赖的包 
    yum install zlib-devel 
    yum install openssl-devel 
    yum install perl 
    yum install cpio 
    yum install expat-devel 
    yum install gettext-devel 
    
    //安装autoconf 
    yum install autoconf 
    
    //安装git 
    wget http://www.codemonkey.org.uk/projects/git-snapshots/git/git-latest.tar.xz 
    xz -d git-latest.tar.xz
    tar xzvf git-latest.tar.gz 
    cd git-{date} 
    autoconf 
    ./configure --with-curl=/usr/local 
    make 
    make install
```

　　安装`Git`的步骤大同小异，下载包、安装、配置、配合命令使用既可
　　
　　[起步 - 安装 Git](https://git-scm.com/book/zh/v1/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)
　　[安装Git](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/00137396287703354d8c6c01c904c7d9ff056ae23da865a000)
　　

#### 搭建Hexo服务器####

```
	cd /opt    
	npm install hexo-cli -g
	hexo init blog
	cd blog
	npm install
	hexo server
```
　　`hexo命令`：

```
	Usage: hexo <command>
	
	Commands:
	  help     Get help on a command.
	  init     Create a new Hexo folder.
	  version  Display version information.
	
	Global Options:
	  --config  Specify config file instead of using _config.yml
	  --cwd     Specify the CWD
	  --debug   Display all verbose messages in the terminal
	  --draft   Display draft posts
	  --safe    Disable all plugins and scripts
	  --silent  Hide output on console
	
	For more help, you can use 'hexo help [command]' for the detailed information
	or you can check the docs: http://hexo.io/docs/
```
　　一般我都是采用后台的方式启动Hexo Server
```
	nohup hexo server -p 80 >/dev/null 2>&1 &
```
　　Kill后台进程：
```
	ps -ef | grep hexo   #获得Hexo的后台进程
	kill -9 pid   #杀死进程
```

#### 下载Hexo主题 ####
　　Hexo的主题默认存放在`blog根目录下的themes目录[/opt/blog/themes]`下。默认主题：`landscape`

　　本博客采用开源的[next](http://theme-next.iissnan.com/)主题。外观炫酷吊炸天，简洁明了，博主对常见的配置问题都做了很清晰的讲解。构建起来也比较简单

```
	下载主题
	cd /opt/blog
	git clone https://github.com/iissnan/hexo-theme-next themes/next
	
	启动主题
	vi /opt/blog/_config.yml
	找到thems属性,修改为next.重启即可。 
	
	启动服务
	hexo server
```

　　
　　一个简单的`Hexo博客`就搭建好了。【本文中的`Git环境`是为另外一篇文章构建基础~~~~】
　　

