const { getInfo } = require('../services/ytdlpService');
const { isValidUrl } = require('../utils/validators');
const logger = require('../utils/logger');

async function fetchInfo(req, res) {
  const { url } = req.body;

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Please provide a valid video URL.' });
  }

  try {
    const info = await getInfo(url);
    return res.json(info);
  } catch (err) {
    logger.error('fetchInfo error:', err.message);
    return res.status(422).json({ error: err.message });
  }
}

module.exports = { fetchInfo };