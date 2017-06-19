---
title: shell 问题总结
date: 2017-06-11 19:33:12
tag:
   - linux
   - shell
comments: false
---

#### 反思#### 

　　由于自已从事`java`后端开发这块的工作，有时候会登录到远程`Linux`服务器查看日志，分析错误，统计数据等场景，会键入大量的命令。突发奇想，可以通过编写脚本（`Shell`）来实现工作简化。提到`Linux Shell`，自已曾经也系统化学习过，买过关于`Shell编程`的书籍。但是当自已要开始编写脚本的时候，才发现一些基础的知识都可能遗忘掉，比如声明变量、基础语法（`if-else`，`for`）、方法定义 （`function`）、自带Linux命令等一些基础的东西。只能通过百度一点点组装，完成最后脚本的编写，花费了大量的时间以及精力，不断地去重复搜索与记忆。也许自已不是一个运维工程师，不需要去尝试写这些东西。但是编写脚本，简化工作，节约时间，最后受益的人是自已，不是别人。
　　
　　 只有畏惧不敢尝试才是真正的失败！
　　 
　　 本篇仅是对自已搜索知识的记录，方便下次查找！！！

#### Shell接收用户输入####

　　[read命令读取用户输入](http://www.linuxidc.com/Linux/2015-08/122471.htm)
　　[Shell脚本交互之：自动输入密码](http://blog.csdn.net/zhangjikuan/article/details/51105166)
　　
　　通过read命令	
```
	示例：
	read test
	echo $test
```

#### Shell中声明函数####

　　[Shell函数：Shell函数返回值、删除函数、在终端调用函数](http://c.biancheng.net/cpp/view/7011.html)
　　
　　通过funcation name(){}方式声明函数，{}中放入需要执行的命令。通过name即可调用函数
```
	声明函数
	function printEcho()
	{
		echo "hello world！！！"
	}
	调用函数
	printEcho
```

#### Shell中的if判断####

　　[Linux shell if判断语句](http://www.cnblogs.com/huai371720876/p/4561195.html)
　　[对用户输入的判断的shell实现代码](http://www.jb51.net/article/90454.htm)

几种方式：
- if
```
	stdout=` ps -ef|grep hexo |grep -v grep|awk '{print $2}' `
	if [ -n "$stdout" ]
	then
	  echo -n "有货"
	fi
```
- if-else
```
	stdout=` ps -ef|grep hexo |grep -v grep|awk '{print $2}' `
	if [ -n "$stdout" ]
	then
	  echo -n "有货"
	else
	  echo -n "没货"
	fi
```
- if-elif-else
```
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
	elif [ $num = 6 ];then
	 updateSou
	else
	 echo "Input error !!!!!!"
	fi
```
- 判断表达式
**关于文件属性的判断式**
　　-a 如果文件存在
　　-b 如果文件存在，且该文件是区域设备文件
　　-c 当file存在并且是字符设备文件时返回真
　　-d 当pathname存在并且是一个目录时返回真
　　-e 当pathname指定的文件或目录存在时返回真
　　-f 当file存在并且是普通文件时返回真
　　-g 当由pathname指定的文件或目录存在并且设置了SGID位时返回为真
　　-h 当file存在并且是符号链接文件时返回真，该选项在一些老系统上无效
　　-k 当由pathname指定的文件或目录存在并且设置了“sticky”位时返回真
　　-r 当由pathname指定的文件或目录存在并且可读时返回为真
　　-s 当file存在文件大小大于0时返回真
　　-t 文件描述符   如果文件描述符是开启的，且链接了某一个终端
　　-u 当由pathname指定的文件或目录存在并且设置了SUID位时返回真
　　-w 当由pathname指定的文件或目录存在并且可执行时返回真。一个目录为了它的内容被访问必然是可执行的。
　　-x  如果文件存在，且该文件有可执行的属性
　　-O 当由pathname指定的文件或目录存在并且被子当前进程的有效用户ID所指定的用户拥有时返回真。
　　-G  如果文件存在，且该文件为有效的群组 id 所拥有
　　-L  如果该文件存在，且该文件是符号链接文件
　　-S  如果该文件存在，且该文件是Socket文件
　　-N  如果该文件存在，且该文件自上次读取后曾修改过
　　文件1   –nt  文件2   如果文件1比文件2新，或者文件1存在，文件2不存在
　　文件1   –ot  文件2   如果文件1比文件2旧，或者文件1不存在，文件2存在
　　文件1   –ef  文件2   如果文件1和文件2 引用到相同的设备和 inode 编号
**关于字符串的条件判断式**
　　
　　[linux if 命令判断条件总结](http://www.cnblogs.com/TikyZheng/p/3352208.html)
　　
　　-z                                           空串 (如果字符串长度为0)
　　-n                                           非空串 (如果字符串长度不为0)
　　字符串                                       如果字符串长度不为0
　　!=                                           如果两个字符串不相等                   
　　=                                           如果两个字符串相等
　　==                                          如果两个字符串相等
　　字符串 1 < 字符串      2            如果字符串1小于字符串2
　　字符串 1 > 字符串      2            如果字符串1大于字符串2
**关于算式的条件判断**
　　-eq   等于
　　-ne    不等于
　　-gt    大于
　　-lt    小于
　　-le    小于等于
　　-ge   大于等于
**关于 Bash 选项的条件判断**
　　-o set的选项名称         如果选项是开启的状态

#### Shell中的循环####

　　[Shell for&while 循环详细总结](http://www.linuxidc.com/Linux/2012-02/53030.htm)

几种方式：　　
- for  in循环
```
	for i in {1..10}
	do
	   echo $i
	done
```
- for(?,?,?)循环
```
	for((i=1;i<100;i++))
	do
	    if((i%3==0))
	    then
	        echo $i
	        continue
	    fi
	done
```
- while循环
```
	min=1
	max=100
	while [ $min -le $max ]
	do
	    echo $min
	    min=`expr $min + 1`
	done  
```

#### Linux判断命令是否有输出####

```
	第一种方式：
	$ stdout=`ls /asdfkasd`
	$ if [ -n "$stdout" ]
	> then
	> echo "有货"
	> else
	> echo "没货"
	> fi
	没货

	第二种方式：
	$ stdout=`ls /tmp`
	$ if [ -n "$stdout" ]; then echo "有货"; else echo "没货"; fi
	有货
```


#### Linux Crontab内环境变量与Shell环境变量的关系####

  　　 [Linux Crontab内环境变量与Shell环境变量的关系及解决问题的办法](http://www.360doc.com/content/14/0418/13/3300331_370028474.shtml)
  　　 [对一次 crontab 执行失败的调试](http://blog.csdn.net/liuxu0703/article/details/53858406)
  　　 [cron 定时执行脚本 执行用户自定义脚本](http://blog.csdn.net/qustdjx/article/details/7830327)
  　　 [Linux的cron和crontab](http://www.cnblogs.com/itech/archive/2011/02/09/1950226.html)
  　　 
  　　 在线Crontab表达式执行时间验证工具：
  　　 [crontab执行时间计算](http://www.atool.org/crontab.php)
  　　 [crontab在线生成器](http://cron.qqe2.com/)
  　　 

　　crontab有一个坏毛病，就是它总是不会缺省的从**用户profile文件中读取环境变量参数**，经常导致在手工执行某个 脚本时是成功的，但是到crontab中试图让它定期执行时就是会出错。

　　crontab配置文件路径：`/etc/crontab`    
　　
　　编写crontab有两种方式：
　　1.通过文件的方式，编辑上述路径文件   
　　2.通过contab命令的方式   

```
	Usage:
	 crontab [options] file
	 crontab [options]
	 crontab -n [hostname]
	
	Options:
	 -u <user>  define user
	 -e         edit user's crontab
	 -l         list user's crontab
	 -r         delete user's crontab
	 -i         prompt before deleting
	 -n <host>  set host in cluster to run users' crontabs
	 -c         get host in cluster to run users' crontabs
	 -s         selinux context
	 -x <mask>  enable debugging
```

　　Example of job definition：

```
	# .---------------- minute (0 - 59)
	# |  .------------- hour (0 - 23)
	# |  |  .---------- day of month (1 - 31)
	# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
	# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
	# |  |  |  |  |
	# *  *  *  *  * user-name command to be executed
```

　　
　　解决办法：
　　1.  PATH 后面加入缺少目录，将crontab表达式追加到最后一行
　　表达式格式：`30 23 * * * root "sh /opt/blog/hexo-deploy.sh >> /tmp/test.txt"`
　　2. 在Shell脚本缺省的#!/bin/sh开头换行后的第一行加上`. /etc/profile`


#### CentOS 7 下重启服务####

　　　[RHEL/CentOS 7中启动/停止/重启服务](http://www.linuxdiyf.com/linux/2363.html)
　　　
　　　在CentOS 7之前，比如6的时候，是通过  `service  name [start/stop/restart/status]`　的方式启动或停止服务。
　　　CentOS7好像是在6之后的最大改版，在某些命令上会存在差异，比如服务的启动（7采用`systemctl`）、查看ip（`ip addr`）等
　　　
　　　下列演示对crontab服务的操作：
```
　　　systemctl status crond.service  #查看服务的状态
　　　systemctl stop  crond.service  #停止服务
　　　systemctl start crond.service  #启动服务
　　　systemctl restart crond.service #重启服务
```

#### Linux date 指定时间格式####

　　[linux中通过date命令获取昨天或明天时间的方法](http://www.jb51.net/LINUXjishu/117785.html)
　　
　　通过 `date --help`命令可以查看帮助文档
　　
　　date +"%F"　　#输出格式  2017-06-10   yyyy-MM-dd
　　date +"%F %H:%M:%S"    #输出格式   2017-06-10 18:55:38    yyyy-MM-dd HH:mm:ss
　　
#### Linux 设置环境变量####

　　[Linux环境下如何修改环境变量](http://jingyan.baidu.com/article/ea24bc399a73bcda62b33104.html)
　　
　　通过export命令的方式

```
export: usage: export [-fn] [name[=value] ...] or export -p
```
　　查看环境变量配置 ： `export -p`
　　
　　一般不通过命令的方式，因为服务器重启或者关机等异常情况，之前配置的环境变量可能会失效，一般都配置在启动文件中（`/etc/profile`）中，通过`source`命令让环境变量生效。


#### Shell中嵌套执行expect命令####

　　[shell中嵌套执行expect命令实例](http://www.jb51.net/article/58777.htm)
　　[expect spawn、linux expect 用法小记](https://www.centos.bz/2013/07/expect-spawn-linux-expect-usage/)
　　
　　1.先安装`expect`
```
　　yum install -y expect
```
　　2. 脚本示例

```
	/usr/bin/expect <<-EOF
	set time 30
	spawn ssh -p18330 root@192.168.10.22
	expect {
	"*yes/no" { send "yes\r"; exp_continue }
	"*password:" { send "$passwd\r" }
	}
	expect "*#"
	send "cd /home/trunk\r"
	expect "*#"
	send "svn up\r"
	expect "*#"
	send "exit\r"
	interact
	expect eof
	EOF
```

#### Shell 加解密####
	
　　[shell几种字符串加密解密的方法](http://blog.csdn.net/loomz/article/details/47001691)

　　**第一种：〔 Python 与 Bash Shell 的结合 〕**
　　这个命令会让你输入一个字符串，然后会再输出一串加密了的数字。

　　加密代码[照直输入]:
　　python -c 'print reduce(lambda a,b: a*256+ord(b), raw_input("string: "), 0)'

　　解密代码[数字后+P]：
　　dc -e 输出的数字P

　　**第二种：〔 应该是纯 Bash Shell，含 VIM 的 xxd 〕**
　　用 gtalk@gmail.com 作为明文，加密分两步，当然了，也是可以一步过的，呆会说～

　　加密代码：
　　1、echo "gtalk@gmail.com" |xxd -ps -u
　　得到：6774616C6B40676D61696C2E636F6D0A
　　2、echo "ibase=16; 6774616C6B40676D61696C2E636F6D0A" |bc
　　得到：137514765985002236391382606438443478282

　　一步加密代码：
　　echo "ibase=16; $(echo "gtalk@gmail.com" |xxd -ps -u)" |bc
　　得到：137514765985002236391382606438443478282

　　解密代码：
　　3、dc -e 137514765985002236391382606438443478282P
　　得到：gtalk@gmail.com

　　**第三种：〔 Base64 编码，这个很好很强大，适合写加密脚本 〕**
　　同样用 gtalk@gmail.com 作为明文，来看代码：

　　加密代码：
　　echo "gtalk@gmail.com" |base64 -i
　　得到：Z3RhbGtAZ21haWwuY29tCg==

　　解密代码：
　　echo "Z3RhbGtAZ21haWwuY29tCg==" |base64 -d
　　得到：gtalk@gmail.com
　　
#### Shell kill 杀进程####

　　[linux kill终止进程](http://harveyzeng.iteye.com/blog/1452258)
　　
　　先通过`ps -ef | grep 进程名`的方式获得pid。在通过`kill -9 pid` 的方式杀死进程，也可以通过  `killall 进程名`的方式。


　　
#### Shell编写异常收集####

　　Q：**warning: here-document at line 17 delimited by end-of-file (wanted EOF)**
　　A：末尾的EOF后面带有空格，EOF前后都不应有空格或其他符号
　　
　　Q：**linux bash中too many arguments问题的解决方法**
　　A：  `if [ -z " lsof -i:22 " ]`    //这种写法会报too many arguments,改成`[[ -z " lsof -i:22 " ]]`






   
     
　　 
　　
　　


