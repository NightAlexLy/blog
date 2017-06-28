---
title: Spring与Hessian的集成
date: 2017-06-28 11:31:12
tag:
   - java
   - hessian
categories:
   - java
comments: false
---

#### 基础介绍 ####

　　在[上一篇](http://www.rtime.xin/2017/06/27/Java%20Hessian%E5%88%9D%E4%BD%93%E9%AA%8C/)中我们通过HessianServlet的方式暴露一个简单的Hessian服务，这种方式会造成服务层和控制层之间耦合。一般情况下我们都不会采取这种方式【本次只是为了演示基础Hessian的基础实现。】。Spring框架也集成了对一些基础RPC框架的支持，比如jaxws-WebService、Hessian、Http invoker等。    
　　
	本篇文章就简单介绍下，Spring与Hessian集成的方法。

#### Spring-Hessian Demo ####

##### 依赖 #####

　　**pom.xml**

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
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-web</artifactId>
			<version>4.2.5.RELEASE</version>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-webmvc</artifactId>
			<version>4.2.5.RELEASE</version>
		</dependency>
		<dependency>
			<groupId>org.apache.logging.log4j</groupId>
			<artifactId>log4j-api</artifactId>
			<version>2.0.2</version>
		</dependency>
		<dependency>
			<groupId>org.apache.logging.log4j</groupId>
			<artifactId>log4j-core</artifactId>
			<version>2.0.2</version>
		</dependency>
		<dependency>
			<groupId>com.lmax</groupId>
			<artifactId>disruptor</artifactId>
			<version>3.2.1</version>
		</dependency>
```

##### 接口声明以及实现 #####
　　
　　**HelloWordService.java**

```
　　public interface HelloWordService {

	public String sayMsg(String message);
	
　　}
```

　　**HelloWordServiceImpl.java**

```
	public class HelloWordServiceImpl implements HelloWordService{
	
		public String sayMsg(String message) {
			// TODO Auto-generated method stub
			return "Hello  " + message;
		}
	
	}
```

##### 测试Code #####

　　**HellowordController.java**

```
	@Controller
	public class HellowordController {
		
		private static Logger logger = LogManager.getLogger(HellowordController.class.getName());
	
		@Resource(name="hellowordServiceImpl")
		private HelloWordService service;
		
		@RequestMapping(value="/sayMsg",method=RequestMethod.GET)
		@ResponseBody
		public String sayMsg(String msg){
			logger.info("parameter msg ----::::"+msg);
			return service.sayMsg(msg);
		}
	}
```
　　**Test.java**

```
	public static void main(String[] args) throws Exception{

		String url = "http://localhost:8080/hessian-server-springmvc/hessian/hellowordService";

		HessianProxyFactory factory = new HessianProxyFactory();
		HelloWordService service = (HelloWordService) factory.create(HelloWordService.class, url);

		System.out.println(service.sayMsg(" word!!!!"));

	}
```

##### 配置文件 #####

　　**webContext.xml**
```
	<context:annotation-config />
	<mvc:annotation-driven />
	
    <context:component-scan base-package="org.luis.framework.hessian"/>  
    <bean class="org.springframework.web.servlet.mvc.annotation.DefaultAnnotationHandlerMapping"/>
	<bean class="org.springframework.web.servlet.mvc.annotation.AnnotationMethodHandlerAdapter" />
	<!-- 2.jsp视图解析器，内部资源视图解析器;前缀+逻辑名+后缀 -->
	<bean id="jspViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
		<property name="prefix" value=""/>
		<property name="suffix" value=""/>
	</bean>
    
    <bean class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">  
	    <property name="locations"> <!-- PropertyPlaceholderConfigurer类中有个locations属性，接收的是一个数组，即我们可以在下面配好多个properties文件 -->  
	        <array>  
	            <value>classpath:application.properties</value>  
	        </array>  
	    </property>  
	</bean>  
    <bean name="hellowordServiceImpl" class="org.springframework.remoting.caucho.HessianProxyFactoryBean">
    	<property name="serviceInterface" value="org.luis.framework.hessian.service.HelloWordService"/>
    	<property name="serviceUrl" value="${hessian.server.url}/hellowordService"/>
    </bean>
```

　　**hessian-servlet.xml**
```
    <bean name="hellowordService" class="org.luis.framework.hessian.service.impl.HelloWordServiceImpl"/>
    
    <!-- 测试服务 -->  
    <bean name="/hellowordService" class="org.springframework.remoting.caucho.HessianServiceExporter">  
        <property name="service" ref="hellowordService"/>  
        <property name="serviceInterface" value="org.luis.framework.hessian.service.HelloWordService"/>  
    </bean>
```

　　**application.properties**

```
	hessian.server.url=http://localhost:8080/hessian-server-springmvc/hessian
```

　　**web.xml**

```
	<context-param>
		<param-name>contextConfigLocation</param-name>
		<param-value></param-value>
	</context-param>
	<listener>
		<listener-class>org.springframework.web.context.ContextLoaderListener
		</listener-class>
	</listener>

	<servlet>
		<servlet-name>hessianService</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>classpath:hessian-servlet.xml</param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>
	<servlet-mapping>
		<servlet-name>hessianService</servlet-name>
		<url-pattern>/hessian/*</url-pattern>
	</servlet-mapping>
	<!-- Spring MVC -->
	<servlet>
		<servlet-name>spring</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>
				classpath:webContext.xml
			</param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>
	<servlet-mapping>
		<servlet-name>spring</servlet-name>
		<url-pattern>/*</url-pattern>
	</servlet-mapping>
```

#### 验证 ####

　　将应用通过war的方式发布至Tomcat容器，容器正常启动。
　　浏览器中输入：`http://localhost:8080/hessian-server-springmvc/hessian/hellowordService`

　　输出：“**HTTP Status 405 - HessianServiceExporter only supports POST requests**”，即表示Hessian服务发布成功
　　
　　两种验证方式：
　　　　1.通过HTTP的方式，自已调用自已的Hessian服务
　　　　2.通过Main方法直接验证

　　第一种方法：
　　　　浏览器输入：`http://localhost:8080/hessian-server-springmvc/sayMsg?msg=xxx`
　　　　输出”Hello xxx“表示服务自已调用自已正常、

　　第二种方法：
　　　　直接运行Main方法即可。
