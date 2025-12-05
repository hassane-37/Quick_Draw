// src/middlewares/notFound.js

function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    error: "Route non trouvée",
  });
}

module.exports = notFound;
