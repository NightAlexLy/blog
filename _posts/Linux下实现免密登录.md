---
title: 项目小结 
date: 2018-04-03 18:30:12
tag:
   - linux
categories:
   - linux
comments: false
---

## 1.Linux下生成密钥 

　　ssh-keygen的命令手册，通过”man ssh-keygen“命令：
[man ssh-keygen](https://images2015.cnblogs.com/blog/1040840/201610/1040840-20161012142718656-1307073903.png)
　　通过命令”ssh-keygen -t rsa“

[ssh-keygen](https://images2015.cnblogs.com/blog/1040840/201610/1040840-20161012142757453-1604775837.png)
　　生成之后会在用户的根目录生成一个 “.ssh”的文件夹
[.ssh](https://images2015.cnblogs.com/blog/1040840/201610/1040840-20161012142915437-1691338920.png)
　　进入“.ssh”会生成以下几个文件
[.ssh2](https://images2015.cnblogs.com/blog/1040840/201610/1040840-20161012143011312-1844037897.png)

　　authorized_keys:存放远程免密登录的公钥,主要通过这个文件记录多台机器的公钥
　　id_rsa : 生成的私钥文件
　　id_rsa.pub ： 生成的公钥文件
　　know_hosts : 已知的主机公钥清单

　　　　如果希望ssh公钥生效需满足至少下面两个条件：

　　　　　　1) .ssh目录的权限必须是700 
　　　　　　2) .ssh/authorized_keys文件权限必须是600

## 2.远程免密登录
　　原理图：
[原理图](https://images2015.cnblogs.com/blog/1040840/201610/1040840-20161012145601046-1887231974.png)
 　　常用以下几种方法：

　　　　2.1 通过ssh-copy-id的方式

　　　　命令： ssh-copy-id -i ~/.ssh/id_rsa.put <romte_ip>

　　　　举例：　　　　　　
```
[root@test .ssh]# ssh-copy-id -i ~/.ssh/id_rsa.pub 192.168.91.135 
root@192.168.91.135's password: 
Now try logging into the machine, with "ssh '192.168.91.135'", and check in:

.ssh/authorized_keys

to make sure we haven't added extra keys that you weren't expecting.

[root@test .ssh]# ssh root@192.168.91.135
Last login: Mon Oct 10 01:25:49 2016 from 192.168.91.133
[root@localhost ~]#
```
　　　　常见错误：
```
　　　　　　[root@test ~]# ssh-copy-id -i ~/.ssh/id_rsa.pub 192.168.91.135

　　　　　　-bash: ssh-copy-id: command not found   //提示命令不存在

　　　　　　解决办法：yum -y install openssh-clients

```

 　　　2.2　通过scp将内容写到对方的文件中
```
　　　　　　命令：scp -p ~/.ssh/id_rsa.pub root@<remote_ip>:/root/.ssh/authorized_keys

　　　　　　举例：

[root@test .ssh]# scp -p ~/.ssh/id_rsa.pub root@192.168.91.135:/root/.ssh/authorized_keys
root@192.168.91.135's password: 
id_rsa.pub 100% 408 0.4KB/s 00:00 
[root@test .ssh]# 
[root@test .ssh]# 
[root@test .ssh]# 
[root@test .ssh]# ssh root@192.168.91.135
Last login: Mon Oct 10 01:27:02 2016 from 192.168.91.133

[root@localhost ~]#

 ```

　　　　　　也可以分为两步操作：
```
$ scp ~/.ssh/id_rsa.pub root@<remote_ip>:pub_key       //将文件拷贝至远程服务器
$ cat ~/pub_key >>~/.ssh/authorized_keys                     //将内容追加到authorized_keys文件中， 不过要登录远程服务器来执行这条命令
```
　　　　2.3 通过Ansible实现批量免密

2.3.1 将需要做免密操作的机器hosts添加到/etc/ansible/hosts下：
```
　　[Avoid close]
　　192.168.91.132
　　192.168.91.133
　　192.168.91.134
```

2.3.2 执行命令进行免密操作
```
　　ansible <groupname> -m authorized_key -a "user=root key='{{ lookup('file','/root/.ssh/id_rsa.pub') }}'" -k

示例：
　　[root@test sshpass-1.05]# ansible test -m authorized_key -a "user=root key='{{ lookup('file','/root/.ssh/id_rsa.pub') }}'" -k
　　SSH password: ----->输入密码
　　192.168.91.135 | success >> {
　　"changed": true, 
　　"key": "ssh-rsa 　　  AAAAB3NzaC1yc2EAAAABIwAAAQEArZI4kxlYuw7j1nt5ueIpTPWfGBJoZ8Mb02OJHR8yGW7A3izwT3/uhkK7RkaGavBbAlprp5bxp3i0TyNxa/apBQG5NiqhYO8YCuiGYGsQAGwZCBlNLF3gq1/18B6FV5moE/8yTbFA4dBQahdtVP  PejLlSAbb5ZoGK8AtLlcRq49IENoXB99tnFVn3gMM0aX24ido1ZF9RfRWzfYF7bVsLsrIiMPmVNe5KaGL9kZ0svzoZ708yjWQQCEYWp0m+sODbtGPC34HMGAHjFlsC/SJffLuT/ug/hhCJUYeExHIkJF8OyvfC6DeF7ArI6zdKER7D8M0SM　　WQmpKUltj2nltuv3w== root@localhost.localdomain", 
　　"key_options": null, 
　　"keyfile": "/root/.ssh/authorized_keys", 
　　"manage_dir": true, 
　　"path": null, 
　　"state": "present", 
　　"unique": false, 
　　"user": "root"
　　}
　　[root@test sshpass-1.05]# 
```
2.4 手工复制粘贴的方式

　　将本地id_rsa.pub文件的内容拷贝至远程服务器的~/.ssh/authorized_keys文件中