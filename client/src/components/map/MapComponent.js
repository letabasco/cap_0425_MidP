/* global naver */
import React, { useEffect, useRef, useState } from 'react';
import MapService from './MapService'

// 지도 컴포넌트의 메인 컨테이너
// 지도 표시, 경로 정보 표시, 경로 타입 선택 기능 제공

const MapComponent = ({ startCoords, goalCoords }) => {
  const mapRef = useRef(null);
  const mapServiceRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // 지도 초기화
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current || mapServiceRef.current) return;

      try {
        // naver.maps 객체가 로드될 때까지 대기
        if (!window.naver || !window.naver.maps) {
          console.error('Naver Maps API is not loaded');
          return;
        }

        mapServiceRef.current = new MapService(mapRef.current);
        setIsMapReady(true);

        // 현재 위치 가져오기
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (mapServiceRef.current) {
                mapServiceRef.current.setCurrentLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                });
              }
            },
            (error) => {
              console.error("현재 위치를 가져올 수 없습니다:", error);
            },
            {
              enableHighAccuracy: true,
              maximumAge: 0,
              timeout: 5000
            }
          );
        }
      } catch (error) {
        console.error('Map initialization error:', error);
      }
    };

    initializeMap();

    // 클린업 함수
    return () => {
      if (mapServiceRef.current) {
        // 지도 인스턴스 정리
        const mapInstance = mapServiceRef.current.getMapInstance();
        if (mapInstance) {
          mapInstance.destroy();
        }
        mapServiceRef.current = null;
      }
    };
  }, []);

  // 지도 이벤트 리스너
  useEffect(() => {
    if (!mapServiceRef.current || !isMapReady) return;

    try {
      const mapInstance = mapServiceRef.current.getMapInstance();
      if (!mapInstance) return;

      const listeners = [];

      // 이벤트 리스너 등록
      if (window.naver && window.naver.maps) {
        listeners.push(
          naver.maps.Event.addListener(mapInstance, 'dragstart', () => {
            // 드래그 시작 처리
          })
        );

        listeners.push(
          naver.maps.Event.addListener(mapInstance, 'dragend', () => {
            // 드래그 종료 처리
          })
        );

        listeners.push(
          naver.maps.Event.addListener(mapInstance, 'zoom_changed', () => {
            // 줌 변경 처리
          })
        );
      }

      // 클린업 함수
      return () => {
        listeners.forEach(listener => {
          if (window.naver && window.naver.maps) {
            naver.maps.Event.removeListener(listener);
          }
        });
      };
    } catch (error) {
      console.error('Error setting up map event listeners:', error);
    }
  }, [isMapReady]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        touchAction: 'pan-x pan-y'
      }} 
    />
  );
};

export default React.memo(MapComponent);