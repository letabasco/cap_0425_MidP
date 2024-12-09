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
      // App.js에서 현재 위치를 가져와 setStartLocation을 호출할 수 있습니다.
      // 이미 아래 useEffect에서 처리하므로 여기선 별도로 할 필요 없습니다.
    }
  };

  const handleRouteBack = () => {
    setDestination(null);
  };

  // 컴포넌트 마운트 시 현재 위치 가져오기
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // 카카오 API를 사용하여 현재 위치의 주소 정보 가져오기
              const response = await axios.get(
                `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${position.coords.longitude}&y=${position.coords.latitude}`,
                {
                  headers: {
                    Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`
                  }
                }
              );

              const addressInfo = response.data.documents[0];
              const locationData = {
                id: 'current-location',
                name: '현재 위치',
                address: addressInfo.road_address?.address_name || addressInfo.address?.address_name,
                coords: {
                  latitude: parseFloat(position.coords.latitude),
                  longitude: parseFloat(position.coords.longitude)
                }
              };
              
              setStartLocation(locationData); // 현재 위치를 출발지로 설정
            } catch (error) {
              console.error('주소 변환 실패:', error);
            }
          },
          (error) => {
            console.error('현재 위치를 가져올 수 없습니다:', error);
            // 위치 정보를 가져올 수 없는 경우 기본 출발지 설정
            setStartLocation({
              id: 'default-location',
              name: '서울시청',
              address: '서울특별시 중구 세종대로 110',
              coords: {
                latitude: 37.5665,
                longitude: 126.9780
              }
            });
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        // Geolocation을 지원하지 않는 경우 기본 출발지 설정
        setStartLocation({
          id: 'default-location',
          name: '서울시청',
          address: '서울특별시 중구 세종대로 110',
          coords: {
            latitude: 37.5665,
            longitude: 126.9780
          }
        });
      }
    };

    getCurrentLocation();
  }, []);

  return (
    <div className="App">
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
