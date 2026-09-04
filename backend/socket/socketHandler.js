const logger = require('../utils/logger');
const queueService = require('../services/queueService');

function initSocket(io) {
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // send current queue snapshot on connect
    socket.emit('queue:snapshot', queueService.getAllItems());

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  const toPayload = (item) => ({
    id: item.id,
    url: item.url,
    format: item.format,
    status: item.status,
    progress: item.progress,
    speed: item.speed,
    eta: item.eta,
    meta: item.meta,
    error: item.error,
    filename: item.filename
  });

  queueService.on('queued', (item) => io.emit('queued', toPayload(item)));
  queueService.on('progress', (item) => io.emit('progress', toPayload(item)));
  queueService.on('completed', (item) => io.emit('completed', toPayload(item)));
  queueService.on('failed', (item) => io.emit('failed', toPayload(item)));
}

module.exports = { initSocket };