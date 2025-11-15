import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Result } from 'antd';

const { Title } = Typography;

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-page">
      <Card className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <Result
          status="404"
          title="404"
          subTitle="抱歉，您访问的页面不存在"
          extra={
            <Button type="primary" onClick={handleGoHome} size="large">
              返回首页
            </Button>
          }
        />
        
        <Title level={5} style={{ marginTop: 24 }}>可能的原因：</Title>
        <ul style={{ listStyleType: 'none', padding: 0, marginTop: 16 }}>
          <li>• 页面地址输入错误</li>
          <li>• 该页面可能已被移除</li>
          <li>• 链接已过期</li>
        </ul>
        
        <div style={{ marginTop: 24 }}>
          <Button 
            type="primary" 
            ghost 
            onClick={() => navigate('/symptom-check')}
            style={{ marginRight: 16 }}
          >
            症状自查
          </Button>
          <Button 
            type="primary" 
            ghost 
            onClick={() => navigate('/chat')}
          >
            AI健康咨询
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;