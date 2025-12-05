// src/config/env.js
const dotenv = require("dotenv");

dotenv.config(); // charge les variables depuis .env

const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 4000,
};

module.exports = ENV;
