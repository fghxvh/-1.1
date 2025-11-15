import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import SymptomCheckPage from './pages/SymptomCheckPage';
import DiagnosisResultPage from './pages/DiagnosisResultPage';
import DiseaseInfoPage from './pages/DiseaseInfoPage';
import EmergencyGuidePage from './pages/EmergencyGuidePage';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="container">
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/symptom-check" element={<SymptomCheckPage />} />
            <Route path="/diagnosis-result" element={<DiagnosisResultPage />} />
            <Route path="/disease/:id" element={<DiseaseInfoPage />} />
            <Route path="/emergency" element={<EmergencyGuidePage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;