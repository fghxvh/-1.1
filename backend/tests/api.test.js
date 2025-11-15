const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

// 连接数据库
beforeAll(async () => {
  // 这里假设在app.js中已经设置了数据库连接
  await mongoose.connection.once('open', () => {
    console.log('数据库连接成功');
  });
});

// 测试结束后断开连接
afterAll(async () => {
  await mongoose.connection.close();
});

describe('医疗健康助手API测试', () => {
  // 测试疾病相关接口
  describe('疾病管理接口测试', () => {
    // 测试获取疾病列表
    it('GET /api/diseases 应该返回疾病列表', async () => {
      const response = await request(app).get('/api/diseases').expect(200);
      
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });

    // 测试搜索疾病
    it('POST /api/diseases/search 应该根据关键词搜索疾病', async () => {
      const response = await request(app)
        .post('/api/diseases/search')
        .send({ query: '感冒' })
        .expect(200);
      
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });
  });

  // 测试症状相关接口
  describe('症状管理接口测试', () => {
    // 测试获取症状列表
    it('GET /api/symptoms 应该返回症状列表', async () => {
      const response = await request(app).get('/api/symptoms').expect(200);
      
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body).toHaveProperty('filters');
    });

    // 测试获取身体部位列表
    it('GET /api/body-parts 应该返回身体部位列表', async () => {
      const response = await request(app).get('/api/body-parts').expect(200);
      
      expect(response.body).toHaveProperty('bodyParts');
      expect(Array.isArray(response.body.bodyParts)).toBeTruthy();
    });
  });

  // 测试诊断功能
  describe('疾病诊断功能测试', () => {
    // 测试诊断接口（需要有效症状ID）
    it('POST /api/diagnose 应该返回诊断结果', async () => {
      // 这里使用模拟的症状ID进行测试，实际测试时需要使用数据库中存在的ID
      const mockSymptoms = ['symptom1', 'symptom2', 'symptom3'];
      
      const response = await request(app)
        .post('/api/diagnose')
        .send({ symptomIds: mockSymptoms })
        .expect(200);
      
      expect(response.body).toHaveProperty('possibleDiseases');
      expect(response.body).toHaveProperty('symptoms');
      expect(response.body).toHaveProperty('emergencyDetected');
    });
  });

  // 测试AI聊天功能
  describe('AI聊天功能测试', () => {
    // 测试AI聊天接口
    it('POST /api/chat 应该返回AI回复', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ message: '我有头痛，应该怎么办？' })
        .expect(200);
      
      expect(response.body).toHaveProperty('response');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});

// 性能测试
describe('性能测试', () => {
  // 测试诊断接口响应时间
  it('POST /api/diagnose 响应时间应该小于2秒', async () => {
    const start = Date.now();
    const mockSymptoms = ['symptom1', 'symptom2', 'symptom3'];
    
    await request(app)
      .post('/api/diagnose')
      .send({ symptomIds: mockSymptoms })
      .expect(200);
    
    const end = Date.now();
    const responseTime = end - start;
    
    console.log(`诊断接口响应时间: ${responseTime}ms`);
    expect(responseTime).toBeLessThan(2000); // 2秒内响应
  });
});