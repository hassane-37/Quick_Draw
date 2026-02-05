//This file is for generating a hash secret that i will need to send in every request to AWS.
const crypto = require("crypto");

function getSecretHash(username, clientId, clientSecret) {
  return crypto
    .createHmac("SHA256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

module.exports = getSecretHash