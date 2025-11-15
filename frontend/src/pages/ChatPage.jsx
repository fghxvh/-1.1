import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Typography, Card, Alert, Spin, message } from 'antd';
import axios from 'axios';

const { Text } = Typography;
const { TextArea } = Input;

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: '您好！我是医疗健康助手，请问有什么可以帮助您的健康问题？请描述您的症状或健康咨询。'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmergencyDetected, setIsEmergencyDetected] = useState(false);
  const messagesEndRef = useRef(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim()
    };

    // 添加用户消息到对话历史
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 发送消息到后端API
      const response = await axios.post('/api/ai/chat', {
        message: inputMessage.trim(),
        history: messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      });

      // 添加AI回复到对话历史
      setMessages(prev => [...prev, {
        role: 'ai',
        content: response.data.response
      }]);

      // 检查是否有紧急情况
      if (response.data.emergencyDetected) {
        setIsEmergencyDetected(true);
        message.warning('系统检测到可能的紧急医疗情况，请立即就医！');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: '抱歉，我的服务暂时出现问题，请稍后再试。'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理按键事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 清除对话历史
  const handleClearChat = () => {
    setMessages([
      {
        role: 'ai',
        content: '您好！我是医疗健康助手，请问有什么可以帮助您的健康问题？'
      }
    ]);
    setIsEmergencyDetected(false);
  };

  // 获取健康建议
  const handleGetHealthAdvice = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/ai/health-advice', {
        symptoms: messages.filter(m => m.role === 'user').map(m => m.content).join('\n')
      });
      
      setMessages(prev => [...prev, {
        role: 'ai',
        content: response.data.advice
      }]);
    } catch (error) {
      console.error('获取健康建议失败:', error);
      message.error('获取健康建议失败，请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <Card className="chat-container">
        <Typography.Title level={4} className="card-title">AI健康咨询</Typography.Title>
        
        {isEmergencyDetected && (
          <Alert 
            message="紧急警告" 
            description="系统检测到您描述的症状可能需要紧急医疗处理，请立即前往最近的医院就诊或拨打120急救电话。" 
            type="error" 
            showIcon 
            closable 
            onClose={() => setIsEmergencyDetected(false)}
            style={{ marginBottom: 16 }}
          />
        )}

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <Text>{msg.content}</Text>
            </div>
          ))}
          {isLoading && (
            <div className="message ai-message">
              <Spin size="small" />
              <Text>正在思考...</Text>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <TextArea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="请输入您的问题或描述您的症状..."
            rows={3}
            className="chat-input"
            disabled={isLoading}
          />
          <div className="chat-actions">
            <Button 
              type="primary" 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
            >
              发送
            </Button>
            <Button 
              onClick={handleClearChat}
              style={{ marginTop: 8 }}
              disabled={isLoading}
            >
              清除对话
            </Button>
            <Button 
              type="primary" 
              ghost
              onClick={handleGetHealthAdvice}
              style={{ marginTop: 8 }}
              disabled={isLoading || messages.filter(m => m.role === 'user').length === 0}
            >
              获取健康建议
            </Button>
          </div>
        </div>
      </Card>

      <Alert 
        message="使用提示" 
        description="请尽可能详细地描述您的症状，包括症状出现的时间、频率、严重程度等信息，以便我能提供更准确的建议。" 
        type="info" 
        showIcon 
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default ChatPage;