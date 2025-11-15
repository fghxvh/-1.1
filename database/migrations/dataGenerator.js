// 数据生成器 - 用于生成更多示例数据
const fs = require('fs');
const path = require('path');

// 基础疾病数据模板
const generateDiseaseData = (count) => {
  const diseases = [];
  const bodyParts = ['呼吸道', '心血管系统', '消化系统', '内分泌系统', '神经系统', '骨骼肌肉系统', '泌尿系统', '生殖系统', '皮肤', '血液系统'];
  const severityLevels = ['轻微', '中等', '严重', '危急'];
  const diagnosisMethods = ['临床表现', '血液检查', '影像学检查', '病理检查', '心电图', '病史询问', '生化检查'];
  
  // 常见疾病名称前缀
  const prefixes = ['急性', '慢性', '病毒性', '细菌性', '原发性', '继发性', '功能性', '器质性'];
  
  // 疾病类型
  const diseaseTypes = ['炎', '综合征', '病', '症', '瘤', '癌', '功能障碍', '缺损'];
  
  for (let i = 1; i <= count; i++) {
    const bodyPart = bodyParts[Math.floor(Math.random() * bodyParts.length)];
    const randomSymptoms = generateRandomSymptoms(3, 8);
    
    diseases.push({
      name: `${prefixes[Math.floor(Math.random() * prefixes.length)]}${bodyPart}${diseaseTypes[Math.floor(Math.random() * diseaseTypes.length)]}${i}`,
      description: `这是一种影响${bodyPart}的${severityLevels[Math.floor(Math.random() * 3)]}疾病，常见于成年人。`,
      bodyPart: bodyPart,
      contagious: Math.random() > 0.7,
      susceptibleGroups: generateRandomGroups(2, 4),
      earlySymptoms: randomSymptoms.slice(0, Math.floor(randomSymptoms.length / 2)),
      lateSymptoms: randomSymptoms.slice(Math.floor(randomSymptoms.length / 2)),
      symptoms: randomSymptoms,
      symptomDescriptions: `患者通常表现为${randomSymptoms.slice(0, 2).join('、')}等症状。`,
      complications: '如不及时治疗，可能导致多种并发症。',
      prevention: '保持健康的生活方式，定期体检有助于预防。',
      treatmentApproach: '根据病情严重程度选择药物治疗或手术治疗。',
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      diagnosisMethods: getRandomSubarray(diagnosisMethods, 2, 4)
    });
  }
  
  return diseases;
};

// 基础症状数据模板
const generateSymptomData = (count) => {
  const symptoms = [];
  const bodyParts = ['头部', '胸部', '腹部', '四肢', '背部', '全身', '皮肤', '眼睛', '耳朵', '鼻子', '喉咙'];
  const severityLevels = ['轻微', '中等', '严重'];
  
  // 症状描述模板
  const symptomDescriptions = [
    '表现为持续性不适',
    '通常间歇性发作',
    '可能影响日常生活',
    '在特定情况下加重'
  ];
  
  // 症状名称库
  const symptomNames = [
    '疼痛', '麻木', '肿胀', '发热', '瘙痒', '发红', '僵硬', '无力',
    '头晕', '恶心', '呕吐', '腹泻', '便秘', '心悸', '气短', '咳嗽',
    '流涕', '咽痛', '头痛', '腹痛', '胸痛', '关节痛', '肌肉痛', '疲劳'
  ];
  
  for (let i = 1; i <= count; i++) {
    const bodyPart = bodyParts[Math.floor(Math.random() * bodyParts.length)];
    const symptomName = symptomNames[Math.floor(Math.random() * symptomNames.length)];
    
    symptoms.push({
      name: `${bodyPart}${symptomName}`,
      description: `${bodyPart}出现的${symptomName}症状，${symptomDescriptions[Math.floor(Math.random() * symptomDescriptions.length)]}。`,
      bodyPart: bodyPart,
      relatedDiseases: generateRandomDiseaseNames(3, 6),
      severityLevel: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      durationInfo: '可持续数小时至数天不等。',
      possibleCauses: generateRandomCauses(2, 5),
      whenToSeekHelp: '症状持续加重或伴有其他异常时应及时就医。',
      commonAssociatedSymptoms: generateRandomSymptoms(2, 4)
    });
  }
  
  return symptoms;
};

// 辅助函数：生成随机症状列表
function generateRandomSymptoms(min, max) {
  const symptomPool = [
    '头痛', '头晕', '发热', '咳嗽', '乏力', '恶心', '呕吐', '腹泻',
    '便秘', '腹痛', '胸痛', '关节痛', '肌肉痛', '皮疹', '瘙痒',
    '鼻塞', '流涕', '咽痛', '耳鸣', '视力模糊', '呼吸困难', '心悸'
  ];
  const count = min + Math.floor(Math.random() * (max - min + 1));
  return getRandomSubarray(symptomPool, count, count);
}

// 辅助函数：生成随机易感人群
function generateRandomGroups(min, max) {
  const groupPool = [
    '儿童', '青少年', '成年人', '老年人', '孕妇', '哺乳期妇女',
    '免疫力低下者', '有家族史者', '肥胖者', '吸烟者', '饮酒者'
  ];
  const count = min + Math.floor(Math.random() * (max - min + 1));
  return getRandomSubarray(groupPool, count, count);
}

// 辅助函数：生成随机疾病名称
function generateRandomDiseaseNames(min, max) {
  const diseasePool = [
    '感冒', '流感', '肺炎', '高血压', '糖尿病', '心脏病', '胃炎',
    '肝炎', '肾炎', '关节炎', '头痛', '偏头痛', '哮喘', '过敏'
  ];
  const count = min + Math.floor(Math.random() * (max - min + 1));
  return getRandomSubarray(diseasePool, count, count);
}

// 辅助函数：生成随机病因
function generateRandomCauses(min, max) {
  const causePool = [
    '感染', '炎症', '遗传因素', '环境因素', '生活方式', '压力过大',
    '营养不良', '缺乏运动', '创伤', '药物副作用', '自身免疫反应'
  ];
  const count = min + Math.floor(Math.random() * (max - min + 1));
  return getRandomSubarray(causePool, count, count);
}

// 辅助函数：从数组中随机选择指定数量的元素
function getRandomSubarray(arr, min, max) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  const count = min + Math.floor(Math.random() * (max - min + 1));
  return shuffled.slice(0, count);
}

// 生成并保存数据
function generateAndSaveData(diseaseCount, symptomCount) {
  console.log(`开始生成 ${diseaseCount} 条疾病数据和 ${symptomCount} 条症状数据...`);
  
  const diseases = generateDiseaseData(diseaseCount);
  const symptoms = generateSymptomData(symptomCount);
  
  // 保存为JSON文件
  const outputDir = path.join(__dirname, 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(outputDir, 'diseases.json'),
    JSON.stringify(diseases, null, 2),
    'utf8'
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'symptoms.json'),
    JSON.stringify(symptoms, null, 2),
    'utf8'
  );
  
  console.log(`数据生成完成！`);
  console.log(`疾病数据已保存至: ${path.join(outputDir, 'diseases.json')}`);
  console.log(`症状数据已保存至: ${path.join(outputDir, 'symptoms.json')}`);
}

// 生成示例数据（可以根据需要调整数量）
generateAndSaveData(2000, 2000);