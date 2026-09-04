const rateLimit = require('express-rate-limit');

/**
 * Stricter limiter specifically for the heavy /api/download and /api/info
 * routes, separate from the general API limiter in server.js.
 */
const downloadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20,
  message: { error: 'Too many download requests. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip
});

module.exports = downloadLimiter;