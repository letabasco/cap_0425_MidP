// src/pages/SupportPage.js (고객센터)
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SupportPage.css';

const SupportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const faqList = [
    { question: '경로 검색 방법은?', answer: '출발지와 도착지를 선택하면...' },
    { question: '제보는 어떻게 하나요?', answer: '건의함 메뉴에서...' }
  ];

  return (
    <div className="info-page">
      <button className="back-button-support" onClick={() => navigate('/')}>
        ←
      </button>

      <h1>📞 고객센터</h1>
      
      <section>
        <h2>자주 묻는 질문</h2>
        <div className="faq-list">
          {faqList.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="question">Q. {faq.question}</div>
              <div className="answer">A. {faq.answer}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>1:1 문의</h2>
        <form className="inquiry-form">
          <input type="text" placeholder="문의 종류" required />
          <textarea placeholder="문의 내용" rows="5" required />
          <button type="submit">문의 보내기</button>
        </form>
      </section>
    </div>
  );
};

export default SupportPage;