// src/pages/AboutPage.js (서비스 소개)
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="info-page">
      <button className="back-button-about" onClick={() => navigate('/')}>
        ←
      </button>

      <h1>🚀 서비스 소개</h1>

      <section>
        <h2>기능 소개</h2>
        <ul className="feature-list">
          <li>✔️ 장애물 인식 경로 탐색</li>
          <li>✔️ 실시간 시설물 제보 시스템</li>
          <li>✔️ 맞춤형 이동 경로 제공</li>
        </ul>
      </section>
      
      <section>
        <h2>개발 팀 소개</h2>
        <div className="team-grid">
          <div className="member-card">
            <h3>프론트엔드 개발</h3>
            <p>황혁준</p>
            <p>조태석</p>
          </div>
          <div className="member-card">
            <h3>백엔드 개발</h3>
            <p>안현진</p>
            <p>김경헌</p>
            <p>김진우</p>
            <p>강범석</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;