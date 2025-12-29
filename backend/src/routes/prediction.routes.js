// src/routes/prediction.routes.js
const express = require("express");
const predictionController = require("../controllers/prediction.controller");

const router = express.Router();

// POST /api/predict
router.post("/predict", predictionController.predict);

module.exports = router;
