import React, { useState, useEffect } from "react";

// 현재 위치 관련 컴포넌트
// 사용자의 현재 위치를 가져오고 표시하는 기능 제공

const CurrentLocationComponent = ({ setStartCoords }) => {
  const [location, setLocation] = useState(null); // 현재 위치 상태
  const [error, setError] = useState(null); // 에러 메시지 상태

  // 위치 정보 감시 설정 및 현재 위치 업데이트
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const coords = `${longitude},${latitude}`;
          setLocation({ 
            latitude, 
            longitude,
            accuracy: Math.round(accuracy) // 정확도를 미터 단위로 표시
          });
          setStartCoords(coords);
        },
        (err) => {
          console.error(err);
          setError("위치 정보를 가져올 수 없습니다.");
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // 시간 초과 늘림
          maximumAge: 0,
          distanceFilter: 1 // 1미터 이상 움직였을 때만 업데이트 (선택적)
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return (
    <div>
      {location && (
        <div>
          <p>현재 위치: 위도 {location.latitude}, 경도 {location.longitude}</p>
          <p>정확도: ±{location.accuracy}미터</p>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CurrentLocationComponent;
