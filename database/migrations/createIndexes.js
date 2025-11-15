const mongoose = require('mongoose');
const dbConfig = require('../config/db.config');
const performanceConfig = require('../../backend/config/performance');

// 导入模型
const Disease = require('../../backend/src/models/Disease');
const Symptom = require('../../backend/src/models/Symptom');

// 创建索引的函数
const createIndexes = async () => {
  try {
    // 连接数据库
    await mongoose.connect(dbConfig.mongoURI, dbConfig.options);
    console.log('数据库连接成功');
    
    // 开始创建索引
    console.log('开始创建数据库索引...');
    
    // 为疾病集合创建索引
    if (performanceConfig.database.indexes.diseases && 
        performanceConfig.database.indexes.diseases.length > 0) {
      console.log('正在为疾病集合创建索引...');
      
      for (const indexConfig of performanceConfig.database.indexes.diseases) {
        try {
          await Disease.collection.createIndex(indexConfig.fields, indexConfig.options);
          console.log(`成功创建索引: ${JSON.stringify(indexConfig.fields)}`);
        } catch (indexError) {
          console.error(`创建索引失败: ${JSON.stringify(indexConfig.fields)}`, indexError);
        }
      }
    }
    
    // 为症状集合创建索引
    if (performanceConfig.database.indexes.symptoms && 
        performanceConfig.database.indexes.symptoms.length > 0) {
      console.log('正在为症状集合创建索引...');
      
      for (const indexConfig of performanceConfig.database.indexes.symptoms) {
        try {
          await Symptom.collection.createIndex(indexConfig.fields, indexConfig.options);
          console.log(`成功创建索引: ${JSON.stringify(indexConfig.fields)}`);
        } catch (indexError) {
          console.error(`创建索引失败: ${JSON.stringify(indexConfig.fields)}`, indexError);
        }
      }
    }
    
    // 列出所有已创建的索引
    console.log('\n索引创建完成！');
    console.log('\n疾病集合索引:');
    const diseaseIndexes = await Disease.collection.indexes();
    diseaseIndexes.forEach(index => {
      console.log(`- ${JSON.stringify(index.key)}`);
    });
    
    console.log('\n症状集合索引:');
    const symptomIndexes = await Symptom.collection.indexes();
    symptomIndexes.forEach(index => {
      console.log(`- ${JSON.stringify(index.key)}`);
    });
    
    // 断开数据库连接
    await mongoose.connection.close();
    console.log('\n数据库连接已断开');
    
  } catch (error) {
    console.error('创建索引过程中发生错误:', error);
    // 确保错误时也断开连接
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// 执行脚本
createIndexes();