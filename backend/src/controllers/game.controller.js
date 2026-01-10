const { getAllWords, insertScore } = require("../models/dynamodb");
const ApiResponse = require("../utils/ApiResponse");

exports.getRandomWord = async (req, res, next) => {
  try {
    const words = await getAllWords();
    
    if (!words || words.length === 0) {
      return res.status(404).json(new ApiResponse(false, null, "Aucun mot trouvé dans le cloud"));
    }

    // Sélection aléatoire simple côté serveur
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    return res.status(200).json(new ApiResponse(true, randomWord, "Nouveau mot à dessiner récupéré"));
  } catch (error) {
    next(error);
  }
};

exports.saveScore = async (req, res, next) => {
  try {
    const { user_email, word, category, time_taken, attempts } = req.body;

    if (!user_email || !word) {
      return res.status(400).json(new ApiResponse(false, null, "Informations de partie incomplètes"));
    }

    const success = await insertScore({ user_email, word, category, time_taken, attempts });

    if (success) {
      return res.status(201).json(new ApiResponse(true, null, "Résultat sauvegardé dans le cloud"));
    } else {
      throw new Error("Erreur DB lors de la sauvegarde du score");
    }
  } catch (error) {
    next(error);
  }
};
