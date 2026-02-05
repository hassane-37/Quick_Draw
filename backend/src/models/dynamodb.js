//This file will define AWS dynamodb object and dynamo db operations like READ,WRITE...
const AWS = require("aws-sdk");

// Configurer AWS avec les credentials depuis les variables d'environnement
AWS.config.update({
  region: process.env.AWS_REGION || "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN
});

const dynamo = new AWS.DynamoDB.DocumentClient();

// 🧪 TEST : Essayer de scanner la table users
(async () => {
  try {
    console.log("🧪 Testing DynamoDB connection with table 'users'...");
    const result = await dynamo.scan({
      TableName: "users",
      Limit: 1  // Juste pour tester la connexion
    }).promise();
    console.log("✅ DynamoDB connection successful!");
    console.log("📋 Found", result.Count, "items in table 'users'");
  } catch (err) {
    console.error("❌ DynamoDB connection failed:", err.code, "-", err.message);
  }
})();


async function insertUser(user) {
  const params = {
    TableName: "users",
    Item: {
      id: user.id,             
      email: user.email,
      username: user.username,
      role: user.role || "user",
      created_at: new Date().toISOString(),
      profile_pic : user.username[0]
    }
  };

  try {
    await dynamo.put(params).promise();
    return true;
  } catch (err) {
    console.error("Error creating user:", err);
    return false;
  }
}

async function getUserIdByEmail(email) {
  const params = {
    TableName: "users",
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email
    },
    // Retourner plus d'infos pour le frontend
    ProjectionExpression: "id, email, username, role, profile_pic"
  };

  try {
    const result = await dynamo.scan(params).promise();
    
    if (result.Items && result.Items.length > 0) {
      return result.Items[0];
    }
    
    return null;
  } catch (err) {
    console.error("Error getting user by email:", err);
    throw err;
  }
}

// ==================== GAMES TABLE OPERATIONS ====================

// Créer une nouvelle partie
async function insertGame(game) {
  const params = {
    TableName: "games",
    Item: {
      id: game.id,
      user_id: game.user_id,
      mode: game.mode || "classic",
      model_type: game.model_type, // "cnn" ou "lstm"
      rounds: game.rounds, // Array des résultats par round
      total_score: game.total_score,
      correct_count: game.correct_count,
      total_rounds: game.total_rounds,
      created_at: new Date().toISOString()
    }
  };

  try {
    await dynamo.put(params).promise();
    return true;
  } catch (err) {
    console.error("Error creating game:", err);
    return false;
  }
}

// Récupérer les parties d'un utilisateur
async function getGamesByUserId(user_id) {
  const params = {
    TableName: "games",
    IndexName: "user_id-index", // Créer un GSI sur user_id
    KeyConditionExpression: "user_id = :uid",
    ExpressionAttributeValues: {
      ":uid": user_id
    },
    ScanIndexForward: false // Plus récent en premier
  };

  try {
    const result = await dynamo.query(params).promise();
    return result.Items || [];
  } catch (err) {
    // Fallback avec scan si pas de GSI
    const scanParams = {
      TableName: "games",
      FilterExpression: "user_id = :uid",
      ExpressionAttributeValues: {
        ":uid": user_id
      }
    };
    const result = await dynamo.scan(scanParams).promise();
    return result.Items || [];
  }
}

// Récupérer les statistiques d'un utilisateur
async function getUserStats(user_id) {
  const games = await getGamesByUserId(user_id);
  
  if (games.length === 0) {
    return {
      games_played: 0,
      wins: 0,
      top_score: 0,
      recent_games: []
    };
  }

  const wins = games.filter(g => g.correct_count >= Math.ceil(g.total_rounds / 2)).length;
  const topScore = Math.max(...games.map(g => g.total_score || 0));
  const recentGames = games
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return {
    games_played: games.length,
    wins,
    top_score: topScore,
    recent_games: recentGames
  };
}

async function getUserById(userId) {
  const params = {
    TableName: "users",
    Key: {
      id: userId
    }
  };
  
  try {
    const result = await dynamo.get(params).promise();
    return result.Item;
  } catch (err) {
    console.error("Error getting user by id:", err);
    throw err;
  }
}

module.exports = { insertUser, getUserIdByEmail, insertGame, getGamesByUserId, getUserStats };
