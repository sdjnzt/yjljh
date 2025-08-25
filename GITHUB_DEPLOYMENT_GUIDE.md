# 🚀 GitHub 部署指南 - 渔家里京杭假日酒店管理系统

## 📋 部署前准备

### 1. 确保项目已构建
```bash
npm run build
```

### 2. 检查 Git 状态
```bash
git status
git add .
git commit -m "准备部署到 GitHub Pages"
```

## 🌐 方法一：使用 GitHub Pages（推荐）

### 步骤 1：创建 GitHub 仓库
1. 访问 [GitHub](https://github.com)
2. 点击 "New repository"
3. 仓库名：`yujiali-jinghang-hotel-system`
4. 描述：渔家里京杭假日酒店管理系统
5. 选择 Public（免费用户只能使用 Public 仓库的 GitHub Pages）
6. 不要初始化 README、.gitignore 或 license
7. 点击 "Create repository"

### 步骤 2：推送代码到 GitHub
```bash
# 添加远程仓库
git remote add origin https://github.com/[你的用户名]/yujiali-jinghang-hotel-system.git

# 推送代码
git push -u origin main
```

### 步骤 3：启用 GitHub Pages
1. 在仓库页面，点击 "Settings"
2. 左侧菜单选择 "Pages"
3. Source 选择 "Deploy from a branch"
4. Branch 选择 "gh-pages" 或 "main"
5. 点击 "Save"

### 步骤 4：自动部署
GitHub Actions 会自动构建和部署你的应用。

## 🔧 方法二：手动部署（如果需要）

### 使用提供的脚本
```bash
# Linux/Mac
chmod +x deploy-github.sh
./deploy-github.sh

# Windows
deploy-github.bat
```

### 手动步骤
```bash
# 1. 构建项目
npm run build

# 2. 创建部署分支
git checkout -b gh-pages

# 3. 复制构建文件
cp -r build/* .

# 4. 提交并推送
git add .
git commit -m "部署到 GitHub Pages"
git push origin gh-pages

# 5. 切换回主分支
git checkout main
git branch -D gh-pages
```

## 🌍 访问你的应用

部署成功后，你的应用将在以下地址运行：
```
https://[你的用户名].github.io/yujiali-jinghang-hotel-system
```

## 📱 功能演示

### 🏨 酒店管理系统
- 智能安防监控
- 广播系统管理
- 权限控制
- 数据存储

### 🛡️ 安全特性
- 实时监控
- 报警管理
- 设备状态跟踪
- 应急响应

### 🔊 广播功能
- 实时广播
- 定时任务
- 分区管理
- 设备控制

## 🔍 故障排除

### 常见问题

#### 1. 页面显示 404
- 检查 GitHub Pages 设置
- 确认部署分支正确
- 等待几分钟让部署生效

#### 2. 样式或功能异常
- 检查浏览器控制台错误
- 确认所有资源路径正确
- 验证构建是否成功

#### 3. 部署失败
- 检查 GitHub Actions 日志
- 确认仓库权限设置
- 验证代码没有语法错误

### 调试技巧
```bash
# 本地测试构建结果
npx serve build

# 检查构建文件
ls -la build/

# 查看 Git 状态
git log --oneline
git branch -a
```

## 📞 技术支持

如果遇到问题，可以：
1. 检查 GitHub Issues
2. 查看部署日志
3. 联系项目维护者

## 🎯 下一步

部署成功后，你可以：
1. 分享应用链接
2. 收集用户反馈
3. 持续改进功能
4. 添加更多特性

---

**祝部署顺利！🎉**
