const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const DOWNLOADS_DIR = path.join(__dirname, '..', process.env.DOWNLOADS_DIR || 'downloads');
const TTL_MS = parseInt(process.env.FILE_TTL_MINUTES || '30', 10) * 60 * 1000;
const INTERVAL_MS = parseInt(process.env.CLEANUP_INTERVAL_MINUTES || '5', 10) * 60 * 1000;

function deleteFileSafe(filePath) {
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      logger.warn(`Failed to delete file ${filePath}:`, err.message);
    } else if (!err) {
      logger.info(`Deleted file: ${filePath}`);
    }
  });
}

/** Delete immediately after the user downloads it (call from file route). */
function scheduleImmediateDelete(filePath, delayMs = 5000) {
  setTimeout(() => deleteFileSafe(filePath), delayMs);
}

/** Periodic sweep: delete anything older than TTL_MS. */
function startCleanupScheduler() {
  if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
  }

  setInterval(() => {
    fs.readdir(DOWNLOADS_DIR, (err, files) => {
      if (err) return logger.error('Cleanup scan failed:', err.message);
      const now = Date.now();
      files.forEach((file) => {
        if (file === '.gitkeep') return;
        const filePath = path.join(DOWNLOADS_DIR, file);
        fs.stat(filePath, (statErr, stats) => {
          if (statErr) return;
          if (now - stats.mtimeMs > TTL_MS) {
            deleteFileSafe(filePath);
          }
        });
      });
    });
  }, INTERVAL_MS);

  logger.info(`Cleanup scheduler started (TTL: ${TTL_MS / 60000}min, interval: ${INTERVAL_MS / 60000}min)`);
}

module.exports = { startCleanupScheduler, scheduleImmediateDelete, deleteFileSafe };