// src/routes/index.js
const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
// router.use("/game", gameRoutes);
// router.use("/drawings", drawingRoutes);
// router.use("/ml", mlRoutes);

module.exports = router;
