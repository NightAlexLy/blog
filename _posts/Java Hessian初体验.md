---
title: Java Hessian初体验
date: 2017-06-27 16:28:12
tag:
   - java
   - hessian
categories:
   - java
comments: false
---

#### 基础介绍####

　　[Hessian](http://hessian.caucho.com/)是一个轻量级的远程调用框架，集成Hessian后的web应用既可以暴露服务，也可引入其他的应用Hessian服务，可以实现简单的跨系统之间的交互。**Hessian采用的是二进制的RPC协议。**
　　Hessian主要核心有两块：
　　-  暴露HTTP服务
　　-  序列化（内置）
　　
　　Hessian暴露Http服务是基于HttpServlet实现，通过数据流的方式接收请求信息（类、方法、请求参数），invoke执行实际Object的方法。
　　序列化是指数据在网络中传输的处理，比如我们在网络传递一段信息或者数据落地（写入磁盘），不通过序列化直接传递信息本身。这种会存在第一是效率问题，第二是安全问题，第三是规范问题。数据的传输一般都要先进行序列化。
　　序列化就是数据写入或者传输时候进行的处理。
　　反序列化就将读到的数据进行解析，得到实际的Object。
　　
　　
#### Hessian Demo####　

##### 引入依赖#####
　　
```　　
　　<dependency>
			<groupId>com.caucho</groupId>
			<artifactId>hessian</artifactId>
			<version>4.0.38</version>
		</dependency>
		<dependency>
			<groupId>javax.servlet</groupId>
			<artifactId>servlet-api</artifactId>
			<version>2.5</version>
		</dependency>
```
##### 创建对外暴露的接口#####

```
　　public interface HelloWordService {

	public String sayMsg(String message);
	
   }
```

##### 接口暴露成HTTP服务#####

```
	public class HelloWordServiceImpl extends HessianServlet implements HelloWordService{
	
		public String sayMsg(String message) {
			return "hello" + message;
		}
	
	}
```

##### 容器启动#####
	
　　将应用通过war的方式发布至Tomcat容器，容器正常启动。
　　浏览器中输入：`http://localhost:8080/hessian-server/hello`
　　
　　输出：“**Hessian Requires POST**”，即表示Hessian服务发布成功

##### 客户端调用#####

```
　　public static void main(String[] args) throws Exception{

		String url = "http://localhost:8080/hessian-server/hello";

		HessianProxyFactory factory = new HessianProxyFactory();
		HelloWordService service = (HelloWordService) factory.create(HelloWordService.class, url);

		System.out.println(service.sayMsg(" word!!!!"));

	}
```
　　运行测试方法，Console输出`hello word!!!!`表示调用远程正常。
　　
　　一个简单的Java版Hessian服务【Hello world！】就完成勒。