const mongoose = require('mongoose');
const Disease = require('../../backend/src/models/Disease');
const Symptom = require('../../backend/src/models/Symptom');
const dbConfig = require('../config/db.config');

// 示例疾病数据
const sampleDiseases = [
  {
    name: '普通感冒',
    description: '普通感冒是一种常见的病毒性上呼吸道感染，通常由鼻病毒引起。',
    bodyPart: '呼吸道',
    contagious: true,
    susceptibleGroups: ['儿童', '老年人', '免疫力低下者'],
    earlySymptoms: ['打喷嚏', '鼻塞', '喉咙痛'],
    lateSymptoms: ['咳嗽', '轻微发热', '乏力'],
    symptoms: ['打喷嚏', '鼻塞', '喉咙痛', '咳嗽', '轻微发热', '乏力'],
    symptomDescriptions: '初期表现为上呼吸道症状，随后可能出现全身不适。',
    complications: '可能并发中耳炎、鼻窦炎等。',
    prevention: '勤洗手、避免接触患者、保持良好的个人卫生。',
    treatmentApproach: '主要为对症治疗，包括休息、多喝水、使用解热镇痛药等。',
    severity: '轻微',
    diagnosisMethods: ['临床表现', '病史询问']
  },
  {
    name: '高血压',
    description: '高血压是一种以动脉血压持续升高为主要特征的慢性疾病。',
    bodyPart: '心血管系统',
    contagious: false,
    susceptibleGroups: ['中老年人', '有家族史者', '肥胖者', '高盐饮食者'],
    earlySymptoms: ['可能无症状', '头痛', '头晕'],
    lateSymptoms: ['视力模糊', '胸闷', '心悸'],
    symptoms: ['头痛', '头晕', '视力模糊', '胸闷', '心悸', '鼻出血'],
    symptomDescriptions: '大多数患者早期无明显症状，常在体检时发现血压升高。',
    complications: '可导致脑卒中、心肌梗死、心力衰竭、肾功能衰竭等严重并发症。',
    prevention: '低盐饮食、适量运动、戒烟限酒、保持良好心态。',
    treatmentApproach: '生活方式干预结合降压药物治疗，需要长期管理。',
    severity: '中等',
    diagnosisMethods: ['血压测量', '血液检查', '心电图']
  },
  {
    name: '2型糖尿病',
    description: '2型糖尿病是一种以胰岛素抵抗和胰岛素分泌不足为特征的代谢性疾病。',
    bodyPart: '内分泌系统',
    contagious: false,
    susceptibleGroups: ['中老年人', '肥胖者', '有家族史者', '久坐少动者'],
    earlySymptoms: ['多饮', '多食', '多尿', '体重下降'],
    lateSymptoms: ['视力下降', '皮肤感染', '足部溃疡'],
    symptoms: ['多饮', '多食', '多尿', '体重下降', '视力下降', '皮肤感染'],
    symptomDescriptions: '典型症状为"三多一少"，但部分患者可能无明显症状。',
    complications: '可导致视网膜病变、肾病、神经病变、心血管疾病等。',
    prevention: '健康饮食、适量运动、控制体重、定期体检。',
    treatmentApproach: '饮食控制、运动疗法、口服降糖药或胰岛素治疗。',
    severity: '中等',
    diagnosisMethods: ['血糖检测', '糖化血红蛋白检测']
  }
];

// 示例症状数据
const sampleSymptoms = [
  {
    name: '头痛',
    description: '头部疼痛，可表现为胀痛、刺痛、跳痛等多种形式。',
    bodyPart: '头部',
    relatedDiseases: ['普通感冒', '高血压', '偏头痛', '紧张性头痛'],
    severityLevel: '中等',
    durationInfo: '可持续数分钟至数天不等，取决于病因。',
    possibleCauses: ['感冒', '高血压', '压力过大', '睡眠不足', '偏头痛'],
    whenToSeekHelp: '剧烈头痛、伴随呕吐、视力改变或意识障碍时应立即就医。',
    commonAssociatedSymptoms: ['恶心', '头晕', '畏光', '畏声']
  },
  {
    name: '发热',
    description: '体温升高超过正常范围，通常指腋下温度超过37.3℃。',
    bodyPart: '全身',
    relatedDiseases: ['普通感冒', '流感', '细菌感染', '病毒感染'],
    severityLevel: '中等',
    durationInfo: '根据病因不同，可持续数小时至数天。',
    possibleCauses: ['感染', '炎症反应', '自身免疫性疾病', '中暑'],
    whenToSeekHelp: '体温超过39℃、持续高热不退或伴有严重症状时应就医。',
    commonAssociatedSymptoms: ['寒战', '乏力', '肌肉酸痛', '出汗']
  },
  {
    name: '咳嗽',
    description: '呼吸道受到刺激时的一种保护性反射动作。',
    bodyPart: '呼吸道',
    relatedDiseases: ['普通感冒', '肺炎', '支气管炎', '哮喘'],
    severityLevel: '轻微',
    durationInfo: '急性咳嗽通常持续数天至数周，慢性咳嗽可持续8周以上。',
    possibleCauses: ['感冒', '支气管炎', '过敏', '吸烟', '空气污染'],
    whenToSeekHelp: '咳嗽持续超过3周、伴有血痰、胸痛或呼吸困难时应就医。',
    commonAssociatedSymptoms: ['咳痰', '胸闷', '呼吸困难', '喉咙痛']
  }
];

// 初始化数据库
async function initDatabase() {
  try {
    // 连接数据库
    await mongoose.connect(dbConfig.mongoURI, dbConfig.options);
    console.log('MongoDB连接成功');

    // 清空现有数据
    await Disease.deleteMany({});
    await Symptom.deleteMany({});
    console.log('已清空现有数据');

    // 导入疾病数据
    await Disease.insertMany(sampleDiseases);
    console.log(`成功导入 ${sampleDiseases.length} 条疾病数据`);

    // 导入症状数据
    await Symptom.insertMany(sampleSymptoms);
    console.log(`成功导入 ${sampleSymptoms.length} 条症状数据`);

    console.log('数据库初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

// 执行初始化
initDatabase();