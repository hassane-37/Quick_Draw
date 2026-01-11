const ENV = require("./config/env");

console.log("\n=== VÉRIFICATION CONFIGURATION ===");
console.log(`  Fichier .env utilisé par env.js`); 
console.log("----------------------------------");
console.log("PORT :", ENV.PORT);
console.log("NODE_ENV :", ENV.NODE_ENV);
console.log("AWS_REGION :", ENV.AWS_REGION);
console.log("AWS_ACCESS_KEY_ID :", ENV.AWS_ACCESS_KEY_ID ? " OK (Chargé)" : " ERREUR (Manquant)");
console.log("COGNITO_CLIENT_ID :", ENV.COGNITO_CLIENT_ID ? " OK (Chargé)" : " ERREUR (Manquant)");
console.log("==================================\n");
