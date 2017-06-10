---
title: hexo auto shell
tag:
   - linux
   - shell
   - hexo
---

- ���

     �����������֤������ѧ���û�������ESC����9.9Ԫ/�µĻ��׼���ȴһ��������վ��дд���ѵ��ĵ��Լ����顣֮ǰҲ�����վ��������ڸ���ûʱ�䣨ûʱ���Ǽٵģ�����������������ԭ���������������ڣ��������ڱ������ա��۾������S��
     ������
������     ��վ׼��ͨ��Hexo��������Hexo�ǻ���NodeJs��������ͨ��github�йܡ�**ͨ���ű���ʵ���Զ����£��Զ������ȹ���**��Ҳ����Linux����������򻯲��衣��һ����Ч�ʵĹ���ʨ�������ظ������飬���˷�ʱ�䡣
������     
     
- linux ������

������Linux�� �������������ͨ�� alias����  
�����������﷨��ʽ�� alias  key= '  command  '  
������
���������ֱ��������������ֻ���ڱ��λ�������Ч�����������������߹ػ���������´���������������ʱ���������õ�һЩ�����ᶪʧ��һ�㶼�Ǳ��������������ļ��У���֤���ѵı�����������ʱ�򶼻���Ч��
������
������һ���Ҷ���ѱ�����������    **~/.bashrc**  �ļ��С�

     �����ڷ�������ӵı�����
```
     alias vwc='vi /opt/blog/_config.yml'  #�༭վ���ļ�
	 alias vwtc='vi /opt/blog/themes/next/_config.yml'  #�༭�����ļ�
	 alias cdblog='cd /opt/blog'    #�л�������Ŀ¼
	 alias hs='nohup hexo server -p 80 >/dev/null 2>&1 &'  #����hexo
	 alias hst="sh /opt/blog/killhexo.sh "   #ֹͣhexo
	 alias psh='ps -ef | grep hexo'   #�鿴hexo ����
```

- hexo cmd console

�������ѱ�д��hexo console  ���е�low�� ������������������
   ![hexo console](/images/hexo_console.png)        
������
�����������¹��ܣ�
����������������.����hexo����
����������������.�ر�hexo����
�������������� 3.���hexo pid
�������������� 4. �Զ�����
�������������� 5. �Զ�����github

��������shell��
```
#!/bin/bash

function initUI() 
{

	while [ true ]
	do
	     echo ""
	     echo "------------------------"
	     echo "-----   h  e  x  o -----"
	     echo "------------------------"

	     echo " 1. start    server "
	     echo " 2. shutdown server "
	     echo " 3. hexo pid        "
	     echo " 4. auto update     "
	     echo " 5. auto deploy     "
	     echo -n " Please enter :     "
	     
	     read num

	     if [ -z $num ];then
	       exit 0
	     elif  [ $num = 1 ];then
	      startServer
	     elif [ $num = 2 ];then
	      stopServer
	     elif [ $num = 3 ];then
	      getPID
             elif [ $num = 4 ];then
              autoUpdate
              startServer
             elif [ $num = 5 ];then
              autoDeploy
	     else
	      echo "Input error !!!!!!"
	     fi
	done 
}

function  startServer() 
{
   cd /opt/blog
   nohup hexo server -p 80 >/dev/null 2>&1 &  
   echo -n "start server sucess !!!  PID ::: " 
   getPID
}

function stopServer()
{
   ps -ef|grep hexo |grep -v grep | grep -v /bin/bash| awk '{print $2}' | xargs kill -9  >> /dev/null
   echo "stop hexo success !!! " 
}

function getPID()
{
  ps -ef | grep hexo | grep -v grep | grep -v /bin/bash |  awk '{print $2}' 
  echo ""
}

function autoUpdate()
{

  chkHexo=`ps -ef|grep hexo |grep -v grep | grep -v /bin/bash |awk '{print $2}'`
  if [[ -z $chkHexo ]];then
     echo " hexo server is stop !!! "
  else 
     stopServer
  fi
  
  echo ""
  cd /opt/blog
  rm -rf db.json
  hexo clean
  hexo generate

}


function autoDeploy()
{
   
  autoUpdate

/usr/bin/expect <<-EOF
  spawn hexo deploy
  expect "Username"
  send "$gitUn\r"
  expect "Password"
  send "$gitPwd\r"
  interact
  expect eof
EOF

  startServer

}

clear
initUI
```

- ��ʱ����github

������shell��autoDeploy�ķ���,������һ���ű��У���ͨ��Linux�µ�crontab��ʱ��������ʱ�����ʱִ�нű�����ʵ��

�����������õ�ÿ��23:30�Զ�����

����30 23 * * * root `sh /opt/blog/hexo-deploy.sh >> /tmp/test.txt`

- �����Ŀ�
    
������ Q �� crontab�ڻ���������Shell����������һ�£�
������ A �� ���磬���ڽű���ʹ��hexo�������hexo������/usr/local/bin���档crontab������PATHû��ָ�����Ŀ¼���ã��������������Ҳ������Զ�������һ�²��ɹ�������취����`/etc/profile`�е�PATH����׷��`:/usr/local/bin`���ڽű������ͷ�����`. /etc/profile`���ɡ�
������ Q��Linux�����Զ�������`expect command not found`
������ A :  yum install -y expect