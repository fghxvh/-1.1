require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');

// 导入路由
const apiRoutes = require('./routes/api');
// 导入性能监控相关模块
const { performanceMonitor, optimizeQueryParams, rateLimiter } = require('./middleware/performanceMonitor');
const performanceConfig = require('./config/performance');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medical-assistant';

// 安全中间件
app.use(helmet()); // 增强安全性

// CORS配置
if (performanceConfig && performanceConfig.http && performanceConfig.http.cors && performanceConfig.http.cors.enabled) {
  app.use(cors(performanceConfig.http.cors.options));
} else {
  app.use(cors());
}

// 压缩中间件
if (performanceConfig && performanceConfig.http && performanceConfig.http.compression && performanceConfig.http.compression.enabled) {
  app.use(compression({
    threshold: performanceConfig.http.compression.threshold
  }));
}

// 中间件
app.use(bodyParser.json({
  limit: performanceConfig && performanceConfig.http && performanceConfig.http.bodyParser ? performanceConfig.http.bodyParser.limit : '1mb'
}));
app.use(bodyParser.urlencoded({ extended: true }));

// 性能监控中间件
app.use(performanceMonitor);

// 查询参数优化中间件
app.use(optimizeQueryParams);

// 限流中间件
app.use(rateLimiter);

// 路由设置
app.use('/api', apiRoutes);

// 健康检查接口
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: '医疗健康助手服务运行正常',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404错误处理
app.use((req, res) => {
  res.status(404).json({
    error: '接口不存在',
    path: req.path,
    message: '请检查API路径是否正确'
  });
});

// 数据库连接
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB数据库连接成功');
  // 启动服务器
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
  });
})
.catch((error) => {
  console.error('MongoDB数据库连接失败:', error.message);
  process.exit(1);
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('全局错误捕获:', err);
  res.status(err.status || 500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '系统错误，请稍后重试',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;