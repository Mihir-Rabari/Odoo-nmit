const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // Max 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after an hour',
  headers: true,
});

module.exports = apiLimiter;