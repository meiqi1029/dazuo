// 全局变量
let videos = [];
let currentVideoIndex = 0;
let isAuthenticated = false;

// 配置 - 重要：请修改下面的密码！
const ACCESS_PASSWORD = "qiuxiaohei"; // 🔒 请修改为您自己的复杂密码
const SITE_SECRET = "myVideoSite2024#" + new Date().getFullYear(); // 用于生成访问token的密钥

// DOM 元素
const loginContainer = document.getElementById('loginContainer');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const logoutBtn = document.getElementById('logoutBtn');
const shareAccessBtn = document.getElementById('shareAccessBtn');
const shareAccessModal = document.getElementById('shareAccessModal');
const generateAccessBtn = document.getElementById('generateAccessBtn');
const generatedLinkSection = document.getElementById('generatedLinkSection');
const generatedLink = document.getElementById('generatedLink');
const linkExpiryInfo = document.getElementById('linkExpiryInfo');

// 其他DOM元素
const uploadArea = document.getElementById('uploadArea');
const videoInput = document.getElementById('videoInput');
const videoGrid = document.getElementById('videoGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const categoryBtns = document.querySelectorAll('.category-btn');
const subcategoryBtns = document.querySelectorAll('.subcategory-btn');
const traditionalSubcategory = document.getElementById('traditionalSubcategory');
const emptyState = document.getElementById('emptyState');
const videoModal = document.getElementById('videoModal');
const shareModal = document.getElementById('shareModal');
const modalVideo = document.getElementById('modalVideo');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const shareLink = document.getElementById('shareLink');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    initializeEventListeners();
});

// 检查认证状态
function checkAuthentication() {
    // 检查URL参数中是否有访问token
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access');
    const videoId = urlParams.get('video');
    
    if (accessToken) {
        // 验证访问token
        if (validateAccessToken(accessToken)) {
            isAuthenticated = true;
            showMainApp();
            
            // 如果有视频ID，直接播放该视频
            if (videoId) {
                setTimeout(() => {
                    openVideoModal(videoId);
                }, 500);
            }
            return;
        } else {
            showErrorMessage('访问链接已失效或无效');
        }
    }
    
    // 检查本地存储的登录状态
    const savedAuth = localStorage.getItem('videoGalleryAuth');
    if (savedAuth) {
        const authData = JSON.parse(savedAuth);
        const now = new Date().getTime();
        
        // 检查登录是否过期（24小时）
        if (now - authData.timestamp < 24 * 60 * 60 * 1000) {
            isAuthenticated = true;
            showMainApp();
            loadStoredVideos();
            updateVideoDisplay();
            return;
        } else {
            localStorage.removeItem('videoGalleryAuth');
        }
    }
    
    // 显示登录界面
    showLoginScreen();
}

// 显示登录界面
function showLoginScreen() {
    loginContainer.style.display = 'flex';
    mainApp.style.display = 'none';
    passwordInput.focus();
}

// 显示主应用
function showMainApp() {
    loginContainer.style.display = 'none';
    mainApp.style.display = 'block';
    loadStoredVideos();
    updateVideoDisplay();
}

// 验证访问token
function validateAccessToken(token) {
    try {
        const decoded = atob(token);
        const data = JSON.parse(decoded);
        const now = new Date().getTime();
        
        // 检查token是否包含正确的密钥和是否过期
        if (data.secret === SITE_SECRET) {
            if (data.type === 'permanent') {
                return true;
            } else if (data.type === 'temporary' && now < data.expires) {
                return true;
            }
        }
        return false;
    } catch (e) {
        return false;
    }
}

// 生成访问token
function generateAccessToken(type) {
    const now = new Date().getTime();
    const data = {
        secret: SITE_SECRET,
        type: type,
        created: now
    };
    
    if (type === 'temporary') {
        data.expires = now + (24 * 60 * 60 * 1000); // 24小时后过期
    }
    
    return btoa(JSON.stringify(data));
}

// 初始化事件监听器
function initializeEventListeners() {
    // 登录表单
    loginForm.addEventListener('submit', handleLogin);
    
    // 退出按钮
    logoutBtn.addEventListener('click', handleLogout);
    
    // 分享访问权限按钮
    shareAccessBtn.addEventListener('click', openShareAccessModal);
    
    // 生成访问链接按钮
    generateAccessBtn.addEventListener('click', generateAccessLink);
    
    // 模态框关闭
    document.getElementById('closeShareAccessModal').addEventListener('click', closeShareAccessModal);
    
    // 复制访问链接
    document.getElementById('copyAccessLinkBtn').addEventListener('click', copyAccessLink);
    
    // 只有认证后才初始化其他功能
    if (isAuthenticated) {
        initializeMainAppListeners();
    }
}

