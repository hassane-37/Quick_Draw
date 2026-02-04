const AWS = require("aws-sdk");
const ENV = require("../config/env.js");

console.log("🔍 Checking AWS Credentials:");
console.log("  AWS_ACCESS_KEY_ID:", ENV.AWS_ACCESS_KEY_ID ? `✅ ${ENV.AWS_ACCESS_KEY_ID.substring(0, 10)}...` : "❌ MISSING");
console.log("  AWS_SECRET_ACCESS_KEY:", ENV.AWS_SECRET_ACCESS_KEY ? `✅ ${ENV.AWS_SECRET_ACCESS_KEY.substring(0, 10)}...` : "❌ MISSING");
console.log("  AWS_SESSION_TOKEN:", ENV.AWS_SESSION_TOKEN ? `✅ ${ENV.AWS_SESSION_TOKEN.substring(0, 20)}...` : "❌ MISSING");
console.log("  AWS_REGION:", ENV.AWS_REGION || "❌ MISSING");

AWS.config.update({
  region: ENV.AWS_REGION,
  accessKeyId: ENV.AWS_ACCESS_KEY_ID,
  secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  sessionToken: ENV.AWS_SESSION_TOKEN
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
    ProjectionExpression: "id"
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

module.exports = { insertUser, getUserIdByEmail };