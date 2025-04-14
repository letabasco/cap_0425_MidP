const express = require('express');
const router = express.Router();
// 변경된 서비스 이름으로 수정
const convenienceStoreService = require('../../services/filter/convenienceStorePlacesService');

router.get('/', async (req, res) => {
  try {
    // 클라이언트에서 전달된 위치 정보 추출
    const { lat, lng } = req.query;
    
    // 함수 이름 대문자 C로 수정
    const data = await convenienceStoreService.getConvenienceStorePlacesData(lat, lng);
    res.json(data);
  } catch (error) {
    console.error('편의점 API 요청 실패:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;