const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/auth'); // ตรวจสอบ path

// Route สำหรับ login
router.post('/login', login);

module.exports = router;