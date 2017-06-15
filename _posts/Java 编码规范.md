
---
title: Java 编码规范
date: 2017-06-15 19:54:12
tag:
   - java
comments: false
---

#### 杜绝使用“+”拼接####

　　一般进行字符串拼接的时候，我们常会用"+"进行追加。这种方式每次都创建多个对象、追加的字符串越浪费性能，而且写法上给别人感觉你很`Low`、新手程序猿。大致情况我们都会使用`StringBuffer`或者`StringBuilder`两种方式。两者差异请自行查找资料、这里就不过多复述。
　　

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
　　
> 本文作者： Luis Yang
>本文链接： [http://rtime.xin/2017/06/15/Java 编码规范/](http://rtime.xin/2017/06/15/Java 编码规范/)
>版权声明： 本博客所有文章除特别声明外，均采用 [CC BY-NC-SA 3.0 CN](http://creativecommons.org/licenses/by-nc-sa/3.0/cn/) 许可协议。转载请注明出处！
