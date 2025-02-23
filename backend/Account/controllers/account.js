const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');
const router = express.Router();


// ดึงข้อมูลผู้ใช้ทั้งหมด พร้อมรวมถังปลูกตามเงื่อนไขที่กำหนด
// router.get('/usersdetail', async (req, res) => {
//     try {
//         const queryUser = `SELECT count(*) as cusers FROM users WHERE role != "admin"`;
//         const [users] = await db.execute(queryUser);
//         const queryTank = `SELECT count(*) as ctanks FROM tank`;
//         const [tanks] = await db.execute(queryTank);
//         const data = [
//             { name: "จำนวนบัญชีผู้ใช้งาน", count: users[0].cusers },
//             { name: "จำนวนถังปลูก", count: tanks[0].ctanks }
//         ];
//         res.json({ data });
//     } catch (err) {
//         console.error('Error fetching users:', err);
//         res.status(500).json({ message: 'Error fetching users', error: err.message });
//     }
// });
router.get('/usersdetail', async(req, res) => {
    try {
        // นับจำนวนบัญชีผู้ใช้งานที่ไม่ใช่ admin
        const queryUser = `SELECT COUNT(*) as cusers FROM users WHERE role != "admin"`;
        const [users] = await db.execute(queryUser);

        // นับจำนวน tankId ที่ไม่ซ้ำกัน
        const queryTank = `SELECT COUNT(DISTINCT tankId) as ctanks FROM tank`;
        const [tanks] = await db.execute(queryTank);

        const data = [
            { name: "จำนวนบัญชีผู้ใช้งาน", count: users[0].cusers },
            { name: "จำนวนถังปลูก", count: tanks[0].ctanks } // นับเฉพาะ tankId ที่ไม่ซ้ำกัน
        ];

        res.json({ data });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});


module.exports = router;