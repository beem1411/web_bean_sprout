const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');
const router = express.Router();

// เส้น API Endpoint ดึงรายละเอียดเกี่ยวกับจำนวนบัญชีผู้ใช้งานและจำนวนถังปลูก
router.get('/usersdetail', async(req, res) => {
    try {
        // คำสั่ง SQL นับจำนวนบัญชีผู้ใช้งานที่ไม่ใช่ admin
        const queryUser = `SELECT COUNT(*) as cusers FROM users WHERE role != "admin"`;
        // ส่งคำสั่งไปยังฐานข้อมูลและรอผลลัพธ์
        const [users] = await db.execute(queryUser);

        // คำสั่ง SQL นับจำนวน tankId ที่ไม่ซ้ำกันในตาราง tank
        const queryTank = `SELECT COUNT(DISTINCT tankId) as ctanks FROM tank`;
        // ส่งคำสั่งไปยังฐานข้อมูลและรอผลลัพธ์
        const [tanks] = await db.execute(queryTank);

        // จัดรูปแบบข้อมูลให้อยู่ในรูปแบบของอาร์เรย์ของอ็อบเจ็กต์
        const data = [
            { name: "จำนวนบัญชีผู้ใช้งาน", count: users[0].cusers }, // จำนวนบัญชีที่ไม่ใช่ admin
            { name: "จำนวนถังปลูก", count: tanks[0].ctanks } // จำนวน tankId ที่ไม่ซ้ำกัน
        ];

        // ส่งข้อมูลกลับไปเป็น JSON response
        res.json({ data });
    } catch (err) {
        // แสดง error ใน console กรณีเกิดข้อผิดพลาด
        console.error('Error fetching users:', err);
        // ส่ง HTTP status 500 พร้อมข้อความ error กลับไปให้ client
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

// ส่ง router ออกไปเพื่อให้สามารถใช้ในไฟล์อื่นๆ ได้
module.exports = router;