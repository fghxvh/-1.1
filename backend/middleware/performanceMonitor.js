// API响应时间监控中间件

const performanceConfig = require('../config/performance');

/**
 * API响应时间监控中间件
 * 记录每个请求的响应时间，并在超过阈值时记录日志
 */
const performanceMonitor = (req, res, next) => {
  // 记录请求开始时间
  const startTime = process.hrtime();
  
  // 记录请求路径和方法
  const path = req.path;
  const method = req.method;
  
  // 监听响应结束事件
  res.on('finish', () => {
    // 计算响应时间（毫秒）
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const responseTime = (seconds * 1000) + (nanoseconds / 1000000);
    
    // 构建日志信息
    const logInfo = {
      timestamp: new Date().toISOString(),
      method,
      path,
      status: res.statusCode,
      responseTime: responseTime.toFixed(2),
      ip: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    // 检查是否超过性能阈值
    if (performanceConfig.logging.performanceLog.enabled && 
        responseTime > performanceConfig.logging.performanceLog.threshold) {
      console.warn(`[性能警告] ${method} ${path} 响应时间过长: ${responseTime.toFixed(2)}ms`, logInfo);
      
      // 可以在这里添加额外的告警逻辑，如发送通知等
    } else if (performanceConfig.logging.enabled && 
               performanceConfig.logging.level === 'debug') {
      // 在调试模式下记录所有请求
      console.log(`[性能日志] ${method} ${path} 响应时间: ${responseTime.toFixed(2)}ms`);
    }
    
    // 可以在这里添加性能指标收集逻辑，如存储到数据库或发送到监控系统
  });
  
  next();
};

/**
 * 优化查询参数中间件
 * 确保分页参数的有效性
 */
const optimizeQueryParams = (req, res, next) => {
  // 处理分页参数
  if (req.query.page) {
    req.query.page = parseInt(req.query.page, 10);
    if (isNaN(req.query.page) || req.query.page < 1) {
      req.query.page = 1;
    }
  }
  
  if (req.query.limit) {
    req.query.limit = parseInt(req.query.limit, 10);
    if (isNaN(req.query.limit) || 
        req.query.limit < 1 || 
        req.query.limit > performanceConfig.database.queryOptimization.maxResults) {
      req.query.limit = Math.min(
        req.query.limit || performanceConfig.database.queryOptimization.defaultPageSize,
        performanceConfig.database.queryOptimization.maxResults
      );
    }
  }
  
  // 处理排序参数
  if (req.query.sortBy && !['name', 'createdAt', 'updatedAt'].includes(req.query.sortBy)) {
    req.query.sortBy = 'name';
  }
  
  if (req.query.order && !['asc', 'desc'].includes(req.query.order.toLowerCase())) {
    req.query.order = 'asc';
  }
  
  next();
};

/**
 * 限流中间件（简单实现）
 * 限制每个IP的请求频率
 */
const rateLimiter = (req, res, next) => {
  if (!performanceConfig.rateLimit.enabled) {
    return next();
  }
  
  // 获取客户端IP
  const clientIp = req.ip;
  
  // 判断路由类型
  const isAIRoute = performanceConfig.rateLimit.routes.ai.some(routePattern => {
    const pattern = routePattern.replace(/\*/g, '.*');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(req.path);
  });
  
  const isAuthRoute = performanceConfig.rateLimit.routes.auth.some(routePattern => {
    const pattern = routePattern.replace(/\*/g, '.*');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(req.path);
  });
  
  // 确定最大请求数
  let maxRequests = performanceConfig.rateLimit.maxRequests.default;
  if (isAIRoute) {
    maxRequests = performanceConfig.rateLimit.maxRequests.aiRoutes;
  } else if (isAuthRoute) {
    maxRequests = performanceConfig.rateLimit.maxRequests.authRoutes;
  }
  
  // 注意：这里是简化实现，实际项目中应该使用Redis等存储来跟踪请求频率
  // 这里只是记录日志，表示限流已检查
  console.log(`[限流检查] IP: ${clientIp}, 路径: ${req.path}, 最大请求数: ${maxRequests}`);
  
  // TODO: 实现实际的限流逻辑
  
  next();
};

module.exports = {
  performanceMonitor,
  optimizeQueryParams,
  rateLimiter
};