// src/routes/index.js
const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const predictionRoutes = require("./prediction.routes");
const gameRoutes = require("./game.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/ml", predictionRoutes);
router.use("/game", gameRoutes);
// router.use("/drawings", drawingRoutes);

module.exports = router;
