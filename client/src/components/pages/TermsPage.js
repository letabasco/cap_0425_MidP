// src/pages/TermsPage.js (설명문)
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TermsPage.css';

const TermsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="info-page">
      <button className="back-button-terms" onClick={() => navigate('/')}>
        ←
      </button>

      <h1>📜 이용 약관</h1>

      <section className="terms-section">
        <h2>제1조 (목적)</h2>
        <p>본 약관은 ...</p>
      </section>
      
      <section className="terms-section">
        <h2>개인정보 처리방침</h2>
        <p>수집하는 개인정보 항목: ...</p>
      </section>
    </div>
  );
};

export default TermsPage;