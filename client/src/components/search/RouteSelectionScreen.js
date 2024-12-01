/* global naver */
import React, { useState, useEffect, useRef } from 'react';
import SearchScreen from './SearchScreen';
import MapService from '../map/MapService';
import './RouteSelectionScreen.css';

const RouteSelectionScreen = ({ destination, onBack }) => {
  const [isSearchingStart, setIsSearchingStart] = useState(false);
  const [startLocation, setStartLocation] = useState(null);
  const mapRef = useRef(null);
  const mapServiceRef = useRef(null);

  // 출발지와 도착지가 모두 있을 때만 지도 초기화
  useEffect(() => {
    if (mapRef.current && startLocation && destination) {
      mapServiceRef.current = new MapService(mapRef.current);
      
      // 출발지 마커
      mapServiceRef.current.createMarker({
        position: new naver.maps.LatLng(
          startLocation.coords.latitude,
          startLocation.coords.longitude
        ),
        icon: {
          content: '<div class="start-marker">📍</div>',
          anchor: new naver.maps.Point(15, 31)
        }
      });

      // 도착지 마커
      mapServiceRef.current.createMarker({
        position: new naver.maps.LatLng(
          destination.coords.latitude,
          destination.coords.longitude
        ),
        icon: {
          content: '<div class="destination-marker">🏁</div>',
          anchor: new naver.maps.Point(15, 31)
        }
      });

      // 두 지점이 모두 보이도록 지도 범위 조정
      mapServiceRef.current.fitBounds([
        [startLocation.coords.longitude, startLocation.coords.latitude],
        [destination.coords.longitude, destination.coords.latitude]
      ]);
    }
  }, [startLocation, destination]);

  const handleStartLocationClick = () => {
    setIsSearchingStart(true);
  };

  const handleStartLocationSelect = (location) => {
    setStartLocation(location);
    setIsSearchingStart(false);
  };

  if (isSearchingStart) {
    return (
      <SearchScreen 
        onClose={() => setIsSearchingStart(false)}
        onNavigate={handleStartLocationSelect}
        isStartLocation={true}
      />
    );
  }

  return (
    <div className="route-selection-screen">
      <div className="route-header">
        <div className="header-top">
          <button className="back-button" onClick={onBack}>
            ✕
          </button>
        </div>
        <div className="location-inputs">
          <div 
            className="input-row clickable"
            onClick={handleStartLocationClick}
          >
            <span className="location-icon">⬆️</span>
            <input 
              type="text" 
              placeholder="출발지 입력" 
              className="location-input"
              value={startLocation ? startLocation.name : ''}
              readOnly
            />
          </div>
          <div className="input-row">
            <span className="location-icon">⬇️</span>
            <input 
              type="text" 
              value={destination.name}
              className="location-input"
              readOnly
            />
          </div>
        </div>
      </div>
      
      <div className="transport-tabs">
        <button className="transport-tab">
          <span className="tab-icon">🚌</span>
          <span className="tab-text">버스</span>
        </button>
        <button className="transport-tab active">
          <span className="tab-icon">🚶</span>
          <span className="tab-text">도보</span>
        </button>
      </div>

      {/* 출발지와 도착지가 모두 있을 때만 지도 표시 */}
      {startLocation && destination && (
        <div className="map-container" ref={mapRef}></div>
      )}
    </div>
  );
};

export default RouteSelectionScreen;