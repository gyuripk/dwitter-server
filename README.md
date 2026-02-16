# Dwitter Server

A simple Twitter-like backend API that provides authentication, tweet CRUD, and real-time updates over WebSocket. The server is built with Express and MongoDB, secured with JWT, CSRF protection, and rate limiting.

## Purpose

- Provide a lightweight backend for a Twitter-style app.
- Support user authentication and tweet management.
- Broadcast tweet events to connected clients in real time via Socket.IO.

## Tech Stack

- Runtime: Node.js
- Framework: Express (ESM)
- Database/ODM: MongoDB, Mongoose
- Auth/Security: JWT, bcrypt, Helmet, CSRF token check, rate limiting
- Realtime: Socket.IO
- Utilities: dotenv, morgan, cookie-parser, cors

## Installation

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file in the project root and set the following values:

```bash
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN_SECOND=172800
BCRYPT_SALT_ROUNDS=12
MONGODB_URI=mongodb://localhost:27017/dwitter
PORT=8080
CORS_ALLOW_ORIGIN=http://localhost:3000
CSRF_SECRET_KEY=your_csrf_secret
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3) Run the server

```bash
npm run dev
# or
npm start
```

## Folder Structure

```
.
├── app.js
├── config.js
├── connection/
│   └── socket.js
├── controller/
│   ├── auth.js
│   └── tweet.js
├── data/
│   ├── auth.js
│   └── tweet.js
├── db/
│   └── database.js
├── middleware/
│   ├── auth.js
│   ├── csrf.js
│   ├── rate-limiter.js
│   └── validator.js
└── router/
    ├── auth.js
    └── tweets.js
```

## Notes

- API routes are mounted under `/auth` and `/tweets`.
- For browser clients, JWT is set as an HTTP-only cookie; non-browser clients can use the `Authorization: Bearer <token>` header.
- Non-GET requests require the `dwitter-csrf-token` header obtained from `/auth/csrf-token`.
