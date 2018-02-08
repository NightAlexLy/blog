@echo off

set "currentYMD=%date:~,4%%date:~5,2%%date:~8,2%" 
git pull origin master  >> d:/logs/update.log
git status  >> d:/logs/update.log
git add .  >> d:/logs/update.log
git commit -m "update doc"%currentYMD% >> d:/logs/update.log
git push origin master >> d:/logs/update.log
pause 