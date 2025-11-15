import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Input, Tag, Select, Row, Col, Alert } from 'antd';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const SymptomCheckPage = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [bodyPart, setBodyPart] = useState('');
  const [bodyParts, setBodyParts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 加载症状数据
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await axios.get('/api/symptoms');
        setSymptoms(response.data);
        setFilteredSymptoms(response.data);
        
        // 提取所有身体部位
        const uniqueBodyParts = [...new Set(response.data.map(s => s.bodyPart))];
        setBodyParts(uniqueBodyParts);
      } catch (error) {
        console.error('获取症状数据失败:', error);
      }
    };
    fetchSymptoms();
  }, []);

  // 搜索症状
  useEffect(() => {
    let filtered = symptoms;
    
    if (searchTerm) {
      filtered = filtered.filter(symptom => 
        symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        symptom.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (bodyPart) {
      filtered = filtered.filter(symptom => symptom.bodyPart === bodyPart);
    }
    
    setFilteredSymptoms(filtered);
  }, [searchTerm, bodyPart, symptoms]);

  // 选择/取消选择症状
  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => {
      const isSelected = prev.some(s => s._id === symptom._id);
      if (isSelected) {
        return prev.filter(s => s._id !== symptom._id);
      } else {
        return [...prev, symptom];
      }
    });
  };

  // 清除已选症状
  const clearSelectedSymptoms = () => {
    setSelectedSymptoms([]);
  };

  // 提交症状进行诊断
  const handleSubmitDiagnosis = async () => {
    if (selectedSymptoms.length === 0) {
      Alert.error('请至少选择一个症状');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/diseases/diagnose', {
        symptomIds: selectedSymptoms.map(s => s._id)
      });

      // 将诊断结果存储在sessionStorage中，然后跳转到结果页面
      sessionStorage.setItem('diagnosisResult', JSON.stringify(response.data));
      navigate('/diagnosis-result');
    } catch (error) {
      console.error('诊断请求失败:', error);
      Alert.error('诊断过程中出现错误，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="symptom-check-page">
      <Card className="card">
        <Title level={2} className="card-title">症状自查</Title>
        <Paragraph>
          请从下方选择您当前正在经历的症状，您可以选择多个症状以获得更准确的分析结果。
        </Paragraph>

        {/* 已选症状显示 */}
        {selectedSymptoms.length > 0 && (
          <div className="selected-symptoms">
            <Title level={5}>已选症状 ({selectedSymptoms.length}):</Title>
            <div>
              {selectedSymptoms.map(symptom => (
                <Tag 
                  key={symptom._id} 
                  closable 
                  onClose={() => toggleSymptom(symptom)}
                  color="blue"
                  className="symptom-tag selected"
                >
                  {symptom.name}
                </Tag>
              ))}
              <Button 
                type="text" 
                danger 
                onClick={clearSelectedSymptoms}
                style={{ marginLeft: 16 }}
              >
                清除全部
              </Button>
            </div>
          </div>
        )}

        {/* 筛选条件 */}
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col xs={24} md={12}>
            <Search
              placeholder="搜索症状名称或描述"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={12}>
            <Select
              placeholder="选择身体部位"
              style={{ width: '100%' }}
              value={bodyPart}
              onChange={setBodyPart}
              allowClear
            >
              {bodyParts.map(part => (
                <Option key={part} value={part}>{part}</Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* 症状列表 */}
        <div className="symptoms-container" style={{ marginTop: 24 }}>
          {filteredSymptoms.length > 0 ? (
            filteredSymptoms.map(symptom => (
              <Card 
                key={symptom._id} 
                hoverable 
                onClick={() => toggleSymptom(symptom)}
                className={`symptom-card ${selectedSymptoms.some(s => s._id === symptom._id) ? 'selected' : ''}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedSymptoms.some(s => s._id === symptom._id) ? '#e6f7ff' : 'white',
                  border: selectedSymptoms.some(s => s._id === symptom._id) ? '1px solid #1890ff' : '1px solid #e8e8e8'
                }}
              >
                <Title level={5}>{symptom.name}</Title>
                <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                  {symptom.description}
                </Paragraph>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag color="green">{symptom.bodyPart}</Tag>
                  {selectedSymptoms.some(s => s._id === symptom._id) && (
                    <Tag color="blue">已选择</Tag>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Alert 
              message="未找到匹配的症状" 
              description="请尝试其他搜索条件或身体部位" 
              type="info" 
              showIcon 
            />
          )}
        </div>

        {/* 提交按钮 */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={handleSubmitDiagnosis}
            disabled={selectedSymptoms.length === 0 || isLoading}
            loading={isLoading}
          >
            {isLoading ? '正在分析...' : '提交分析'}
          </Button>
        </div>
      </Card>

      <Alert 
        message="使用提示" 
        description="症状自查结果仅供参考，不能替代专业医生的诊断。如有严重症状，请及时就医。" 
        type="warning" 
        showIcon 
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default SymptomCheckPage;