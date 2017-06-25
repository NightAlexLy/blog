---

title: 浅尝PHP
date: 2017-06-25 19:38:12
tag:
   - php
comments: false
---

#### 背景介绍####

　　最近需求上线，涉及到底层框架的升级（`Spring2.5.6升级为3.2.16`）。导致外部商城平台调用Java Hessian服务异常。查询订单状态异常，最后无法支付。商城平台采用的是PHP（`世界上最好的语言`）。在排查问题的时候，需要模拟PHP调Java场景。不得不在自已本地构建PHP环境。
　　
　　之前也接触过一些PHP的信息，比如说很出名的博客平台[WordPress](https://cn.wordpress.org/)，一些YY网站（嘿嘿~~~~）。常用的PHP构建环境`LMAP（Linux+Mysql+Apache+PHP）`，能够帮助我们快速迭代出一个站点。在互联网的初期，很多站点都是采用PHP开发的，比如淘宝商城的第一版(最后在某一些性能或者安全方面的考虑，慢慢的被替换，架构也与之不断的演变。这里就不细述)。
　　
　　还有一点就是PHP语言入门门槛比较低，编写完的代码直接扔到容器中运行即可。 没有java编译，重新部署等等复杂的流程。每个语言都有自已的优劣势。不同场景下使用不同的语言和技术即可。

#### 环境搭建####

　　1.下载[XAMPP](https://www.apachefriends.org/zh_cn/index.html)，一键构建`Apache+MariaDB+PHP+Perl`环境
　　2.下载[upupw](http://www.upupw.net/)，点击下载Apache服务即可。
　　
　　第二种方式会比第一种方式更加简单，在功能上没有第一点多，但是小而美。足够我们使用。
　　
　　我下载的是[PHP 5.4](UPUPW_NP5.4-1511.7z)版本。
　　
　　下载完成直接解压，双击upupw.exe既可以运行。

　　![upupw console](http://ore2d9chp.bkt.clouddn.com/upupw_console.png)
　　

#### Hello World####
　　
　　打开`upupw`,输入`s1，`开启全部服务。等待完成之后浏览器中输入`http://localhost/`.看到如下页面表示启动应用成功。

　　![](http://ore2d9chp.bkt.clouddn.com/upupw_index.png)
　　
　　现在，我们来开发一个PHP版本的`HelloWorld`。
　　在容器的应用部署目录（解压包的`htdocs`目录）下新增一个test.php文件，键入如下代码：
```
	<?  
	   echo "Hello world";
	   print "hello world";
	 ?>
```
　　打开浏览器重新输入`http://localhost/test.php`，返回页面中包含`"hello world"`输出即表示应用无问题，并且运行正常。一个PHP简单版本的HelloWorld就完成了。
　　
#### 后续思考####
　　
　　- PHP的语法，数据结构，关键词，基础库，第三方框架等？
　　- PHP中存在JAVA中类似Main方法的入口？
　　- 语言的使用场景？
　　- 最佳实践？以及与JAVA语言的类比？
　　- 常用的开发工具？
　　

	
	 

