const ENV = require("../config/env.js");
//for AWS cognito
const AWS = require('aws-sdk');
const getSecretHash = require("../utils/secretHash.js")
const { v4: uuidv4 } = require('uuid')
const {insertUser} = require("../models/dynamodb.js")


const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
  region: ENV.AWS_REGION 
});


//SignUp
async function signUpUser(email, password, username) {
  const internalUsername = uuidv4();

  // Step 1: Insert user into DB
  let insert = false;
  try {
    insert = await insertUser({ id: internalUsername, email, username });
  } catch (err) {
    throw new Error("DB insert failed: " + err.message);
  }

  // Stop execution if insert failed
  if (!insert) {
    throw new Error("DB insert returned false. Cognito signup aborted.");
  }

  // Step 2: Prepare Cognito signup
  const params = {
    ClientId: ENV.COGNITO_CLIENT_ID,
    Username: internalUsername,
    Password: password,
    SecretHash: getSecretHash(
      internalUsername,
      ENV.COGNITO_CLIENT_ID,
      ENV.COGNITO_CLIENT_SECRET
    ),
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "name", Value: username },
    ],
  };

  // Step 3: Call Cognito
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.signUp(params, (err, data) => {
      if (err) return reject(err);
      resolve({
        userSub: data.UserSub,
        email,
        message: "User created successfully. Please check email for verification code.",
      });
    });
  });
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
function confirmSignUp(email, code) {
  return new Promise((resolve, reject) => {
    const params = {
      ClientId: ENV.COGNITO_CLIENT_ID,
      Username: email, 
      ConfirmationCode: code,
      SecretHash: getSecretHash(email, ENV.COGNITO_CLIENT_ID, ENV.COGNITO_CLIENT_SECRET)
    };

    cognitoIdentityServiceProvider.confirmSignUp(params, (err, data) => {
      if (err) reject(err);
      else resolve({ message: 'Email verified successfully' });
    });
  });
}

// RESEND CONFIRMATION CODE
function resendConfirmationCode(email) {
  return new Promise((resolve, reject) => {
    const params = {
      ClientId: ENV.COGNITO_CLIENT_ID,
      Username: email,
      SecretHash: getSecretHash(email, ENV.COGNITO_CLIENT_ID, ENV.COGNITO_CLIENT_SECRET)
    };

    cognitoIdentityServiceProvider.resendConfirmationCode(params, (err, data) => {
      if (err) reject(err);
      else resolve({ message: 'Confirmation code resent' });
    });
  });
}

module.exports = { signInUser, signUpUser ,confirmSignUp,resendConfirmationCode};