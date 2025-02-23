const express = require('express');
const { getAllConnections } = require('../controllers/connectionController');

const router = express.Router();

router.get('/', getAllConnections);

module.exports = router;