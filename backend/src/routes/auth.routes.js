// src/routes/health.routes.js
const express = require("express");
const router = express.Router();
const signupController = require("../controllers/auth.controller");


//signup s'inscrire
router.post("/signup",signupController.signup);
//confirm email
router.post("/confirmEmail",signupController.signupConfirm);
//signin se connecter
router.post("/signin",signupController.signin);



module.exports = router;
