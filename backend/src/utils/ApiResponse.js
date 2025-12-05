// src/utils/ApiResponse.js

class ApiResponse {
  constructor(success, data = null, message = null) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}

module.exports = ApiResponse;
