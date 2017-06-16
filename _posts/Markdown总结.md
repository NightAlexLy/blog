---
title: Markdown经验总结
date: 2017-06-13 21:33:12
tag:
   - markdown
comments: false
---

#### 前提####

　　这两天写博客，感觉使用富文本编辑框来撰写文章，感觉特别的`Low`，而且不是很理想。决定采用最近流行的Markdown语言，使用指定的语法来编写文章，保存之后编辑器自动对语法进行渲染，生成整洁的文章排版。`炫酷吊炸天、36个赞！！！！！`

　　本文顺便也总结这两天使用的经验~~~~

#### Markdown编辑器####

　　主流的编辑器有：
- [MarkdownPad 2](http://markdownpad.com/download/markdownpad2-setup.exe)
	- windows 10 存在bug，旁边的渲染页面打不开，需要装[Awesomium 1.6.6 SDK](http://markdownpad.com/download/awesomium_v1.6.6_sdk_win.exe)
- Mou [Mac平台编辑器，windows不支持。泪崩]
- [马克飞象](https://maxiang.io/)[基于网页编写的方式，也支持Chrome插件的方式]
- Atom [github开源一款编辑器，觉得写MD。大材小用、不是很适用]　　

  目前撰写MD的方式：
　由于我的操作系统是Win10，安装渲染器之后， MarkdownPad 2 渲染页面展示的很`Low`。决定主要使用`马克飞象`撰写，之后再通过`MarkdownPad 2`检查与修正保存[`马克飞象与MarkDownPad个别语法有差异`]、**不要通过文本的方式直接保存**，可能保存的文件编码格式存在问题。我通过文本的方式保存，文件编码是`GB2312`，在部署到`Hexo`会出现乱码的问题，建议采用**MarkdownPad 2**保存，得到的文件格式编码是`UTF-8/无 BOM`。不会出现乱码问题。

#### Markdown常用快捷键####
　　常用总结：
　　1. 加粗  `Ctrl + B`
　　2.斜体   `Ctrl + I`
　　3. 链接   `Ctrl + L`
　　4. 标题  `Ctrl + 1~5`
　　5.代码   `Ctrl + K`
　　6.图片   `Ctrl + G`
　　7.表格   `Ctrl + Alt + T`
　　9.帮助    `Ctrl + /`  [**马克飞象**]
		
![马克飞象快捷键](http://ore2d9chp.bkt.clouddn.com/markdown_kjj.png)    

#### 一些经验####
- 开头空格
	**把输入法由半角改为全角。 两次空格之后就能够有两个汉字的缩进**　
　　　也可以在文章开头键入多个`nbsp`;，不过这种方法很`low`.
- 回车换行
**在文字末尾输入 2 个及以上的空格，再点击回车即可实现回车换行。**

