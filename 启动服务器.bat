@echo off
chcp 65001 >nul
title 视频素材库 - 本地服务器

echo.
echo 🎬 视频素材库 - 本地服务器
echo ========================================
echo.

:: 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到Python，请先安装Python 3.6或更高版本
    echo.
    echo 下载地址: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

:: 检查是否存在必要文件
if not exist "index.html" (
    echo ❌ 未找到 index.html 文件
    echo 请确保在项目根目录中运行此脚本
    echo.
    pause
    exit /b 1
)

echo ✅ 环境检查通过
echo.
echo 🚀 正在启动服务器...
echo.

:: 启动Python服务器
python server.py

echo.
echo �� 感谢使用视频素材库！
pause 