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

    //calling AWS cognito signingup service 
    const user = await signInUser(email, password);
    return res.status(201).json({
      message: "User signed in successfully"
    });

  } catch (error) {
    console.error("Signin error:", error);

    return res.status(500).json({
      message: "Error signing in user",
      error: error.message
    });
  }
};

exports.signupConfirm = async (req, res) => {
  try {

    const {email, code} = req.body;
    
    const getId = await getUserIdByEmail(email)
    const id = getId.id




    await confirmSignUp(id,code)
    return res.status(201).json({
      message: "User confirmed his account successfully"
    });

  } catch (error) {
    console.error("Signin error:", error);

    return res.status(500).json({
      message: "Error confirming user account",
      error: error.message
    });
  }
};