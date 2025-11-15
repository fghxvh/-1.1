import React, { useState } from 'react';
import { Card, Typography, Button, List, Alert, Collapse, Tag } from 'antd';
import { PhoneOutlined, ClockCircleOutlined, AlertOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const EmergencyGuidePage = () => {
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  // 紧急情况数据
  const emergencyCases = [
    {
      id: 'heart-attack',
      title: '心脏病发作',
      description: '心脏病发作是一种严重的医疗紧急情况，需要立即就医。',
      symptoms: [
        '胸部中央有压迫感、沉重感或疼痛',
        '疼痛可能放射到手臂、背部、颈部或下巴',
        '呼吸急促',
        '恶心、呕吐或消化不良',
        '冷汗、头晕或晕厥'
      ],
      firstAid: [
        '立即拨打120急救电话',
        '让患者保持坐位或半卧位，保持冷静',
        '如果患者有硝酸甘油，可在医生指导下使用',
        '如果患者失去意识且无脉搏，开始心肺复苏（CPR）',
        '等待救护车到来，不要自行驾车前往医院'
      ],
      severity: 'high',
      responseTime: '立即'
    },
    {
      id: 'stroke',
      title: '脑卒中（中风）',
      description: '脑卒中是由于脑部血管突然破裂或阻塞导致的脑组织损伤。',
      symptoms: [
        '面部下垂或麻木（微笑时一侧面部无法运动）',
        '手臂无力或麻木（抬双臂时一侧手臂下垂）',
        '言语困难（说话含糊不清或无法理解他人语言）',
        '突然视力模糊或丧失',
        '突然剧烈头痛',
        '平衡失调或行走困难'
      ],
      firstAid: [
        '立即拨打120急救电话（时间就是大脑！）',
        '记录症状开始的时间',
        '让患者保持舒适的体位，头部略抬高',
        '如果患者呕吐，将其头部偏向一侧以防止窒息',
        '不要给患者服用任何药物或食物',
        '密切观察患者的呼吸和意识状态'
      ],
      severity: 'high',
      responseTime: '立即'
    },
    {
      id: 'choking',
      title: '窒息',
      description: '当异物阻塞气道导致无法呼吸时，需要立即采取行动。',
      symptoms: [
        '呼吸困难或无法说话',
        '面部发红，随后变青紫色',
        '双手抓住喉咙(国际通用的窒息求救手势)',
        '表情惊恐',
        '意识丧失（如果不及时处理）'
      ],
      firstAid: [
        '询问"您窒息了吗？如果患者点头确认但无法说话',
        '对于成人和1岁以上儿童，实施海姆立克急救法:',
          '站在患者背后，用手臂环绕其腰部：'
          - 一手握拳,拇指侧对准患者上腹部(肚脐上方)
          - 另一手抓住握拳的手,快速向上向后冲击
          - 重复直到异物排出或患者失去意识,
        '如果患者失去意识，将其平放，开始心肺复苏，',
        '拨打120急救电话'
      ],
      severity: 'high',
      responseTime: '立即'
    },
    {
      id: 'severe-bleeding',
      title: '严重出血',
      description: '大量失血可能导致休克甚至死亡，需要迅速控制。',
      symptoms: [
        '血液从伤口大量涌出',
        '伤口呈喷射状出血（动脉出血）',
        '皮肤苍白、湿冷',
        '心跳加速、呼吸急促',
        '意识模糊或丧失'
      ],
      firstAid: [
        '立即用干净的纱布、毛巾或衣物直接按压伤口',
        '抬高受伤部位（高于心脏水平）',
        '如果出血持续，增加按压力度',
        '对于四肢出血，可考虑使用止血带（注意记录使用时间）',
        '拨打120急救电话',
        '保持患者温暖，防止休克'
      ],
      severity: 'high',
      responseTime: '立即'
    },
    {
      id: 'burns',
      title: '严重烧伤',
      description: '深度或大面积烧伤需要专业医疗处理。',
      symptoms: [
        '皮肤红肿、水泡（二度烧伤）',
        '皮肤呈白色或焦黑色（三度烧伤）',
        '疼痛剧烈或无痛觉（神经受损）',
        '烧伤面积超过身体的10%',
        '面部、手部、脚部或生殖器的烧伤'
      ],
      firstAid: [
        '对于轻度烧伤（一度）：用流动冷水冲洗10-15分钟',
        '对于严重烧伤:'
          - 不要使用冰块或冰水(可能加重组织损伤)
          - 不要刺破水泡
          - 不要在伤口上涂抹药膏,黄油等物质
          - 用干净的纱布轻轻覆盖伤口,
        '立即拨打120急救电话',
        '如果患者出现休克症状，使其平躺并抬高腿部',
        '防止患者体温过低'
      ],
      severity: 'medium',
      responseTime: '30分钟内'
    },
    {
      id: 'fracture',
      title: '骨折',
      description: '骨骼断裂或裂纹，需要固定以防止进一步损伤。',
      symptoms: [
        '受伤部位剧烈疼痛',
        '肿胀和淤青',
        '畸形或异常活动',
        '无法负重或使用受伤部位',
        '骨骼可能穿透皮肤（开放性骨折）'
      ],
      firstAid: [
        '不要尝试复位骨折',
        '用夹板固定受伤部位（木板、杂志等）',
        '固定范围应包括骨折部位上下的关节',
        '对于开放性骨折，用干净的敷料覆盖伤口',
        '抬高受伤部位，减轻肿胀',
        '如果疼痛严重，可考虑服用止痛药（如布洛芬）',
        '及时就医'
      ],
      severity: 'medium',
      responseTime: '尽快'
    }
  ];

  // 急救联系信息
  const emergencyContacts = [
    { name: '急救中心', number: '120', description: '全国统一急救电话' },
    { name: '报警电话', number: '110', description: '紧急情况下的报警电话' },
    { name: '消防电话', number: '119', description: '火灾及紧急救援' },
    { name: '交通事故', number: '122', description: '交通事故报警' }
  ];

  return (
    <div className="emergency-guide-page">
      <Card className="card">
        <Title level={2} className="card-title">
          <AlertOutlined style={{ marginRight: 8 }} />紧急情况指南
        </Title>
        <Paragraph>
          以下是常见紧急医疗情况的处理指南。请注意，这些信息仅供参考，在紧急情况下，
          请始终优先拨打120急救电话，并在专业医护人员到达前采取必要的急救措施。
        </Paragraph>

        {/* 紧急联系电话 */}
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>紧急联系电话</Title>
          <div className="emergency-contacts">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} hoverable className="contact-card" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong>{contact.name}</Text>
                    <Paragraph type="secondary" style={{ margin: 4 }}>
                      {contact.description}
                    </Paragraph>
                  </div>
                  <Button 
                    type="primary" 
                    danger 
                    icon={<PhoneOutlined />}
                    style={{ fontSize: '1.2rem' }}
                  >
                    {contact.number}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 紧急情况列表 */}
        <Title level={4}>常见紧急情况</Title>
        <List
          dataSource={emergencyCases}
          renderItem={(emergency) => (
            <List.Item>
              <Card 
                hoverable 
                onClick={() => setSelectedEmergency(emergency)}
                style={{ 
                  width: '100%', 
                  cursor: 'pointer',
                  borderLeft: `4px solid ${emergency.severity === 'high' ? '#ff4d4f' : '#faad14'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong style={{ fontSize: '1.1rem' }}>{emergency.title}</Text>
                    <Paragraph type="secondary" ellipsis={{ rows: 1 }} style={{ margin: '4px 0 0 0' }}>
                      {emergency.description}
                    </Paragraph>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Tag 
                      color={emergency.severity === 'high' ? 'red' : 'orange'} 
                      icon={<ClockCircleOutlined />}
                    >
                      {emergency.responseTime}
                    </Tag>
                    <Tag color={emergency.severity === 'high' ? 'red' : 'orange'}>
                      {emergency.severity === 'high' ? '高危' : '中危'}
                    </Tag>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Card>

      {/* 选中的紧急情况详情 */}
      {selectedEmergency && (
        <Card className="card" style={{ marginTop: 16 }}>
          <Title level={3}>{selectedEmergency.title}</Title>
          
          <Collapse defaultActiveKey={['symptoms', 'firstAid']}>
            <Panel header="症状表现" key="symptoms">
              <List
                dataSource={selectedEmergency.symptoms}
                renderItem={symptom => (
                  <List.Item>
                    <Tag color="blue" style={{ marginRight: 8 }}>•</Tag>
                    {symptom}
                  </List.Item>
                )}
              />
            </Panel>
            
            <Panel header="急救措施" key="firstAid">
              <List
                dataSource={selectedEmergency.firstAid}
                renderItem={(aid, index) => (
                  <List.Item>
                    <Tag color="green" style={{ marginRight: 8 }}>{index + 1}</Tag>
                    <div dangerouslySetInnerHTML={{ __html: aid.replace(/\n\s*/g, '<br>') }} />
                  </List.Item>
                )}
              />
            </Panel>
          </Collapse>
          
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Button 
              type="primary" 
              danger 
              size="large"
              icon={<PhoneOutlined />}
            >
              立即拨打 120
            </Button>
          </div>
          
          <Button 
            type="text" 
            onClick={() => setSelectedEmergency(null)}
            style={{ marginTop: 8 }}
          >
            返回列表
          </Button>
        </Card>
      )}

      <Alert 
        message="重要提醒" 
        description="在任何紧急医疗情况下，时间都是关键。请不要犹豫，立即拨打急救电话。本指南不能替代专业医疗救助。" 
        type="error" 
        showIcon 
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default EmergencyGuidePage;