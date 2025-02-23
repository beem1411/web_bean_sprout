const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/database'); // เชื่อมต่อกับ database


exports.getUser = async(req, res) => {
    try {
        const queryUser = `SELECT * FROM users WHERE role != "admin"`;
        const [users] = await db.execute(queryUser);
        const usersWithConnections = await Promise.all(users.map(async(user) => {
            const queryConn = `SELECT * FROM connection WHERE userId = ?`;
            const [connections] = await db.execute(queryConn, [user.userId]);
            return {...user, connections };
        }));

        res.json(usersWithConnections);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

// ฟังก์ชันสำหรับยกเลิกบัญชีผู้ใช้
exports.deleteUser = (req, res) => {
    console.log('Request Body:', req.body);

    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: 'Missing userId' });
    }

    const sqlUser = 'DELETE FROM users WHERE userId = ?';
    const sqlConn = 'DELETE FROM connection WHERE userId = ?';
    db.query(sqlConn, [userId], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ message: 'Failed to delete user' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    });
    db.query(sqlUser, [userId], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ message: 'Failed to delete user' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    });
};