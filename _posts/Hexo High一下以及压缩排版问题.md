
---
title: Hexo High一下以及压缩排版问题 
date: 2017-06-21 18:10:12
tag:
	- hexo
categories:
   - hexo
comments: false
---

#### 背景介绍####

　　**集成`Hight一下`以及`Gulp-html压缩`之后出现的问题：**

　　`High一下`功能多次点击，会创建多个`Audio`对象，导致同时播放多次音乐，重音。解决办法：判断是否添加`Audio`对象，如果存在则判断是否播放，播放状态不做任何处理，未播放则调用播放方法。如果不存在则调用后续创建音乐对象的处理。
　　`Gulp-html压缩`会导致我们页面故意添加的空格排版也会被清空掉。查询`Gulp-html`的API，发现没有这种配置，而且尝试去组合配置，最后发现还是不行。实在没办法后，只能看压缩的源代码。核心思路：就是找到要压缩的地方，对某一类或者几类标签不做压缩处理。

#### Hight一下####

　　[JavaScript源码](https://infos.rtime.xin/high-animation.js)
	
　　定位到100行左右，添加如下代码：
　　
```
var audios = document.getElementsByTagName("audio");
if(audios.length > 0){
    if(!audios[0].ended){
        return;
    }else{
        audios[0].play();
        return;
    }
}
```

#### Gulp-html压缩####

　　gulp对HTML的压缩有两种框架[gulp-minify-html](https://github.com/jonschlinkert/gulp-htmlmin)和[gulp-htmlmin](https://github.com/jonschlinkert/gulp-htmlmin)。
　　
　　`gulp-minify-html`是基于[minimize](https://github.com/Swaagie/minimize)做的包装，其核心压缩的处理都是在`minimize`中完成的。
　　`gulp-htmlmin`是基于[html-minifier](https://github.com/kangax/html-minifier)的包装。
　　
　　本文暂时只讨论基于`html-minifier`的改造，**设置多个标签不做压缩处理**。
　　
　　找到`html-minifier`压缩的核心代码：
　　绝对路径：`blog/node_modules/gulp-htmlmin/node_modules/html-minifier/src/htmlminifier.js`
　　
　　翻阅源码发现压缩是通过`HTMLParser`解析DOM的方式。轮训每个标签，在通过正则表达式替换指定字符。（还有更多的特殊处理，这里就不细节描述。）
　　
　　定位到如下一行：
```
	chars: function(text, prevTag, nextTag) {
	  prevTag = prevTag === '' ? 'comment' : prevTag;
	  nextTag = nextTag === '' ? 'comment' : nextTag;
```
　　
　　添加过滤处理：
```
　　//  当前标签为p/br/strong/div ,不做处理直接返回
	if(currentTag === undefined ||  currentTag === 'p' || prevTag === 'p' 
	        || nextTag === 'p' || currentTag === 'br'|| currentTag === 'strong'
	        || currentTag === 'div'){
	        buffer.push(text);
	        return;
	      }
```

　　