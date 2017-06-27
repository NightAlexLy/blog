---
title: Oracle 实践
date: 2017-06-27 16:28:12
tag:
   - Oracle
   - Sql
categories:
   - Oracle
comments: false
---


#### 查看当前的库 ####
```
	select  name  from  v$ database  ;
```

#### 查看当前表是否存在 ####

```
	select count(*) from user_tables where table_name = 'TABLE_NAME';      0表示不存在，1表示存在。
	
	select count(*) from dba_tables where owner = 'USER_NAME' and table_name = 'TABLE_NAME';   
```

#### 建立索引 ####

```
 	CREATE INDEX IDX_OUT_REFUND_NO ON ACCTPAY.T_ACC_REFUND_APPLY(OUT_REFUND_NO); 
```

#### 查看表的索引 ####

```
	select * from user_indexes;
	select * from all_indexes;
```


#### 删除索引 ####

```
	DROP INDEX ACCTPAY.IDX_OUT_REFUND_NO;
```

#### 表新增列   ####

```
	alter table Schema.Table add Column VARCHAR2(32) ;
   comment on column Schema.Table.Column
     is '字段备注'; 
```

#### 表删除列 ####    

```
	alter table Schema.Table drop column ColumnName;
```