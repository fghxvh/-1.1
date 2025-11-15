import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Tag, List, Alert, Row, Col, Statistic } from 'antd';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;

const DiagnosisResultPage = () => {
  const navigate = useNavigate();
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [healthAdvice, setHealthAdvice] = useState('');

  // 从sessionStorage获取诊断结果
  useEffect(() => {
    const result = sessionStorage.getItem('diagnosisResult');
    if (result) {
      setDiagnosisResult(JSON.parse(result));
    } else {
      // 如果没有诊断结果，重定向到症状自查页面
      navigate('/symptom-check');
    }
  }, [navigate]);

  // 获取健康建议
  const fetchHealthAdvice = async () => {
    if (!diagnosisResult) return;

    setIsLoading(true);
    try {
      const response = await axios.post('/api/ai/health-advice', {
        symptoms: diagnosisResult.symptoms.map(s => s.name).join(', '),
        possibleDiseases: diagnosisResult.possibleDiseases.map(d => d.name).join(', ')
      });
      setHealthAdvice(response.data.advice);
    } catch (error) {
      console.error('获取健康建议失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理疾病详情点击
  const handleDiseaseClick = (diseaseId) => {
    navigate(`/disease/${diseaseId}`);
  };

  // 重新进行症状自查
  const handleRestartCheck = () => {
    sessionStorage.removeItem('diagnosisResult');
    navigate('/symptom-check');
  };

  // 前往AI对话
  const handleGoToChat = () => {
    navigate('/chat');
  };

  if (!diagnosisResult) {
    return (
      <Card className="card">
        <Alert 
          message="没有找到诊断结果" 
          description="请先进行症状自查" 
          type="info" 
          showIcon 
        />
        <Button 
          type="primary" 
          onClick={handleRestartCheck}
          style={{ marginTop: 16 }}
        >
          返回症状自查
        </Button>
      </Card>
    );
  }

  return (
    <div className="diagnosis-result-page">
      <Card className="card">
        <Title level={2} className="card-title">诊断结果分析</Title>
        
        {/* 已选症状 */}
        <div className="selected-symptoms-section">
          <Title level={4}>您选择的症状</Title>
          <div>
            {diagnosisResult.symptoms.map(symptom => (
              <Tag key={symptom._id} color="blue" style={{ marginRight: 8, marginBottom: 8 }}>
                {symptom.name}
              </Tag>
            ))}
          </div>
        </div>

        {/* 诊断结果统计 */}
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col xs={24} md={8}>
            <Statistic title="可能的疾病" value={diagnosisResult.possibleDiseases.length} />
          </Col>
          <Col xs={24} md={8}>
            <Statistic title="最高匹配率" value={diagnosisResult.possibleDiseases[0]?.matchRate || 0} suffix="%" precision={1} />
          </Col>
          <Col xs={24} md={8}>
            <Statistic title="分析时间" value={diagnosisResult.analysisTime} suffix="秒" precision={1} />
          </Col>
        </Row>

        {/* 可能的疾病列表 */}
        <div className="possible-diseases-section" style={{ marginTop: 24 }}>
          <Title level={4}>可能的疾病（按匹配度排序）</Title>
          <List
            dataSource={diagnosisResult.possibleDiseases}
            renderItem={(disease) => (
              <List.Item>
                <Card 
                  hoverable 
                  className="disease-card"
                  onClick={() => handleDiseaseClick(disease._id)}
                  style={{ width: '100%', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={5} style={{ margin: 0 }}>{disease.name}</Title>
                    <Tag color="red" className="match-rate">
                      匹配率: {disease.matchRate.toFixed(1)}%
                    </Tag>
                  </div>
                  <Paragraph ellipsis={{ rows: 2 }}>
                    {disease.description}
                  </Paragraph>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <Tag color="green">{disease.bodyPart}</Tag>
                    {disease.severity && <Tag color={disease.severity === 'high' ? 'red' : 'orange'}>{disease.severity}</Tag>}
                    {disease.contagious && <Tag color="purple">传染性</Tag>}
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>

        {/* 健康建议 */}
        <div className="health-advice-section" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4}>健康建议</Title>
            <Button 
              type="primary" 
              onClick={fetchHealthAdvice}
              loading={isLoading}
              disabled={healthAdvice || isLoading}
            >
              {isLoading ? '获取中...' : '获取个性化建议'}
            </Button>
          </div>
          
          {healthAdvice ? (
            <Card className="diagnosis-result">
              <Paragraph>{healthAdvice}</Paragraph>
            </Card>
          ) : (
            <Alert 
              message="提示" 
              description="点击按钮获取针对您症状的个性化健康建议" 
              type="info" 
              showIcon 
            />
          )}
        </div>

        {/* 操作按钮 */}
        <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={handleRestartCheck}
          >
            重新进行症状自查
          </Button>
          <Button 
            type="primary" 
            ghost 
            size="large" 
            onClick={handleGoToChat}
          >
            咨询AI健康助手
          </Button>
        </div>
      </Card>

      <Alert 
        message="重要提示" 
        description="本诊断结果仅作为参考，不能替代专业医生的诊断。如有严重症状，请尽快就医。" 
        type="warning" 
        showIcon 
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default DiagnosisResultPage;