// 初始化主应用的事件监听器
function initializeMainAppListeners() {
    // 文件上传
    videoInput.addEventListener('change', handleFileSelect);
    
    // 拖拽上传
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // 搜索功能
    searchInput.addEventListener('input', handleSearch);
    
    // 筛选功能
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
    
    // 分类功能
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', handleCategory);
    });
    
    // 二级分类功能
    subcategoryBtns.forEach(btn => {
        btn.addEventListener('click', handleSubcategory);
    });
    
    // 模态框关闭
    document.getElementById('closeModal').addEventListener('click', closeVideoModal);
    document.getElementById('closeShareModal').addEventListener('click', closeShareModal);
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === videoModal) closeVideoModal();
        if (e.target === shareModal) closeShareModal();
        if (e.target === shareAccessModal) closeShareAccessModal();
    });
    
    // 复制链接
    document.getElementById('copyLinkBtn').addEventListener('click', copyShareLink);
    
    // 社交分享按钮
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', handleSocialShare);
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
            closeShareModal();
            closeShareAccessModal();
        }
    });
}

// 处理登录
function handleLogin(e) {
    e.preventDefault();
    const password = passwordInput.value.trim();
    
    if (password === ACCESS_PASSWORD) {
        isAuthenticated = true;
        
        // 保存登录状态到本地存储
        const authData = {
            timestamp: new Date().getTime()
        };
        localStorage.setItem('videoGalleryAuth', JSON.stringify(authData));
        
        showMainApp();
        initializeMainAppListeners();
        showSuccessMessage('登录成功！');
    } else {
        showErrorMessage('密码错误，请重试');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// 处理退出
function handleLogout() {
    isAuthenticated = false;
    localStorage.removeItem('videoGalleryAuth');
    
    // 清空URL参数
    window.history.replaceState({}, document.title, window.location.pathname);
    
    showLoginScreen();
    showSuccessMessage('已退出登录');
}

// 打开分享访问权限模态框
function openShareAccessModal() {
    shareAccessModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    generatedLinkSection.style.display = 'none';
}

// 关闭分享访问权限模态框
function closeShareAccessModal() {
    shareAccessModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 生成访问链接
function generateAccessLink() {
    const shareType = document.querySelector('input[name="shareType"]:checked').value;
    const token = generateAccessToken(shareType);
    const baseUrl = window.location.origin + window.location.pathname;
    const accessUrl = `${baseUrl}?access=${token}`;
    
    generatedLink.value = accessUrl;
    generatedLinkSection.style.display = 'block';
    
    // 更新过期信息
    if (shareType === 'temporary') {
        linkExpiryInfo.textContent = '此链接将在24小时后失效';
    } else {
        linkExpiryInfo.textContent = '此链接永久有效';
    }
    
    showSuccessMessage('访问链接已生成！');
}

// 复制访问链接
function copyAccessLink() {
    generatedLink.select();
    generatedLink.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        showSuccessMessage('访问链接已复制到剪贴板！');
    } catch (err) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(generatedLink.value).then(() => {
                showSuccessMessage('访问链接已复制到剪贴板！');
            });
        }
    }
}

// 处理文件选择
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (file.type.startsWith('video/')) {
            processVideoFile(file);
        }
    });
    e.target.value = '';
}

// 处理拖拽
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
        if (file.type.startsWith('video/')) {
            processVideoFile(file);
        }
    });
}

// 处理视频文件
function processVideoFile(file) {
    const uploadCategory = document.getElementById('uploadCategory');
    const selectedCategory = uploadCategory ? uploadCategory.value : 'newmedia';
    
    const video = {
        id: generateId(),
        name: file.name,
        size: formatFileSize(file.size),
        format: file.type.split('/')[1].toUpperCase(),
        uploadDate: new Date(),
        file: file,
        url: URL.createObjectURL(file),
        thumbnail: null,
        duration: '0:00',
        description: `上传于 ${new Date().toLocaleDateString()}`,
        category: 'recent',
        mediaType: selectedCategory  // 添加媒体类型分类
    };
    
    generateVideoThumbnail(video).then(() => {
        videos.unshift(video);
        saveVideosToStorage();
        updateVideoDisplay();
        showSuccessMessage('视频上传成功！');
    });
}

