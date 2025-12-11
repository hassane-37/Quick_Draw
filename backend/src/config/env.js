// src/config/env.js
const dotenv = require("dotenv");

dotenv.config(); // charge les variables depuis .env

const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 4000,
  AWS_ACCESS_KEY_ID : process.env.AWS_ACCESS_KEY_ID, //aws credintials
  AWS_SECRET_ACCESS_KEY : process.env.AWS_SECRET_ACCESS_KEY,
  AWS_SESSION_TOKEN : process.env.AWS_SESSION_TOKEN,
  AWS_REGION : process.env.AWS_REGION || "us-east-1",
  COGNITO_USER_POOL_ID : process.env.COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID : process.env.COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET : process.env.COGNITO_CLIENT_SECRET 
};

module.exports = ENV;
