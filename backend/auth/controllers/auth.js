const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');
require('dotenv').config();


const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        //ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        //เช็คข้อมูลผู้ใช้ในฐานข้อมูล
        const [user] = await db.query('SELECT * FROM users WHERE email = ? AND password = ? AND role = "admin"', [email, password]);
        if (!(user.length > 0)) {
            return res.status(401).json({ success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือไม่ได้รับอนุญาต" });
        }

        const token = jwt.sign({ userId: user.userId, role: 'users' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ success: true, message: "เข้าสู่ระบบสำเร็จ (User)", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในระบบ" });
    }
};

// ส่งออกฟังก์ชัน
module.exports = { login };