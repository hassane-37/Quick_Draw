// src/middlewares/rateLimiter.js
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requêtes par IP dans cette fenêtre
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
