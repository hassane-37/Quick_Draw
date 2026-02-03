// src/server.js
const app = require("./app");
const ENV = require("./config/env");
const logger = require("./config/logger");
const gameRoutes = require("./routes/game.routes");

app.listen(ENV.PORT, () => {
  logger.info(` Server running on http://localhost:${ENV.PORT} (${ENV.NODE_ENV})`);
});

app.use("/api/games", gameRoutes);
