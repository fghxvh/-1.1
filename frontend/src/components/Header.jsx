import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span role="img" aria-label="医疗助手">🏥</span>
          <span>医疗健康助手</span>
        </div>
        
        <nav className="nav-menu">
          <Link to="/" className="nav-item">首页</Link>
          <Link to="/chat" className="nav-item">AI对话</Link>
          <Link to="/symptom-check" className="nav-item">症状自查</Link>
          <Link to="/emergency" className="nav-item">紧急指南</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;