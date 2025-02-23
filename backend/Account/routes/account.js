const express = require('express');
const { getAllUsers } = require('../controllers/userController');

const router = express.Router();

// กำหนดเส้นทาง GET /users เพื่อดึงข้อมูลผู้ใช้
router.get('/', getAllUsers);

module.exports = router;