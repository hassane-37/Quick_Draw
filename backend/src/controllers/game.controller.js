const { insertGame, getGamesByUserId, getUserStats } = require("../models/dynamodb");
const { v4: uuidv4 } = require("uuid");

// Sauvegarder une partie
exports.saveGame = async (req, res) => {
  try {
    const { user_id, model_type, rounds } = req.body;

    console.log("Saving game for user:", user_id);
    console.log("Rounds data:", JSON.stringify(rounds, null, 2));

    if (!user_id || !rounds || !Array.isArray(rounds)) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["user_id", "rounds"]
      });
    }

    // Calculer le score
    const correctCount = rounds.filter(r => 
      r.prediction?.toLowerCase() === r.word?.toLowerCase()
    ).length;
    
    const totalScore = rounds.reduce((sum, r) => sum + (r.confidence || 0), 0);

    const game = {
      id: uuidv4(),
      user_id,
      model_type: model_type || "lstm",
      rounds,
      total_score: Math.round(totalScore),
      correct_count: correctCount,
      total_rounds: rounds.length
    };

    console.log("Game object to save:", game);

    const success = await insertGame(game);

    if (success) {
      console.log("Game saved successfully with id:", game.id);
      return res.status(201).json({
        message: "Game saved successfully",
        data: game
      });
    } else {
      throw new Error("Failed to save game");
    }
  } catch (error) {
    console.error("Save game error:", error);
    return res.status(500).json({
      message: "Error saving game",
      error: error.message
    });
  }
};

// Récupérer l'historique des parties
exports.getHistory = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const games = await getGamesByUserId(user_id);

    return res.status(200).json({
      message: "Games retrieved successfully",
      data: games
    });
  } catch (error) {
    console.error("Get history error:", error);
    return res.status(500).json({
      message: "Error retrieving games",
      error: error.message
    });
  }
};

// Récupérer les statistiques
exports.getStats = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const stats = await getUserStats(user_id);

    return res.status(200).json({
      message: "Stats retrieved successfully",
      data: stats
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return res.status(500).json({
      message: "Error retrieving stats",
      error: error.message
    });
  }
};
