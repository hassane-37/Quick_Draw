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
async function signUpUser(email,password,username) {

  const internalUsername = uuidv4();
  await insertUser({
      id:internalUsername, 
      email:email,
      username:username
    });
  return new Promise((resolve, reject) => {
  
    
    
    const params = {
      ClientId: ENV.COGNITO_CLIENT_ID,
      Username: internalUsername, 
      Password: password,
      SecretHash: getSecretHash(internalUsername, ENV.COGNITO_CLIENT_ID, ENV.COGNITO_CLIENT_SECRET),
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: username },
        
      ]
    };

    cognitoIdentityServiceProvider.signUp(params, (err, data) => {
      if (err) reject(err);
      else resolve({
        userSub: data.UserSub,
        email: email,
        message: 'User created successfully. Please check email for verification code.'
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