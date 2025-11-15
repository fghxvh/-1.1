# 医疗健康助手 - 前端应用

## 项目概述

前端应用是医疗健康助手系统的用户界面组件，提供直观、易用的交互体验。该应用基于React框架开发，使用Ant Design作为UI组件库，通过Axios与后端API进行通信，实现了AI对话、症状自查、疾病查询等功能的用户界面。

## 技术栈

- **React 18** - JavaScript库用于构建用户界面
- **React Router 6** - 前端路由管理
- **Ant Design** - React UI组件库
- **Axios** - HTTP客户端，用于API请求
- **Vite** - 现代前端构建工具
- **Redux Toolkit** (预留) - 状态管理
- **Less** - CSS预处理器

## 目录结构

```
frontend/
├── public/              # 静态资源目录
│   └── favicon.ico      # 网站图标
├── src/                 # 源代码目录
│   ├── assets/          # 资源文件（图片、图标等）
│   ├── components/      # 可复用组件
│   │   ├── common/      # 通用组件
│   │   ├── layout/      # 布局组件
│   │   └── medical/     # 医疗相关组件
│   ├── pages/           # 页面组件
│   │   ├── Home.js      # 首页
│   │   ├── AIChat.js    # AI聊天页面
│   │   ├── SymptomChecker.js # 症状自查页面
│   │   ├── DiseaseInfo.js    # 疾病信息页面
│   │   └── EmergencyGuide.js # 紧急指南页面
│   ├── services/        # API服务
│   │   ├── api.js       # API基础配置
│   │   ├── medicalService.js # 医疗相关API
│   │   └── aiService.js # AI服务API
│   ├── utils/           # 工具函数
│   │   ├── request.js   # 请求工具
│   │   └── formatters.js # 格式化工具
│   ├── context/         # React Context
│   │   └── AppContext.js # 应用上下文
│   ├── hooks/           # 自定义Hooks
│   ├── routes/          # 路由配置
│   │   └── index.js     # 路由定义
│   ├── App.js           # 应用主组件
│   ├── main.js          # 应用入口
│   └── index.css        # 全局样式
├── .env                 # 环境变量配置
├── .env.development     # 开发环境配置
├── .env.production      # 生产环境配置
├── index.html           # HTML模板
├── package.json         # 项目依赖配置
├── vite.config.js       # Vite配置文件
└── README.md            # 前端说明文档（当前文件）
```

## 安装与配置

### 前置要求

- Node.js 16.x 或更高版本
- npm 8.x 或更高版本（或yarn 1.22+）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <项目仓库URL>
   cd 医疗健康助手/frontend
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或使用yarn
   yarn install
   ```

3. **配置环境变量**
   创建`.env.development`文件（开发环境）：
   ```
   # API基础URL
   VITE_API_BASE_URL=http://localhost:5000/api
   
   # 是否启用开发模式
   NODE_ENV=development
   ```

   创建`.env.production`文件（生产环境）：
   ```
   # API基础URL
   VITE_API_BASE_URL=https://api.medical-assistant.com/api
   
   # 是否启用生产模式
   NODE_ENV=production
   ```

## 运行项目

### 开发环境
```bash
npm run dev
# 或使用yarn
yarn dev
```

然后在浏览器中访问 `http://localhost:5173`

### 构建生产版本
```bash
npm run build
# 或使用yarn
yarn build
```

构建后的文件将位于 `dist` 目录

### 预览生产版本
```bash
npm run preview
# 或使用yarn
yarn preview
```

## 功能模块说明

### 首页 (Home)
- 系统介绍
- 快速功能入口
- 健康资讯展示
- 系统状态显示

### AI聊天 (AIChat)
- 实时聊天界面
- 消息历史记录
- 健康问题输入区域
- 加载状态和错误处理

### 症状自查 (SymptomChecker)
- 症状选择器（可多选）
- 身体部位筛选
- 症状严重程度评估
- 诊断结果展示
- 紧急情况提示

### 疾病信息 (DiseaseInfo)
- 疾病列表和搜索
- 疾病详情展示
- 相关症状关联
- 治疗和预防建议

