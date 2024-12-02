import React, { useState } from 'react';
import MapComponent from './MapComponent';
import SearchScreen from '../search/SearchScreen';
import './Map.css';

const Map = ({ selectedMode, isSearchOpen, setIsSearchOpen, onNavigate }) => {
  const [activeFilters, setActiveFilters] = useState([]);

  const handleNavigate = (destination) => {
    onNavigate(destination);
  };

  const handleFilterClick = (filterText) => {
    setActiveFilters(prev => {
      if (prev.includes(filterText)) {
        return prev.filter(f => f !== filterText);
      } else {
        return [...prev, filterText];
      }
    });
  };

  const filterButtons = {
    '일반': [
      { icon: '🏗️', text: '공사현장' },
      { icon: '🏪', text: '편의점' },
      { icon: '🚒', text: '소방시설' },
      { icon: '👮', text: '경찰서' },
      { icon: '⚠️', text: '범죄주의구간' },
    ],
    '여성': [
      { icon: '🚨', text: '안전비상벨' },
      { icon: '📹', text: 'CCTV' },
      { icon: '⚠️', text: '범죄주의구간' },
      { icon: '🏪', text: '편의점' },
      { icon: '🚒', text: '소방시설' },
      { icon: '👮', text: '경찰서' },
      { icon: '🏗️', text: '공사현장' },
    ],
    '노약자': [
      { icon: '🚇', text: '지하철역 엘레베이터' },
      { icon: '💊', text: '심야약국' },
      { icon: '🔌', text: '휠체어 충전소' },
      { icon: '🏥', text: '복지시설' },
      { icon: '⚠️', text: '범죄주의구간' },
      { icon: '🏪', text: '편의점' },
      { icon: '🚒', text: '소방시설' },
      { icon: '👮', text: '경찰서' },
      { icon: '🏗️', text: '공사현장' },
    ],
  };

  return (
    <div className="map-container">
      {isSearchOpen ? (
        <SearchScreen 
          onClose={() => setIsSearchOpen(false)} 
          onNavigate={handleNavigate}
        />
      ) : (
        <>
          {/* 검색바와 필터 버튼을 포함하는 상단 영역 */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1000,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            width: '100%',
            touchAction: 'pan-x',
            height: '170px',
            background: 'transparent',
            pointerEvents: 'auto'
          }}>
            {/* 검색바 */}
            <div className="search-bar" style={{
              width: '100%',  // 전체 너비 사용
              maxWidth: 'calc(100% - 32px)',  // 양쪽 여백 16px씩
              margin: '0 auto'  // 중앙 정렬
            }}>
              {/* mapspicy 로고 */}
              <div 
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginRight: '8px'
                }}
              >
                <img 
                  src="/images/search_bar/mapspicy.png" 
                  alt="mapspicy" 
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>

              {/* 메뉴 버튼 */}
              <button 
                className="menu-button" 
                style={{ 
                  border: 'none', 
                  background: 'none', 
                  cursor: 'pointer',
                  fontSize: '24px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // 메뉴 클릭 핸들러 추가
                }}
              >
                ≡
              </button>

              {/* 검색 입력창 */}
              <div 
                onClick={() => setIsSearchOpen(true)}
                style={{
                  flex: 1,
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <input 
                  type="text" 
                  placeholder="장소, 버스, 지하철, 주소 검색" 
                  className="search-input" 
                  readOnly
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                />
              </div>

              {/* 음성 검색 버튼 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '8px'
              }}>
                <img 
                  src="/images/search_bar/mike.svg" 
                  alt="음성 검색" 
                  className="voice-icon"
                  style={{ 
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </div>
            </div>
            
            {/* 필터 버튼 */}
            <div className="filter-buttons-container">
              <div className="filter-buttons-scroll">
                {filterButtons[selectedMode].map((button, index) => (
                  <button 
                    key={index} 
                    className={`filter-button ${activeFilters.includes(button.text) ? 'active' : ''}`}
                    onClick={() => handleFilterClick(button.text)}
                  >
                    <span className="filter-button-icon">{button.icon}</span>
                    <span className="filter-button-text">{button.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 지도 컴포넌트 */}
          <div className="map-component-container">
            <MapComponent />
          </div>
        </>
      )}
    </div>
  );
};

export default Map;