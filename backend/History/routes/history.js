const express = require('express');
const { getAllConnections } = require('../controllers/connectionController');

const router = express.Router();

// กำหนดเส้นทาง API และผูกกับ Controller
router.get('/', getAllConnections);

module.exports = router;