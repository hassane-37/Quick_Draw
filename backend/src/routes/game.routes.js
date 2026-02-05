const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controller");

// Sauvegarder une partie
router.post("/save", gameController.saveGame);

// Récupérer l'historique d'un utilisateur
router.get("/history/:user_id", gameController.getHistory);

// Récupérer les statistiques d'un utilisateur
router.get("/stats/:user_id", gameController.getStats);

module.exports = router;
