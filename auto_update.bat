@echo off

set "currentYMD=%date:~,4%%date:~5,2%%date:~8,2%"
git pull origin master
git status
git add .
git commit -m "update doc"%currentYMD%
git push origin master
pause >> d:/logs/update.log