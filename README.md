# Dev Tinder Backend using Nodejs🚀

## 📌 Overview

DevTinder is a **MERN stack** web application designed to help developers connect and collaborate — like Tinder, but built for developers. Users can create profiles, explore other developers, send connection requests, and manage their matches.

This repository contains the **backend** of DevTinder, built with **Node.js**, **Express.js**, and **MongoDB**.

> ⚠️ The backend is fully functional and ready for further scaling and optimizations.

---

## 📖 My Node.js Learning Repository

I learned Node.js through the **Namaste Node.js course by Akshay Saini** 

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (JSON Web Tokens) + Cookies |
| Encryption | bcryptjs |
| API Testing | Postman |
| Environment Config | dotenv |
| Package Manager | npm |

---

## ✨ Features Implemented

### 1. Authentication System
- User Signup, Login, and Logout
- JWT-based authentication with secure HTTP-only cookies
- Password encryption using `bcryptjs`
- Auth middleware to protect private routes

### 2. User Profile Management
- View logged-in user profile
- Edit allowed profile fields (restricted fields for security)
- Update password with validation

### 3. Connection Request System
- Send connection requests (`Interested` / `Ignored`)
- Accept or Reject received requests
- Prevent duplicate requests using MongoDB validation
- Prevent self-requests using Mongoose `.pre` middleware

### 4. Feed API & Pagination
- Fetch suggested developers while excluding:
  - Logged-in user
  - Existing connections
  - Ignored users
  - Users with pending requests
- Pagination using `skip` & `limit`
- Optimized queries using MongoDB `$nin` and `$ne` operators

### 5. Database Design
**User Schema:**
- Sanitized input fields (trim, lowercase, validation)
- Unique constraints on email and username

**ConnectionRequest Schema:**
- `fromUserId`, `toUserId`, `status` with enum validation
- Indexed fields for optimized queries
- Prevents multiple requests between the same users

### 6. Advanced Query Optimization
- `index: true` for faster lookups
- Compound indexes to optimize search across multiple fields

### 7. Middleware
- **Auth Middleware** — Protects all private routes
- **Error Handling Middleware** — Centralized error responses
- **Mongoose `.pre` Middleware** — Prevents self-connection requests

### 8. Express Router Structure
- Modular route organization for clean maintainability
- APIs split into separate routers: `auth`, `profile`, `connections`, `users`

---

## 🚀 API Endpoints

### 1️⃣ Authentication Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/signup` | Register a new user | ❌ |
| POST | `/auth/login` | Login and get JWT cookie | ❌ |
| POST | `/auth/logout` | Logout and clear cookie | ✅ |

### 2️⃣ User Profile Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/profile/view` | Get logged-in user profile | ✅ |
| PATCH | `/profile/edit` | Update allowed profile fields | ✅ |
| PATCH | `/profile/password` | Update user password | ✅ |

### 3️⃣ Connection Request Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/request/send/:status/:toUserId` | Send a connection request | ✅ |
| POST | `/request/review/:status/:requestId` | Accept or Reject a request | ✅ |
| GET | `/user/requests/received` | Get all pending requests | ✅ |
| GET | `/user/connections` | Get all accepted connections | ✅ |

### 4️⃣ Feed API

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/user/feed?page=1&limit=10` | Get suggested developers (paginated) | ✅ |

---

## 🏗️ Setup & Running the Server

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Ajayapk007/devT-inder.git
cd devTinder-backend
```

### 2️⃣ Set Up Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/devTinder
JWT_SECRET=your_jwt_secret
PORT=3000
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Start the Server

```bash
npm start
```

Server runs at: `http://localhost:3000/`

---

## 🤝 Connect

- **GitHub:** [Ajayapk007](https://github.com/Ajayapk007)

---

⭐ If you found this helpful, feel free to star the repo!
