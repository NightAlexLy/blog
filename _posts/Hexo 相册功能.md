---

title: Hexo 相册实践
date: 2017-06-18 21:33:12
tag:
   - hexo  
categories:
   - hexo  
comments: false
---


#### 灵感 ####

　　想给自已的`blog`添加一个相册功能、给生活中的点点滴滴留影记录。搜寻网络上给Next主题添加相册功能的基本上没有，只能重头到尾开始一点点的实践。
　　
　　大致的想法：
　　　　1. 相册展示类似于`归档`一样，按时间戳来分类
　　　　2.每一个时间节点都是一个小相册，展示的时候上面是相册的标题，下面是几张经典图片的缩略图
　　　　3.点击标题，进行相册的详细页面，可以看到更多关于这个小相册的图片
　　　　4.相册展示的特效类似于[Lawlite](http://lawlite.me/photos/)
　　　　

#### 实践####

##### 插件开发实践#####
　　
　　由于Hexo基于NodeJS开发的，通过插件的方式集成一些第三方的功能。比如归档是 通过[hexo-generator-archive](https://github.com/hexojs/hexo-generator-archive)实现的，标签页是通过[hexo-generator-tag](https://github.com/hexojs/hexo-generator-tag)实现的。更多Hexo插件请看[Hexo Plugins](https://hexo.io/plugins/).这里就不过多讨论。
　　
　　本次实践修改的插件有：
　　　　1.[hexo-generator-archive](https://github.com/hexojs/hexo-generator-archive)
　　　　2.[hexo-generator-index](https://github.com/hexojs/hexo-generator-index)
　　　　2.[hexo-generator-category](https://github.com/hexojs/hexo-generator-category)
　　　　4.hexo-generator-photo[自已新增的]

　　每一个小相册都是一个MD文件,每次首页和归档生成的时候都会把相册加载进去。我想让相册和博客进行区别，所以在MD文件的开头会声明一个属性`isPhoto`,`true表示相册、false表示普通博客文章`。
　　`hexo-generator-archive`和`hexo-generator-index`中去除相册的展示。
　　修改插件的`\lib\generator.js`文件，在`exports`函数，变量声明完加上如下一段代码。
```
	//过滤所有的文章
	 function filterPhoto(posts){
	    var tmp = [];
	    posts.forEach(function(post) {
	      var isPhoto = post.isPhoto; //相册
	      if(!isPhoto){
	        tmp.push(post);
	      }
	    });
	    posts.data = tmp;
	    posts.length = tmp.length;
	  }
	  //hexo-generator-index中调用
	  filterPhoto(posts);
	  //hexo-generator-archive中调用
	  filterPhoto(allPosts);
```
　　归档的时候会显示所有文章的总数（包含相册）,通过下列方式去除掉。
　　在`hexo-generator-archive`插件的`\lib\generator.js`文件添加如下注释的代码：
```
	 function generate(path, posts, options) {
	    options = options || {};
	    options.archive = true;
	    options.postLength = allPosts.length; //新增的
```
　　修改归档的展示页面代码（`themes\next\layout\archive.swig`）：
　　将`site.posts.length`改为`page.postLength`即可。

　　新增`hexo-generator-photo`插件，自动生成相册时间戳界面,参考`hexo-generator-archive`插件。
　　
　　拷贝`hexo-generator-archive`的源码，主要修改以下几个文件：
　　
　　1.`index.js`：
```
	/* global hexo */
	'use strict';
	var assign = require('object-assign');
	// when archive disabled pagination, per_page should be 0.
	var per_page;
	if (hexo.config.photo === 1) {
	  per_page = 0;
	} else if (typeof hexo.config.per_page === 'undefined') {
	  per_page = 10;
	} else {
	  per_page = hexo.config.per_page;
	}
	hexo.config.photo_generator = assign({
	  per_page: per_page,
	  yearly: true,
	  monthly: true,
	  daily: false
	}, hexo.config.photo_generator);
	hexo.extend.generator.register('photo', require('./lib/generator'));
```
　　2.`package.json`：

```
	{
	  "name": "hexo-generator-photo",
	  "version": "0.0.1",
	  "description": "photo generator for Hexo.",
	  "main": "index",
	  "scripts": {
	    "eslint": "eslint .",
	    "jscs": "jscs .",
	    "test": "mocha test/index.js",
	    "test-cov": "istanbul cover --print both _mocha -- test/index.js"
	  },
	  "directories": {
	    "lib": "./lib"
	  },
	  "repository": "hexojs/hexo-generator-photo",
	  "homepage": "http://hexo.io/",
	  "keywords": [
	    "hexo",
	    "generator",
	    "photo"
	  ],
	  "author": "",
	  "license": "",
	  "devDependencies": {
	    "chai": "^1.9.1",
	    "eslint": "^1.10.3",
	    "eslint-config-hexo": "^1.0.2",
	    "hexo": "^3.1.1",
	    "istanbul": "^0.4.1",
	    "jscs": "^2.7.0",
	    "jscs-preset-hexo": "^1.0.1",
	    "mocha": "^2.0.1"
	  },
	  "dependencies": {
	    "hexo-pagination": "0.0.2",
	    "object-assign": "^2.0.0"
	  }
	}
```
　　3.`generator.js`：
```
	'use strict';
	
	var pagination = require('hexo-pagination');
	
	var fmtNum = function(num) {
	  return num < 10 ? '0' + num : num;
	};
	
	module.exports = function(locals) {
	  var config = this.config;
	  var photoDir = config.photo_dir;
	  var paginationDir = config.pagination_dir || 'page';
	  var allPosts = locals.posts.sort('-date');
	  var perPage = config.photo_generator.per_page;
	  var result = [];
	
	  if (!allPosts.length) return;
	
	  function screenPhoto(posts){
	
	    var tmp = [];
	    posts.forEach(function(post) {
	      var isPhoto = post.isPhoto; //相册
	      if(isPhoto){
	        tmp.push(post);
	      }
	    });
	
	    posts.data = tmp;
	    posts.length = tmp.length;
	  }
	
	  screenPhoto(allPosts);
	
	  if (photoDir[photoDir.length - 1] !== '/') photoDir += '/';
	
	  function generate(path, posts, options) {
	    options = options || {};
	    options.photo = true;
	    options.postLength = allPosts.length;
	
	    result = result.concat(pagination(path, posts, {
	      perPage: perPage,
	      layout: ['photo', 'index'],
	      format: paginationDir + '/%d/',
	      data: options
	    }));
	  }
	
	  generate(photoDir, allPosts);
	
	  if (!config.photo_generator.yearly) return result;
	
	  var posts = {};
	
	  // Organize posts by date
	  allPosts.forEach(function(post) {
	      var date = post.date;
	      var year = date.year();
	      var month = date.month() + 1; // month is started from 0
	      
	      if (!posts.hasOwnProperty(year)) {
	      // 13 arrays. The first array is for posts in this year
	      // and the other arrays is for posts in this month
	      posts[year] = [
	        [],
	        [],
	        [],
	        [],
	        [],
	        [],
	        [],
	        [],
	        [],
	        [],
	        [],
	        [],
	        []
	      ];
	    }
	
	    posts[year][0].push(post);
	    posts[year][month].push(post);
	    // Daily
	    if (config.photo_generator.daily) {
	      var day = date.date();
	      if (!posts[year][month].hasOwnProperty(day)) {
	        posts[year][month].day = {};
	      }
	
	      (posts[year][month].day[day] || (posts[year][month].day[day] = [])).push(post);
	    }
	    
	  });
	
	  var Query = this.model('Post').Query;
	  var years = Object.keys(posts);
	  var year, data, month, monthData, url;
	
	  // Yearly
	  for (var i = 0, len = years.length; i < len; i++) {
	    year = +years[i];
	    data = posts[year];
	    url = photoDir + year + '/';
	    if (!data[0].length) continue;
	
	    generate(url, new Query(data[0]), {year: year});
	
	    if (!config.photo_generator.monthly && !config.photo_generator.daily) continue;
	
	    // Monthly
	    for (month = 1; month <= 12; month++) {
	      monthData = data[month];
	      if (!monthData.length) continue;
	      if (config.photo_generator.monthly) {
	        generate(url + fmtNum(month) + '/', new Query(monthData), {
	          year: year,
	          month: month
	        });
	      }
	
	      if (!config.photo_generator.daily) continue;
	
	      // Daily
	      for (var day = 1; day <= 31; day++) {
	        var dayData = monthData.day[day];
	        if (!dayData || !dayData.length) continue;
	        generate(url + fmtNum(month) + '/' + fmtNum(day) + '/', new Query(dayData), {
	          year: year,
	          month: month,
	          day: day
	        });
	      }
	    }
	  }
	
	  return result;
	};
```
　　`hexo`执行调用`Hexo-generator-photo`插件：
　　网站根目录的`package.json`文件中天价如下一行：
```
	"hexo-server": "^0.2.0",  //下面添加,不要遗漏","
	"hexo-generator-photo":"^0.0.1"
```

##### 相册样式调整#####

　　新增相册的swig文件（`themes\next\layout\photo.swig`）：
```
	{% extends '_layout.swig' %}
	{% import '_macro/post-collapse-photo.swig' as post_template %}
	{% import '_macro/sidebar.swig' as sidebar_template %}
	{% block title %}{{ __('title.photo') }} | {{ config.title }}{% endblock %}
	{% block page_class %} page-archive {% endblock %}
	{% block content %}
	  <section id="posts" class="posts-collapse">
	    {% for post in page.posts %}
	      {# Show year #}
	      {% set year %}
	      {% set post.year = date(post.date, 'YYYY') %}
	      {% if post.year !== year %}
	        {% set year = post.year %}
	        <div class="collection-title">
	          <h2 class="archive-year motion-element" id="archive-year-{{ year }}">{{ year }}</h2>
	        </div>
	      {% endif %}
	      {# endshow #}
	      {{ post_template.render(post) }}
	    {% endfor %}
	  </section>
	  {% include '_partials/pagination.swig' %}
	{% endblock %}
	{% block sidebar %}
	  {{ sidebar_template.render(false) }}
	{% endblock %}
	{% block script_extra %}
	  {% if theme.use_motion %}
	    <script type="text/javascript" id="motion.page.archive">
	      $('.archive-year').velocity('transition.slideLeftIn');
	    </script>
	  {% endif %}
	{% endblock %}
```
　　添加相册子标题模板（`themes\next\layout\_macro\post-collapse-photo.swig`）：
```
	{% macro render(post) %}
	  <article class="post post-type-{{ post.type | default('normal') }}" itemscope itemtype="http://schema.org/Article">
	    <header class="post-header2">
	      <{% if theme.seo %}h3{% else %}h2{% endif %} class="post-title">
	        {% if post.link %}{# Link posts #}
	          <a class="post-title-link post-title-link-external" target="_blank" href="{{ url_for(post.link) }}" itemprop="url">
	            {{ post.title or post.link }}
	            <i class="fa fa-external-link"></i>
	          </a>
	        {% else %}
	            <a class="post-title-link" href="{{ url_for(post.path) }}" itemprop="url">
	              {% if post.type === 'picture' %}
	                {{ post.content }}
	              {% else %}
	                <span itemprop="name">{{ post.title | default(__('post.untitled')) }}</span>
	              {% endif %}
	            </a>
	        {% endif %}
	      </{% if theme.seo %}h3{% else %}h2{% endif %}>
		  <div>
			<ul class="box">
			  {% for photo in post.photos %}
				<figure class="thumb"><img src="{{photo}}" alt=""></figure>
			  {% endfor %}
			</ul>
		  </div>
	      <div class="post-meta">
	        <time class="post-time" itemprop="dateCreated"
	              datetime="{{ moment(post.date).format() }}"
	              content="{{ date(post.date, config.date_format) }}" >
	          {{ date(post.date, 'MM-DD') }}
	        </time>
	      </div>
	    </header>
	  </article>
	{% endmacro %}
```
　　新增样式（`themes\next\source\css\_custom\custom.styl`）：
```
	box{ width:100%;}
	.box li{ float:left; width:100px; height:80px; margin-right:10px; padding:0; margin:5px; overflow:hidden;list-style:none;}	
	
	.posts-collapse .post-header2 {
		position: relative;
	    transition-duration: 0.2s;
	    transition-timing-function: ease-in-out;
	    transition-delay: 0s;
	    transition-property: border;
	}
	
	.thumb{
		width: 25%;
	    height: 0;
	    padding-bottom: 25%;
	    position: relative;
	    display: inline-block;
	    text-align: center;
		margin:0px;
	}
	
	.thumb img{
	    display: inline;
	    margin: auto;
	    max-width: 100%;
	    height: auto;
	}
```
#####相册配置#####
　　
　　站点文件配置（_config.yml）新增如下配置：
```
	# Directory节点添加如下配置
	photo_dir: photos //添加Photo生成目录
```
```
	//Photo生成配置
	photo_generator:
	  per_page: 3   //默认展示的条数
	  yearly: true
	  monthly: true
```
　　主题文件配置（_config.yml）新增如下配置
```
menu:  //menu节点添加如下一行
  photos: /photos/

menu_icons: //menu节点下添加如下一行
  photos: book
```
　　中文显示（themes\next\languages\zh-Hans.yml）：
```
title:  //节点下添加如下一行
  photo: 相册
menu： //节点下添加如下一行
  photos: 相册
```

##### 测试#####

　　`source\_posts`目录下添加相册的MD文件，内容如下：
```
	---
	title: 王二狗是个大帅哥
	date: 2017-06-17 10:26:32
	comments: false
	photos: ["http://img5.duitang.com/uploads/item/201508/10/20150810153526_2ifjW.jpeg","http://img5.duitang.com/uploads/item/201508/10/20150810153526_2ifjW.jpeg","http://img5.duitang.com/uploads/item/201508/10/20150810153526_2ifjW.jpeg","http://img5.duitang.com/uploads/item/201508/10/20150810153526_2ifjW.jpeg","http://img5.duitang.com/uploads/item/201508/10/20150810153526_2ifjW.jpeg","http://img5.duitang.com/uploads/item/201508/10/20150810153526_2ifjW.jpeg","http://img5.duitang.com/uploads/item/201508/10/20150810153526_2ifjW.jpeg","http://img5.duitang.com/uploads/item/201508/10/20150810153526_2ifjW.jpeg"]
	isPhoto: true
	---
	
	
	![test](http://tupian.enterdesk.com/2014/mxy/06/09/4/4.jpg)
	![test](http://img5.duitang.com/uploads/item/201508/10/20150810153526_2ifjW.jpeg)
```
	通过`Hexo server`启动服务，访问`http://localhost:4000/photos/`即可看到生成的相册界面。

　　![hexo photo](https://infos.rtime.xin/hexo_photo.png)

#### 心得 总结####

　　　　
　　安装Hexo之后，插件默认存放在`blog\node_modules`目录下。
　　插件开发的核心文件:`index.js`,`package`.`json,generator.js`
　　关于插件开发的Demo：[Plugin Demo](https://hexo.io/docs/plugins.html)


#### 后续优化####
　　
　　- 首页、标签、文章详情页日志总数减去相册的条数（site.pages.length）
　　- 图片展示优化
　　- 图片整理（QQ空间链接不行）
　　- 视屏的优化
　　- 相册页的日志总条数问题