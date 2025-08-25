# 🚀 GitHub Pages 部署步骤指南

## 🚨 当前问题

GitHub Actions 遇到权限错误：
```
Error: Create Pages site failed
Error: HttpError: Resource not accessible by integration
```

## ✅ 解决步骤

### 步骤 1：手动启用 GitHub Pages

1. **访问你的 GitHub 仓库**
   - 打开浏览器，访问你的仓库页面
   - 例如：`https://github.com/[用户名]/[仓库名]`

2. **进入设置页面**
   - 点击仓库页面顶部的 **"Settings"** 标签页

3. **配置 Pages**
   - 左侧菜单选择 **"Pages"**
   - Source 选择 **"Deploy from a branch"**
   - Branch 选择 **"main"** 或 **"master"**
   - 点击 **"Save"**

### 步骤 2：推送代码触发构建

```bash
# 1. 添加所有文件
git add .

# 2. 提交更改
git commit -m "🔧 修复 GitHub Actions 权限问题"

# 3. 推送到 GitHub
git push origin main
```

### 步骤 3：检查构建状态

1. **查看 Actions 标签页**
   - 在仓库页面点击 **"Actions"** 标签页
   - 查看最新的工作流运行状态

2. **等待构建完成**
   - 构建过程可能需要 5-10 分钟
   - 确保所有步骤都显示绿色勾号

### 步骤 4：访问你的网站

构建成功后，你的网站将在：
```
https://[用户名].github.io/[仓库名]
```

## 🔍 如果仍有问题

### 检查仓库权限
- 确保仓库是 **Public**（免费用户只能使用 Public 仓库的 GitHub Pages）
- 检查仓库设置中的权限配置

### 检查分支名称
- 确认你的主分支名称是 `main` 还是 `master`
- 在 GitHub Actions 中更新对应的分支名称

### 手动部署（备选方案）
如果 GitHub Actions 仍然失败，可以手动部署：

```bash
# 1. 构建项目
npm run build

# 2. 创建 gh-pages 分支
git checkout -b gh-pages

# 3. 复制构建文件
cp -r build/* .

# 4. 提交并推送
git add .
git commit -m "手动部署到 GitHub Pages"
git push origin gh-pages

# 5. 切换回主分支
git checkout main
git branch -D gh-pages
```

## 📋 部署检查清单

- [ ] GitHub Pages 已在仓库设置中启用
- [ ] 代码已推送到 GitHub
- [ ] GitHub Actions 构建成功
- [ ] 网站可以正常访问
- [ ] 所有功能正常工作

## 🎯 下一步

1. **手动启用 GitHub Pages**
2. **推送代码触发构建**
3. **等待构建完成**
4. **访问你的网站**

---

**按照这些步骤操作，你的渔家里京杭假日酒店管理系统就能成功部署了！🎉**
