#!/bin/bash

# 渔家里京杭假日酒店管理系统 - GitHub Pages 部署脚本

echo "🚀 开始部署渔家里京杭假日酒店管理系统到 GitHub Pages..."

# 1. 构建项目
echo "📦 构建项目..."
npm run build

# 2. 检查构建是否成功
if [ ! -d "build" ]; then
    echo "❌ 构建失败！build 目录不存在"
    exit 1
fi

echo "✅ 项目构建成功！"

# 3. 创建部署分支
echo "🌿 创建部署分支..."
git checkout -b gh-pages

# 4. 复制构建文件到根目录
echo "📁 复制构建文件..."
cp -r build/* .

# 5. 添加所有文件
echo "➕ 添加文件到 Git..."
git add .

# 6. 提交更改
echo "💾 提交更改..."
git commit -m "🚀 部署渔家里京杭假日酒店管理系统 v1.0.0

✨ 新功能：
- 智能安防系统
- 广播管理系统  
- 权限管理
- 数据存储
- 用户管理

🔧 技术特性：
- React 18 + TypeScript
- Ant Design 5
- ECharts 图表
- 响应式设计
- 实时监控"

# 7. 推送到远程仓库
echo "🚀 推送到 GitHub..."
git push origin gh-pages

# 8. 切换回主分支
echo "🔄 切换回主分支..."
git checkout main

# 9. 删除本地部署分支
echo "🧹 清理本地分支..."
git branch -D gh-pages

echo "🎉 部署完成！"
echo "🌐 你的应用将在以下地址运行："
echo "   https://[你的用户名].github.io/[仓库名]"
echo ""
echo "📝 注意："
echo "   1. 确保在 GitHub 仓库设置中启用了 GitHub Pages"
echo "   2. 选择 gh-pages 分支作为源"
echo "   3. 等待几分钟让部署生效"
