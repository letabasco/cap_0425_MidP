// src/App.js
import React, { useState, useEffect } from "react";
import axios from 'axios'; // 현재 위치 가져오기 위해 axios 추가
import Map from "./components/map/Map";
import CustomSettingsPanel from "./components/map/CustomSettingsPanel";
import RouteSelectionScreen from "./components/search/RouteSelectionScreen";
import SearchScreen from "./components/search/SearchScreen";
import "./App.css";

const App = () => {
  const [selectedMode, setSelectedMode] = useState('일반');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchingStart, setIsSearchingStart] = useState(false);
  const [isSearchingDestination, setIsSearchingDestination] = useState(false);

  const [startLocation, setStartLocation] = useState(null);
  const [destination, setDestination] = useState(null);

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
  };

  const handleOpenSearchForStart = () => {
    setIsSearchingStart(true);
    setIsSearchingDestination(false);
    setIsSearchOpen(true);
  };

  const handleOpenSearchForDestination = () => {
    setIsSearchingStart(false);
    setIsSearchingDestination(true);
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setIsSearchingStart(false);
    setIsSearchingDestination(false);
  };

  const handleLocationSelected = (location) => {
    if (isSearchingStart) {
      console.log("Setting startLocation:", location);
      setStartLocation(location);
    } else if (isSearchingDestination) {
      console.log("Setting destination:", location);
      setDestination(location);
    }
    handleSearchClose();
  };

  const handleNavigate = (dest) => {
    setDestination(dest);
    setIsSearchOpen(false);
    // 출발지가 아직 설정되지 않은 경우 현재 위치를 자동으로 설정
    if (!startLocation) {
      // 현재 위치를 가져오는 로직을 여기에 추가하거나,
      // App.js에서 현재 위치를 가져와 setStartLocation을 호출할 수 있음.
      // 이미 아래 useEffect에서 처리하므로 여기선 별도로 할 필요 없음.
    }
  };

  const handleRouteBack = () => {
    setDestination(null);
  };

  const updateCurrentLocation = (location) => {
    const locationData = {
      id: 'current-location',
      name: '현재 위치',
      address: '', // 주소 정보는 필요에 따라 추가
      coords: location
    };
    setStartLocation(locationData);
  };

  return (
    <div className="App" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      {/* 검색 화면 */}
      {isSearchOpen && (
        <SearchScreen
          onClose={handleSearchClose}
          onNavigate={handleLocationSelected}
          isStartLocation={isSearchingStart}
        />
      )}

      {/* 경로 선택 화면 */}
      {destination && !isSearchOpen && (
        <RouteSelectionScreen
          startLocation={startLocation}
          destination={destination}
          onBack={handleRouteBack}
          onStartLocationEdit={handleOpenSearchForStart}
          onDestinationEdit={handleOpenSearchForDestination}
        />
      )}

      {/* 지도 화면 (기본 화면) */}
      {!destination && !isSearchOpen && (
        <>
          <Map
            selectedMode={selectedMode}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            onNavigate={handleNavigate}
            onEditStart={handleOpenSearchForStart}
            onEditDestination={handleOpenSearchForDestination}
            onCurrentLocationUpdate={updateCurrentLocation}
            startLocation={startLocation}
          />
          <CustomSettingsPanel
            onModeChange={handleModeChange}
            selectedMode={selectedMode}
          />
        </>
      )}
    </div>
  );
};

export default App;