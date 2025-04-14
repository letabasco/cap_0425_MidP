/* global naver */

class MarkerService {
  constructor() {
    this.markers = {};
    this.infoWindows = {};
  }

  // 마커 토글 기능 구현
  toggleMarkers(mapInstance, places, category) {
    // 이미 해당 카테고리의 마커가 있다면 제거
    if (this.markers[category]) {
      this.removeMarkers(category);
      return;
    }

    // 마커 생성
    this.markers[category] = [];
    this.infoWindows[category] = [];

    places.forEach(place => {
      const marker = this.createMarker(mapInstance, place, category);
      const infoWindow = this.createInfoWindow(place, category);
      
      this.markers[category].push(marker);
      this.infoWindows[category].push(infoWindow);
      
      // 마커 클릭 시 정보창 표시
      naver.maps.Event.addListener(marker, 'click', () => {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(mapInstance, marker);
        }
      });
    });
  }

  // 마커 생성 메소드
  createMarker(mapInstance, place, category) {
    // 카테고리별 마커 아이콘 설정
    const markerIcons = {
      '편의점': '/images/map/category/store.png',
      '소방시설': '/images/map/category/oneonenine.png',
      '경찰서': '/images/map/category/police.png',
      '안전비상벨': '/images/map/category/siren.png',
      'CCTV': '/images/map/category/cctv.png',
      '지하철역 엘레베이터': '/images/map/category/ele.png',
      '심야약국': '/images/map/category/drugstore.png',
      '휠체어 충전소': '/images/map/category/charge.png',
      '복지시설': '/images/map/category/noin.png'
    };

    // 마커 생성
    return new naver.maps.Marker({
      position: new naver.maps.LatLng(place.latitude, place.longitude),
      map: mapInstance,
      icon: {
        url: markerIcons[category] || '/images/map/default-marker.png',
        size: new naver.maps.Size(24, 24),
        scaledSize: new naver.maps.Size(24, 24),
        origin: new naver.maps.Point(0, 0),
        anchor: new naver.maps.Point(12, 12)
      },
      zIndex: 100
    });
  }

  // 정보창 생성 메소드
  createInfoWindow(place, category) {
    const content = `
      <div style="padding: 10px; width: 200px;">
        <h4 style="margin: 0 0 5px 0;">${place.name || category}</h4>
        ${place.address ? `<p style="margin: 5px 0;">${place.address}</p>` : ''}
        ${place.distance ? `<p style="margin: 5px 0;">거리: ${place.distance}m</p>` : ''}
      </div>
    `;

    return new naver.maps.InfoWindow({
      content: content,
      maxWidth: 220,
      borderColor: "#ccc",
      borderWidth: 1,
      anchorSize: new naver.maps.Size(10, 10)
    });
  }

  // 카테고리별 마커 제거
  removeMarkers(category) {
    if (!this.markers[category]) return;

    this.markers[category].forEach(marker => {
      marker.setMap(null);
    });

    this.infoWindows[category].forEach(infoWindow => {
      if (infoWindow.getMap()) {
        infoWindow.close();
      }
    });

    delete this.markers[category];
    delete this.infoWindows[category];
  }

  // 모든 마커 제거
  removeAllMarkers() {
    for (const category in this.markers) {
      this.removeMarkers(category);
    }
  }
}

export default MarkerService;