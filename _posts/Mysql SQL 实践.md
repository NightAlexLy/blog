---
title: Mysql 实践
date: 2017-06-27 15:43:12
tag:
   - Mysql
   - Sql
categories:
   - Mysql
comments: false
---

#### Updaet语句####

　　需求：判断字段是否为空，为空则添加默认值，不位空，则在JSON字符串后面追加。
　　
　　判断为空的函数：IFNULL()
　　字符串追加的函数（这个不是追加，只是替换，因为使用的Json字符串）：replace()

　　实现语句：
```
	UPDATE 111 SET 222 = replace(222, '333', '1') WHERE vod_cid =15

	以及
	
	update table m set m.status1 = 2,m.status2 = 2,m.ext=IFNULL(replace(ext,'}',CONCAT(',"a":' , '"', 'b' , '"', '}')),'{"a":"b"}'),m.update_time = NOW()   where m.num ='123456';
	
```

#### commit、rollback等事务控制命令 ####

```

#commit、rollback用来确保数据库有足够的剩余空间；
#commit、rollback只能用于DML操作，即insert、update、delet;
#rollback操作撤销上一个commit、rollback之后的事务。
 
create table test
(
 PROD_ID varchar(10) not null,
 PROD_DESC varchar(25)  null,
 COST decimal(6,2)  null
);
 
#禁止自动提交
set autocommit=0;
 
#设置事务特性,必须在所有事务开始前设置
#set transaction read only;  #设置事务只读
set transaction read write;  #设置事务可读、写
 
#开始一次事务
start transaction;
insert into test
values('4456','mr right',46.97);
commit;     #位置1
 
insert into test
values('3345','mr wrong',54.90);
rollback;    #回到位置1，(位置2)；上次commit处
 
insert into test
values('1111','mr wan',89.76);
rollback;    #回到位置2，上次rollback处
 

```