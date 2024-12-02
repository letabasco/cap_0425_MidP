/* global naver */

class MapService {
    constructor(mapElement) {
      // naver maps 객체 확인
      if (!window.naver || !window.naver.maps) {
        throw new Error('Naver Maps API is not loaded');
      }

      // 기본 옵션 설정
      const defaultOptions = {
        center: new naver.maps.LatLng(35.8714354, 128.601445),
        zoom: 14,
        mapDataControl: false,
        scaleControl: false,
        logoControl: false,
        zoomControl: false,
        mapTypeControl: false,
        disableKineticPan: false,
        tileTransition: true,
        minZoom: 6,
        maxZoom: 21,
        scrollWheel: true,
        draggable: true,
        pinchZoom: true,
        keyboardShortcuts: true,
      };

      try {
        // 지도 인스턴스 생성
        this.mapInstance = new naver.maps.Map(mapElement, defaultOptions);
        
        // 지도 인스턴스 초기화 확인
        if (!this.mapInstance) {
          throw new Error('Failed to initialize map instance');
        }

        this.currentLocationMarker = null;

        // 기본 이벤트 바인딩
        this._bindMapEvents();

      } catch (error) {
        console.error('Map initialization error:', error);
        throw error;
      }
    }

    // 기본 이벤트 바인딩
    _bindMapEvents() {
      if (!this.mapInstance) return;

      // 지도 로드 완료 이벤트
      naver.maps.Event.once(this.mapInstance, 'init', () => {
        console.log('Map initialization completed');
      });

      // 에러 처리
      naver.maps.Event.addListener(this.mapInstance, 'error', (error) => {
        console.error('Map error:', error);
      });
    }

    // 지도 인스턴스 getter
    getMapInstance() {
      if (!this.mapInstance) {
        throw new Error('Map instance is not initialized');
      }
      return this.mapInstance;
    }

    // 현재 위치 설정
    setCurrentLocation(position) {
      if (!this.mapInstance) return;

      const { latitude, longitude } = position;
      const location = new naver.maps.LatLng(latitude, longitude);

      if (this.currentLocationMarker) {
        this.currentLocationMarker.setPosition(location);
      } else {
        this.currentLocationMarker = new naver.maps.Marker({
          position: location,
          map: this.mapInstance
        });
      }

      this.mapInstance.setCenter(location);
    }

    // 지도 이동
    moveToPosition(position, zoom) {
      if (!this.mapInstance) return;

      try {
        const moveLatLng = new naver.maps.LatLng(position.lat, position.lng);
        this.mapInstance.setCenter(moveLatLng);
        if (zoom) {
          this.mapInstance.setZoom(zoom);
        }
      } catch (error) {
        console.error('Error moving map:', error);
      }
    }

    // 줌 레벨 설정
    setZoom(level) {
      if (!this.mapInstance) return;

      try {
        this.mapInstance.setZoom(level);
      } catch (error) {
        console.error('Error setting zoom:', error);
      }
    }
}

export default MapService;