### 紧急指南 (EmergencyGuide)
- 紧急情况分类
- 症状识别指南
- 应急处理建议
- 紧急联系方式

## 组件说明

### 通用组件

#### ButtonGroup
- 用途：显示一组操作按钮
- 特性：支持主要、次要、危险等类型

#### Card
- 用途：内容卡片容器
- 特性：支持标题、描述、操作按钮

#### FormField
- 用途：表单输入字段
- 特性：支持验证、错误提示、辅助文本

#### LoadingSpinner
- 用途：加载状态指示器
- 特性：支持自定义大小和文本

#### Notification
- 用途：系统通知组件
- 特性：支持成功、警告、错误、信息等类型

### 医疗专用组件

#### SymptomSelector
- 用途：症状选择组件
- 特性：支持多选、搜索、分类

#### DiseaseCard
- 用途：疾病信息卡片
- 特性：显示疾病名称、描述、严重程度等

#### DiagnosisResult
- 用途：诊断结果展示
- 特性：显示匹配疾病、置信度、建议等

#### EmergencyAlert
- 用途：紧急情况警报
- 特性：醒目提示、紧急联系方式

## API服务配置

前端使用Axios进行API请求，主要配置位于`src/services/api.js`：

```javascript
// API基础配置示例
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 可以在这里添加认证token等
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // 统一错误处理
    return Promise.reject(error);
  }
);
```

## 状态管理

应用使用React Context API进行状态管理，主要状态包括：

1. 用户状态（登录/未登录）
2. 对话历史
3. 当前选中的症状
4. 诊断结果
5. 系统配置

## 路由配置

前端路由使用React Router 6配置，定义在`src/routes/index.js`：

```javascript
// 路由配置示例
const routes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'chat', element: <AIChat /> },
      { path: 'symptom-checker', element: <SymptomChecker /> },
      { path: 'diseases/:id', element: <DiseaseInfo /> },
      { path: 'emergency', element: <EmergencyGuide /> },
      // 404页面
      { path: '*', element: <NotFound /> },
    ],
  },
];
```

## 样式和主题

应用使用Ant Design的默认主题，可以在`src/index.css`中进行全局样式覆盖：

```css
/* 全局样式示例 */
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
  --text-color: #333;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  padding: 0;
  color: var(--text-color);
}

/* 自定义Ant Design组件样式 */
.ant-btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}
```

## 性能优化

前端应用采用以下性能优化措施：

1. **组件懒加载**：使用React.lazy和Suspense实现路由组件懒加载
2. **图片优化**：使用适当的图片格式和大小
3. **请求缓存**：缓存API响应数据
4. **状态优化**：避免不必要的重新渲染
5. **代码分割**：根据路由和功能分割代码

## 测试指南

前端测试使用Jest和React Testing Library：

### 运行测试
```bash
npm test
# 或使用yarn
yarn test
```

### 测试覆盖率
```bash
npm run test:coverage
# 或使用yarn
yarn test:coverage
```

## 开发最佳实践

1. **组件化开发**：将UI拆分为可复用组件
2. **状态管理**：使用Context API或Redux管理应用状态
3. **错误处理**：为所有异步操作添加错误处理
4. **代码规范**：遵循ESLint和Prettier规范
5. **文档注释**：为组件和函数添加JSDoc注释

## 部署指南

### 开发环境
- 使用`npm run dev`启动开发服务器
- 确保后端服务正常运行

### 生产环境
- 使用`npm run build`构建应用
- 部署到Nginx、Vercel、Netlify等静态网站托管服务
- 配置适当的CDN加速
- 设置HTTPS

## 浏览器兼容性

支持以下现代浏览器：
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 贡献指南

欢迎贡献代码和改进！请遵循以下流程：

1. Fork项目仓库
2. 创建功能分支
3. 提交代码更改
4. 运行测试确保无错误
5. 创建Pull Request

## 许可证

[MIT License](LICENSE)

## 联系方式

如有问题或建议，请联系开发团队：
- 邮箱：[frontend-dev@medical-assistant.com](mailto:frontend-dev@medical-assistant.com)