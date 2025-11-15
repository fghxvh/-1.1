# 医疗健康助手 - 后端服务

## 项目概述

后端服务是医疗健康助手系统的核心组件，负责处理业务逻辑、数据处理和API接口。该服务基于Node.js和Express框架开发，使用MongoDB作为数据存储，提供了疾病查询、症状分析、AI诊断等功能的API接口。

## 技术栈

- **Node.js** - JavaScript运行时环境
- **Express.js** - Web应用框架
- **MongoDB** - 文档数据库
- **Mongoose** - MongoDB对象建模工具
- **OpenAI API** - AI功能集成
- **JWT** - 用户认证（预留）
- **Helmet** - Web应用安全增强
- **Compression** - HTTP请求压缩
- **Cors** - 跨域资源共享

## 目录结构

```
backend/
├── config/              # 配置文件目录
│   ├── db.config.js     # 数据库配置
│   ├── env.config.js    # 环境变量配置
│   └── performance.js   # 性能优化配置
├── middleware/          # 中间件目录
│   ├── auth.js          # 认证中间件（预留）
│   ├── errorHandler.js  # 错误处理中间件
│   └── performanceMonitor.js # 性能监控中间件
├── models/              # 数据模型目录
│   ├── Disease.js       # 疾病模型
│   └── Symptom.js       # 症状模型
├── routes/              # 路由目录
│   └── api.js           # API路由定义
├── services/            # 业务逻辑服务目录
│   ├── aiService.js     # AI服务
│   ├── diagnosisService.js # 诊断服务
│   ├── diseaseService.js # 疾病服务
│   └── symptomService.js # 症状服务
├── utils/               # 工具函数目录
│   ├── emergencyUtils.js # 紧急情况工具
│   └── responseFormatter.js # 响应格式化工具
├── tests/               # 测试目录
│   └── api.test.js      # API测试文件
├── index.js             # 应用入口文件
├── package.json         # 项目依赖配置
├── package-lock.json    # 依赖版本锁定文件
└── README.md            # 后端说明文档（当前文件）
```

## 安装与配置

### 前置要求

- Node.js 16.x 或更高版本
- MongoDB 4.0 或更高版本
- OpenAI API Key（用于AI功能）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <项目仓库URL>
   cd 医疗健康助手/backend
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   创建`.env`文件，添加以下内容：
   ```
   # MongoDB连接字符串
   MONGO_URI=mongodb://localhost:27017/medical-assistant
   
   # 服务器配置
   PORT=5000
   NODE_ENV=development
   
   # OpenAI API配置
   OPENAI_API_KEY=your_openai_api_key
   
   # 性能配置
   REDIS_URL=redis://localhost:6379
   RATE_LIMIT_WINDOW_MS=15 * 60 * 1000
   RATE_LIMIT_MAX=100
   ```

## 运行服务

### 开发模式
```bash
npm run dev
```

### 生产模式
```bash
npm start
```

### 运行测试
```bash
npm test
```

## 数据库设置

### 数据库索引

系统包含自动创建数据库索引的脚本，以优化查询性能：

```bash
node database/migrations/createIndexes.js
```

### 数据模型

#### Disease（疾病）模型
- **name**: 疾病名称
- **description**: 疾病描述
- **symptoms**: 相关症状（关联Symptom模型）
- **severity**: 严重程度（1-5）
- **treatment**: 治疗建议
- **prevention**: 预防措施
- **riskFactors**: 风险因素
- **bodyPart**: 受影响身体部位
- **createdAt**: 创建时间
- **updatedAt**: 更新时间

#### Symptom（症状）模型
- **name**: 症状名称
- **description**: 症状描述
- **bodyPart**: 相关身体部位
- **diseases**: 可能相关的疾病（关联Disease模型）
- **severityScale**: 严重程度范围
- **createdAt**: 创建时间
- **updatedAt**: 更新时间

## API接口文档

### 疾病相关接口

#### 获取疾病列表
- **方法**: `GET`
- **路径**: `/api/diseases`
- **参数**: 
  - `page`: 页码（默认1）
  - `limit`: 每页数量（默认10）
  - `sort`: 排序字段（默认name）
  - `order`: 排序方式（asc/desc，默认asc）
- **返回**: 疾病列表和分页信息

#### 获取疾病详情
- **方法**: `GET`
- **路径**: `/api/diseases/:id`
- **参数**: 无
- **返回**: 指定ID的疾病详细信息

#### 搜索疾病
- **方法**: `POST`
- **路径**: `/api/diseases/search`
- **请求体**: 
  ```json
  {
    "query": "关键词",
    "bodyPart": "身体部位",
    "severity": 3,
    "page": 1,
    "limit": 10
  }
  ```
- **返回**: 搜索结果和分页信息

