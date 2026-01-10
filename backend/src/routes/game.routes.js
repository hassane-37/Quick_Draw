const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controller");

// GET /api/game/word -> Récupère un mot aléatoire
router.get("/word", gameController.getRandomWord);

// POST /api/game/score -> Enregistre le résultat
router.post("/score", gameController.saveScore);

module.exports = router;
