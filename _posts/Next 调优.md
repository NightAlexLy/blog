
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
   
