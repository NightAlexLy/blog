---
title: RSA公私钥生成
date: 2017-09-27 18:28:12
tag:
   - RSA
   - SHA1WithRSA
   - OpenSSL
categories:
   - RSA
comments: false
---


#### 背景介绍 ####
      
　　　　在安全性比较高的应用交互的时候，会采用对称加密算 法的方式。双方应用在服务端都生成一套公私钥对，双方互换公钥证书。 通过加签验签（或者加密解密）对数据的合法校验。保证数据交互的安全性。
      
　　　　下面介绍下，如何在服务端生成公私钥对。

#### 安装OpenSSL ####

　　　　Linux环境可能自带OpenSSL工具，直接键入命令，看命令是否安装。 如果未安装，通过`yum install openssl -y`命令进行安装。
　　　　Window下请下载指定的OpenSSL工具。地址：[http://gnuwin32.sourceforge.net/packages/openssl.htm](http://gnuwin32.sourceforge.net/packages/openssl.htm)
　　　　OpenSSL的官网：[https://www.openssl.org/source/](https://www.openssl.org/source/)

#### 生成公私钥 ####

***下文中的命令都是在OpenSSL窗口中执行。假如出现某个文件不存在的时候，请尝试重启OpenSSL窗口。***
　　　　
##### 生成RSA私钥 #####

```
req -new -x509 -key rsa-private.key -days 720 -out rsa-public.cer

回车之后输入密码
```

##### 生成证书 #####

```
req -new -x509 -key rsa-private.key -days 720 -out rsa-public.cer

需要验证设置的key密码
还有几项用户自定义输入项：

           Contry Name (2 letter code) [au]：   CN

          State or Province Name (full name)[Some-State]：        SH

          Locality Name （eg.city）【】：    SH

         Organation Name（eg.company）【Internet Widgits Pty Ltd】：xxxx

         Organational Unit Name（eg.section）【】：xxxx

        Common Name（eg.Your name）：Zs

         Email Address：xxxxx@163.com 
```

##### 生成PKCS12私钥文件 #####

```
 pkcs12 -export -name test-alias -inkey rsa-private.key -in rsa-public.cer -out test-rsa.pfx

 需要验证key的密码
```

##### 获得PKCS12的PEM文件 #####

```
pkcs12 -in test-rsa.pfx -nodes -out test-rsa.pem

需要验证key的密码
```

#####  提取私钥 #####

```
rsa -in test-rsa.pem -out test-rsa.key
```

#####  转换密钥格式（PKCS8） #####

```
pkcs8 -topk8 -inform PEM -in test-rsa.key -outform pem -nocrypt -out test-rsa.pem.pkcs8
```