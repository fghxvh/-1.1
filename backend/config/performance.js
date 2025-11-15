// 性能优化配置

module.exports = {
  // 缓存配置
  cache: {
    // Redis缓存配置（如果使用Redis）
    redis: {
      enabled: false, // 是否启用Redis
      host: 'localhost',
      port: 6379,
      ttl: 3600, // 缓存过期时间（秒）
    },
    
    // 内存缓存配置
    memoryCache: {
      enabled: true,
      maxSize: 1000, // 最大缓存项数量
      ttl: 1800, // 缓存过期时间（秒）
      // 需要缓存的路由
      cachedRoutes: [
        '/api/diseases',
        '/api/symptoms',
        '/api/body-parts',
      ],
    },
  },
  
  // 数据库性能优化
  database: {
    // 索引配置
    indexes: {
      // 为疾病集合添加索引
      diseases: [
        { fields: { name: 1 }, options: { unique: false } },
        { fields: { bodyPart: 1 }, options: { unique: false } },
        { fields: { symptoms: 1 }, options: { unique: false } },
        { fields: { earlySymptoms: 1 }, options: { unique: false } },
        { fields: { lateSymptoms: 1 }, options: { unique: false } },
      ],
      
      // 为症状集合添加索引
      symptoms: [
        { fields: { name: 1 }, options: { unique: false } },
        { fields: { bodyPart: 1 }, options: { unique: false } },
        { fields: { relatedDiseases: 1 }, options: { unique: false } },
      ],
    },
    
    // 查询优化
    queryOptimization: {
      maxResults: 100, // 默认最大返回结果数
      defaultPageSize: 50, // 默认分页大小
      useLean: true, // 使用lean()方法提高查询性能
    },
  },
  
  // HTTP优化
  http: {
    // Gzip压缩
    compression: {
      enabled: true,
      threshold: 1024, // 压缩阈值（字节）
    },
    
    // 请求大小限制
    bodyParser: {
      limit: '10mb', // 请求体大小限制
    },
    
    // CORS配置
    cors: {
      enabled: true,
      options: {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      },
    },
  },
  
  // 限流配置
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15分钟窗口
    maxRequests: {
      default: 100, // 默认每IP每分钟最大请求数
      aiRoutes: 20, // AI相关接口每分钟最大请求数
      authRoutes: 5, // 认证相关接口每分钟最大请求数
    },
    // 需要限流的路由
    routes: {
      general: ['/api/*'],
      ai: ['/api/chat', '/api/health-advice', '/api/health-knowledge'],
      auth: ['/api/auth/*'],
    },
  },
  
  // 日志配置
  logging: {
    enabled: true,
    level: 'info', // 日志级别
    performanceLog: {
      enabled: true,
      threshold: 500, // 记录响应时间超过500ms的请求
    },
  },
  
  // 应用程序性能监控
  monitoring: {
    enabled: false, // 是否启用性能监控
    samplingRate: 0.1, // 采样率
    metrics: {
      requestCount: true,
      responseTime: true,
      errorRate: true,
      memoryUsage: true,
    },
  },
};