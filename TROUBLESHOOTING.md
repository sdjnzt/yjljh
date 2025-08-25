# 🔧 GitHub Pages 故障排除指南

## 🚨 当前问题

访问 `https://sdjnzt.github.io/yjljh/` 显示的是 README.md 内容，而不是 React 应用。

## 🔍 问题诊断

### 可能的原因：

1. **GitHub Pages 配置错误**
2. **构建文件未正确部署**
3. **分支配置不正确**
4. **GitHub Actions 失败**

## ✅ 解决步骤

### 步骤 1：强制重新部署

运行强制部署脚本：
```bash
force-deploy.bat
```

这个脚本会：
- 清理所有缓存和构建文件
- 重新安装依赖
- 重新构建项目
- 推送到 GitHub 触发部署

### 步骤 2：检查 GitHub Pages 设置

1. **访问仓库设置**
   - 打开 `https://github.com/sdjnzt/yjljh`
   - 点击 **"Settings"** 标签页

2. **配置 Pages**
   - 左侧菜单选择 **"Pages"**
   - Source 选择 **"Deploy from a branch"**
   - Branch 选择 **"main"**
   - 点击 **"Save"**

### 步骤 3：检查 GitHub Actions

1. **查看 Actions 标签页**
   - 在仓库页面点击 **"Actions"**
   - 查看最新的工作流运行状态

2. **确认构建成功**
   - 所有步骤都应该显示绿色勾号
   - 检查是否有错误信息

### 步骤 4：验证部署

1. **等待部署完成**（5-10 分钟）
2. **访问网站**：`https://sdjnzt.github.io/yjljh/`
3. **应该看到**：你的 React 应用界面，而不是 README

## 🔧 如果还是不行

### 检查构建输出

确保 `build` 文件夹包含：
```
build/
├── index.html          ← 必须有这个文件
├── static/
│   ├── css/
│   └── js/
└── asset-manifest.json
```

### 手动部署（备选方案）

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

### 检查仓库权限

- 确保仓库是 **Public**
- 检查 GitHub Pages 设置中的权限

## 📋 验证清单

- [ ] 强制重新部署已完成
- [ ] GitHub Pages 配置正确
- [ ] GitHub Actions 构建成功
- [ ] 网站显示 React 应用界面
- [ ] 所有功能正常工作

## 🎯 预期结果

部署成功后，访问 `https://sdjnzt.github.io/yjljh/` 应该显示：
- ✅ 你的渔家里京杭假日酒店管理系统界面
- ✅ 登录页面或主页面
- ❌ 不是 README 文档

---

**按照这些步骤操作，问题应该就能解决了！🚀**
