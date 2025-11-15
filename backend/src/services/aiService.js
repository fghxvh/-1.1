require('dotenv').config();
const { OpenAI } = require('openai');

// 初始化OpenAI客户端，配置DeepSeek模型接入
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-d9aaa724be5f4ffdbeba5ad56b84db64',
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
});

// AI服务类
class AIService {
  constructor() {
    // 设置默认配置
    this.defaultModel = 'deepseek-chat';
    this.defaultTemperature = 0.7;
    this.maxTokens = 10000;
    
    // 医疗助手系统提示词
    this.medicalAssistantPrompt = `你是一个专业的医疗健康助手。请基于医学知识为用户提供帮助，但请注意：
    1. 你只能提供初步的健康咨询和建议，不能替代专业医生的诊断和治疗
    2. 所有建议都应附带免责声明，建议用户及时就医
    3. 不要做出明确的疾病诊断，只能提供可能的疾病信息和建议
    4. 对于紧急情况，请立即建议用户拨打急救电话（如120）
    5. 保持回答专业、友好且通俗易懂
    6. 使用中文回答用户的问题
    7. 根据用户提供的症状信息，可以提供可能的疾病范围，但务必强调需要就医确诊
    8. 对于涉及个人隐私的问题，可以适当婉拒`;
    
    // 症状分析系统提示词
    this.symptomAnalyzerPrompt = `你是一个专业的症状分析助手。
    请分析用户提供的症状信息，并：
    1. 提取关键症状
    2. 判断症状的紧急程度
    3. 提供初步的建议
    4. 但不要做出明确的疾病诊断
    5. 始终强调及时就医的重要性`;
  }
  
  // 基本聊天功能 - 增加重试机制和更友好的错误处理
  async chat(messages, options = {}) {
    const maxRetries = options.maxRetries || 2; // 默认最多重试2次
    let lastError;
    
    // 配置请求参数
    const config = {
      model: options.model || this.defaultModel,
      messages: messages,
      temperature: options.temperature !== undefined ? options.temperature : this.defaultTemperature,
      max_tokens: options.maxTokens || this.maxTokens
    };
    
    // 重试循环
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await openai.chat.completions.create(config);
        return response.choices[0].message.content;
      } catch (error) {
        lastError = error;
        console.error(`AI聊天错误(尝试${attempt + 1}/${maxRetries + 1}):`, error);
        
        // 如果是最后一次尝试或者是非临时性错误，则抛出异常
        if (attempt === maxRetries || 
            error.response?.status >= 500 || // 服务器错误
            error.message?.includes('Invalid API key') || // API密钥错误
            error.message?.includes('insufficient_quota')) { // 配额不足
          break;
        }
        
        // 指数退避策略
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // 格式化友好的错误信息
    let errorMessage = "抱歉，我的服务暂时出现问题，请稍后再试。";
    
    if (lastError.response?.status === 401 || 
        lastError.message?.includes('Invalid API key')) {
      errorMessage = "服务认证失败，请检查API配置。";
    } else if (lastError.message?.includes('insufficient_quota')) {
      errorMessage = "当前服务配额已用完，请稍后再试或联系管理员。";
    } else if (lastError.message?.includes('model not found')) {
      errorMessage = "请求的模型不存在，请检查模型名称。";
    } else if (lastError.response?.status >= 500) {
      errorMessage = "服务器暂时不可用，请稍后再试。";
    }
    
    throw new Error(errorMessage);
  }
  
  // 医疗咨询聊天
  async medicalChat(userMessage, history = []) {
    try {
      // 构建消息数组
      const messages = [
        { role: 'system', content: this.medicalAssistantPrompt },
        ...history,
        { role: 'user', content: userMessage }
      ];
      
      return await this.chat(messages, {
        temperature: 0.5, // 降低温度使回答更加严谨
        maxTokens: 800,
        maxRetries: 2 // 为医疗咨询设置额外的重试次数
      });
    } catch (error) {
      // 直接抛出原始错误信息，已在chat方法中处理为友好提示
      throw error;
    }
  }
  
  // 症状分析
  async analyzeSymptoms(symptomDescription, patientInfo = {}) {
    try {
      const query = `
        患者症状描述: ${symptomDescription}
        患者信息:
        - 年龄: ${patientInfo.age || '未知'}
        - 性别: ${patientInfo.gender || '未知'}
        - 既往病史: ${patientInfo.medicalHistory ? patientInfo.medicalHistory.join(', ') : '无'}
        - 持续时间: ${patientInfo.duration || '未知'}
        
        请分析以上信息并提供:
        1. 提取的主要症状列表
        2. 症状的可能严重程度评估
        3. 是否需要立即就医的建议
        4. 可能的健康问题范围（但不要做出明确诊断）
        5. 等待就医期间的自我护理建议
      `;
      
      const messages = [
        { role: 'system', content: this.symptomAnalyzerPrompt },
        { role: 'user', content: query }
      ];
      
      const analysis = await this.chat(messages, {
        temperature: 0.3, // 更低的温度确保分析更加严谨
        maxTokens: 1000,
        maxRetries: 3 // 症状分析更重要，增加重试次数
      });
      
      return analysis;
    } catch (error) {
      // 直接抛出原始错误信息
      throw error;
    }
  }
  
  // 生成健康建议
  async generateHealthAdvice(topic, specificNeeds = '') {
    try {
      const prompt = `请提供关于${topic}的健康建议。${specificNeeds ? `特别关注: ${specificNeeds}` : ''}
      建议内容应包括：
      1. 基本知识介绍
      2. 日常预防措施
      3. 健康生活方式建议
      4. 何时需要寻求医疗帮助
      
      请确保建议科学、实用且易于理解。`;
      
      const messages = [
        { role: 'system', content: this.medicalAssistantPrompt },
        { role: 'user', content: prompt }
      ];
      
      return await this.chat(messages, {
        maxRetries: 2
      });
    } catch (error) {
      // 直接抛出原始错误信息
      throw error;
    }
  }
  
  // 处理紧急情况 - 紧急情况需要更可靠的处理
  async handleEmergency(symptomDescription) {
    try {
      const emergencyPrompt = `分析以下症状描述，判断是否属于紧急情况需要立即就医：
      ${symptomDescription}
      
      如果判断为紧急情况，请明确说明需要立即拨打急救电话，并列出可能的紧急医疗问题。
      如果不属于紧急情况，请提供适当的建议和观察要点。`;
      
      const messages = [
        { 
          role: 'system', 
          content: '你是一个紧急医疗情况判断专家。请基于提供的症状描述，判断是否需要紧急医疗干预。'
        },
        { role: 'user', content: emergencyPrompt }
      ];
      
      return await this.chat(messages, {
        temperature: 0.2, // 极低温度确保判断准确
        maxTokens: 500,
        maxRetries: 3 // 紧急情况处理增加重试次数
      });
    } catch (error) {
      // 紧急情况即使API失败也应该给用户一个基本建议
      if (error.message.includes('服务暂时出现问题')) {
        return "由于系统原因，无法进行详细分析。无论如何，如果症状严重或持续恶化，请立即拨打120急救电话寻求专业医疗帮助。";
      }
      throw error;
    }
  }
}

// 导出单例实例
module.exports = new AIService();