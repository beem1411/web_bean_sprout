const express = require('express');
const { getUser, deleteUser, authenticateToken } = require('../controllerss/system');
const router = express.Router();

// เส้นทาง API ของระบบ
router.get('/users', getUser); // ใช้ Middleware สำหรับตรวจสอบ Token
router.post('/users/delete', deleteUser); // ใช้ Middleware เช่นกัน

module.exports = router;