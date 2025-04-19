// src/pages/SuggestPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './SuggestPage.css'; // 별도 CSS 파일 생성 필요

const SuggestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    photos: [],
    contact: ''
  });

  const [submitted, setSubmitted] = useState(false);

  // SearchScreen에서 전달된 주소를 반영
  useEffect(() => {
    if (location.state?.selectedAddress) {
      setFormData((prev) => ({
        ...prev,
        location: location.state.selectedAddress
      }));
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      alert('제목, 설명, 유형은 필수 입력입니다.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/analyze', {
        title: formData.title,
        content: formData.description, // content로 보냄
        category: formData.category,
        location: formData.location || null
      });

      console.log('전처리 결과:', response.data.keywords);
      setSubmitted(true);

      // 입력 초기화
      setFormData({
        title: '',
        category: '',
        location: '',
        description: '',
        photos: [],
        contact: ''
      });

      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('건의 제출 중 오류:', error); // 원래 있던 줄
      console.error('응답 상태 코드:', error.response?.status); // 추가
      console.error('응답 데이터:', error.response?.data);     // 추가
      alert('건의 제출에 실패했습니다.');
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setFormData({ ...formData, photos: [...formData.photos, ...previews] });
  };

  return (
    <div className="suggest-container">
      <button className="back-button-suggest" onClick={() => navigate('/')}>
        ←
      </button>

      <div className="suggest-header">
        <h1>📢 시설물 파손 건의</h1>
        <p>발견하신 시설물 문제를 신속하게 해결할 수 있도록 도와주세요</p>
      </div>

      <form onSubmit={handleSubmit} className="suggest-form">
        {/* 제목 입력 */}
        <div className="form-section">
          <label>제목 (필수)</label>
          <input
            type="text"
            placeholder="예) ○○아파트 1동 엘리베이터 파손"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        {/* 유형 선택 */}
        <div className="form-section">
          <label>유형 선택 (필수)</label>
          <div className="category-grid">
            {['엘리베이터', '계단', '도로', '조명', '난간', '기타'].map((cat) => (
              <button
                type="button"
                key={cat}
                className={`category-btn ${formData.category === cat ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, category: cat })}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 위치 입력 */}
        <div className="form-section">
          <label>위치 정보 (선택)</label>
          <div className="location-input">
            <input
              type="text"
              placeholder="주소 또는 건물명 검색"
              value={formData.location}
              readOnly
              onClick={() => navigate('/search', { state: { fromSuggestPage: true } })}
            />
            <button
              type="button"
              className="map-btn"
              //onClick={() => alert('맵에서 지정 기능은 추후 구현됩니다')}
            >
              🗺️ 지도에서 위치 지정
            </button>
          </div>
        </div>

        {/* 상세 설명 */}
        <div className="form-section">
          <label>상세 설명 (필수)</label>
          <textarea
            placeholder="파손 정도, 발생 시간대, 위험성 등 자세히 설명해주세요"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="5"
            required
          />
        </div>

        {/* 사진 업로드 */}
        <div className="form-section">
          <label>사진 첨부 (최대 5장)</label>
          <div className="photo-upload">
            <label className="upload-btn">
              📸 사진 추가
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
            <div className="photo-preview">
              {formData.photos.map((preview, index) => (
                <img key={index} src={preview} alt={`미리보기-${index}`} />
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          건의 제출하기
        </button>

        {submitted && (
          <div className="success-message">
            ✅ 건의사항이 성공적으로 제출되었습니다
          </div>
        )}
      </form>
    </div>
  );
};

export default SuggestPage;