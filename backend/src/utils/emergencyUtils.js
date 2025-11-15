// 紧急情况处理工具模块

// 紧急症状关键词列表
const EMERGENCY_SYMPTOMS = [
  '胸痛', '急性胸痛', '心肌梗死', '心绞痛',
  '呼吸困难', '呼吸急促', '窒息',
  '剧烈头痛', '突发性头痛', '脑卒中', '中风',
  '昏迷', '意识丧失',
  '严重外伤', '大量出血',
  '高烧不退', '超高热',
  '抽搐', '癫痫发作',
  '剧烈腹痛', '急性腹痛',
  '严重过敏', '过敏性休克'
];

// 紧急联系电话
const EMERGENCY_CONTACTS = {
  ambulance: '120', // 中国急救电话
  police: '110',    // 报警电话
  fire: '119'       // 消防电话
};

/**
 * 检查症状是否包含紧急情况
 * @param {Array} symptoms - 症状列表
 * @returns {boolean} - 是否为紧急情况
 */
export const isEmergencySituation = (symptoms) => {
  if (!symptoms || !Array.isArray(symptoms)) {
    return false;
  }
  
  // 检查是否包含紧急症状关键词
  return symptoms.some(symptom => {
    const symptomText = symptom.name || symptom.description || symptom;
    return EMERGENCY_SYMPTOMS.some(emergencySymptom => 
      (symptomText && typeof symptomText === 'string' && 
       symptomText.toLowerCase().includes(emergencySymptom.toLowerCase()))
    );
  });
};

/**
 * 发送紧急警报
 * @param {Object} contactInfo - 联系信息
 * @param {Array} symptoms - 症状列表
 * @returns {Promise<Object>} - 发送结果
 */
export const sendEmergencyAlert = async (contactInfo, symptoms) => {
  try {
    // 这里是模拟发送警报的逻辑
    // 在实际应用中，这里可能会调用短信服务、邮件服务或其他通知服务
    
    console.log('\n=== 紧急警报 ===');
    console.log('联系人信息:', contactInfo);
    console.log('紧急症状:', symptoms);
    console.log('建议紧急联系方式:', EMERGENCY_CONTACTS.ambulance);
    console.log('================\n');
    
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: '紧急警报已发送',
      emergencyContact: EMERGENCY_CONTACTS.ambulance
    };
  } catch (error) {
    console.error('发送紧急警报失败:', error);
    throw new Error('发送紧急警报失败: ' + error.message);
  }
};

/**
 * 获取紧急情况建议
 * @param {Array} symptoms - 症状列表
 * @returns {Object} - 紧急情况建议
 */
export const getEmergencyAdvice = (symptoms) => {
  // 根据不同类型的紧急症状提供不同的建议
  let advice = '请立即拨打急救电话 ' + EMERGENCY_CONTACTS.ambulance + ' 并等待专业医疗救助。';
  let immediateActions = [];
  
  // 根据症状判断紧急类型并提供相应建议
  const symptomTexts = symptoms.map(s => 
    (s.name || s.description || s).toLowerCase()
  ).join(' ');
  
  if (symptomTexts.includes('胸痛') || symptomTexts.includes('心肌梗死') || symptomTexts.includes('心绞痛')) {
    immediateActions = [
      '让患者保持安静，避免活动',
      '帮助患者保持舒适的姿势（通常是半坐位）',
      '如果患者有心脏病史并携带硝酸甘油，可以按医嘱使用',
      '如果患者失去意识，检查呼吸和脉搏，必要时进行心肺复苏'
    ];
  } 
  else if (symptomTexts.includes('呼吸困难') || symptomTexts.includes('窒息')) {
    immediateActions = [
      '帮助患者保持半卧位，使呼吸更顺畅',
      '确保患者周围空气流通',
      '避免患者紧张，保持其情绪稳定',
      '如果是窒息，尝试使用海姆立克急救法'
    ];
  }
  else if (symptomTexts.includes('头痛') || symptomTexts.includes('脑卒中') || symptomTexts.includes('中风')) {
    immediateActions = [
      '让患者平卧，头部略抬高',
      '避免患者活动和紧张',
      '记录症状开始的时间',
      '不要给患者服用任何药物，除非在医生指导下'
    ];
  }
  else if (symptomTexts.includes('昏迷') || symptomTexts.includes('意识丧失')) {
    immediateActions = [
      '确保患者呼吸道通畅，将头部偏向一侧防止窒息',
      '检查呼吸和脉搏',
      '如果没有呼吸和脉搏，立即进行心肺复苏',
      '不要试图喂患者食物或水'
    ];
  }
  
  return {
    isEmergency: true,
    advice,
    immediateActions,
    emergencyContact: EMERGENCY_CONTACTS.ambulance
  };
};

module.exports = {
  isEmergencySituation,
  sendEmergencyAlert,
  getEmergencyAdvice,
  EMERGENCY_CONTACTS
};