#### 批量获取疾病信息
- **方法**: `POST`
- **路径**: `/api/diseases/batch`
- **请求体**: 
  ```json
  { "ids": ["id1", "id2", "id3"] }
  ```
- **返回**: 多个疾病的详细信息

### 症状相关接口

#### 获取症状列表
- **方法**: `GET`
- **路径**: `/api/symptoms`
- **参数**: 
  - `page`: 页码（默认1）
  - `limit`: 每页数量（默认10）
  - `bodyPart`: 按身体部位筛选
- **返回**: 症状列表和分页信息

#### 获取症状详情
- **方法**: `GET`
- **路径**: `/api/symptoms/:id`
- **参数**: 无
- **返回**: 指定ID的症状详细信息

#### 搜索症状
- **方法**: `POST`
- **路径**: `/api/symptoms/search`
- **请求体**: 
  ```json
  {
    "query": "关键词",
    "bodyPart": "身体部位",
    "page": 1,
    "limit": 10
  }
  ```
- **返回**: 搜索结果和分页信息

#### 批量获取症状信息
- **方法**: `POST`
- **路径**: `/api/symptoms/batch`
- **请求体**: 
  ```json
  { "ids": ["id1", "id2", "id3"] }
  ```
- **返回**: 多个症状的详细信息

#### 获取身体部位列表
- **方法**: `GET`
- **路径**: `/api/body-parts`
- **参数**: 无
- **返回**: 所有可用的身体部位列表

### 诊断功能接口

#### 疾病诊断
- **方法**: `POST`
- **路径**: `/api/diagnose`
- **请求体**: 
  ```json
  {
    "symptoms": ["symptomId1", "symptomId2"],
    "age": 30,
    "gender": "male",
    "medicalHistory": ["diseaseId1"],
    "severity": 2
  }
  ```
- **返回**: 诊断结果和相关建议

### AI功能接口

#### AI聊天咨询
- **方法**: `POST`
- **路径**: `/api/chat`
- **请求体**: 
  ```json
  {
    "message": "我有头痛症状",
    "history": ["之前的对话内容"]
  }
  ```
- **返回**: AI回复内容

#### 获取健康建议
- **方法**: `POST`
- **路径**: `/api/health-advice`
- **请求体**: 
  ```json
  {
    "topic": "头痛",
    "symptoms": ["头痛", "恶心"]
  }
  ```
- **返回**: 健康建议内容

#### 查询健康知识
- **方法**: `POST`
- **路径**: `/api/health-knowledge`
- **请求体**: 
  ```json
  { "query": "糖尿病预防" }
  ```
- **返回**: 相关健康知识内容

#### 紧急情况判断
- **方法**: `POST`
- **路径**: `/api/emergency-check`
- **请求体**: 
  ```json
  { "symptoms": ["剧烈胸痛", "呼吸困难"] }
  ```
- **返回**: 紧急情况判断结果

### 系统状态接口

#### 健康检查
- **方法**: `GET`
- **路径**: `/health`
- **参数**: 无
- **返回**: 服务状态信息

## 性能优化

后端服务包含多种性能优化措施：

1. **数据库索引**: 为常用查询字段创建索引
2. **缓存机制**: 支持Redis和内存缓存
3. **请求限流**: 防止API滥用
4. **压缩传输**: 使用Gzip压缩响应
5. **查询优化**: 分页查询和选择性字段查询
6. **性能监控**: 记录API响应时间和资源使用情况

## 安全措施

1. **请求验证**: 对所有API输入进行验证
2. **错误处理**: 避免暴露敏感信息的错误消息
3. **CORS配置**: 控制跨域资源访问
4. **Helmet中间件**: 设置安全相关的HTTP头
5. **速率限制**: 防止暴力攻击

## 测试指南

系统使用Jest和Supertest进行API测试。测试用例位于`/tests`目录。

### 运行所有测试
```bash
npm test
```

### 测试覆盖率
```bash
npm run test:coverage
```

## 部署建议

### 开发环境
- 使用`npm run dev`启动开发服务器
- 配置开发专用的MongoDB实例

### 生产环境
- 使用PM2管理Node.js进程
- 配置Nginx作为反向代理
- 使用MongoDB Atlas或其他托管MongoDB服务
- 设置环境变量和密钥管理

## 故障排除

### 常见问题

1. **MongoDB连接失败**
   - 检查MongoDB服务是否运行
   - 验证MONGO_URI配置是否正确

2. **API响应缓慢**
   - 检查数据库索引是否已创建
   - 查看性能日志识别慢查询
   - 考虑启用缓存机制

3. **AI功能不可用**
   - 确认OpenAI API Key配置正确
   - 检查API密钥是否有效

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
- 邮箱：[dev@medical-assistant.com](mailto:dev@medical-assistant.com)