
---
title: Hexo 与 Git 集成
tag:
   - hexo
   - git
---


#### git初始化项目 ####

　　登录[Github](https://github.com/login)，初始化GitHub Pages项目。即是添加一个Git Project。
         
　　点击`New repository`创建一个新的Project.需要填写选项如下：    
      　　　
　　- `Repository Name` 填写 `{github AccountName}.github.io`    
　　　　　　比如我的`AccountName`为`NightAlexLy`，即填写的为`NightAlexLy.github.io`
　　- 点击保存

　　![create repository](http://ore2d9chp.bkt.clouddn.com/create_rep.png)  



#### 配置git信息 ####

　　登录远程服务器.执行下列命令初始化Git信息： 
  
```
　　　git config --global user.name "your username"    
　　　git config --global user.email "your email"

```
　　关于Git的操作：    
　　　[Git 常用命令整理](http://justcoding.iteye.com/blog/1830388)    
　　　[Git Pro](http://iissnan.com/progit/)


#### 配置Hexo ####    

　　**站点文件和主题文件区别：   **
　　- 站点文件作用于整个站点,配置一些站点信息（比如`Site、URL、Directory`等基础信息）   
　　- 主题文件即是应用主题所采用的配置、一般只做用于你采用的主题。   
　　站点文件一般在blog的根目录,主题文件在Theme/主题名/下。文件名都为`_config.yml`

　　找到deploy节点：  
　　　`type`设置为`git`    
　　　`repo`设置为`你刚创建的git Project repository ` 
　　　`branch`设置为`master`   

　　　保存即可.


#### 部署至github ####

　　 切换到站点目录`${BLOG}`,执行`hexo deploy`命令.
　　  
　　![hexo deploy](http://ore2d9chp.bkt.clouddn.com/hexo_deploy.png)

　　 结尾出现`INFO Deploy done:git`表示push成功.(部署成功)

#### 验证Github Pages ####

　　 浏览器输入"创建项目的repository name"。比如我的为nightalexly.github.io。

　　![github pages](http://ore2d9chp.bkt.clouddn.com/hexo_gitpages.png)
   