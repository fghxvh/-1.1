const Disease = require('../models/Disease');
const Symptom = require('../models/Symptom');

class DiagnosisService {
  // 基于症状进行疾病诊断
  static async diagnose(symptomIds) {
    try {
      // 记录开始时间，用于计算分析时间
      const startTime = Date.now();

      // 获取症状详情
      const symptoms = await Symptom.find({ _id: { $in: symptomIds } });
      
      // 如果没有找到症状，返回空结果
      if (!symptoms || symptoms.length === 0) {
        return {
          symptoms: [],
          possibleDiseases: [],
          analysisTime: 0
        };
      }

      // 获取所有可能的疾病，包含相关症状信息
      const diseases = await Disease.find({})
        .populate('symptoms')
        .populate('earlySymptoms')
        .populate('lateSymptoms');

      // 计算每个疾病与症状的匹配度
      const matchedDiseases = [];
      
      diseases.forEach(disease => {
        // 收集疾病的所有相关症状ID
        const allDiseaseSymptomIds = new Set();
        
        // 添加主要症状
        if (disease.symptoms && Array.isArray(disease.symptoms)) {
          disease.symptoms.forEach(s => allDiseaseSymptomIds.add(s._id.toString()));
        }
        
        // 添加早期症状
        if (disease.earlySymptoms && Array.isArray(disease.earlySymptoms)) {
          disease.earlySymptoms.forEach(s => allDiseaseSymptomIds.add(s._id.toString()));
        }
        
        // 添加晚期症状
        if (disease.lateSymptoms && Array.isArray(disease.lateSymptoms)) {
          disease.lateSymptoms.forEach(s => allDiseaseSymptomIds.add(s._id.toString()));
        }
        
        // 计算匹配的症状数量
        const symptomIdsSet = new Set(symptomIds.map(id => id.toString()));
        let matchedCount = 0;
        let primaryMatchedCount = 0;
        
        symptomIdsSet.forEach(id => {
          if (allDiseaseSymptomIds.has(id)) {
            matchedCount++;
            // 检查是否为主要症状
            if (disease.symptoms && Array.isArray(disease.symptoms)) {
              const isPrimary = disease.symptoms.some(s => s._id.toString() === id);
              if (isPrimary) {
                primaryMatchedCount++;
              }
            }
          }
        });
        
        // 只有当有匹配的症状时才加入结果
        if (matchedCount > 0) {
          // 计算匹配度：主要症状权重更高
          const totalSymptoms = symptomIds.length;
          const primaryWeight = 1.5;
          const secondaryWeight = 1.0;
          
          const weightedMatch = (primaryMatchedCount * primaryWeight) + ((matchedCount - primaryMatchedCount) * secondaryWeight);
          const matchRate = Math.min((weightedMatch / totalSymptoms) * 100, 100);
          
          matchedDiseases.push({
            _id: disease._id,
            name: disease.name,
            description: disease.description,
            bodyPart: disease.bodyPart,
            severity: disease.severity,
            contagious: disease.contagious,
            matchedSymptoms: matchedCount,
            primaryMatchedSymptoms: primaryMatchedCount,
            matchRate: matchRate
          });
        }
      });
      
      // 按匹配率排序
      matchedDiseases.sort((a, b) => b.matchRate - a.matchRate);
      
      // 限制返回结果数量，最多返回10个最匹配的疾病
      const topDiseases = matchedDiseases.slice(0, 10);
      
      // 计算分析时间
      const analysisTime = (Date.now() - startTime) / 1000;
      
      return {
        symptoms: symptoms,
        possibleDiseases: topDiseases,
        analysisTime: analysisTime
      };
    } catch (error) {
      console.error('诊断过程中发生错误:', error);
      throw new Error('诊断过程中发生错误');
    }
  }

