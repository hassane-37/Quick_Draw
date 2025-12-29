// src/controllers/prediction.controller.js
const ApiResponse = require("../utils/ApiResponse");

// TODO: remplacer cette logique mock par un appel réel au modèle ML
exports.predict = async (req, res, next) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res
        .status(400)
        .json(new ApiResponse(false, null, "Champ 'image' (dataURL) requis"));
    }

    // Exemple de prédictions factices pour tester l'intégration
    const labels = ["chat", "chien", "maison", "pizza"];
    const predictions = labels
      .map((label) => ({
        label,
        prob: Math.random(),
      }))
      .sort((a, b) => b.prob - a.prob)
      .slice(0, 3);

    const response = new ApiResponse(true, { predictions }, "Prédiction réussie");
    return res.json(response);
  } catch (err) {
    return next(err);
  }
};
