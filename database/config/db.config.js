require('dotenv').config();

// 数据库配置
const dbConfig = {
  // MongoDB连接URI
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/medical-assistant',
  
  // 连接选项
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true, // 自动创建索引
    serverSelectionTimeoutMS: 5000, // 服务器选择超时
    socketTimeoutMS: 45000, // 套接字超时
    family: 4 // 使用IPv4
  },
  
  // 数据库名称
  dbName: process.env.DB_NAME || 'medical-assistant',
  
  // 是否使用Mongoose调试模式
  debug: process.env.NODE_ENV === 'development'
};

// 导出配置
module.exports = dbConfig;