const express = require('express');
const { getFile } = require('../controllers/downloadController');

const router = express.Router();
router.get('/:id', getFile);

module.exports = router;