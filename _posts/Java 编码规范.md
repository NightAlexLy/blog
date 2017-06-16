
---
title: Java 编码规范
date: 2017-06-15 19:54:12
tag:
   - java
comments: false
---

#### 杜绝使用“+”拼接####

　　一般进行字符串拼接的时候，我们常会用"+"进行追加。这种方式每次都创建多个对象、追加的字符串越多越影响性能，而且写法上给别人感觉你很`Low`、新手程序猿。大致情况我们可以使用`StringBuffer`或者`StringBuilder`两种方式。两者差异请自行查找资料、这里就不过多复述。
　　

```
	String arg1 = "Hello ";
	String arg2 = "World";
	
	//“+” 的方式
	System.out.println(arg1+arg2);
	
	//日志(Log4j)打印指定对象的属性时，常用这种方式
	System.out.println(String.format("%s%s", arg1,arg2));
	
	// StringBuffer 的方式
	StringBuffer sb = new StringBuffer(arg1);
	sb.append(arg2);
	System.out.println(sb.toString());
	
	// StringBuilder 的方式
	StringBuilder sb2 = new StringBuilder(arg1);
	sb2.append(arg2);
	System.out.println(sb2.toString());
```
　　