  // 高级诊断算法，考虑更多因素
  static async advancedDiagnose(symptomIds, patientInfo = {}) {
    try {
      // 首先获取基础诊断结果
      const basicDiagnosis = await this.diagnose(symptomIds);
      
      // 如果没有匹配的疾病，直接返回
      if (!basicDiagnosis.possibleDiseases || basicDiagnosis.possibleDiseases.length === 0) {
        return basicDiagnosis;
      }
      
      // 根据患者信息调整匹配度
      const { age, gender, medicalHistory = [] } = patientInfo;
      
      // 进一步优化诊断结果
      const optimizedDiseases = basicDiagnosis.possibleDiseases.map(disease => {
        let adjustedRate = disease.matchRate;
        
        // 根据年龄调整匹配率
        if (age) {
          // 这里可以根据不同疾病的高发年龄段进行调整
          // 简化示例：假设某些疾病对特定年龄段有偏好
          if (age < 18 && disease.name.includes('儿童') || disease.name.includes('小儿')) {
            adjustedRate += 5;
          } else if (age > 65 && disease.name.includes('老年') || disease.name.includes('退行性')) {
            adjustedRate += 5;
          }
        }
        
        // 根据性别调整匹配率
        if (gender) {
          // 简化示例：某些疾病在特定性别中更常见
          if (gender === 'male' && (disease.name.includes('前列腺') || disease.name.includes('男性'))) {
            adjustedRate += 5;
          } else if (gender === 'female' && (disease.name.includes('乳腺') || disease.name.includes('卵巢') || disease.name.includes('女性'))) {
            adjustedRate += 5;
          }
        }
        
        // 根据病史调整匹配率
        if (medicalHistory.length > 0) {
          // 简化示例：如果有相关病史，提高匹配率
          const hasRelevantHistory = medicalHistory.some(history => 
            disease.name.toLowerCase().includes(history.toLowerCase()) ||
            disease.description.toLowerCase().includes(history.toLowerCase())
          );
          
          if (hasRelevantHistory) {
            adjustedRate += 10;
          }
        }
        
        // 确保匹配率不超过100%
        adjustedRate = Math.min(adjustedRate, 100);
        
        return {
          ...disease,
          matchRate: adjustedRate,
          adjusted: true
        };
      });
      
      // 重新排序
      optimizedDiseases.sort((a, b) => b.matchRate - a.matchRate);
      
      return {
        ...basicDiagnosis,
        possibleDiseases: optimizedDiseases,
        advancedAnalysis: true,
        patientFactorsConsidered: Object.keys(patientInfo).length > 0
      };
    } catch (error) {
      console.error('高级诊断过程中发生错误:', error);
      // 如果高级诊断失败，返回基础诊断结果
      return this.diagnose(symptomIds);
    }
  }

  // 根据多个疾病ID批量获取疾病信息
  static async getDiseasesByIds(diseaseIds) {
    try {
      const diseases = await Disease.find({ _id: { $in: diseaseIds } });
      return diseases;
    } catch (error) {
      console.error('批量获取疾病信息失败:', error);
      throw new Error('获取疾病信息失败');
    }
  }

  // 检查症状是否为紧急情况
  static isEmergency(symptoms) {
    // 定义紧急症状关键词
    const emergencyKeywords = [
      '胸痛', '胸痛放射', '呼吸困难', '窒息', '严重出血', '昏迷', 
      '意识丧失', '抽搐', '剧烈头痛', '瘫痪', '语言障碍', '突发视力丧失',
      '高热', '持续呕吐', '腹部剧烈疼痛', '休克', '心悸', '晕厥'
    ];
    
    // 检查症状中是否包含紧急关键词
    const hasEmergencySymptom = symptoms.some(symptom => {
      const symptomText = (symptom.name + ' ' + symptom.description).toLowerCase();
      return emergencyKeywords.some(keyword => symptomText.includes(keyword.toLowerCase()));
    });
    
    return hasEmergencySymptom;
  }
}

module.exports = DiagnosisService;