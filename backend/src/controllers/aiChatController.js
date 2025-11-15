require('dotenv').config();
const aiService = require('../services/aiService');

// AI聊天功能
const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: '请提供聊天消息' });
    }
    
    // 调用AI服务进行医疗咨询聊天
    const aiResponse = await aiService.medicalChat(message, history);
    
    // 检查是否为紧急情况
    const isEmergency = await checkForEmergency(message);
    
    res.status(200).json({
      response: aiResponse,
      updatedHistory: [...history, { role: 'user', content: message }, { role: 'assistant', content: aiResponse }],
      isEmergency: isEmergency.isEmergency,
      emergencyAdvice: isEmergency.advice
    });
  } catch (error) {
    console.error('AI聊天错误:', error);
    res.status(500).json({ 
      error: 'AI聊天过程中出现错误', 
      message: error.message 
    });
  }
};

// 检查消息是否包含紧急情况关键词
const checkForEmergency = async (message) => {
  const emergencyKeywords = [
    '胸痛', '剧烈头痛', '昏迷', '呼吸困难', '大量出血', 
    '严重外伤', '突然无法说话', '突然瘫痪', '高烧不退', '抽搐'
  ];
  
  const containsEmergency = emergencyKeywords.some(keyword => 
    message.includes(keyword)
  );
  
  if (containsEmergency) {
    const emergencyAdvice = await aiService.handleEmergency(message);
    return { isEmergency: true, advice: emergencyAdvice };
  }
  
  return { isEmergency: false, advice: '' };
};

// 健康建议功能
const getHealthAdvice = async (req, res) => {
  try {
    const { symptoms, patientInfo = {} } = req.body;
    
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: '请提供症状信息' });
    }
    
    // 构建症状描述字符串
    const symptomDescription = symptoms.join('、');
    
    // 使用AI服务分析症状
    const advice = await aiService.analyzeSymptoms(symptomDescription, patientInfo);
    
    res.status(200).json({
      advice,
      disclaimer: '以上分析和建议仅供参考，不能替代专业医生的诊断和治疗。如有不适，请及时就医。',
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取健康建议错误:', error);
    res.status(500).json({ 
      error: '获取健康建议过程中出现错误', 
      message: error.message 
    });
  }
};

// 添加健康知识查询接口
const getHealthKnowledge = async (req, res) => {
  try {
    const { topic, specificNeeds = '' } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: '请提供查询主题' });
    }
    
    const knowledge = await aiService.generateHealthAdvice(topic, specificNeeds);
    
    res.status(200).json({
      knowledge,
      topic,
      specificNeeds,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取健康知识错误:', error);
    res.status(500).json({ 
      error: '获取健康知识过程中出现错误', 
      message: error.message 
    });
  }
};

module.exports = {
  chatWithAI,
  getHealthAdvice,
  getHealthKnowledge
};