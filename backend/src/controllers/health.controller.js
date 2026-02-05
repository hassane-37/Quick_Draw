// src/controllers/health.controller.js
const ApiResponse = require("../utils/ApiResponse");

exports.getHealth = (req, res) => {
  const response = new ApiResponse(true, { status: "ok" }, "Backend opérationnel");
  res.json(response);
};
