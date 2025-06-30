#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简单的HTTP服务器，用于本地测试视频素材库网站
使用方法：python server.py
然后在浏览器中访问：http://localhost:8000
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# 配置
PORT = 8000
HOST = 'localhost'

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """自定义HTTP请求处理器"""
    
    def end_headers(self):
        # 添加CORS头，允许跨域访问
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        """自定义日志格式"""
        print(f"[{self.date_time_string()}] {format % args}")

def start_server():
    """启动服务器"""
    try:
        # 确保在正确的目录中
        if not os.path.exists('index.html'):
            print("❌ 错误：未找到 index.html 文件")
            print("请确保在项目根目录中运行此脚本")
            return False
        
        # 创建服务器
        with socketserver.TCPServer((HOST, PORT), MyHTTPRequestHandler) as httpd:
            print("🚀 视频素材库服务器启动成功！")
            print(f"📍 服务器地址: http://{HOST}:{PORT}")
            print(f"📁 服务目录: {os.getcwd()}")
            print("⏹️  按 Ctrl+C 停止服务器")
            print("-" * 50)
            
            # 自动打开浏览器
            try:
                webbrowser.open(f'http://{HOST}:{PORT}')
                print("🌐 已自动打开浏览器")
            except:
                print("⚠️  无法自动打开浏览器，请手动访问上面的地址")
            
            print("-" * 50)
            
            # 启动服务器
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ 端口 {PORT} 已被占用")
            print(f"请尝试访问 http://{HOST}:{PORT} 或稍后重试")
        else:
            print(f"❌ 启动服务器失败: {e}")
        return False
    except KeyboardInterrupt:
        print("\n⏹️  服务器已停止")
        return True
    except Exception as e:
        print(f"❌ 发生未知错误: {e}")
        return False

def check_requirements():
    """检查运行环境"""
    print("🔍 检查运行环境...")
    
    # 检查Python版本
    if sys.version_info < (3, 6):
        print("❌ Python版本过低，需要Python 3.6或更高版本")
        return False
    
    print(f"✅ Python版本: {sys.version}")
    
    # 检查必要文件
    required_files = ['index.html', 'style.css', 'script.js']
    missing_files = []
    
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ 缺少必要文件: {', '.join(missing_files)}")
        return False
    
    print("✅ 所有必要文件都存在")
    return True

def main():
    """主函数"""
    print("🎬 视频素材库 - 本地服务器")
    print("=" * 50)
    
    # 检查环境
    if not check_requirements():
        print("\n❌ 环境检查失败，无法启动服务器")
        input("按回车键退出...")
        return
    
    print("\n🚀 准备启动服务器...")
    
    # 启动服务器
    if start_server():
        print("✅ 服务器正常关闭")
    else:
        print("❌ 服务器异常退出")
    
    input("\n按回车键退出...")

if __name__ == "__main__":
    main() 