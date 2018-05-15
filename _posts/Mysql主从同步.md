---
title: Mysql主从同步
date: 2018-05-15 19:33:12
tag:
   - mysql   
categories:  
   - mysql  
comments: false
---

　　阿里云服务快到期了，重新换了腾讯云的服务器。数据库懒的备份，直接配置一个主从同步，到时候就不用在去备份恢复。

#### Master Server配置####
##### 添加同步账户 #####
   连接Mysql服务[mysql -uroot -pxxxx]         
   mysql> create user repl;         
   Query OK, 1 rows affected (0.01 sec)         
   mysql> GRANT REPLICATION SLAVE ON *.* TO 'repl'@'192.168.0.%' IDENTIFIED BY 'mysql';             #指定那个段的IP才能连接服务         
   Query OK, 1 rows affected (0.01 sec)             
   mysql> flush privileges;            
   Query OK, 1 rows affected (0.01 sec)         
##### 修改/etc/my.cnf文件#####   
   [mysqld]
   port=13577
   datadir=/var/lib/mysql
   socket=/tmp/mysql.sock
   server-id=1  # server id
   log-bin=master-bin  # master-bin日志文件 
   log-bin-index=master-bin.index  
   binlog-do-db=itools  # 指定同步那个库

   [mysqld_safe]
   log-error=/var/log/mariadb/mariadb.log
   pid-file=/var/run/mariadb/mariadb.pid
##### 重启Master Server的Mysql服务#####   
   systemctl restart mysql.service
##### 查看Master的状态#####   
   连接Mysql服务[mysql -uroot -pxxxx]
   执行`show master status;`
```
   mysql> show master status;
   +-------------------+----------+--------------+------------------+
   | File              | Position | Binlog_Do_DB | Binlog_Ignore_DB |
   +-------------------+----------+--------------+------------------+
   | master-bin.000004 |    10237 | itools       |                  |
   +-------------------+----------+--------------+------------------+
   1 row in set (0.00 sec)
```
#### Slave Server配置####    
##### 修改/etc/my.cnf文件#####   
   [mysqld]
   datadir=/var/lib/mysql
   socket=/var/lib/mysql/mysql.sock
   server-id=2
   relay-log-index=slave-relay-bin.index
   relay-log=slave-relay-bin
   [mysql.server]
   user=mysql
   [client]
   socket=/var/lib/mysql/mysql.sock
##### 重启Master Server的Mysql服务#####   
   systemctl restart mysql.service
##### 添加Master配置#####   
   连接Mysql服务[mysql -uroot -pxxxx]
