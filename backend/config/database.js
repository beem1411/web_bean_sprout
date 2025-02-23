const mysql = require('mysql2/promise');
require('dotenv').config();

// การสร้าง Connection Pool เพื่อใช้เชื่อมต่อฐานข้อมูล
const db = mysql.createPool({
    host: process.env.DB_HOST || '210.246.215.73', // โฮสต์ของฐานข้อมูล
    user: process.env.DB_USER || 'root1', // ชื่อผู้ใช้ฐานข้อมูล
    password: process.env.DB_PASS || "IQTBPPCPE46", // รหัสผ่านฐานข้อมูล
    database: process.env.DB_NAME || 'bean_sprout_DB', // ชื่อฐานข้อมูล


});

module.exports = db;