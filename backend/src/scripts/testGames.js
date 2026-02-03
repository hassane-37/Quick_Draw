// Charger les variables d'environnement EN PREMIER
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

// Configurer AWS avec les credentials
const AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.AWS_REGION || "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN
});

// Maintenant importer les modules qui utilisent AWS
const { insertGame, getGamesByUserId, getUserStats } = require("../models/dynamodb");
const { v4: uuidv4 } = require("uuid");

async function testGameOperations() {
  const testUserId = "test-user-" + Date.now();
  
  console.log(" Testing game operations...\n");
  console.log("User ID:", testUserId);
  console.log("AWS Region:", process.env.AWS_REGION);

  // Test 1: Insert a game
  console.log("\n1️ Testing insertGame...");
  const game = {
    id: uuidv4(),
    user_id: testUserId,
    model_type: "lstm",
    rounds: [
      { word: "Tree", prediction: "Tree", confidence: 85.5 },
      { word: "Cat", prediction: "Dog", confidence: 45.2 },
      { word: "House", prediction: "House", confidence: 92.1 }
    ],
    total_score: 223,
    correct_count: 2,
    total_rounds: 3
  };

  const insertResult = await insertGame(game);
  console.log("Insert result:", insertResult ? " Success" : "❌ Failed");

  // Test 2: Get games by user
  console.log("\n2️ Testing getGamesByUserId...");
  const games = await getGamesByUserId(testUserId);
  console.log("Games found:", games.length);
  console.log("Games:", JSON.stringify(games, null, 2));

  // Test 3: Get user stats
  console.log("\n3️ Testing getUserStats...");
  const stats = await getUserStats(testUserId);
  console.log("Stats:", JSON.stringify(stats, null, 2));

  console.log("\n All tests completed!");
}

testGameOperations().catch(console.error);