```
   mysql> change master to master_host='xxx.xxx.xxx.xxx',   # Master的IP
          master_port=13577,    # Master的port
          master_user='repl',   # 连接Master的用户名
          master_password='mysql',  # 连接Master的用户密码
          master_log_file='master-bin.000004',   # 上面show master status 查到的File值
          master_log_pos=2806;    # 上面show master status  查看到Position值
   Query OK, 1 rows affected (0.01 sec)
   mysql> flush privileges;
   Query OK, 1 rows affected (0.01 sec)
```
##### 查看Slave的状态#####   
```
mysql> show slave status;
   +----------------------------------+----------------+-------------+-------------+---------------+-------------------+---------------------+------------------------+---------------+-----------------------+------------------+-------------------+-----------------+---------------------+--------------------+------------------------+-------------------------+-----------------------------+------------+------------+--------------+---------------------+-----------------+-----------------+----------------+---------------+--------------------+--------------------+--------------------+-----------------+-------------------+----------------+-----------------------+-------------------------------+---------------+---------------+----------------+----------------+-----------------------------+------------------+-------------+----------------------------+-----------+---------------------+-----------------------------------------------------------------------------+--------------------+-------------+-------------------------+--------------------------+----------------+--------------------+--------------------+-------------------+---------------+
   | Slave_IO_State                   | Master_Host    | Master_User | Master_Port | Connect_Retry | Master_Log_File   | Read_Master_Log_Pos | Relay_Log_File         | Relay_Log_Pos | Relay_Master_Log_File | Slave_IO_Running | Slave_SQL_Running | Replicate_Do_DB | Replicate_Ignore_DB | Replicate_Do_Table | Replicate_Ignore_Table | Replicate_Wild_Do_Table | Replicate_Wild_Ignore_Table | Last_Errno | Last_Error | Skip_Counter | Exec_Master_Log_Pos | Relay_Log_Space | Until_Condition | Until_Log_File | Until_Log_Pos | Master_SSL_Allowed | Master_SSL_CA_File | Master_SSL_CA_Path | Master_SSL_Cert | Master_SSL_Cipher | Master_SSL_Key | Seconds_Behind_Master | Master_SSL_Verify_Server_Cert | Last_IO_Errno | Last_IO_Error | Last_SQL_Errno | Last_SQL_Error | Replicate_Ignore_Server_Ids | Master_Server_Id | Master_UUID | Master_Info_File           | SQL_Delay | SQL_Remaining_Delay | Slave_SQL_Running_State                                                     | Master_Retry_Count | Master_Bind | Last_IO_Error_Timestamp | Last_SQL_Error_Timestamp | Master_SSL_Crl | Master_SSL_Crlpath | Retrieved_Gtid_Set | Executed_Gtid_Set | Auto_Position |
   +----------------------------------+----------------+-------------+-------------+---------------+-------------------+---------------------+------------------------+---------------+-----------------------+------------------+-------------------+-----------------+---------------------+--------------------+------------------------+-------------------------+-----------------------------+------------+------------+--------------+---------------------+-----------------+-----------------+----------------+---------------+--------------------+--------------------+--------------------+-----------------+-------------------+----------------+-----------------------+-------------------------------+---------------+---------------+----------------+----------------+-----------------------------+------------------+-------------+----------------------------+-----------+---------------------+-----------------------------------------------------------------------------+--------------------+-------------+-------------------------+--------------------------+----------------+--------------------+--------------------+-------------------+---------------+
   | Waiting for master to send event | xxx.xxx.xxx.xxx | repl        |       13577 |            60 | master-bin.000004 |               10237 | slave-relay-bin.000002 |          7698 | master-bin.000004     | Yes              | Yes               |                 |                     |                    |                        |                         |                             |          0 |            |            0 |               10237 |            7867 | None            |                |             0 | No                 |                    |                    |                 |                   |                |                     0 | No                            |             0 |               |              0 |                |                             |                1 |             | /var/lib/mysql/master.info |         0 |                NULL | Slave has read all relay log; waiting for the slave I/O thread to update it |              86400 |             |                         |                          |                |                    |                    |                   |             0 |
   +----------------------------------+----------------+-------------+-------------+---------------+-------------------+---------------------+------------------------+---------------+-----------------------+------------------+-------------------+-----------------+---------------------+--------------------+------------------------+-------------------------+-----------------------------+------------+------------+--------------+---------------------+-----------------+-----------------+----------------+---------------+--------------------+--------------------+--------------------+-----------------+-------------------+----------------+-----------------------+-------------------------------+---------------+---------------+----------------+----------------+-----------------------------+------------------+-------------+----------------------------+-----------+---------------------+-----------------------------------------------------------------------------+--------------------+-------------+-------------------------+--------------------------+----------------+--------------------+--------------------+-------------------+---------------+
   1 row in set (0.00 sec)
```

   **主要看`Slave_IO_Running`和`Slave_SQL_Running`是否都是`YES`。**

#### 验证####    
   
   在Master Server的同步里面插入表或者数据， Slave会自动进行同步。

#### 资料####    

- [实现两个Mysql数据库之间的主从同步](https://blog.csdn.net/guoguo1980/article/details/2343722)
- [主从不同步解决办法，常见问题及解决办法，在线对mysql做主从复制](http://blog.51cto.com/13407306/2067333)
- [mysql 远程连接数据库的二种方法](https://www.cnblogs.com/skyWings/p/5952795.html)
- [MySQL主从复制指定不同库表同步参数说明](https://www.linuxidc.com/Linux/2016-07/132862.htm)
- [Mysql主从配置，实现读写分离](https://www.cnblogs.com/alvin_xp/p/4162249.html)
- [mysql主从选择性同步某几个库实现方法](http://blog.itpub.net/29654823/viewspace-2139004/)

