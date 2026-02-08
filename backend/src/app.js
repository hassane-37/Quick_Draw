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

app.use("/api", apiLimiter);
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
