## 📚 Tech Stack

| Technology | Purpose |
|------------|---------|
| **AWS Cognito** | User authentication & management |
| **AWS DynamoDB** | User data storage |
| **AWS S3** | Profile and drawing pictures storage |
| **Node.js** | Backend runtime |
| **Express.js** | Web framework |

---

## Overview

This project implements a complete authentication system using **AWS Cognito** for user management and **AWS DynamoDB** for user data storage.

# 🔐 Authentication API

---

## 🗄️ Database

### AWS DynamoDB

**Table Name:** `users`

#### User Data Model
```javascript
{
  id: String,              // Unique user identifier (Cognito sub)
  email: String,           // User email address
  username: String,        // Display name
  role: String,            // User role (default: "user")
  created_at: String,      // ISO timestamp
  profile_pic: String      // a picture with user first letter (google style)
}
```

> **Note:** Profile pictures are stored in an S3 bucket with the naming convention: `{first_letter}.png`

---

## 🚀 API Endpoints

### Base URL
```
http://localhost:3000/api/auth
```

---

### 1️⃣ Sign Up

Create a new user account.

**Endpoint:** `POST /signup`

#### Request Body
```json
{
  "email": "email@gmail.com",
  "password": "xxxxxx",
  "username": "user_name"
}
```

#### Response
```json
{
  "message": "User created successfully, confirm email with given code"
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - Invalid input
- `409` - User already exists
- `500` - Server error

---

### 2️⃣ Confirm Email

Verify user email with confirmation code sent via email.

**Endpoint:** `POST /confirmEmail`

#### Request Body
```json
{
  "email": "arachadirchad@gmail.com",
  "code": "412010"
}
```

#### Response
```json
{
  "message": "User confirmed his account successfully"
}
```

**Status Codes:**
- `200` - Email confirmed successfully
- `400` - Invalid code or expired code
- `404` - User not found
- `500` - Server error

---

### 3️⃣ Sign In

Authenticate user and receive access tokens.

**Endpoint:** `POST /signin`

#### Request Body
```json
{
  "email": "arachadirchad@gmail.com",
  "password": "123Test@123"
}
```

#### Response
```json
{
  "message": "User signed in successfully"
}
```

**Status Codes:**
- `200` - Sign in successful
- `400` - User not confirmed
- `401` - Invalid credentials
- `404` - User not found
- `500` - Server error

---

## 📋 Error Codes

| Code | Message | Description |
|------|---------|-------------|
| `UsernameExistsException` | User already exists | Email is already registered |
| `CodeMismatchException` | Invalid code | Confirmation code is incorrect |
| `ExpiredCodeException` | Code expired | Confirmation code has expired |
| `NotAuthorizedException` | Invalid credentials | Wrong email or password |
| `UserNotConfirmedException` | Email not confirmed | User must confirm email first |

---

## 🔧 Setup Instructions

### Prerequisites
- AWS Account
- Node.js installed
- AWS CLI configured

### Environment Variables

Create a `.env` file in the root directory:
```env
COGNITO_USER_POOL_ID=your_user_pool_id
COGNITO_CLIENT_ID=your_client_id
COGNITO_CLIENT_SECRET=your_client_secret
AWS_REGION=us-east-1
```

### Installation
```bash
# Install dependencies
npm install

# Run the server
npm start
```

---

## 🧪 Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123",
    "username": "testuser"
  }'
```

### Confirm Email
```bash
curl -X POST http://localhost:3000/api/auth/confirmEmail \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

---

## 🔒 Security Features

- ✅ Password hashing via AWS Cognito
- ✅ Email verification required
- ✅ Secure token-based authentication
- ✅ Secret hash for API requests
- ✅ Rate limiting on authentication attempts

---
#Faire un dockerfile de backend et on va appeler les services aws via les variables d'env 
docker run -p 4000:4000 ^
  -e AWS_REGION=eu-west-1 ^
  -e COGNITO_USER_POOL_ID=... ^
  -e COGNITO_CLIENT_ID=... ^
  -e COGNITO_CLIENT_SECRET=... ^
  -e AWS_ACCESS_KEY_ID=... ^
  -e AWS_SECRET_ACCESS_KEY=... ^
  -e DYNAMODB_TABLE_NAME=... ^
  quickdraw-backend

Cette approche permet à toute l’équipe de travailler avec la même configuration sans dépendre d’installations AWS locales.
**Last Updated:** December 2025