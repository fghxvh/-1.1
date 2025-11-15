const Disease = require('../models/Disease');
const Symptom = require('../models/Symptom');

// 疾病相关服务
const DiseaseService = {
  // 创建新疾病
  createDisease: async (diseaseData) => {
    try {
      const disease = new Disease(diseaseData);
      return await disease.save();
    } catch (error) {
      throw new Error(`创建疾病失败: ${error.message}`);
    }
  },

  // 批量导入疾病数据
  importDiseases: async (diseasesData) => {
    try {
      // 使用insertMany进行批量插入
      return await Disease.insertMany(diseasesData, { ordered: false });
    } catch (error) {
      // 记录导入失败的项目，但继续处理其他数据
      console.error('批量导入疾病数据时出错:', error);
      // 继续抛出错误，让调用方决定如何处理
      throw new Error(`批量导入疾病数据失败: ${error.message}`);
    }
  },

  // 根据症状查找相关疾病
  findDiseasesBySymptoms: async (symptoms, limit = 10) => {
    try {
      const diseases = await Disease.find({
        symptoms: { $in: symptoms }
      }).limit(limit);
      
      // 计算匹配度
      return diseases.map(disease => {
        const matchedCount = disease.symptoms.filter(symptom => 
          symptoms.includes(symptom)
        ).length;
        
        return {
          ...disease.toObject(),
          matchScore: matchedCount / symptoms.length,
          matchedSymptomsCount: matchedCount
        };
      }).sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
      throw new Error(`根据症状查找疾病失败: ${error.message}`);
    }
  },

  // 按疾病名称搜索
  searchByName: async (keyword, limit = 20) => {
    try {
      return await Disease.find({
        name: { $regex: keyword, $options: 'i' }
      }).limit(limit);
    } catch (error) {
      throw new Error(`搜索疾病失败: ${error.message}`);
    }
  }
};

// 症状相关服务
const SymptomService = {
  // 创建新症状
  createSymptom: async (symptomData) => {
    try {
      const symptom = new Symptom(symptomData);
      return await symptom.save();
    } catch (error) {
      throw new Error(`创建症状失败: ${error.message}`);
    }
  },

  // 批量导入症状数据
  importSymptoms: async (symptomsData) => {
    try {
      // 使用insertMany进行批量插入
      return await Symptom.insertMany(symptomsData, { ordered: false });
    } catch (error) {
      console.error('批量导入症状数据时出错:', error);
      throw new Error(`批量导入症状数据失败: ${error.message}`);
    }
  },

  // 根据疾病查找相关症状
  findSymptomsByDisease: async (diseaseName) => {
    try {
      return await Symptom.find({
        relatedDiseases: { $regex: diseaseName, $options: 'i' }
      });
    } catch (error) {
      throw new Error(`根据疾病查找症状失败: ${error.message}`);
    }
  },

  // 获取常见症状列表
  getCommonSymptoms: async (limit = 50) => {
    try {
      return await Symptom.find({ severityLevel: { $ne: '轻微' } })
        .sort({ severityLevel: 1 })
        .limit(limit);
    } catch (error) {
      throw new Error(`获取常见症状失败: ${error.message}`);
    }
  }
};

// 诊断辅助服务
const DiagnosisService = {
  // 基础诊断逻辑
  performBasicDiagnosis: async (symptoms, patientInfo = {}) => {
    try {
      // 获取可能的疾病
      const potentialDiseases = await DiseaseService.findDiseasesBySymptoms(symptoms);
      
      // 根据患者信息进一步筛选
      let filteredDiseases = potentialDiseases;
      
      // 如果提供了患者信息，可以进行更精准的筛选
      if (patientInfo.age || patientInfo.gender) {
        filteredDiseases = potentialDiseases.filter(disease => {
          // 简化的年龄和性别筛选逻辑
          // 实际应用中可能需要更复杂的算法
          if (patientInfo.age) {
            const age = parseInt(patientInfo.age);
            const hasAgeGroup = disease.susceptibleGroups.some(group => {
              if (group.includes('儿童') && age < 18) return true;
              if (group.includes('成人') && age >= 18 && age < 60) return true;
              if (group.includes('老人') && age >= 60) return true;
              return false;
            });
            if (hasAgeGroup) return true;
          }
          return true;
        });
      }
      
      return {
        potentialDiseases: filteredDiseases.slice(0, 5),
        confidenceLevel: potentialDiseases.length > 0 ? 
          potentialDiseases[0].matchScore : 0
      };
    } catch (error) {
      throw new Error(`诊断过程失败: ${error.message}`);
    }
  }
};

module.exports = {
  DiseaseService,
  SymptomService,
  DiagnosisService
};