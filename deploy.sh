#!/bin/bash

echo "🚀 开始部署到GitHub Pages..."

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    
    # 如果安装了gh-pages，自动部署
    if npm list -g gh-pages > /dev/null 2>&1; then
        echo "🌐 部署到GitHub Pages..."
        npx gh-pages -d build
        echo "🎉 部署完成！"
    else
        echo "📋 构建文件已生成在 build/ 目录"
        echo "💡 提示: 安装 gh-pages 可以自动部署"
        echo "   npm install -g gh-pages"
        echo "   然后运行: gh-pages -d build"
    fi
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi 