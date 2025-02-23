const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');

// ฟังก์ชันดึงข้อมูลผู้ใช้ที่ไม่ใช่ admin พร้อมข้อมูล connection
exports.getUser = async(req, res) => {
    try {
        // ดึงข้อมูลผู้ใช้ทั้งหมดที่ไม่ใช่ admin จากตาราง users
        const queryUser = `SELECT * FROM users WHERE role != "admin"`;
        const [users] = await db.execute(queryUser);

        // วนลูปดึงข้อมูล connection ของแต่ละ user
        const usersWithConnections = await Promise.all(users.map(async(user) => {
            const queryConn = `SELECT * FROM connection WHERE userId = ?`;
            const [connections] = await db.execute(queryConn, [user.userId]);
            return {...user, connections }; // รวมข้อมูลของ user และ connection
        }));

        // ส่งข้อมูลผู้ใช้ที่รวมกับ connection กลับไปยัง client
        res.json(usersWithConnections);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

// ฟังก์ชันสำหรับลบบัญชีผู้ใช้
exports.deleteUser = (req, res) => {
    console.log('Request Body:', req.body);

    // ดึงค่า userId จาก request body
    const { userId } = req.body;

    // ตรวจสอบว่ามี userId ถูกส่งมาหรือไม่
    if (!userId) {
        return res.status(400).json({ message: 'Missing userId' });
    }

    // คำสั่ง SQL สำหรับลบข้อมูลในตาราง connection และ users
    const sqlConn = 'DELETE FROM connection WHERE userId = ?';
    const sqlUser = 'DELETE FROM users WHERE userId = ?';

    // ลบ connection ของผู้ใช้ก่อน
    db.query(sqlConn, [userId], (err, results) => {
        if (err) {
            console.error('Error deleting connection:', err);
            return res.status(500).json({ message: 'Failed to delete user connections' });
        }
    });

    // ลบข้อมูลผู้ใช้จากฐานข้อมูล
    db.query(sqlUser, [userId], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ message: 'Failed to delete user' });
        }

        // ตรวจสอบว่ามีการลบข้อมูลจริงหรือไม่
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ส่งข้อความแจ้งว่าผู้ใช้ถูกลบสำเร็จ
        res.json({ message: 'User deleted successfully' });
    });
};