// 生成视频缩略图和获取时长
function generateVideoThumbnail(video) {
    return new Promise((resolve) => {
        const videoElement = document.createElement('video');
        videoElement.src = video.url;
        videoElement.currentTime = 1;
        
        videoElement.addEventListener('loadedmetadata', function() {
            video.duration = formatDuration(this.duration);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = 320;
            canvas.height = 180;
            
            this.addEventListener('seeked', function() {
                ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                video.thumbnail = canvas.toDataURL();
                resolve();
            });
        });
    });
}

// 更新视频显示
function updateVideoDisplay() {
    const filteredVideos = getFilteredVideos();
    
    if (filteredVideos.length === 0) {
        videoGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    videoGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    videoGrid.innerHTML = filteredVideos.map(video => createVideoCard(video)).join('');
    
    addVideoCardListeners();
}

// 创建视频卡片
function createVideoCard(video) {
    return `
        <div class="video-card" data-category="${video.category}" data-id="${video.id}">
            <div class="video-thumbnail">
                <video muted preload="metadata">
                    <source src="${video.url}" type="video/mp4">
                    您的浏览器不支持视频播放
                </video>
                <div class="play-overlay" onclick="openVideoModal('${video.id}')">
                    <i class="fas fa-play"></i>
                </div>
                <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.name}</h3>
                <p class="video-description">${video.description}</p>
                <div class="video-meta">
                    <span class="video-size">${video.size}</span>
                    <span class="video-format">${video.format}</span>
                    <span class="video-category" data-type="${video.mediaType}">${getCategoryDisplayName(video.mediaType)}</span>
                </div>
            </div>
            <div class="video-actions">
                <button class="action-btn download-btn" title="下载" onclick="downloadVideo('${video.id}')">
                    <i class="fas fa-download"></i>
                </button>
                <button class="action-btn share-btn" title="分享" onclick="openShareModal('${video.id}')">
                    <i class="fas fa-share"></i>
                </button>
                <button class="action-btn delete-btn" title="删除" onclick="deleteVideo('${video.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

// 添加视频卡片事件监听器
function addVideoCardListeners() {
    document.querySelectorAll('.video-thumbnail video').forEach(video => {
        const card = video.closest('.video-card');
        
        card.addEventListener('mouseenter', () => {
            video.currentTime = 0;
            video.play().catch(() => {});
        });
        
        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });
}

// 搜索功能
function handleSearch(e) {
    updateVideoDisplay();
}

// 筛选功能
function handleFilter(e) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    updateVideoDisplay();
}

// 分类功能
function handleCategory(e) {
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    const selectedCategory = e.target.dataset.category;
    
    // 显示/隐藏二级分类
    if (selectedCategory === 'traditional') {
        traditionalSubcategory.style.display = 'flex';
        // 重置二级分类选择
        subcategoryBtns.forEach(btn => btn.classList.remove('active'));
        subcategoryBtns[0].classList.add('active'); // 默认选择"全部传统媒体"
    } else {
        traditionalSubcategory.style.display = 'none';
    }
    
    updateVideoDisplay();
}

// 二级分类功能
function handleSubcategory(e) {
    subcategoryBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    updateVideoDisplay();
}

// 获取筛选后的视频
function getFilteredVideos() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const activeCategory = document.querySelector('.category-btn.active').dataset.category;
    const activeSubcategory = document.querySelector('.subcategory-btn.active')?.dataset.subcategory;
    
    let filtered = videos;
    
    // 应用搜索过滤
    if (searchTerm) {
        filtered = filtered.filter(video => 
            video.name.toLowerCase().includes(searchTerm) ||
            video.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // 应用分类过滤
    if (activeCategory === 'traditional') {
        // 传统媒体：检查二级分类
        if (activeSubcategory && activeSubcategory !== 'all-traditional') {
            filtered = filtered.filter(video => video.mediaType === activeSubcategory);
        } else {
            // 显示所有传统媒体（宣传片和广告）
            filtered = filtered.filter(video => 
                video.mediaType === 'promo' || video.mediaType === 'ad'
            );
        }
    } else if (activeCategory === 'newmedia') {
        filtered = filtered.filter(video => video.mediaType === 'newmedia');
    }
    // activeCategory === 'all' 时不过滤
    
    // 应用排序过滤
    if (activeFilter !== 'all') {
        filtered = filtered.filter(video => video.category === activeFilter);
    }
    
    return filtered;
}

// 打开视频播放模态框
function openVideoModal(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;
    
    modalVideo.src = video.url;
    modalTitle.textContent = video.name;
    modalDescription.textContent = video.description;
    
    videoModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 关闭视频播放模态框
function closeVideoModal() {
    modalVideo.pause();
    modalVideo.src = '';
    videoModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 打开分享模态框
function openShareModal(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;
    
    // 生成带访问权限的分享链接
    const token = generateAccessToken('temporary');
    const shareUrl = `${window.location.origin}${window.location.pathname}?access=${token}&video=${videoId}`;
    shareLink.value = shareUrl;
    
    shareModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 关闭分享模态框
function closeShareModal() {
    shareModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 复制分享链接
function copyShareLink() {
    shareLink.select();
    shareLink.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        showSuccessMessage('链接已复制到剪贴板！');
    } catch (err) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareLink.value).then(() => {
                showSuccessMessage('链接已复制到剪贴板！');
            });
        }
    }
}

// 社交分享
function handleSocialShare(e) {
    const platform = e.currentTarget.dataset.platform;
    const shareUrl = shareLink.value;
    const title = '查看这个精彩的视频！';
    
    let socialUrl = '';
    
    switch (platform) {
        case 'wechat':
            showSuccessMessage('请复制链接到微信分享！');
            copyShareLink();
            break;
        case 'qq':
            socialUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
            window.open(socialUrl, '_blank');
            break;
        case 'weibo':
            socialUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
            window.open(socialUrl, '_blank');
            break;
    }
}

// 下载视频
function downloadVideo(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;
    
    const a = document.createElement('a');
    a.href = video.url;
    a.download = video.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showSuccessMessage('视频下载已开始！');
}

// 删除视频
function deleteVideo(videoId) {
    if (!confirm('确定要删除这个视频吗？')) return;
    
    const index = videos.findIndex(v => v.id === videoId);
    if (index !== -1) {
        URL.revokeObjectURL(videos[index].url);
        videos.splice(index, 1);
        saveVideosToStorage();
        updateVideoDisplay();
        showSuccessMessage('视频已删除！');
    }
}

// 工具函数
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getCategoryDisplayName(mediaType) {
    const categoryNames = {
        'newmedia': '新媒体',
        'promo': '宣传片',
        'ad': '广告'
    };
    return categoryNames[mediaType] || '未分类';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showSuccessMessage(message) {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function showErrorMessage(message) {
    const existingMessage = document.querySelector('.error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 4000);
}

// 本地存储功能
function saveVideosToStorage() {
    const videoData = videos.map(video => ({
        id: video.id,
        name: video.name,
        size: video.size,
        format: video.format,
        uploadDate: video.uploadDate,
        duration: video.duration,
        description: video.description,
        category: video.category,
        mediaType: video.mediaType || 'newmedia',  // 添加媒体类型
        thumbnail: video.thumbnail
    }));
    
    try {
        localStorage.setItem('videoGalleryData', JSON.stringify(videoData));
    } catch (e) {
        console.warn('无法保存到本地存储，可能是存储空间不足');
    }
}

function loadStoredVideos() {
    try {
        const stored = localStorage.getItem('videoGalleryData');
        if (stored) {
            const videoData = JSON.parse(stored);
            console.log('发现已保存的视频信息，但文件需要重新上传');
        }
    } catch (e) {
        console.warn('无法从本地存储加载数据');
    }
}

// 响应式处理
function handleResize() {
    if (window.innerWidth <= 768) {
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.style.padding = '30px 15px';
        }
    }
}

window.addEventListener('resize', handleResize);
handleResize();

// 错误处理
window.addEventListener('error', function(e) {
    console.error('发生错误:', e.error);
    showErrorMessage('操作失败，请重试！');
});

// 防止页面意外关闭时丢失上传的视频
window.addEventListener('beforeunload', function(e) {
    if (videos.length > 0) {
        e.preventDefault();
        e.returnValue = '您有未保存的视频，确定要离开吗？';
        return '您有未保存的视频，确定要离开吗？';
    }
}); 