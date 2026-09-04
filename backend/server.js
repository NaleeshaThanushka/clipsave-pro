require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');

const infoRoutes = require('./routes/infoRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const fileRoutes = require('./routes/fileRoutes');
const { initSocket } = require('./socket/socketHandler');
const { startCleanupScheduler } = require('./services/cleanupService');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const io = new Server(server, {
  cors: { origin: FRONTEND_URL, methods: ['GET', 'POST'] }
});

// --- Middleware ---
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// --- Routes ---
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/info', infoRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/file', fileRoutes);

// --- 404 + error handler ---
app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));

app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// --- Socket.IO ---
initSocket(io);

// --- Cleanup scheduler ---
startCleanupScheduler();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`ClipSave Pro backend running on port ${PORT}`);
});