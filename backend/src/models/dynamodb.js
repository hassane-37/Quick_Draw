//This flie will define AWS dynamodb object and dynamo db operations like READ,WRITE...
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');
const dynamo = new AWS.DynamoDB.DocumentClient();

//Creating a user in dynamo db
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
      //we get just the first letter,pictures will be stored in an S3 bucket with id=firstletter.
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
    ProjectionExpression: "id" // Only return needed fields
  };

  try {
    const result = await dynamo.scan(params).promise();
    
    if (result.Items && result.Items.length > 0) {
      return result.Items[0]; // Return first matching user
    }
    
    return null; // User not found
  } catch (err) {
    console.error("Error getting user by email:", err);
    throw err;
  }
}

// Enregistrer un score
async function insertScore(scoreData) {
  const params = {
    TableName: "scores",
    Item: {
      id: uuidv4(),
      user_email: scoreData.user_email,
      word: scoreData.word,
      category: scoreData.category,
      time_taken: scoreData.time_taken,
      attempts: scoreData.attempts,
      created_at: new Date().toISOString()
    }
  };

  try {
    await dynamo.put(params).promise();
    return true;
  } catch (err) {
    console.error("Error creating score:", err);
    return false;
  }
}

// Récupérer tous les mots (pour en choisir un au hasard ensuite)
async function getAllWords() {
  const params = {
    TableName: "words"
  };

  try {
    const result = await dynamo.scan(params).promise();
    return result.Items || [];
  } catch (err) {
    console.error("Error getting words:", err);
    return [];
  }
}

module.exports={insertUser,getUserIdByEmail, insertScore, getAllWords}