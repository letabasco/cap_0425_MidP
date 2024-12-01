import React, { useState } from 'react';
import './SearchScreen.css';

// 장소 검색 화면을 담당하는 컴포넌트
// 사용자가 장소나 주소를 검색하고 결과를 표시하는 기능 제공

const SearchScreen = ({ onClose, onNavigate }) => {
  const [searchText, setSearchText] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [searchResults, setSearchResults] = useState([]);

  // 실제 API 검색 함수 (추후 구현)
  const handleSearch = async (text) => {
    try {
      // API 호출 로직이 들어갈 자리
      // setSearchResults(apiResponse.data); // API 응답으로 결과 설정
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="search-screen">
      <div className="search-header">
        <button className="back-button" onClick={onClose}>
          ←
        </button>
        <div className="search-input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="장소, 주소 검색"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              handleSearch(e.target.value);
            }}
            autoFocus
          />
          <span className="voice-icon">🎤</span>
        </div>
      </div>

      <div className="search-results">
        {searchResults.map((result) => (
          <div key={result.id} className="result-item">
            <div className="result-info">
              <h3 className="result-name">{result.name}</h3>
              <p className="result-address">{result.address}</p>
            </div>
            <button 
              className="find-route-button"
              onClick={() => onNavigate(result)}
            >
              길찾기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchScreen; 