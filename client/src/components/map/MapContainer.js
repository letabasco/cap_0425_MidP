// src/components/map/MapContainer.js
import React, { useState, useRef } from 'react';
import NaverMap from './NaverMap';
import MenuPanel from '../panels/MenuPanel';
import './MapContainer.css';

const filterButtons = {
  '일반': [
    { icon: '/images/map/category/store.png', text: '편의점' },
    { icon: '/images/map/category/oneonenine.png', text: '소방시설' },
    { icon: '/images/map/category/police.png', text: '경찰서' },
  ],
  '여성': [
    { icon: '/images/map/category/siren.png', text: '안전비상벨' },
    { icon: '/images/map/category/cctv.png', text: 'CCTV' },
    { icon: '/images/map/category/store.png', text: '편의점' },
    { icon: '/images/map/category/oneonenine.png', text: '소방시설' },
    { icon: '/images/map/category/police.png', text: '경찰서' },
  ],
  '노약자': [
    { icon: '/images/map/category/ele.png', text: '지하철역 엘리베이터' },
    { icon: '/images/map/category/drugstore.png', text: '심야약국' },
    { icon: '/images/map/category/charge.png', text: '휠체어 충전소' },
    { icon: '/images/map/category/noin.png', text: '복지시설' },
    { icon: '/images/map/category/store.png', text: '편의점' },
    { icon: '/images/map/category/oneonenine.png', text: '소방시설' },
    { icon: '/images/map/category/police.png', text: '경찰서' },
  ],
};

const MapContainer = ({ 
  selectedMode, 
  isSearchOpen, 
  setIsSearchOpen, 
  onNavigate,
  onEditStart,
  onEditDestination,
  onCurrentLocationUpdate,
  startLocation
}) => {
  const [activeFilters, setActiveFilters] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationButtonActive, setIsLocationButtonActive] = useState(false);
  const mapServiceRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const handleFilterClick = (filterText) => {
    setActiveFilters(prev =>
      prev.includes(filterText)
        ? prev.filter(f => f !== filterText)
        : [...prev, filterText]
    );
  };

  const handleMoveToCurrent = () => {
    setIsLocationButtonActive(true);
    if (mapServiceRef.current?.moveToCurrentLocation) {
      mapServiceRef.current.moveToCurrentLocation();
    }
    setTimeout(() => setIsLocationButtonActive(false), 3000);
  };

  return (
    <div className="map-container" style={{ overflow: 'hidden' }}>
      {/* 상단 바 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        width: '100%',
        touchAction: 'pan-x',
        height: '170px',
        background: 'transparent',
        pointerEvents: 'auto'
      }}>
        <div className="search-bar" style={{
          width: '90%',
          maxWidth: 'calc(100% - 32px)',
          margin: '0 auto'
        }}>
          <button 
            className="menu-button"
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
          >
            ≡
          </button>

          <div 
            onClick={() => onEditDestination()}
            style={{
              flex: 1,
              cursor: 'pointer',
              height: '70%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <input 
              type="text" 
              placeholder="원하는 장소, 주소를 입력하세요" 
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
                <img 
                  src={button.icon} 
                  alt={button.text}
                  className="filter-button-icon"
                  style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                />
                <span className="filter-button-text">{button.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 지도 컴포넌트 */}
      <div className="map-component-container">
        <NaverMap
          selectedMode={selectedMode}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          onFilterClick={handleFilterClick}
          onCurrentLocationUpdate={onCurrentLocationUpdate}
          startLocation={startLocation}
          mapServiceRef={mapServiceRef}
        />
      </div>

      {/* 현재 위치 버튼 */}
      <button
        className={`move-to-current-button ${isLocationButtonActive ? 'active' : ''}`}
        onClick={handleMoveToCurrent}
      >
        <img src="/images/RouteSelectionScreen/location.svg" alt="현재 위치로 이동" />
      </button>

      {/* 메뉴 패널 */}
      <MenuPanel isOpen={isMenuOpen} onClose={toggleMenu} />
    </div>
  );
};

export default MapContainer;
