const mongoose = require('mongoose');

const SymptomSchema = new mongoose.Schema({
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
  relatedDiseases: [
    {
      type: String,
      trim: true
    }
  ],
  severityLevel: {
    type: String,
    enum: ['轻微', '中等', '严重'],
    default: '中等'
  },
  durationInfo: {
    type: String,
    trim: true
  },
  possibleCauses: [
    {
      type: String,
      trim: true
    }
  ],
  whenToSeekHelp: {
    type: String,
    trim: true
  },
  commonAssociatedSymptoms: [
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
SymptomSchema.index({ name: 1 });
SymptomSchema.index({ bodyPart: 1 });
SymptomSchema.index({ relatedDiseases: 1 });

// 更新时间戳中间件
SymptomSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Symptom = mongoose.model('Symptom', SymptomSchema);

module.exports = Symptom;