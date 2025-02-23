const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');
const router = express.Router();

// ดึงข้อมูลประวัติการปลูกทั้งหมด
router.get('/history', async(req, res) => {
    try {
        const [history] = await db.execute(`
            SELECT startDate, amountStart, amountEnd
            FROM history_planting
            ORDER BY startDate DESC
        `);

        res.json(history);
    } catch (err) {
        console.error('Database Error:', err.message); // Log ข้อผิดพลาดเพื่อ debug
        res.status(500).json({ message: 'Error fetching planting history', error: err.message });
    }
});

// ตรวจสอบการเชื่อมต่อฐานข้อมูล
db.execute('SELECT 1')
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection failed:', err.message));

module.exports = router;