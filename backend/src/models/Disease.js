const mongoose = require('mongoose');

const DiseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  bodyPart: {
    type: String,
    required: true,
    trim: true
  },
  contagious: {
    type: Boolean,
    default: false
  },
  susceptibleGroups: [
    {
      type: String,
      trim: true
    }
  ],
  earlySymptoms: [
    {
      type: String,
      trim: true
    }
  ],
  lateSymptoms: [
    {
      type: String,
      trim: true
    }
  ],
  symptoms: [
    {
      type: String,
      trim: true
    }
  ],
  symptomDescriptions: {
    type: String,
    trim: true
  },
  complications: {
    type: String,
    trim: true
  },
  prevention: {
    type: String,
    trim: true
  },
  treatmentApproach: {
    type: String,
    trim: true
  },
  severity: {
    type: String,
    enum: ['轻微', '中等', '严重', '危急'],
    default: '中等'
  },
  diagnosisMethods: [
    {
      type: String,
      trim: true
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 添加索引以提高搜索性能
DiseaseSchema.index({ name: 1 });
DiseaseSchema.index({ symptoms: 1 });
DiseaseSchema.index({ bodyPart: 1 });

// 更新时间戳中间件
DiseaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Disease = mongoose.model('Disease', DiseaseSchema);

module.exports = Disease;