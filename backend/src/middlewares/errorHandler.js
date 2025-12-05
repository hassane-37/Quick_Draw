// src/middlewares/errorHandler.js
const logger = require("../config/logger");

function errorHandler(err, req, res, next) {
  logger.error("Unhandled error:", err);

  const statusCode = err.statusCode || 500;
  const message =
    err.message || "Une erreur interne est survenue. Veuillez réessayer.";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

module.exports = errorHandler;
