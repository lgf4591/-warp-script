@echo off
chcp 936 >nul
setlocal enabledelayedexpansion

:start
if not exist warp.exe Powershell wget -Uri "https://gitlab.com/Misaka-blog/warp-script/-/raw/main/files/warp-yxip/warp.exe?inline=false" -OutFile "warp.exe"
if not exist warp.exe echo 缺少 warp.exe 程序 & pause & exit
for %%i in (v4 v6) do (
    if not exist ips-%%i.txt Powershell wget -Uri "https://gitlab.com/Misaka-blog/warp-script/-/raw/main/files/warp-yxip/ips-%%i.txt" -OutFile "ips-%%i.txt"
    if not exist ips-%%i.txt echo 缺少 IP%%i 数据 ips-%%i.txt & pause & exit
)

:main
cls
title WARP Endpoint IP 一键优选脚本
echo #############################################################
echo #                WARP Endpoint IP 一键优选脚本              #
echo # 作者: MisakaNo の 小破站                                  #
echo # 博客: https://blog.misaka.rest                            #
echo # GitHub 项目: https://github.com/Misaka-blog               #
echo # GitLab 项目: https://gitlab.com/Misaka-blog               #
echo # Telegram 频道: https://t.me/misaka_noc                    #
echo # Telegram 群组: https://t.me/misaka_noc_chat               #
echo # YouTube 频道: https://www.youtube.com/@misaka-blog        #
echo #############################################################
echo.
echo 1. WARP IPv4 Endpoint IP 优选
echo 2. WARP IPv6 Endpoint IP 优选
echo -------------
echo 0. 退出
echo.
choice /c 120 /M "请输入选项:"
if "%errorlevel%"=="3" exit
if "%errorlevel%"=="2" set ver=v6
if "%errorlevel%"=="1" set ver=v4
title WARP IP%ver% Endpoint IP 优选
set filename=ips-%ver%.txt
goto get%ver%


:getv4
for /f "delims=" %%i in (%filename%) do (
set !random!_%%i=randomsort
)
for /f "tokens=2,3,4 delims=_.=" %%i in ('set ^| findstr =randomsort ^| sort /m 10240') do (
call :randomcidrv4
if not defined %%i.%%j.%%k.!cidr! set %%i.%%j.%%k.!cidr!=anycastip&set /a n+=1
if !n! EQU 100 goto getip
)
goto getv4

:randomcidrv4
set /a cidr=%random%%%256
goto :eof

:getv6
for /f "delims=" %%i in (%filename%) do (
set !random!_%%i=randomsort
)
for /f "tokens=2,3,4 delims=_:=" %%i in ('set ^| findstr =randomsort ^| sort /m 10240') do (
call :randomcidrv6
if not defined [%%i:%%j:%%k::!cidr!] set [%%i:%%j:%%k::!cidr!]=anycastip&set /a n+=1
if !n! EQU 100 goto getip
)
goto getv6

:randomcidrv6
set str=0123456789abcdef
set /a r=%random%%%16
set cidr=!str:~%r%,1!
set /a r=%random%%%16
set cidr=!cidr!!str:~%r%,1!
set /a r=%random%%%16
set cidr=!cidr!!str:~%r%,1!
set /a r=%random%%%16
set cidr=!cidr!!str:~%r%,1!
set /a r=%random%%%16
set cidr=!cidr!:!str:~%r%,1!
set /a r=%random%%%16
set cidr=!cidr!!str:~%r%,1!
set /a r=%random%%%16
set cidr=!cidr!!str:~%r%,1!
set /a r=%random%%%16
set cidr=!cidr!!str:~%r%,1!
set /a r=%random%%%16
set cidr=!cidr!:!str:~%r%,1!
set /a r=%random%%%16
set cidr=!cidr!!str:~%r%,1!
set /a r=%random%%%16
set cidr=!cidr!!str:~%r%,1!
set /a r=%random%%%16
set cidr=!cidr!!str:~%r%,1!
set /a r=%random%%%16
set cidr=!cidr!:!str:~%r%,1!
set /a r=%random%%%16
set cidr=!cidr!!str:~%r%,1!
set /a r=%random%%%16
set cidr=!cidr!!str:~%r%,1!
set /a r=%random%%%16
set cidr=!cidr!!str:~%r%,1!
goto :eof

:getip
del ip.txt > nul 2>&1
for /f "tokens=1 delims==" %%i in ('set ^| findstr =randomsort') do (
set %%i=
)
for /f "tokens=1 delims==" %%i in ('set ^| findstr =anycastip') do (
echo %%i>>ip.txt
)
for /f "tokens=1 delims==" %%i in ('set ^| findstr =anycastip') do (
set %%i=
)

warp
del ip.txt > nul 2>&1
echo 请按任意键关闭窗口
pause > nul
exit
