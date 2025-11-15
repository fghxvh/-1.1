const express = require('express');
const router = express.Router();

// 导入控制器
const medicalController = require('../controllers/medicalController');
const symptomController = require('../controllers/symptomController');
const aiChatController = require('../controllers/aiChatController');

// 疾病相关路由
router.get('/diseases', medicalController.getAllDiseases);
router.get('/diseases/:id', medicalController.getDiseaseById);
router.post('/diseases/search', medicalController.searchDiseases);
router.post('/diseases/batch', medicalController.getDiseasesBatch);

// 症状相关路由
router.get('/symptoms', symptomController.getAllSymptoms);
router.get('/symptoms/:id', symptomController.getSymptomById);
router.post('/symptoms/search', symptomController.searchSymptoms);
router.post('/symptoms/batch', symptomController.getSymptomsBatch);
router.get('/body-parts', symptomController.getBodyParts);

// 疾病诊断路由
router.post('/diagnose', medicalController.diagnose);

// AI聊天路由
router.post('/chat', aiChatController.chatWithAI);

// 健康建议路由
router.post('/health-advice', aiChatController.getHealthAdvice);

// 健康知识查询路由
router.post('/health-knowledge', aiChatController.getHealthKnowledge);

// 紧急情况判断路由
router.post('/emergency-check', async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) {
      return res.status(400).json({ error: '请提供症状描述' });
    }
    
    const aiService = require('../services/aiService');
    const result = await aiService.handleEmergency(symptoms);
    
    res.status(200).json({
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: '紧急情况判断失败', message: error.message });
  }
});

module.exports = router;