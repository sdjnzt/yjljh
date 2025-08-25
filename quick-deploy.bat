@echo off
chcp 65001 >nul
echo 🚀 快速部署渔家里京杭假日酒店管理系统到 GitHub Pages

echo.
echo 📋 步骤 1: 检查 Git 状态
git status

echo.
echo 📋 步骤 2: 添加所有文件
git add .

echo.
echo 📋 步骤 3: 提交更改
git commit -m "🔧 修复依赖冲突，移除不兼容的包，准备部署"

echo.
echo 📋 步骤 4: 推送到 GitHub
git push origin main

echo.
echo 🎉 部署完成！
echo.
echo 📝 下一步：
echo    1. 访问你的 GitHub 仓库
echo    2. 检查 Actions 标签页的构建状态
echo    3. 在 Settings > Pages 中启用 GitHub Pages
echo    4. 等待部署完成
echo.
echo 🌐 你的应用将在以下地址运行：
echo    https://[你的用户名].github.io/[仓库名]
echo.
pause
