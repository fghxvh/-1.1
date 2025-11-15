import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Tag, Descriptions, Collapse, Alert, List } from 'antd';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const DiseaseInfoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disease, setDisease] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedDiseases, setRelatedDiseases] = useState([]);

  useEffect(() => {
    const fetchDiseaseInfo = async () => {
      try {
        // 获取疾病详情
        const diseaseResponse = await axios.get(`/api/diseases/${id}`);
        setDisease(diseaseResponse.data);

        // 获取相关疾病
        if (diseaseResponse.data.relatedDiseases && diseaseResponse.data.relatedDiseases.length > 0) {
          const relatedResponse = await axios.post('/api/diseases/batch', {
            ids: diseaseResponse.data.relatedDiseases
          });
          setRelatedDiseases(relatedResponse.data);
        }
      } catch (error) {
        console.error('获取疾病信息失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiseaseInfo();
  }, [id]);

  // 返回上一页
  const handleGoBack = () => {
    navigate(-1);
  };

  // 前往AI咨询
  const handleConsultAI = () => {
    // 存储当前疾病信息，方便在聊天页面使用
    sessionStorage.setItem('currentDisease', JSON.stringify(disease));
    navigate('/chat');
  };

  if (isLoading) {
    return (
      <Card className="card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text>加载中...</Text>
        </div>
      </Card>
    );
  }

  if (!disease) {
    return (
      <Card className="card">
        <Alert 
          message="未找到疾病信息" 
          description="请检查疾病ID是否正确" 
          type="error" 
          showIcon 
        />
        <Button 
          type="primary" 
          onClick={handleGoBack}
          style={{ marginTop: 16 }}
        >
          返回
        </Button>
      </Card>
    );
  }

  return (
    <div className="disease-info-page">
      <Card className="card">
        {/* 疾病基本信息 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <Title level={2} className="card-title">{disease.name}</Title>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              <Tag color="green">{disease.bodyPart}</Tag>
              {disease.severity && <Tag color={disease.severity === 'high' ? 'red' : disease.severity === 'medium' ? 'orange' : 'green'}>
                {disease.severity === 'high' ? '严重' : disease.severity === 'medium' ? '中等' : '轻微'}
              </Tag>}
              {disease.contagious ? <Tag color="purple">具有传染性</Tag> : <Tag color="blue">非传染性</Tag>}
              {disease.chronic ? <Tag color="orange">慢性病</Tag> : <Tag color="green">急性病</Tag>}
            </div>
          </div>
          <div>
            <Button type="primary" onClick={handleGoBack} style={{ marginRight: 8 }}>
              返回
            </Button>
            <Button type="primary" danger onClick={handleConsultAI}>
              咨询AI助手
            </Button>
          </div>
        </div>

        {/* 疾病描述 */}
        <Descriptions column={1} bordered>
          <Descriptions.Item label="疾病描述">
            <Paragraph>{disease.description}</Paragraph>
          </Descriptions.Item>
        </Descriptions>

        {/* 详细信息折叠面板 */}
        <Collapse defaultActiveKey={['1']} style={{ marginTop: 24 }}>
          <Panel header="症状信息" key="1">
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>早期症状</Title>
              <List
                dataSource={disease.earlySymptoms || []}
                renderItem={symptom => (
                  <List.Item>
                    <Tag color="blue" style={{ marginRight: 8 }}>•</Tag>
                    {symptom}
                  </List.Item>
                )}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>主要症状</Title>
              <List
                dataSource={disease.symptoms || []}
                renderItem={symptom => (
                  <List.Item>
                    <Tag color="red" style={{ marginRight: 8 }}>•</Tag>
                    {symptom}
                  </List.Item>
                )}
              />
            </div>
            <div>
              <Title level={5}>晚期症状</Title>
              <List
                dataSource={disease.lateSymptoms || []}
                renderItem={symptom => (
                  <List.Item>
                    <Tag color="orange" style={{ marginRight: 8 }}>•</Tag>
                    {symptom}
                  </List.Item>
                )}
              />
            </div>
          </Panel>

          <Panel header="疾病详情" key="2">
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>易发人群</Title>
              <Paragraph>{disease.targetPopulation || '无特定易发人群'}</Paragraph>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>发病原因</Title>
              <Paragraph>{disease.causes || '尚未明确'}</Paragraph>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>并发症</Title>
              <List
                dataSource={disease.complications || []}
                renderItem={complication => (
                  <List.Item>
                    <Tag color="purple" style={{ marginRight: 8 }}>•</Tag>
                    {complication}
                  </List.Item>
                )}
              />
            </div>
            <div>
              <Title level={5}>预防措施</Title>
              <List
                dataSource={disease.preventionMeasures || []}
                renderItem={measure => (
                  <List.Item>
                    <Tag color="green" style={{ marginRight: 8 }}>•</Tag>
                    {measure}
                  </List.Item>
                )}
              />
            </div>
          </Panel>

          <Panel header="治疗信息" key="3">
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>治疗方法</Title>
              <Paragraph>{disease.treatmentMethods || '暂无详细治疗信息'}</Paragraph>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>药物治疗</Title>
              <List
                dataSource={disease.medications || []}
                renderItem={medication => (
                  <List.Item>
                    <Tag color="blue" style={{ marginRight: 8 }}>•</Tag>
                    {medication}
                  </List.Item>
                )}
              />
            </div>
            <div>
              <Title level={5}>康复建议</Title>
              <Paragraph>{disease.recoveryAdvice || '遵循医生建议进行康复'}</Paragraph>
            </div>
          </Panel>
        </Collapse>

        {/* 相关疾病 */}
        {relatedDiseases.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={4}>相关疾病</Title>
            <div className="related-diseases">
              {relatedDiseases.map(relatedDisease => (
                <Card 
                  key={relatedDisease._id} 
                  hoverable 
                  style={{ marginBottom: 8, cursor: 'pointer' }}
                  onClick={() => navigate(`/disease/${relatedDisease._id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>{relatedDisease.name}</Text>
                    <Tag color="green">{relatedDisease.bodyPart}</Tag>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Alert 
        message="重要提示" 
        description="本页面信息仅供参考，具体诊断和治疗方案请咨询专业医生。" 
        type="warning" 
        showIcon 
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default DiseaseInfoPage;