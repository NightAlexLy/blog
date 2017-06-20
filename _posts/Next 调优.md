
---
title: Next 调优 
date: 2017-06-14 23:15:12
tag:
   - hexo
categories:
   - hexo
comments: false
---

#### Links对齐 ####

　　编辑`themes/next/source/css/_custom`下的`custom.styl`，添加如下代码即可。

```
	.links-of-blogroll-title{
	   margin-left:6px;
	}
	
	.links-of-blogroll-inline .links-of-blogroll-item{
	    float: left;
	    margin-left: 6px;
	    width: 47%;
	}

```

#### Code标签 ####

　　编辑`themes/next/source/css/_custom`下的`custom.styl`，添加如下代码即可。

```
	//修改文章内code样式
	code {color:#c7254e;background:#f8f3f4;}
```

#### 文章版权优化####

　　之前添加文章版权的方式比较`Low`，手工在每个文章末尾添加一段关于版权的代码，不易维护，并且很容易错误。现在优化的办法是将这段代码移至主题的配置加载文件中。并且设置开关，当`hexo generate`生成代码的时候自动添加版本代码。
　　
　　参考：[hexo文章添加版权声明及一些特效](http://tc9011.com/2017/02/02/hexo%E6%96%87%E7%AB%A0%E6%B7%BB%E5%8A%A0%E7%89%88%E6%9D%83%E5%A3%B0%E6%98%8E%E5%8F%8A%E4%B8%80%E4%BA%9B%E7%89%B9%E6%95%88/)
　　
　　与上述参考不同的是，`passage-end-tag.swig`文件，内容如下：

```
	{% if theme.passage_end_tag.enabled %}
	<blockquote>
	<p>本文作者： {{ theme.author }}<br>本文链接： <a id="versionA" href="#" target="_blank" rel="external"></a><br>版权声明： 本博客所有文章除特别声明外，均采用 <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/cn/" target="_blank" rel="external">CC BY-NC-SA 3.0 CN</a> 许可协议。转载请注明出处！   </p>
	</blockquote>
	<script>
	  window.onload = function () {
	   var locationUrl= decodeURI(window.location.href);
	   document.getElementById("versionA").href = locationUrl;
	   document.getElementById("versionA").innerHTML = locationUrl;
	  }
	</script>
	{% endif %}
```
   
#### 静态页面压缩####

　　通过`Hexo g`自动生成的静态js、css、html是没有经过压缩的,而且存在大量无用的空白。想通过优化的方式，自动将生成的页面进行亚索

　　参考文章：
　　　　[使用gulp精简hexo博客代码](http://www.5941740.cn/2016/02/19/gulp-minify-blog/)
　　　　[gulp构建入门](http://www.gulpjs.com.cn/docs/getting-started/)

　　gulp是nodejs下的自动构建工具，通过一列的task执行步骤进行自动流程化处理。
　　
　　安装gulp以及所需插件：
　　`npm install -d --save gulp gulp-clean gulp-load-plugins gulp-minify-css gulp-minify-html gulp-rename gulp-uglify gulp-shell  typescript`
　　
　　在站点的根目录创建gulpfile.js文件（默认的处理文件），我的站点目录是/opt/blog/。
　gulpfile.js内容如下：
```
	var gulp = require('gulp');
	var clean = require('gulp-clean');
	var minifyCss = require('gulp-minify-css');
	var minifyHtml = require('gulp-minify-html');
	var uglify = require('gulp-uglify');
	var shell = require('gulp-shell');
	var ts = require('gulp-typescript');
	
	gulp.task("clean",function() {
	    return gulp.src("./dst/*")
	    .pipe(clean());           //plugins为加载的gulp-load-plugins插件,它可以自动加载项目依赖(package.json定义)
	});
	
	gulp.task("css",function() {
	    return gulp.src(["public/**/*.css","!public/**/*.min.css"])
	    .pipe(minifyCss({compatibility: "ie8"}))
	    .pipe(gulp.dest("./dst/"));
	});
	
	gulp.task("js",function() {
	    return gulp.src(["public/**/*.js","!public/**/*.min.js"])
	   .pipe(ts({
	      target: "es5",
	      allowJs: true,
	      module: "commonjs",
	      moduleResolution: "node"
	    }))
	    .pipe(uglify())
	    .pipe(gulp.dest("./dst/"));
	});
	
	gulp.task("html",function() {
	    return gulp.src("public/**/*.html")
	    .pipe(minifyHtml())
	    .pipe(gulp.dest("./dst/"));
	});
	
	gulp.task("default",["css","js","html","mv"],function() {
	    console.log("gulp task finished!");
	});
	
	gulp.task("watch",function() {
	    gulp.watch("public/*",["default"]);
	});
	
	gulp.task("mv",function() {
	    return gulp.src("./dst/*")
	    .pipe(shell([
	        "cp -r ./dst/* ./public/"
	    ]));
	});
```

通过执行`gulp`命令即可开启压缩处理。

执行结果：
```
[~~~~@~~~~~ blog]# gulp 
[15:35:41] Using gulpfile /opt/blog/gulpfile.js
[15:35:41] Starting 'css'...
[15:35:41] Starting 'js'...
[15:35:41] Starting 'html'...
[15:35:42] Finished 'css' after 1.31 s
public/lib/Han/dist/han.js(2301,7): error TS7028: Unused label.
public/lib/velocity/velocity.js(348,22): error TS2300: Duplicate identifier 'offsetParent'.
public/lib/velocity/velocity.js(360,17): error TS2300: Duplicate identifier 'offsetParent'.
[15:36:01] TypeScript: 3 semantic errors
[15:36:01] TypeScript: emit succeeded (with errors)
[15:36:01] Finished 'js' after 20 s
[15:36:02] Finished 'html' after 20 s
[15:36:02] Starting 'default'...
gulp task finished!
[15:36:02] Finished 'default' after 90 μs
```

**遇到的坑**

　　Q：**GulpUglifyError: unable to minify JavaScript???**
　　A：在进行压缩的时候执行typescript检查javascript的类型(es6,es8)。

```
	//改写后的处理
	var ts = require('gulp-typescript');
	var uglify = require('gulp-uglifyjs');
	....
	.pipe(ts({
	    target: "es5",
	    allowJs: true,
	    module: "commonjs",
	    moduleResolution: "node"
	}))
	.pipe(uglify())
```
　　Q： **gulp command not found ????**
　　A： `npm install -g gulp`
　　
　　

　　

