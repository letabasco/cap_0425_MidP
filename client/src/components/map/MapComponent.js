/* global naver */
import React, { useEffect, useRef, useState, useMemo } from 'react';
import MapService from './MapService';
import RouteService from './RouteService';

const MapComponent = ({ startCoords, goalCoords }) => {
  const mapRef = useRef(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapService = useRef(null);
  const routeService = useRef(null);
  const watchPositionId = useRef(null);  // 위치 감시 ID 저장용

  // 컨테이너 스타일 메모이제이션
  const containerStyle = useMemo(() => ({
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  }), []);

  // 맵 컨테이너 스타일 메모이제이션
  const mapContainerStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#fff',
    WebkitTransform: 'translate3d(0,0,0)',
    transform: 'translate3d(0,0,0)',
    WebkitBackfaceVisibility: 'hidden',
    backfaceVisibility: 'hidden',
    WebkitPerspective: 1000,
    perspective: 1000,
    touchAction: 'manipulation',
    willChange: 'transform',  // 추가: 브라우저에 변환 최적화 힌트 제공
    isolation: 'isolate',     // 추가: 새로운 쌓임 맥락 생성
    contain: 'layout paint',  // 추가: 렌더링 최적화
  }), []);

  // 지도 초기화 최적화
  useEffect(() => {
    let isSubscribed = true;

    const initializeMap = async () => {
      if (!mapRef.current || mapService.current) return;

      try {
        if (!window.naver || !window.naver.maps) {
          console.error('Naver Maps API is not loaded');
          return;
        }

        if (navigator.geolocation) {
          // 초기 위치 가져오기
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (!isSubscribed) return;
              
              const { latitude, longitude } = position.coords;
              const initialPosition = { latitude, longitude };

              requestAnimationFrame(() => {
                if (!isSubscribed) return;
                
                mapService.current = new MapService(mapRef.current, initialPosition);
                routeService.current = new RouteService(mapService.current.getMapInstance());
                mapService.current.setCurrentLocation(initialPosition);
                setIsMapReady(true);

                // 실시간 위치 추적 시작
                watchPositionId.current = navigator.geolocation.watchPosition(
                  (newPosition) => {
                    const newCoords = {
                      latitude: newPosition.coords.latitude,
                      longitude: newPosition.coords.longitude
                    };
                    mapService.current.updateCurrentLocation(newCoords);
                  },
                  (error) => {
                    console.error('위치 추적 오류:', error);
                  },
                  {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000
                  }
                );
              });
            },
            (error) => {
              console.error('현재 위치를 가져올 수 없습니다:', error);
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

    return () => {
      isSubscribed = false;
      // 위치 추적 중지
      if (watchPositionId.current) {
        navigator.geolocation.clearWatch(watchPositionId.current);
      }
      if (mapService.current) {
        const mapInstance = mapService.current.getMapInstance();
        if (mapInstance) {
          mapInstance.destroy();
        }
        mapService.current = null;
      }
    };
  }, []);

  // 지도 이벤트 리스너
  useEffect(() => {
    if (!mapService.current || !isMapReady) return;

    try {
      const mapInstance = mapService.current.getMapInstance();
      if (!mapInstance) return;

      const listeners = [];

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

  // 경로 그리기
  useEffect(() => {
    const drawRoute = async () => {
      if (startCoords && goalCoords && routeService.current) {
        try {
          const result = await routeService.current.drawRoute(
            startCoords, 
            goalCoords
          );
          setRouteInfo(result);
        } catch (error) {
          console.error('경로 그리기 실패:', error);
          setRouteInfo({ error: '경로 검색에 실패했습니다.' });
        }
      }
    };

    drawRoute();
  }, [startCoords, goalCoords]);

  return (
    <div style={containerStyle}>
      <div 
        ref={mapRef} 
        style={mapContainerStyle}
      />
      {routeInfo?.error && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: '#fff3f3',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          color: '#ff0000',
          zIndex: 100,
          pointerEvents: 'none'  // 추가: 에러 메시지가 맵 상호작용을 방해하지 않도록
        }}>
          {routeInfo.error}
        </div>
      )}
    </div>
  );
};

// React.memo에 비교 함수 추가
export default React.memo(MapComponent, (prevProps, nextProps) => {
  return (
    prevProps.startCoords === nextProps.startCoords &&
    prevProps.goalCoords === nextProps.goalCoords
  );
});