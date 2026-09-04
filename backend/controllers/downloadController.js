const fs = require('fs');
const path = require('path');
const queueService = require('../services/queueService');
const { scheduleImmediateDelete } = require('../services/cleanupService');
const {
  isValidUrl,
  isValidFormat,
  isValidTimeRange,
  parseMultipleUrls
} = require('../utils/validators');
const logger = require('../utils/logger');

/**
 * POST /api/download
 * Accepts either a single `url` or a multi-line `urls` string.
 * Every valid URL is pushed to the queue individually.
 */
function createDownload(req, res) {
  const { url, urls, format, startTime, endTime } = req.body;

  if (!isValidFormat(format)) {
    return res.status(400).json({ error: 'Format must be "mp4" or "mp3".' });
  }
  if (!isValidTimeRange(startTime, endTime)) {
    return res.status(400).json({ error: 'Invalid time range. Use HH:MM:SS and ensure end is after start.' });
  }

  let targets = [];
  if (urls) {
    targets = parseMultipleUrls(urls);
    if (targets.length === 0) {
      return res.status(400).json({ error: 'No valid URLs found in the provided list.' });
    }
  } else if (isValidUrl(url)) {
    targets = [url.trim()];
  } else {
    return res.status(400).json({ error: 'Please provide a valid video URL.' });
  }
  // inside createDownload, after computing `targets`:
const MAX_BATCH_SIZE = 10;
if (targets.length > MAX_BATCH_SIZE) {
  return res.status(400).json({ error: `Maximum ${MAX_BATCH_SIZE} URLs per batch.` });
}

  const created = targets.map((singleUrl) =>
    queueService.addToQueue({ url: singleUrl, format, startTime, endTime })
  );

  return res.status(201).json({
    downloadIds: created.map((item) => item.id),
    downloadId: created[0].id, // convenience for single-URL callers
    queued: created.length
  });
}

/**
 * GET /api/file/:id
 * Streams the completed file, then deletes it shortly after.
 */
function getFile(req, res) {
  const { id } = req.params;
  const item = queueService.getItem(id);

  if (!item) {
    return res.status(404).json({ error: 'Download not found.' });
  }
  if (item.status !== 'completed' || !item.filePath) {
    return res.status(409).json({ error: `Download is not ready yet (status: ${item.status}).` });
  }
  if (!fs.existsSync(item.filePath)) {
    return res.status(410).json({ error: 'File has expired and was removed from the server.' });
  }

  res.download(item.filePath, item.filename, (err) => {
    if (err) {
      logger.error('File send error:', err.message);
    } else {
      scheduleImmediateDelete(item.filePath, 5000);
    }
  });
}

/** GET /api/queue - full queue + history snapshot (for page refresh) */
function getQueueSnapshot(req, res) {
  res.json({
    queue: queueService.getAllItems(),
    history: queueService.getHistory()
  });
}

module.exports = { createDownload, getFile, getQueueSnapshot };