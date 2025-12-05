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

// Sécurité de base
app.use(helmet());
app.disable("x-powered-by"); // ne pas révéler qu'on utilise Express

// CORS (à restreindre plus tard à ton domaine frontend)
app.use(cors());

// Logs HTTP
app.use(morgan("dev"));

// Pour lire le JSON (limité pour éviter les gros payloads malveillants)
app.use(express.json({ limit: "5mb" }));

// Rate limiting global
app.use("/api", apiLimiter);

// Toutes les routes API
app.use("/api", routes);

// 404
app.use(notFound);

// Gestion centralisée des erreurs
app.use(errorHandler);

module.exports = app;
