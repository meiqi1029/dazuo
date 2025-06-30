#!/bin/bash

# 设置脚本在遇到错误时停止执行
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}🎬 视频素材库 - 本地服务器${NC}"
echo "========================================"
echo ""

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo -e "${RED}❌ 未检测到Python，请先安装Python 3.6或更高版本${NC}"
        echo ""
        echo "macOS安装方法: brew install python3"
        echo "Ubuntu/Debian安装方法: sudo apt-get install python3"
        echo "或访问: https://www.python.org/downloads/"
        echo ""
        read -p "按回车键退出..."
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

# 检查Python版本
PYTHON_VERSION=$($PYTHON_CMD -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
echo -e "${GREEN}✅ Python版本: $PYTHON_VERSION${NC}"

# 检查是否存在必要文件
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ 未找到 index.html 文件${NC}"
    echo "请确保在项目根目录中运行此脚本"
    echo ""
    read -p "按回车键退出..."
    exit 1
fi

if [ ! -f "style.css" ]; then
    echo -e "${YELLOW}⚠️  未找到 style.css 文件${NC}"
fi

if [ ! -f "script.js" ]; then
    echo -e "${YELLOW}⚠️  未找到 script.js 文件${NC}"
fi

echo -e "${GREEN}✅ 环境检查通过${NC}"
echo ""
echo -e "${BLUE}🚀 正在启动服务器...${NC}"
echo ""

# 启动Python服务器
$PYTHON_CMD server.py

echo ""
echo -e "${GREEN}👋 感谢使用视频素材库！${NC}"
read -p "按回车键退出..." 