const {signInUser,signUpUser,confirmSignUp} = require("../models/awsCognito")
//for AWS dynamoDB
const {getUserIdByEmail} = require("../models/dynamodb")



exports.signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // input validation
    if (!email || !password || !username) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["email", "password", "username"]
      });
    }

  
    const cognitoUser = await signUpUser(email, password, username);


    return res.status(201).json({
      message: "User created successfully,confirm email with given code"
    });

  } catch (error) {
    console.error("Signup error:", error);

   
    if (error.code === 'UsernameExistsException') {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    if (error.code === 'InvalidPasswordException') {
      return res.status(400).json({
        message: "Password does not meet requirements"
      });
    }

    return res.status(500).json({
      message: "Error creating user",
      error: error.message
    });
  }
};

exports.signin =  async (req, res) => {
  try {
    const { email, password} = req.body;

    if(!email || !password){
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // Vérifier via Cognito
    const cognitoTokens = await signInUser(email, password);

    // Récupérer les infos utilisateur depuis DynamoDB
    let userInfo = null;
    try {
      userInfo = await getUserIdByEmail(email);
    } catch (_) {}

    return res.status(200).json({
      message: "User signed in successfully",
      data: cognitoTokens,
      user: userInfo ? { id: userInfo.id, email: userInfo.email, username: userInfo.username } : { email }
    });

  } catch (error) {
    console.error("Signin error:", error);

      if (error.code === 'UserNotFoundException' || 
        error.code === 'NotAuthorizedException') {
    return res.status(401).json({
      message: "User not found"
    });
  }
  if(error.code === 'UserNotConfirmedException') {
    return res.status(403).json({
      message: "User not confirmed. Please confirm your email."
    });
  }
  return res.status(500).json({
    message: "Error signing in user",
    error: error.message
  });
  }
};

exports.signupConfirm = async (req, res) => {
  try {

    const {username, code} = req.body;

    
    
    // const getId = await getUserIdByEmail(email)
    // const id = getId.id

    if(!username || !code){
      return res.status(400).json({
        message: "Missing required fields",
        required: ["username", "code"]
      });
    }


    await confirmSignUp(username,code)
    return res.status(200).json({
      message: "User confirmed his account successfully"
    });

  } catch (error) {
    console.error("Confirmation error:", error);

    if(error.code === 'CodeMismatchException') {
      return res.status(400).json({
        message: "Invalid confirmation code"
      });
    }

    if(error.code === 'ExpiredCodeException') {
      return res.status(400).json({
        message: "Confirmation code has expired"
      });
    }

    if(error.code === 'UserNotFoundException') {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(400).json({
      message: "Error confirming user account",
      error: error.message
    });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Vérifier que l'utilisateur demande ses propres stats
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = jwtDecode(token);
    
    // Option 1: Si vous stockez sub dans DynamoDB
    // Option 2: Si vous utilisez email comme lien
    const userFromToken = await getUserIdByEmail(decoded.email);
    
    if (userFromToken.id !== user_id) {
      return res.status(403).json({
        message: "Unauthorized to view these stats"
      });
    }
    
    const stats = await getUserStats(user_id);
    return res.status(200).json({
      data: stats
    });
    
  } catch (error) {
    console.error("Error getting user stats:", error);
    return res.status(500).json({
      message: "Error retrieving user stats"
    });
  }
};