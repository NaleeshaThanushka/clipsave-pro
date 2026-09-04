const express = require('express');
const { createDownload, getQueueSnapshot } = require('../controllers/downloadController');
const downloadLimiter = require('../middleware/downloadLimiter');

const router = express.Router();
router.post('/', downloadLimiter, createDownload);
router.get('/queue', getQueueSnapshot);

module.exports = router;