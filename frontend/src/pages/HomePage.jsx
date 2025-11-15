import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Typography, Row, Col, Statistic, Alert } from 'antd';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const [tipOfTheDay, setTipOfTheDay] = useState('');
  
  useEffect(() => {
    // 加载每日健康小贴士
    const tips = [
      '保持充足的水分摄入，每天建议饮用8杯水。',
      '定期进行体育锻炼，每周至少150分钟中等强度运动。',
      '保证良好的睡眠质量，成人每晚应睡7-9小时。',
      '均衡饮食，多摄入蔬菜水果，减少加工食品摄入。',
      '定期体检，及早发现和预防潜在健康问题。'
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTipOfTheDay(randomTip);
  }, []);

  return (
    <div className="home-page">
      {/* 欢迎部分 */}
      <div className="card welcome-section">
        <Title level={2} className="card-title">欢迎使用医疗健康助手</Title>
        <Paragraph>
          医疗健康助手是一款集成了人工智能技术的健康咨询平台，
          旨在为您提供便捷、准确的健康信息和初步的症状分析。
        </Paragraph>
        <Alert 
          message="健康小贴士" 
          description={tipOfTheDay} 
          type="info" 
          showIcon 
          style={{ marginTop: 16 }}
        />
      </div>

      {/* 功能卡片 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12} lg={8}>
          <Card hoverable className="feature-card">
            <div className="feature-icon">
              <span role="img" aria-label="AI对话" style={{ fontSize: '3rem' }}>💬</span>
            </div>
            <Title level={4}>AI对话咨询</Title>
            <Paragraph>
              与医疗AI助手进行自然语言交流，获取健康建议和医疗知识解答。
            </Paragraph>
            <Button type="primary" size="large" block>
              <Link to="/chat" style={{ color: 'white' }}>开始对话</Link>
            </Button>
          </Card>
        </Col>
        
        <Col xs={24} md={12} lg={8}>
          <Card hoverable className="feature-card">
            <div className="feature-icon">
              <span role="img" aria-label="症状自查" style={{ fontSize: '3rem' }}>🔍</span>
            </div>
            <Title level={4}>症状自查分析</Title>
            <Paragraph>
              通过选择您的症状，获取可能的疾病信息和初步分析结果。
            </Paragraph>
            <Button type="primary" size="large" block>
              <Link to="/symptom-check" style={{ color: 'white' }}>开始自查</Link>
            </Button>
          </Card>
        </Col>
        
        <Col xs={24} md={12} lg={8}>
          <Card hoverable className="feature-card">
            <div className="feature-icon">
              <span role="img" aria-label="紧急指南" style={{ fontSize: '3rem' }}>⚠️</span>
            </div>
            <Title level={4}>紧急情况指南</Title>
            <Paragraph>
              了解常见紧急医疗情况的处理方法和急救知识。
            </Paragraph>
            <Button type="primary" size="large" block>
              <Link to="/emergency" style={{ color: 'white' }}>查看指南</Link>
            </Button>
          </Card>
        </Col>
      </Row>

      {/* 统计信息 */}
      <div className="card statistics-section" style={{ marginTop: 24 }}>
        <Title level={4} className="card-title">系统数据统计</Title>
        <Row gutter={[16, 16]}>
          <Col xs={12} lg={6}>
            <Statistic title="疾病数据库" value={2000} suffix="条" />
          </Col>
          <Col xs={12} lg={6}>
            <Statistic title="症状数据库" value={2000} suffix="条" />
          </Col>
          <Col xs={12} lg={6}>
            <Statistic title="AI准确率" value={95} suffix="%" />
          </Col>
          <Col xs={12} lg={6}>
            <Statistic title="响应速度" value={1} suffix="秒" />
          </Col>
        </Row>
      </div>

      {/* 免责声明 */}
      <Alert 
        message="重要提示" 
        description="本平台提供的信息仅供参考，不能替代专业医生的诊断和治疗。如有严重症状，请及时就医。" 
        type="warning" 
        showIcon 
        style={{ marginTop: 24 }}
      />
    </div>
  );
};

export default HomePage;