# 医疗健康助手

## 项目概述
医疗健康助手是一个基于AI的智能医疗咨询系统，旨在为用户提供便捷的健康咨询、症状分析和疾病诊断建议服务。系统通过自然语言处理和医疗数据库分析，帮助用户初步了解自身健康状况并提供相应的建议。

## 功能特性

### 核心功能
- **AI对话咨询**：用户可以通过自然语言与AI助手进行健康咨询
- **症状自查分析**：用户可选择症状，系统进行智能匹配分析
- **疾病知识库**：提供各类常见疾病的详细信息
- **紧急情况识别**：自动识别紧急症状并提供相应建议
- **健康知识查询**：获取健康相关知识和建议

### 技术特点
- **智能化诊断**：基于症状和患者信息的加权匹配算法
- **性能优化**：包含缓存机制、索引优化和请求限流
- **安全性保障**：实施了必要的安全中间件和错误处理
- **用户友好界面**：直观易用的React前端界面
- **可扩展性**：模块化设计，便于功能扩展和维护

## 技术栈

### 前端
- React 18
- React Router 6
- Ant Design (UI组件库)
- Axios (HTTP请求)
- Vite (构建工具)

### 后端
- Node.js
- Express.js
- MongoDB (数据库)
- Mongoose (ODM)
- OpenAI API (AI功能)

### 工具和库
- JWT (认证)
- Helmet (安全)
- Compression (性能优化)
- Cors (跨域处理)

## 系统架构

系统采用前后端分离的架构设计：

1. **前端应用**：负责用户交互界面和数据展示
2. **后端服务**：处理业务逻辑、数据处理和API接口
3. **数据库层**：存储疾病、症状和用户数据
4. **AI服务层**：提供智能分析和自然语言处理能力

## 安装与部署

### 前置要求
- Node.js 16.x 或更高版本
- MongoDB 4.0 或更高版本
- OpenAI API Key (用于AI功能)

### 安装步骤

#### 1. 克隆项目
```bash
git clone <项目仓库URL>
cd 医疗健康助手
```

#### 2. 后端安装
```bash
cd backend
npm install
```

#### 3. 前端安装
```bash
cd ../frontend
npm install
```

### 配置

#### 后端配置
1. 在backend目录下创建.env文件：
```
MONGO_URI=mongodb://localhost:27017/medical-assistant
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key
```

#### 前端配置
1. 在frontend目录下创建.env文件：
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### 运行项目

#### 启动后端
```bash
cd backend
npm start
```

#### 启动前端
```bash
cd frontend
npm run dev
```

## API文档

系统提供以下主要API端点：

### 疾病相关
- `GET /api/diseases` - 获取疾病列表
- `GET /api/diseases/:id` - 获取疾病详情
- `POST /api/diseases/search` - 搜索疾病
- `POST /api/diseases/batch` - 批量获取疾病信息

### 症状相关
- `GET /api/symptoms` - 获取症状列表
- `GET /api/symptoms/:id` - 获取症状详情
- `POST /api/symptoms/search` - 搜索症状
- `POST /api/symptoms/batch` - 批量获取症状信息
- `GET /api/body-parts` - 获取身体部位列表

### 诊断功能
- `POST /api/diagnose` - 根据症状进行诊断

### AI功能
- `POST /api/chat` - AI聊天咨询
- `POST /api/health-advice` - 获取健康建议
- `POST /api/health-knowledge` - 查询健康知识
- `POST /api/emergency-check` - 紧急情况判断

### 健康检查
- `GET /health` - 服务健康状态检查

## 使用说明

### AI对话咨询
1. 在首页点击"AI对话咨询"或导航栏选择"AI对话"
2. 在聊天界面输入您的健康问题
3. 等待AI助手回复并进行后续交互

### 症状自查
1. 在首页点击"症状自查分析"或导航栏选择"症状自查"
2. 从症状列表中选择您正在经历的症状
3. 点击"提交诊断"按钮获取分析结果
4. 查看诊断结果和相关建议

### 紧急情况指南
1. 在导航栏选择"紧急指南"
2. 浏览不同类型紧急情况的症状和应对措施
3. 如遇紧急情况，请立即拨打当地急救电话

## 注意事项

1. 本系统提供的诊断建议仅供参考，不能替代专业医生的诊断
2. 如遇紧急健康状况，请立即就医或拨打急救电话
3. 系统收集的健康信息仅用于诊断分析，我们重视用户隐私保护
4. 定期更新系统数据以获取更准确的健康信息

## 开发说明

### 项目结构
- `/backend` - 后端服务代码
- `/frontend` - 前端应用代码
- `/database` - 数据库相关配置和迁移脚本
- `/docs` - 项目文档
- `/tests` - 测试代码

### 开发流程
1. 确保MongoDB服务正常运行
2. 配置好.env文件中的环境变量
3. 分别启动前端和后端服务
4. 访问 http://localhost:3000 进行开发测试

## 许可证

[MIT License](LICENSE)

## 联系方式

如有问题或建议，请联系项目维护团队：
- 邮箱：[support@medical-assistant.com](mailto:support@medical-assistant.com)

## 免责声明

本系统不构成医疗诊断或治疗建议。任何健康问题请咨询专业医疗人员。系统开发者不对因使用本系统而导致的任何后果承担责任。