const EventEmitter = require('events');
const { generateId } = require('../utils/filename');
const { getInfo, downloadMedia } = require('./ytdlpService');
const logger = require('../utils/logger');

const MAX_CONCURRENT = parseInt(process.env.MAX_CONCURRENT_DOWNLOADS || '2', 10);

/**
 * In-memory download queue + history.
 * Emits: 'queued' | 'progress' | 'completed' | 'failed'
 */
class QueueService extends EventEmitter {
  constructor() {
    super();
    this.items = new Map(); // id -> item
    this.pendingIds = [];
    this.activeCount = 0;
    this.history = []; // completed items, most recent first
  }

  addToQueue({ url, format, startTime, endTime }) {
    const id = generateId();
    const item = {
      id,
      url,
      format,
      startTime: startTime || null,
      endTime: endTime || null,
      status: 'pending', // pending | downloading | completed | failed
      progress: 0,
      speed: null,
      eta: null,
      meta: null,
      filePath: null,
      filename: null,
      error: null,
      createdAt: new Date().toISOString()
    };
    this.items.set(id, item);
    this.pendingIds.push(id);
    this.emit('queued', item);
    this._processNext();
    return item;
  }

  getItem(id) {
    return this.items.get(id);
  }

  getAllItems() {
    return Array.from(this.items.values());
  }

  getHistory() {
    return this.history;
  }

  async _processNext() {
    if (this.activeCount >= MAX_CONCURRENT) return;
    const nextId = this.pendingIds.shift();
    if (!nextId) return;

    const item = this.items.get(nextId);
    if (!item) return this._processNext();

    this.activeCount++;
    item.status = 'downloading';
    this.emit('progress', item);

    try {
      // fetch metadata first (used for filename + history display)
      if (!item.meta) {
        item.meta = await getInfo(item.url);
      }

      const result = await downloadMedia(
        {
          url: item.url,
          format: item.format,
          startTime: item.startTime,
          endTime: item.endTime,
          id: item.id,
          title: item.meta?.title
        },
        (progressData) => {
          item.progress = progressData.progress;
          item.speed = progressData.speed;
          item.eta = progressData.eta;
          this.emit('progress', item);
        }
      );

      item.status = 'completed';
      item.progress = 100;
      item.filePath = result.filePath;
      item.filename = result.filename;
      item.completedAt = new Date().toISOString();

      this.history.unshift(item);
      this.emit('completed', item);
    } catch (err) {
      logger.error(`Queue item ${item.id} failed:`, err.message);
      item.status = 'failed';
      item.error = err.message;
      this.emit('failed', item);
    } finally {
      this.activeCount--;
      this._processNext();
    }
  }
}

module.exports = new QueueService();