---
title: Hexo页面优化和音乐的心得
date: 2017-06-20 21:31:32
tag:
   - hexo   
categories:
   - hexo  
comments: false
---

#### 灵感####

　　这两天在添加“留言”以及“关于”页面，准备先简单设计一下自已的页面。`留言`页面可以放置一些自已比较感兴趣的音乐、以及一些JS特效，再集成一个第三方的留言功能。`关于`页面可以放置一些简单的联系方式、以及基础信息的存放，还有自已`帅照`。嘿嘿嘿嘿。。。。。
　　音乐插件的集成不在这里过多复述，请参考：[hexo添加音乐](http://tc9011.com/2016/12/24/hexo%E6%B7%BB%E5%8A%A0%E9%9F%B3%E4%B9%90%E3%80%81high%E4%B8%80%E4%B8%8B%E5%8F%8A%E4%B8%80%E4%BA%9B%E5%9D%91/)
　　关于页面帅照采用NexT的扩展标签` fullimage `。嘿嘿嘿嘿。。。。
　　
　　在官方的`常见方案`中关于NexT的优化，看到一篇帖子，是关于gulp插件的介绍，自动化构建工具，通过一系列的`Task`,完成引用的优化。主要思想就是通过压缩HTML，CSS，JavaSCript减少加载内容的大小，提升网站响应效率。
　　
　　关于`Gulp`的优化，可以参照“[使用gulp精简hexo博客代码](http://www.5941740.cn/2016/02/19/gulp-minify-blog/)”，也可以参考我写一篇博客“[Next 调优](http://www.rtime.xin/2017/06/14/Next%20%E8%B0%83%E4%BC%98/)”。

#### 从1000到1####

　　通过`hexo g`命令生成静态页面，随便打开一个`index.html`都可以发现有几百行到上千行的代码，其中大部分都是空白片段。关于大片的空白片段可以通过`gulp`插件进行压缩，下面方法主要是要讲怎么压缩HTML中的JavaScript代码。
　　插件对于HTML页面进行压缩时，不会对HTML中包含的JavaScript代码进行压缩，参考`浏览器--》反键查看源码`，还是有一些小段的JavaScript代码，对于存在有代码洁癖的程序猿，肯定会去想方设法去优化掉。
　　![hexo js ](http://infos.rtime.xin/hexo_js.png)
　　
##### 定位该段JavaScript#####
　　
　　由于站点是部署在Linux系统下，切换到站点主题目录(`/blog/themes/next`)。执行`find . -type f | xargs grep -F "code标识"`。定位该段代码在何配置文件中。
```
	[root@luisyang next]# find . -type f | xargs grep -F "var NexT=window.NexT||{};"
	./layout/_partials/head.swig:<script type="text/javascript" id="hexo.configurations">var NexT=window.NexT||{};var CONFIG={root:'{{ theme.root }}',scheme:'{{ theme.scheme }}',sidebar:{{theme.sidebar|json_encode}},fancybox:{{theme.fancybox}},motion:{{theme.use_motion}},duoshuo:{userId:'{{ theme.duoshuo_info.user_id | default() }}',author:'{{ theme.duoshuo_info.admin_nickname | default(__('author'))}}'},algolia:{applicationID:'{{ theme.algolia.applicationID }}',apiKey:'{{ theme.algolia.apiKey }}',indexName:'{{ theme.algolia.indexName }}',hits:{{theme.algolia_search.hits|json_encode}},labels:{{theme.algolia_search.labels|json_encode}}}};</script>
```
	 
　　可以发现该段代码存在`./layout/_partials/head.swig`中。特别注意：`{ \{  xxx  }\  }`标识模板会引用页面变量中的某个属性，**这段代码是不能单独抽取成一个JS文件。**

##### JS压缩#####
　　
　　常见的JavaScript压缩工具：
　　　　[站长工具-JS压缩](http://tool.chinaz.com/js.aspx)
　　　　[在线JS压缩](http://tool.lu/js/)
　　
　　点击“普通压缩”
　　
```
	var NexT=window.NexT||{};var CONFIG={root:'{{ theme.root }}',scheme:'{{ theme.scheme }}',sidebar:{{theme.sidebar|json_encode}},fancybox:{{theme.fancybox}},motion:{{theme.use_motion}},duoshuo:{userId:'{{ theme.duoshuo_info.user_id | default() }}',author:'{{ theme.duoshuo_info.admin_nickname | default(__('author'))}}'},algolia:{applicationID:'{{ theme.algolia.applicationID }}',apiKey:'{{ theme.algolia.apiKey }}',indexName:'{{ theme.algolia.indexName }}',hits:{{theme.algolia_search.hits|json_encode}},labels:{{theme.algolia_search.labels|json_encode}}}};
```

##### 修改模板#####
　　
　　再次打开模板文件。
```
	<script type="text/javascript" id="hexo.configurations">
	  var NexT = window.NexT || {};
	  var CONFIG = {
	    root: '{{ theme.root }}',
	    scheme: '{{ theme.scheme }}',
	    sidebar: {{ theme.sidebar | json_encode }},
	    fancybox: {{ theme.fancybox }},
	    motion: {{ theme.use_motion }},
	    duoshuo: {
	      userId: '{{ theme.duoshuo_info.user_id | default() }}',
	      author: '{{ theme.duoshuo_info.admin_nickname | default(__('author'))}}'
	    },
	    algolia: {
	      applicationID: '{{ theme.algolia.applicationID }}',
	      apiKey: '{{ theme.algolia.apiKey }}',
	      indexName: '{{ theme.algolia.indexName }}',
	      hits: {{ theme.algolia_search.hits | json_encode }},
	      labels: {{ theme.algolia_search.labels | json_encode }}
	    }
	  };
	</script>
```
　　替换为
```
　　<script type="text/javascript" id="hexo.configurations">var NexT=window.NexT||{};var CONFIG={root:'{{ theme.root }}',scheme:'{{ theme.scheme }}',sidebar:{{theme.sidebar|json_encode}},fancybox:{{theme.fancybox}},motion:{{theme.use_motion}},duoshuo:{userId:'{{ theme.duoshuo_info.user_id | default() }}',author:'{{ theme.duoshuo_info.admin_nickname | default(__('author'))}}'},algolia:{applicationID:'{{ theme.algolia.applicationID }}',apiKey:'{{ theme.algolia.apiKey }}',indexName:'{{ theme.algolia.indexName }}',hits:{{theme.algolia_search.hits|json_encode}},labels:{{theme.algolia_search.labels|json_encode}}}};</script>
```
　　
##### 注意点#####

　　JavaScript的压缩原理就是将多行代码转成一行代码，代码换行的地方记得要用“`；`”隔开，**不然浏览器解析的时候会报错。**
　　
　　**这里只介绍一段JavaScript的优化，其余的地方类似。**


#### 添加音乐####

　　音乐采用的是`hexo-tag-aplayer`插件。声明歌单的时候我们会使用如下数据字符串。
```
　　{% aplayerlist %}{"narrow": false,"autoplay": true,"showlrc": 3,"mode": "random","music": [{"title": "平凡之路","author": "朴树","url": "http://xxx.com/%E5%B9%B3%E5%87%A1%E4%B9%8B%E8%B7%AF.mp3","pic": "https://xxx.com/1.jpg","lrc": "http://og9ocpmwk.bkt.clouddn.com/%E5%B9%B3%E5%87%A1%E4%B9%8B%E8%B7%AF.txt"},{"title": "野子","author": "苏运莹","url": "http://xxx.com/01%20%E9%87%8E%E5%AD%90.m4a","pic": "http://xxxx.com/%E9%87%8E%E5%AD%90.jpg","lrc":"https://xxx.com/%E9%87%8E%E5%AD%90.txt"}]}{% endaplayerlist %}
```
　　其中url表示音乐的地址（mp3,mp4）,lrc表示歌词文件的地址，pic表示歌曲的封面图片。

##### 音乐的下载#####

　　可以下载“网易云音乐”客户端，选择喜欢的音乐，点击下载。比较简单。

##### 歌词的下载#####
	
　　[歌词下载网站](http://www.lrcgc.com/lyric-11423-253098.html)
　　
　　通过网易云音乐下载会自动下载歌词，不过会保存在`%USERPROFILE%\AppData\Local\Netease\CloudMusic\webdata\lyric`路径下。
　　
　　反键编辑找到自已喜欢歌曲的歌词，如`成都-赵雷`：
```
　　{"sgc":false,"sfy":false,"qfy":false,"lrc":{"version":4,"lyric":"[00:00.00] 作曲 : 赵雷\n[00:01.00] 作词 : 赵雷\n[00:16.75]让我掉下眼泪的 不止昨夜的酒\n[00:25.91]让我依依不舍的 不止你的温柔\n[00:33.91]余路还要走多久 你攥着我的手\n[00:41.70]让我感到为难的 是挣扎的自由\n[00:52.10]分别总是在九月 回忆是思念的愁\n[00:59.63]深秋嫩绿的垂柳 亲吻着我额头\n[01:07.53]在那座阴雨的小城里 我从未忘记你\n[01:15.41]成都 带不走的 只有你\n[01:23.69]和我在成都的街头走一走\n[01:31.08]直到所有的灯都熄灭了也不停留\n[01:39.69]你会挽着我的衣袖 我会把手揣进裤兜\n[01:47.08]走到玉林路的尽头 坐在(走过)小酒馆的门口\n[02:30.37]分别总是在九月 回忆是思念的愁\n[02:38.10]深秋嫩绿的垂柳 亲吻着我额头\n[02:46.13]在那座阴雨的小城里 我从未忘记你\n[02:54.02]成都 带不走的 只有你\n[03:02.34]和我在成都的街头走一走\n[03:10.41]直到所有的灯都熄灭了也不停留\n[03:18.34]你会挽着我的衣袖 我会把手揣进裤兜\n[03:25.51]走到玉林路的尽头 坐在(走过)小酒馆的门口\n[04:35.96][03:35.40]和我在成都的街头走一走\n[04:42.76][03:45.39]直到所有的灯都熄灭了也不停留\n[03:53.62]和我在成都的街头走一走\n[04:01.35]直到所有的灯都熄灭了也不停留\n[04:08.95]你会挽着我的衣袖 我会把手揣进裤兜\n[04:17.27]走到玉林路的尽头 坐在(走过)小酒馆的门口\n"},"klyric":{"version":0},"tlyric":{"version":0,"lyric":null},"code":200}
```
　　格式排版存在问题，需要优化成如下方式：

```
	[ti:成都]
	[ar:赵雷]
	[al:成都]
	[by:赵雷]
	[00:00.00] 作曲 : 赵雷
	[00:01.00] 作词 : 赵雷
	[00:16.75]让我掉下眼泪的 不止昨夜的酒
	[00:25.91]让我依依不舍的 不止你的温柔
	[00:33.91]余路还要走多久 你攥着我的手
	[00:41.70]让我感到为难的 是挣扎的自由
	[00:52.10]分别总是在九月 回忆是思念的愁
	[00:59.63]深秋嫩绿的垂柳 亲吻着我额头
	[01:07.53]在那座阴雨的小城里 我从未忘记你
	[01:15.41]成都 带不走的 只有你
	[01:23.69]和我在成都的街头走一走
	[01:31.08]直到所有的灯都熄灭了也不停留
	[01:39.69]你会挽着我的衣袖 我会把手揣进裤兜
	[01:47.08]走到玉林路的尽头 坐在(走过)小酒馆的门口
	[02:30.37]分别总是在九月 回忆是思念的愁
	[02:38.10]深秋嫩绿的垂柳 亲吻着我额头
	[02:46.13]在那座阴雨的小城里 我从未忘记你
	[02:54.02]成都 带不走的 只有你
	[03:02.34]和我在成都的街头走一走
	[03:10.41]直到所有的灯都熄灭了也不停留
	[03:18.34]你会挽着我的衣袖 我会把手揣进裤兜
	[03:25.51]走到玉林路的尽头 坐在(走过)小酒馆的门口
	[04:35.96][03:35.40]和我在成都的街头走一走
	[04:42.76][03:45.39]直到所有的灯都熄灭了也不停留
	[03:53.62]和我在成都的街头走一走
	[04:01.35]直到所有的灯都熄灭了也不停留
	[04:08.95]你会挽着我的衣袖 我会把手揣进裤兜
	[04:17.27]走到玉林路的尽头 坐在(走过)小酒馆的门口aba
```
　　**保存为txt文本，保存编码格式一定要是UNIX / UTF-8w/o BOM的方式，而且命名最好不是中文。**

##### 封面图片下载#####
　　
　　打开网页版的[网易云音乐](http://music.163.com/#/user/home?id=262759259)，搜索“成都-赵雷”，回车。打开控制台，下载歌词封面图片。
　　
　　![网易云下载封面图片](http://infos.rtime.xin/wangyi_xiazai.png)