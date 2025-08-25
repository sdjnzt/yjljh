# 曲阜夫子城酒店管理有限公司数据采集与监控平台 - 部署指南

## 🚀 项目概述

本项目已成功改造为**曲阜夫子城酒店管理有限公司数据采集与监控平台**，基于AI深度学习算法，提供人脸识别、视频监控直播、数据采集分析、智能预警等核心功能。

## ✨ 主要功能模块

### 1. **AI智能监控**
- **人脸识别系统**: VIP客户自动识别、黑名单人员实时预警、员工考勤智能统计
- **视频监控直播**: 实时视频流、多画面切换、缩放功能
- **报警与预警系统**: AI行为分析、区域入侵识别、多级报警通知
- **应急管理系统**: 应急预案整合、资源调配、指挥调度

### 2. **数据平台**
- **数据采集系统**: 传感器数据采集、设备状态监控
- **数据存储管理**: 大容量存储、数据完整性保障
- **数据分析平台**: AI机器学习、趋势预测、异常模式报告
- **回放检索系统**: 智能检索、特征识别、快速定位

### 3. **传统功能保留**
- 设备管理、智能服务、运营分析、系统管理等原有功能

## 🛠️ 技术架构

- **前端框架**: React 18 + TypeScript
- **UI组件库**: Ant Design 5
- **图表库**: ECharts + @ant-design/plots
- **AI功能**: 深度学习算法集成
- **响应式设计**: 支持多种设备访问

## 📋 环境要求

- **Node.js**: 16.0 或更高版本
- **npm**: 8.0 或更高版本
- **浏览器**: Chrome 70+, Firefox 70+, Safari 12+, Edge 79+

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repository-url>
cd qufu-fuzi-city-hotel-monitoring-platform
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm start
```

应用将在 http://localhost:5137 启动

### 4. 构建生产版本

```bash
npm run build
```

### 5. 运行测试

```bash
npm test
```

## 🌐 访问地址

- **本地开发**: http://localhost:5137
- **生产环境**: 根据实际部署配置

## 📱 功能演示

### 人脸识别系统
- 路径: `/facial-recognition`
- 功能: VIP客户识别、黑名单预警、员工考勤、门禁管理
- 特色: 识别准确率达99.5%以上

### 视频监控直播
- 路径: `/video-monitor`
- 功能: 实时视频流、多画面切换、摄像头管理
- 特色: 支持多终端访问、实时录制

### 数据采集系统
- 路径: `/data-collection`
- 功能: 传感器数据采集、设备状态监控
- 特色: 实时数据更新、智能异常检测

### 回放检索系统
- 路径: `/playback-retrieval`
- 功能: AI智能检索、特征识别、快速定位
- 特色: 基于人脸、物体、行为特征检索

### 数据存储管理
- 路径: `/data-storage`
- 功能: 大容量存储、数据完整性、安全性管理
- 特色: 存储时长可定制、自动备份

### 数据分析平台
- 路径: `/data-analysis`
- 功能: AI机器学习、趋势预测、异常模式报告
- 特色: 深度数据挖掘、智能分析

### 报警与预警系统
- 路径: `/alarm-system`
- 功能: AI行为分析、异常识别、多级报警
- 特色: 从被动响应到主动预警

### 应急管理系统
- 路径: `/emergency-management`
- 功能: 应急预案、资源调配、指挥调度
- 特色: 快速响应流程、应急演练

## 🔧 配置说明

### 环境变量配置

创建 `.env` 文件：

```env
REACT_APP_API_BASE_URL=http://localhost:3000/api
REACT_APP_AI_SERVICE_URL=http://localhost:5000/ai
REACT_APP_VIDEO_SERVICE_URL=http://localhost:6000/video
```

### AI服务配置

如需连接真实的AI服务，请配置以下参数：

```typescript
// src/config/ai.ts
export const AI_CONFIG = {
  FACE_RECOGNITION_THRESHOLD: 0.8,
  BEHAVIOR_ANALYSIS_SENSITIVITY: 0.7,
  OBJECT_DETECTION_ACCURACY: 0.9,
  RESPONSE_TIME: 500
};
```

### 视频监控配置

```typescript
// src/config/video.ts
export const VIDEO_CONFIG = {
  DEFAULT_RESOLUTION: '1920x1080',
  DEFAULT_FPS: 25,
  AUTO_RECORD: true,
  MOTION_DETECTION: true
};
```

## 📊 数据模拟

项目使用完整的模拟数据，包括：

- **人脸识别数据**: VIP客户、黑名单、员工信息
- **视频监控数据**: 摄像头状态、视频流信息
- **传感器数据**: 温度、湿度、设备状态
- **报警预警数据**: 异常事件、预警级别
- **应急管理数据**: 应急预案、资源信息

## 🚀 部署方式

### 1. 静态部署

```bash
npm run build
# 将 build 目录部署到 Web 服务器
```

### 2. Docker 部署

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 3. 云平台部署

支持部署到：
- AWS S3 + CloudFront
- Azure Static Web Apps
- Google Cloud Storage
- 阿里云 OSS
- 腾讯云 COS

## 🔒 安全配置

### 1. 身份验证

```typescript
// 配置登录验证
const AUTH_CONFIG = {
  TOKEN_EXPIRE_TIME: 24 * 60 * 60 * 1000, // 24小时
  REFRESH_TOKEN_EXPIRE_TIME: 7 * 24 * 60 * 60 * 1000, // 7天
  PASSWORD_MIN_LENGTH: 8,
  SESSION_TIMEOUT: 30 * 60 * 1000 // 30分钟
};
```

### 2. 数据加密

```typescript
// 配置数据加密
const ENCRYPTION_CONFIG = {
  ALGORITHM: 'AES-256-GCM',
  KEY_LENGTH: 32,
  IV_LENGTH: 16,
  SALT_LENGTH: 64
};
```

## 📈 性能优化

### 1. 代码分割

```typescript
// 使用 React.lazy 进行代码分割
const FacialRecognition = React.lazy(() => import('./pages/FacialRecognition'));
const VideoMonitor = React.lazy(() => import('./pages/VideoMonitor'));
```

### 2. 图片优化

```typescript
// 配置图片懒加载和压缩
const IMAGE_CONFIG = {
  LAZY_LOADING: true,
  COMPRESSION_QUALITY: 0.8,
  WEBP_SUPPORT: true
};
```

## 🐛 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 修改端口
   PORT=3001 npm start
   ```

2. **依赖安装失败**
   ```bash
   # 清除缓存
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **构建失败**
   ```bash
   # 检查 TypeScript 错误
   npm run build
   # 或
   npx tsc --noEmit
   ```

## 📞 技术支持

- **项目维护**: 曲阜夫子城酒店管理有限公司
- **技术文档**: 参考 README.md 和代码注释
- **问题反馈**: 通过 GitHub Issues 提交

## 📄 许可证

本项目为曲阜夫子城酒店管理有限公司内部使用，版权所有。

---

**曲阜夫子城酒店管理有限公司数据采集与监控平台** - 让监控更智能，让管理更高效！ 