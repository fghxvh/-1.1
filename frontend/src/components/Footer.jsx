import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">关于我们</h3>
          <ul className="footer-links">
            <li><Link to="/about">团队介绍</Link></li>
            <li><Link to="/mission">我们的使命</Link></li>
            <li><Link to="/contact">联系方式</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">使用指南</h3>
          <ul className="footer-links">
            <li><Link to="/guide/chat">AI对话使用</Link></li>
            <li><Link to="/guide/symptom">症状自查方法</Link></li>
            <li><Link to="/guide/emergency">紧急情况处理</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">免责声明</h3>
          <ul className="footer-links">
            <li><Link to="/disclaimer">医疗免责</Link></li>
            <li><Link to="/privacy">隐私政策</Link></li>
            <li><Link to="/terms">使用条款</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="copyright">
        <p>© 2024 医疗健康助手 | 本服务不能替代专业医疗诊断</p>
        <p>如有紧急医疗情况，请立即拨打 120 急救电话</p>
      </div>
    </footer>
  );
};

export default Footer;