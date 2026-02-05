const ENV = require("../config/env.js");
//for AWS cognito
const AWS = require('aws-sdk');
const getSecretHash = require("../utils/secretHash.js")
const { v4: uuidv4 } = require('uuid')
const {insertUser} = require("../models/dynamodb.js")

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
  region: ENV.AWS_REGION 
});

//SignUp - Cognito d'abord, puis DynamoDB
async function signUpUser(email, password, username) {
  const internalUsername = uuidv4();
  
  // Step 1: Prepare Cognito signup
  const params = {
    ClientId: ENV.COGNITO_CLIENT_ID,
    Username: username,
    Password: password,
    SecretHash: getSecretHash(
      username,
      ENV.COGNITO_CLIENT_ID,
      ENV.COGNITO_CLIENT_SECRET
    ),
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "name", Value: username },
    ],
  };

  try {
    // Step 2: Call Cognito FIRST
    const cognitoData = await new Promise((resolve, reject) => {
      cognitoIdentityServiceProvider.signUp(params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    // Step 3: THEN insert into DynamoDB
    let insert = false;
    try {
      insert = await insertUser({ 
        id: internalUsername, 
        email, 
        username,
        cognitoSub: cognitoData.UserSub, // Store Cognito ID for reference
        createdAt: new Date().toISOString()
      });
    } catch (dbErr) {
      // Log DB error but don't fail the whole signup
      console.error("DB insert failed after Cognito success:", dbErr.message);
      // You might want to implement a retry mechanism or queue here
    }

    return {
      userSub: cognitoData.UserSub,
      email,
      message: "User created successfully. Please check email for verification code.",
      dbInserted: insert // Indicate if DB insertion was successful
    };
  } catch (cognitoErr) {
    throw new Error("Cognito signup failed: " + cognitoErr.message);
  }
}

// SIGNIN - Only email and password required
function signInUser(email, password) {
  return new Promise((resolve, reject) => {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: ENV.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email, 
        PASSWORD: password,
        SECRET_HASH: getSecretHash(email, ENV.COGNITO_CLIENT_ID, ENV.COGNITO_CLIENT_SECRET)
      }
    };

    cognitoIdentityServiceProvider.initiateAuth(params, (err, data) => {
      if (err) reject(err);
      else {
        resolve({
          accessToken: data.AuthenticationResult.AccessToken,
          idToken: data.AuthenticationResult.IdToken,
          refreshToken: data.AuthenticationResult.RefreshToken
        });
      }
    });
  });
}

//Confirmation code 
function confirmSignUp(username, code) {
  return new Promise((resolve, reject) => {
    const params = {
      ClientId: ENV.COGNITO_CLIENT_ID,
      Username: username, 
      ConfirmationCode: code,
      SecretHash: getSecretHash(username, ENV.COGNITO_CLIENT_ID, ENV.COGNITO_CLIENT_SECRET)
    };

    cognitoIdentityServiceProvider.confirmSignUp(params, (err, data) => {
      if (err) reject(err);
      else resolve({ message: 'Email verified successfully' });
    });
  });
}

// RESEND CONFIRMATION CODE
function resendConfirmationCode(username) {
  return new Promise((resolve, reject) => {
    const params = {
      ClientId: ENV.COGNITO_CLIENT_ID,
      Username: usename,
      SecretHash: getSecretHash(username, ENV.COGNITO_CLIENT_ID, ENV.COGNITO_CLIENT_SECRET)
    };

    cognitoIdentityServiceProvider.resendConfirmationCode(params, (err, data) => {
      if (err) reject(err);
      else resolve({ message: 'Confirmation code resent' });
    });
  });
}

module.exports = { signInUser, signUpUser, confirmSignUp, resendConfirmationCode };