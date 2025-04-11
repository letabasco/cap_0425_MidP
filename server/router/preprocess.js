// routes/preprocess.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');  // MySQL 연결 모듈

router.post('/analyze', async (req, res) => {
  const { title, content, category, location } = req.body;
  console.log('[요청 도착]');
  console.log('제목:', title);
  console.log('내용:', content);
  console.log('유형:', category);
  console.log('위치:', location);

  try {
    const response = await axios.post('http://localhost:5001/preprocess', { content });

    console.log('[Flask 응답] 전처리 결과:', response.data); // ⭐⭐ 여기가 중요 ⭐⭐

    const keywords = response.data.keywords;
  
      const conn = await db.getConnection();
      try {
        await conn.query(
          'INSERT INTO complaints (title, content, category, keywords, location) VALUES (?, ?, ?, ?, ?)',
          [title, content, category, JSON.stringify(keywords), location || null]
        );
      } finally {
        conn.release();
      }
  
      res.json({ keywords });
  
    } catch (error) {
      console.error('전처리 오류:', error.message);
      res.status(500).json({ error: '전처리 실패' });
    }
  });
  

module.exports = router;
