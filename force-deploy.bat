@echo off
chcp 65001 >nul
echo 🚀 强制重新部署渔家里京杭假日酒店管理系统

echo.
echo 📋 步骤 1: 删除旧的构建文件
if exist "build" rmdir /s /q "build"
if exist ".next" rmdir /s /q ".next"

echo.
echo 📋 步骤 2: 清理 npm 缓存
call npm cache clean --force

echo.
echo 📋 步骤 3: 删除 node_modules
if exist "node_modules" rmdir /s /q "node_modules"

echo.
echo 📋 步骤 4: 重新安装依赖
call npm install --legacy-peer-deps

echo.
echo 📋 步骤 5: 重新构建项目
call npm run build

echo.
echo 📋 步骤 6: 检查构建结果
if exist "build" (
    echo ✅ 构建成功！
    dir build
) else (
    echo ❌ 构建失败！
    pause
    exit /b 1
)

echo.
echo 📋 步骤 7: 提交所有更改
git add .
git commit -m "🚀 强制重新部署 - 修复 GitHub Pages 显示问题"

echo.
echo 📋 步骤 8: 推送到 GitHub
git push origin main

echo.
echo 🎉 强制部署完成！
echo.
echo 📝 下一步：
echo    1. 等待 GitHub Actions 完成（约 5-10 分钟）
echo    2. 检查 Actions 标签页的构建状态
echo    3. 访问 https://[用户名].github.io/[仓库名]
echo    4. 应该显示你的 React 应用，而不是 README
echo.
pause
