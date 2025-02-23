const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');
const router = express.Router();



// ดึงข้อมูลผู้ใช้ทั้งหมด พร้อมสถานะการเชื่อมต่อ
router.get('/userscon', async(req, res) => {
    try {
        const queryUser = `SELECT * FROM users WHERE role != "admin"`;
        const [users] = await db.execute(queryUser);

        // ใช้ Promise.all() เพื่อดึงข้อมูล connection ของแต่ละ user
        const usersWithConnections = await Promise.all(users.map(async(user) => {
            const queryConn = "SELECT * FROM connection WHERE userId = ?";
            const [connections] = await db.execute(queryConn, [user.userId]);

            // แปลงค่าของ status: ถ้าเป็น 1 → "เชื่อมต่อ", อื่นๆ → "ไม่เชื่อมต่อ"
            const formattedConnections = connections.map(conn => ({
                ...conn,
                status: conn.status === '1' ? 'เชื่อมต่อ' : 'ไม่เชื่อมต่อ'
            }));

            return {...user, connections: formattedConnections };
        }));

        res.json(usersWithConnections);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

// ดึงข้อมูลของผู้ใช้ตาม tankId พร้อมสถานะการเชื่อมต่อ
router.get('/userscode/:tankId', async(req, res) => {
    const { tankId } = req.params;

    try {
        // ดึงข้อมูล users ที่มี tankId ตรงกัน
        const [users] = await db.execute(
            'SELECT firstname, lastname FROM users WHERE tankId = ?', [tankId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ตรวจสอบ connection ที่เกี่ยวข้องกับ tankId
        const [connections] = await db.execute(
            'SELECT status FROM connection WHERE tankId = ?', [tankId]
        );

        // แปลงค่า status: ถ้าเป็น 1 → "เชื่อมต่อ", อื่นๆ → "ไม่เชื่อมต่อ"
        const statusText = (connections.length > 0 && connections[0].status === '1') ? 'เชื่อมต่อ' : 'ไม่เชื่อมต่อ';

        res.json({
            ...users[0],
            status: statusText
        });
    } catch (err) {
        console.error('Error fetching user connection status:', err);
        res.status(500).json({ message: 'Error fetching user connection status', error: err.message });
    }
});

module.exports = router;