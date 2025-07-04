# 🎬 私人视频素材库 - Video Gallery

一个带有访问控制的私人视频素材展示网站，只有通过您分享的链接才能被他人访问。

## ✨ 核心特点

- 🔐 **访问控制** - 密码保护，确保只有您能管理视频
- 🔗 **安全分享** - 生成临时或永久访问链接，控制他人的访问权限
- 🎯 **拖拽上传** - 支持拖拽或点击上传多个视频文件
- 🔍 **智能搜索** - 快速搜索视频名称和描述
- 🏷️ **分类筛选** - 按最新、热门等分类查看视频
- 🎥 **视频预览** - 鼠标悬停自动播放预览
- 📱 **响应式设计** - 完美适配桌面和移动设备
- ⬇️ **下载功能** - 一键下载视频文件
- 🎨 **现代UI** - 采用渐变背景和毛玻璃效果

## 🔒 隐私保护机制

### 访问控制
- **密码保护**：首次访问需要输入密码（默认：`video123`）
- **自动登出**：24小时后自动退出，需重新登录
- **链接保护**：所有分享链接都包含访问验证

### 分享权限
1. **临时访问**（24小时）- 适合短期分享
2. **永久访问** - 长期有效的分享链接
3. **单视频分享** - 分享特定视频的访问链接

## 🚀 快速开始

### 1. 修改访问密码
编辑 `script.js` 文件第6行，修改密码：
```javascript
const ACCESS_PASSWORD = "您的新密码"; // 修改为您想要的密码
```

### 2. 本地运行
- **简单方式**：双击 `index.html` 文件
- **服务器方式**：运行 `python server.py` 或双击 `启动服务器.bat`

### 3. 首次使用
1. 在浏览器中打开网站
2. 输入您设置的密码
3. 开始上传和管理视频

## 🌐 部署到网络

### 推荐方案：GitHub Pages

1. **创建GitHub仓库**
   ```bash
   git init
   git add .
   git commit -m "初始化视频素材库"
   git remote add origin https://github.com/您的用户名/仓库名.git
   git push -u origin main
   ```

2. **开启GitHub Pages**
   - 进入仓库设置 → Pages
   - 选择 main 分支
   - 几分钟后访问：`https://您的用户名.github.io/仓库名`

3. **获取网站链接**
   - 登录后点击"分享访问权限"
   - 选择分享类型并生成链接
   - 复制链接发给需要访问的人

### 其他部署选项

- **Netlify**：拖拽文件夹部署，自动获得域名
- **Vercel**：连接GitHub自动部署
- **自己的服务器**：上传文件到网站根目录

## 🔧 使用说明

### 管理员操作（您）

1. **登录网站**
   - 输入密码进入管理界面
   - 自动保存登录状态24小时

2. **上传视频**
   - 拖拽文件到上传区域
   - 或点击"选择视频文件"按钮
   - 支持MP4、AVI、MOV等格式

3. **分享访问权限**
   - 点击右上角"分享访问权限"按钮
   - 选择临时（24小时）或永久访问
   - 复制生成的链接发给他人

4. **分享单个视频**
   - 点击视频的分享按钮
   - 自动生成24小时临时访问链接
   - 他人通过链接可直接观看该视频

### 访问者操作（他人）

1. **通过分享链接访问**
   - 点击您分享的链接
   - 无需输入密码，直接进入网站
   - 可以浏览、播放、下载视频

2. **单视频链接**
   - 点击单视频分享链接
   - 直接打开对应视频播放
   - 可以浏览其他视频

## 📁 文件结构

```
dazuo/
├── index.html              # 主页面（包含登录界面）
├── style.css               # 样式文件（包含登录样式）
├── script.js               # 功能脚本（包含访问控制）
├── server.py               # 本地服务器
├── 启动服务器.bat          # Windows启动脚本
├── 启动服务器.sh           # macOS/Linux启动脚本
└── README.md               # 说明文档
```

## ⚙️ 自定义配置

### 修改密码
编辑 `script.js` 文件：
```javascript
const ACCESS_PASSWORD = "新密码";
```

### 修改登录过期时间
编辑 `script.js` 文件，修改第49行：
```javascript
if (now - authData.timestamp < 7 * 24 * 60 * 60 * 1000) // 改为7天
```

### 修改分享链接过期时间
编辑 `script.js` 文件，修改第92行：
```javascript
data.expires = now + (7 * 24 * 60 * 60 * 1000); // 改为7天
```

### 修改主题色彩
编辑 `style.css` 文件：
```css
/* 修改主色调 */
background: linear-gradient(135deg, #新颜色1 0%, #新颜色2 100%);
```

## 🔐 安全注意事项

1. **密码安全**
   - 使用复杂密码，避免被猜测
   - 定期更换访问密码
   - 不要在公共场所输入密码

2. **链接管理**
   - 临时链接24小时后自动失效
   - 永久链接请谨慎分享
   - 可以通过重新部署网站使所有链接失效

3. **数据安全**
   - 视频存储在浏览器本地，刷新后会丢失
   - 建议备份重要视频文件
   - 考虑升级为服务器版本以永久存储

## 🚨 限制说明

- **存储限制**：使用浏览器本地存储，容量有限
- **文件丢失**：刷新页面后上传的视频会丢失
- **同时访问**：多人同时访问不会看到实时更新
- **移动端**：大文件上传在移动设备上可能较慢

## 🔄 升级建议

如需更稳定的服务，建议升级为服务器版本：

1. **后端存储**：使用数据库存储视频信息
2. **云存储**：配置阿里云OSS、腾讯云COS等
3. **用户系统**：支持多用户注册和管理
4. **高级权限**：细粒度的访问权限控制

## 💡 使用场景

- **个人作品集**：展示摄影、视频作品
- **私人分享**：与朋友分享旅行视频
- **工作协作**：团队内部视频资料共享
- **客户展示**：向客户展示项目进度
- **临时分享**：短期分享特定内容

## 🤝 技术支持

如需帮助或定制开发，请联系开发者。

## 📜 许可证

本项目采用 MIT 许可证，您可以自由使用和修改。

---

**🎉 享受您的私人视频素材库！**

*安全分享，隐私保护，让创意在信任中传播。* 