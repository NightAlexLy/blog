
---
title: Hexo 添加自定义的内置标签
date: 2017-06-21 21:40:12
tag:
	- hexo
categories:
   - hexo
comments: false
---

#### 灵感####
　　
　　想设计一个记录自已骑行的页面，显示时间、地点、路线图等信息。方便以后做一些留念。定位想实现下面类似的效果。参考：《[特效](http://www.iissnan.com/)》
　　
　　![特效](/images/hexo_lsb.png)
　　
　　实现方案也比较简单，反键查看源码。直接Copy，在加之改造即可。下面所述的方式是怎么提高代码的复用性。（内置标签）

#### 简单实现####

　　　查看源码发现大致结构代码如下：
```
	<div class="location">
	    <i class="location-icon" style="opacity: 1; top: 0px;"></i>
	    <span class="location-text animate-init" style="opacity: 1; top: 0px;">XiaMen - China</span>
	</div>
```
　　相关的CSS样式（`优化后`）：
```
	.location {
	    font-weight: bold;
	}
	
	.location-icon {
	    position: relative;
	    top: 10px;
	    opacity: 0;
	    display: inline-block;
	    vertical-align: top;
	    width: 16px;
	    height: 40px;
	    background: url('../images/mini_location.png') no-repeat left center;
	    background-size: 16px;
	}
	
	
	.animate-init {
	    position: relative;
	    top: -10px;
	    opacity: 0;
	}
	
	.location-text {
	    display: inline-block;
	    vertical-align: top;
	    font-size: 13px;
	    line-height: 40px;
	    margin-left: 10px;
	}
```
　　将CSS样式追加到`blog/themes/next/source/css/_custom/custom.styl`中。
　　
　　[定位图标下载](http://www.rtime.xin/images/mini_location.png)

　　添加定位信息的时候，拷贝上面的HTML代码至`MD文件`中，修改span中text文本即可实现效果。（替换“`XiaMen - China`”）。
　　
　　
#### 内置标签####

　　在`Hexo`中存在一些[内置标签](https://hexo.io/zh-cn/docs/tag-plugins.html)，比如`blockquote`,`codeblock`,`pullquote`等等。

　　**我们是否可以上面的HTML抽成一些内置标签？**，比如：`lsb`。

　　通过查看自定义标签的标志，发现主题自带标签脚本都会存放在`themes/xxx/script/tag/xxx.js`中。

　　参考脚本，编写了一个类似的`lsb脚本`。如下：
```　　
	/* global hexo */
	// Usage: {% locationAddr date, address %}
	// Alias: {% lsb date, address %}
	
	function locationAddr(args) {
	  args = args.join(' ').split(',');
	  var date = args[0];
	  var address = args[1] || '';
	
	  if (!date) {
	    hexo.log.warn('Location date can NOT be empty');
	  }
	  if(!address){
	    hexo.log.warn('Location address can NOT be empty');
	  }
	
	  date = date.trim();
	  address = address.trim();
	
	  var lsb = ['<div class="location"><i class="location-icon" style="opacity: 1; top:0px;"></i><span class="location-text animate-init" style="opacity: 1; top: 0px;">'];
	
	  date.length > 0 && lsb.push(alt+"-");
	  address.length > 0 && lsb.push(address);
	  lsb.push ('</span></div>');
	
	  return lsb.join(' ');
	}
	
	hexo.extend.tag.register('locationAddr', locationAddr);
	hexo.extend.tag.register('lsb', locationAddr);
```

　　使用方法：

```
　　 {% locationAddr '', 'Test Address' %}
　   或者
　　 {% locationAddr '2017-01-22', 'Test Address' %}　 
```