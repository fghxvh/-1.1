const Disease = require('../models/Disease');
const DiagnosisService = require('../services/diagnosisService');
const { sendEmergencyAlert } = require('../utils/emergencyUtils');

// 获取所有疾病
const getAllDiseases = async (req, res) => {
  try {
    const { page = 1, limit = 50, sortBy = 'name', order = 'asc' } = req.query;
    
    // 计算分页
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: order === 'desc' ? -1 : 1 };
    
    const diseases = await Disease.find({})
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalCount = await Disease.countDocuments({});
    
    res.json({
      data: diseases,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('获取疾病列表失败:', error);
    res.status(500).json({ message: '获取疾病列表失败', error: error.message });
  }
};

// 根据ID获取疾病详情
const getDiseaseById = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id)
      .populate('symptoms', 'name description')
      .populate('earlySymptoms', 'name description')
      .populate('lateSymptoms', 'name description');
      
    if (!disease) {
      return res.status(404).json({ message: '疾病未找到' });
    }
    
    res.json(disease);
  } catch (error) {
    console.error('获取疾病详情失败:', error);
    res.status(500).json({ message: '获取疾病详情失败', error: error.message });
  }
};

// 搜索疾病
const searchDiseases = async (req, res) => {
  try {
    const { query, bodyPart, severity, contagious, page = 1, limit = 50 } = req.query;
    const searchConditions = {};
    
    if (query) {
      searchConditions.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { symptoms: { $elemMatch: { $regex: query, $options: 'i' } } }
      ];
    }
    
    if (bodyPart) {
      searchConditions.bodyPart = bodyPart;
    }
    
    if (severity) {
      searchConditions.severity = severity;
    }
    
    if (contagious !== undefined) {
      searchConditions.contagious = contagious === 'true';
    }
    
    const skip = (page - 1) * limit;
    
    const diseases = await Disease.find(searchConditions)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });
    
    const totalCount = await Disease.countDocuments(searchConditions);
    
    res.json({
      data: diseases,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('搜索疾病失败:', error);
    res.status(500).json({ message: '搜索疾病失败', error: error.message });
  }
};

// 根据症状进行诊断
const diagnose = async (req, res) => {
  try {
    const { symptomIds, patientInfo } = req.body;
    
    if (!symptomIds || !Array.isArray(symptomIds) || symptomIds.length === 0) {
      return res.status(400).json({ 
        message: '请提供有效的症状ID数组',
        errorCode: 'INVALID_SYMPTOMS'
      });
    }
    
    let diagnosisResult;
    
    // 如果提供了患者信息，使用高级诊断
    if (patientInfo && Object.keys(patientInfo).length > 0) {
      diagnosisResult = await DiagnosisService.advancedDiagnose(symptomIds, patientInfo);
    } else {
      diagnosisResult = await DiagnosisService.diagnose(symptomIds);
    }
    
    // 检查是否为紧急情况
    const isEmergency = DiagnosisService.isEmergency(diagnosisResult.symptoms);
    diagnosisResult.emergencyDetected = isEmergency;
    
    // 如果是紧急情况，发送警报（可选）
    if (isEmergency && patientInfo?.contactInfo) {
      try {
        await sendEmergencyAlert(patientInfo.contactInfo, diagnosisResult.symptoms);
        diagnosisResult.emergencyAlertSent = true;
      } catch (alertError) {
        console.error('发送紧急警报失败:', alertError);
        // 不影响诊断结果的返回
      }
    }
    
    res.json(diagnosisResult);
  } catch (error) {
    console.error('诊断过程中发生错误:', error);
    res.status(500).json({ 
      message: '诊断过程中发生错误', 
      error: error.message,
      errorCode: 'DIAGNOSIS_ERROR'
    });
  }
};

// 批量获取疾病信息
const getDiseasesBatch = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ 
        message: '请提供有效的疾病ID数组',
        errorCode: 'INVALID_IDS'
      });
    }
    
    const diseases = await DiagnosisService.getDiseasesByIds(ids);
    res.json(diseases);
  } catch (error) {
    console.error('批量获取疾病信息失败:', error);
    res.status(500).json({ 
      message: '批量获取疾病信息失败', 
      error: error.message
    });
  }
};

module.exports = {
  getAllDiseases,
  getDiseaseById,
  searchDiseases,
  diagnose,
  getDiseasesBatch
};