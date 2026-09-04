const express = require('express');
const { fetchInfo } = require('../controllers/infoController');
const downloadLimiter = require('../middleware/downloadLimiter');

const router = express.Router();
router.post('/', downloadLimiter, fetchInfo);

module.exports = router;