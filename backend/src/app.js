// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");
const apiLimiter = require("./middlewares/rateLimiter");

const app = express();

app.use(helmet());
app.disable("x-powered-by");
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));

// CORS (à restreindre plus tard à ton domaine frontend)
app.use(cors()); 

// Logs HTTP
app.use(morgan("dev")); //utile pour debugger

// Pour lire le JSON (limité pour éviter les gros payloads malveillants)
app.use(express.json({ limit: "5mb" })); 

// Route racine
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "Quick Draw API is running! 🎨",
    availableRoutes: {
      health: "/api/health",
      auth: "/api/auth",
      ml: "/api/ml",
      games: "/api/games"
    }
  });
});

// Rate limiting global
app.use("/api", apiLimiter);
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
