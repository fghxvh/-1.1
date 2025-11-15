const Symptom = require('../models/Symptom');

// 获取所有症状
const getAllSymptoms = async (req, res) => {
  try {
    const { page = 1, limit = 100, sortBy = 'name', order = 'asc', bodyPart } = req.query;
    
    // 构建查询条件
    const query = {};
    if (bodyPart) {
      query.bodyPart = bodyPart;
    }
    
    // 计算分页
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: order === 'desc' ? -1 : 1 };
    
    const symptoms = await Symptom.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalCount = await Symptom.countDocuments(query);
    
    // 获取所有身体部位用于筛选
    const bodyParts = await Symptom.distinct('bodyPart');
    
    res.json({
      data: symptoms,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit)
      },
      filters: {
        bodyParts
      }
    });
  } catch (error) {
    console.error('获取症状列表失败:', error);
    res.status(500).json({ message: '获取症状列表失败', error: error.message });
  }
};

// 根据ID获取症状详情
const getSymptomById = async (req, res) => {
  try {
    const symptom = await Symptom.findById(req.params.id);
    if (!symptom) {
      return res.status(404).json({ message: '症状未找到' });
    }
    
    // 查找与该症状相关的常见疾病（用于提示）
    const relatedDiseases = await Symptom.findById(req.params.id)
      .select('relatedDiseases')
      .populate('relatedDiseases', 'name severity');
    
    const result = {
      ...symptom.toObject(),
      relatedDiseases: relatedDiseases?.relatedDiseases || []
    };
    
    res.json(result);
  } catch (error) {
    console.error('获取症状详情失败:', error);
    res.status(500).json({ message: '获取症状详情失败', error: error.message });
  }
};

// 搜索症状
const searchSymptoms = async (req, res) => {
  try {
    const { keyword, bodyPart, severity, duration, page = 1, limit = 50 } = req.body;
    const query = {};
    
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { bodyPart: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    if (bodyPart) {
      query.bodyPart = bodyPart;
    }
    
    if (severity) {
      query.severity = severity;
    }
    
    if (duration) {
      query.duration = duration;
    }
    
    const skip = (page - 1) * limit;
    
    const symptoms = await Symptom.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });
    
    const totalCount = await Symptom.countDocuments(query);
    
    res.json({
      data: symptoms,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('搜索症状失败:', error);
    res.status(500).json({ message: '搜索症状失败', error: error.message });
  }
};

// 批量获取症状信息
const getSymptomsBatch = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ 
        message: '请提供有效的症状ID数组',
        errorCode: 'INVALID_IDS'
      });
    }
    
    const symptoms = await Symptom.find({ _id: { $in: ids } });
    res.json(symptoms);
  } catch (error) {
    console.error('批量获取症状信息失败:', error);
    res.status(500).json({ 
      message: '批量获取症状信息失败', 
      error: error.message
    });
  }
};

// 获取身体部位列表
const getBodyParts = async (req, res) => {
  try {
    const bodyParts = await Symptom.distinct('bodyPart');
    
    // 对身体部位进行排序
    const sortedBodyParts = bodyParts.sort();
    
    res.json({
      bodyParts: sortedBodyParts
    });
  } catch (error) {
    console.error('获取身体部位列表失败:', error);
    res.status(500).json({ message: '获取身体部位列表失败', error: error.message });
  }
};

module.exports = {
  getAllSymptoms,
  getSymptomById,
  searchSymptoms,
  getSymptomsBatch,
  getBodyParts
};