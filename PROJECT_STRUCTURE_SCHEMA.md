# 📂 Quiz Application API - Complete Project Structure Schema

```
quiz-api/
│
├── 📋 Configuration Files
│   ├── package.json                 # Project dependencies and scripts
│   ├── .env.example                 # Environment variables template
│   ├── .env                         # Your environment config (create this)
│   ├── .gitignore                   # Git ignore rules
│   └── server.js                    # 🚀 MAIN ENTRY POINT
│
├── 📁 config/
│   └── db.js                        # MongoDB connection setup
│
├── 📁 models/                       # Database Schemas (MongoDB/Mongoose)
│   ├── User.js                      # User Schema
│   │   ├── username (String, unique)
│   │   ├── email (String, unique)
│   │   ├── password (String, hashed)
│   │   ├── role (String: 'user' | 'admin')
│   │   └── timestamps (createdAt, updatedAt)
│   │
│   ├── Quiz.js                      # Quiz Schema
│   │   ├── title (String)
│   │   ├── description (String)
│   │   ├── createdBy (ObjectId → User)
│   │   ├── isPublic (Boolean)
│   │   └── timestamps
│   │
│   ├── Question.js                  # Question Schema
│   │   ├── quiz (ObjectId → Quiz)
│   │   ├── questionText (String)
│   │   ├── options (Array of Strings)
│   │   ├── correctAnswer (Number: index)
│   │   └── timestamps
│   │
│   └── Result.js                    # Result Schema
│       ├── user (ObjectId → User)
│       ├── quiz (ObjectId → Quiz)
│       ├── score (Number)
│       ├── totalQuestions (Number)
│       ├── answers (Array of Objects)
│       │   ├── question (ObjectId → Question)
│       │   ├── selectedAnswer (Number)
│       │   └── isCorrect (Boolean)
│       ├── submittedAt (Date)
│       └── timestamps
│
├── 📁 controllers/                  # Business Logic Layer
│   ├── authController.js            # Authentication logic
│   │   ├── register()              # Register new user
│   │   └── login()                 # Login user & generate JWT
│   │
│   ├── userController.js            # User management
│   │   ├── getProfile()            # Get user profile
│   │   └── updateProfile()         # Update user info
│   │
│   ├── quizController.js            # Quiz operations
│   │   ├── createQuiz()            # Create new quiz
│   │   ├── getAllQuizzes()         # Get all quizzes
│   │   ├── getQuiz()               # Get single quiz
│   │   ├── updateQuiz()            # Update quiz (creator/admin)
│   │   └── deleteQuiz()            # Delete quiz (creator/admin)
│   │
│   ├── questionController.js        # Question management
│   │   ├── addQuestion()           # Add question to quiz
│   │   ├── getQuestions()          # Get quiz questions
│   │   ├── updateQuestion()        # Update question
│   │   └── deleteQuestion()        # Delete question
│   │
│   └── resultController.js          # Quiz results
│       ├── submitQuiz()            # Submit quiz answers
│       ├── getMyResults()          # Get user's results
│       ├── getResult()             # Get specific result
│       └── getQuizResults()        # Get all results for quiz
│
├── 📁 middleware/                   # Middleware Functions
│   ├── auth.js                      # Authentication & Authorization
│   │   ├── protect                 # Verify JWT token
│   │   └── authorize               # Check user roles
│   │
│   └── errorHandler.js              # Global error handler
│
├── 📁 routes/                       # API Route Definitions
│   ├── authRoutes.js                # /api/auth/*
│   │   ├── POST /register
│   │   └── POST /login
│   │
│   ├── userRoutes.js                # /api/users/*
│   │   ├── GET  /profile          (protected)
│   │   └── PUT  /profile          (protected)
│   │
│   ├── quizRoutes.js                # /api/quizzes/*
│   │   ├── POST   /                (protected)
│   │   ├── GET    /                (public)
│   │   ├── GET    /:id             (public)
│   │   ├── PUT    /:id             (protected)
│   │   ├── DELETE /:id             (protected)
│   │   ├── POST   /:id/questions   (protected)
│   │   ├── GET    /:id/questions   (protected)
│   │   ├── POST   /:id/submit      (protected)
│   │   └── GET    /:id/results     (protected)
│   │
│   ├── questionRoutes.js            # /api/questions/*
│   │   ├── PUT    /:id             (protected)
│   │   └── DELETE /:id             (protected)
│   │
│   └── resultRoutes.js              # /api/results/*
│       ├── GET /my                  (protected)
│       └── GET /:id                 (protected)
│
└── 📁 documentation/                # Documentation Files
    ├── README.md                    # Main documentation
    ├── SETUP.md                     # Setup instructions
    ├── POSTMAN_GUIDE.md            # API testing guide
    └── PROJECT_SUMMARY.md          # Project overview
```

---

## 🔄 Request Flow Diagram

```
Client Request
    ↓
[Express Server] (server.js)
    ↓
[CORS Middleware]
    ↓
[Body Parser]
    ↓
[Route Matching] (routes/*.js)
    ↓
[Authentication Middleware] (if protected) → middleware/auth.js
    ↓                                            ↓
    |                                       Verify JWT
    |                                            ↓
    |                                       Get User
    ↓
[Authorization Middleware] (if role-based)
    ↓
[Controller Function] (controllers/*.js)
    ↓
[Database Operations] (models/*.js)
    ↓
[MongoDB]
    ↓
[Response to Client]
    ↓
[Error Handler] (if error) → middleware/errorHandler.js
```

---

## 🗄️ Database Schema Relationships

```
┌─────────────┐
│    USER     │
│─────────────│
│ _id         │◄────────────┐
│ username    │             │
│ email       │             │ createdBy
│ password    │             │
│ role        │             │
└─────────────┘             │
      ▲                     │
      │ user                │
      │                     │
      │                ┌────┴──────┐
      │                │   QUIZ    │
      │                │───────────│
      │                │ _id       │◄────────────┐
      │                │ title     │             │
      │                │ createdBy │             │ quiz
      │                └───────────┘             │
      │                      ▲                   │
      │                      │ quiz              │
      │                      │                   │
      │                ┌─────┴────────┐    ┌────┴──────┐
      │                │  QUESTION    │    │  RESULT   │
      │                │──────────────│    │───────────│
      │                │ _id          │◄───│ quiz      │
      │                │ quiz         │    │ user      │
      │                │ questionText │    │ score     │
      │                │ options[]    │    │ answers[] │
      │                │ correctAnswer│    └───────────┘
      │                └──────────────┘         ▲
      │                                         │
      └─────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
1. REGISTER
   User Data → Controller → Hash Password → Save to DB → Generate JWT → Return Token

2. LOGIN
   Credentials → Controller → Find User → Compare Password → Generate JWT → Return Token

3. PROTECTED ROUTE
   Request + Token → Middleware → Verify JWT → Decode User ID → Attach to req.user → Next()

4. ROLE CHECK
   Request → Auth Middleware → Role Middleware → Check user.role → Allow/Deny
```

---

## 📊 API Endpoint Architecture

```
/api
│
├── /auth                           [Public]
│   ├── POST /register             → authController.register
│   └── POST /login                → authController.login
│
├── /users                          [Protected]
│   ├── GET  /profile              → userController.getProfile
│   └── PUT  /profile              → userController.updateProfile
│
├── /quizzes
│   ├── POST   /                   [Protected] → quizController.createQuiz
│   ├── GET    /                   [Public]    → quizController.getAllQuizzes
│   ├── GET    /:id                [Public]    → quizController.getQuiz
│   ├── PUT    /:id                [Protected] → quizController.updateQuiz
│   ├── DELETE /:id                [Protected] → quizController.deleteQuiz
│   │
│   ├── POST   /:id/questions      [Protected] → questionController.addQuestion
│   ├── GET    /:id/questions      [Protected] → questionController.getQuestions
│   ├── POST   /:id/submit         [Protected] → resultController.submitQuiz
│   └── GET    /:id/results        [Protected] → resultController.getQuizResults
│
├── /questions                      [Protected]
│   ├── PUT    /:id                → questionController.updateQuestion
│   └── DELETE /:id                → questionController.deleteQuestion
│
└── /results                        [Protected]
    ├── GET /my                    → resultController.getMyResults
    └── GET /:id                   → resultController.getResult
```

---

## 🔧 Technology Stack Schema

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  (API Client - Postman/Frontend App)   │
└────────────────┬────────────────────────┘
                 │ HTTP Requests
                 ↓
┌─────────────────────────────────────────┐
│         APPLICATION LAYER               │
│  ┌───────────────────────────────────┐  │
│  │   Express.js Framework            │  │
│  │   - Routing                       │  │
│  │   - Middleware                    │  │
│  │   - Controllers                   │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │   Authentication & Security       │  │
│  │   - JWT (jsonwebtoken)            │  │
│  │   - bcryptjs (password hashing)   │  │
│  │   - CORS                          │  │
│  └───────────────────────────────────┘  │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│         DATA ACCESS LAYER               │
│  ┌───────────────────────────────────┐  │
│  │   Mongoose ODM                    │  │
│  │   - Models/Schemas                │  │
│  │   - Validation                    │  │
│  │   - Middleware (hooks)            │  │
│  └───────────────────────────────────┘  │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│         DATABASE LAYER                  │
│  ┌───────────────────────────────────┐  │
│  │   MongoDB                         │  │
│  │   - Collections                   │  │
│  │   - Indexes                       │  │
│  │   - Documents                     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 📦 NPM Dependencies Structure

```
quiz-api
│
├── 📦 Production Dependencies
│   ├── express (4.18.2)            → Web framework
│   ├── mongoose (8.0.3)            → MongoDB ODM
│   ├── jsonwebtoken (9.0.2)        → JWT auth
│   ├── bcryptjs (2.4.3)            → Password hashing
│   ├── dotenv (16.3.1)             → Environment variables
│   ├── cors (2.8.5)                → CORS middleware
│   └── express-validator (7.0.1)   → Input validation
│
└── 🛠️ Development Dependencies
    └── nodemon (3.0.2)             → Auto-restart server
```

---

## 🌐 Environment Configuration Schema

```
.env file structure:
├── PORT                  → Server port (default: 5000)
├── MONGODB_URI           → Database connection string
├── JWT_SECRET            → Secret key for JWT signing
├── JWT_EXPIRE            → Token expiration time (e.g., '7d')
└── NODE_ENV              → Environment (development/production)
```

---

## 🎯 Feature Implementation Map

```
USER FEATURES
├── Authentication
│   ├── Register with email validation
│   ├── Login with JWT token
│   └── Password hashing
│
├── Profile Management
│   ├── View profile
│   └── Update profile
│
└── Quiz Participation
    ├── View available quizzes
    ├── Take quizzes
    ├── Submit answers
    └── View results

ADMIN/CREATOR FEATURES
├── Quiz Management
│   ├── Create quiz
│   ├── Update own quiz
│   ├── Delete own quiz
│   └── View quiz results
│
└── Question Management
    ├── Add questions
    ├── Update questions
    └── Delete questions

SYSTEM FEATURES
├── Authorization
│   ├── JWT verification
│   ├── Role-based access
│   └── Resource ownership check
│
├── Validation
│   ├── Input validation
│   ├── Schema validation
│   └── Business logic validation
│
└── Error Handling
    ├── Global error handler
    ├── Mongoose errors
    └── Custom error messages
```

---

## 📈 Data Flow Examples

### Example 1: Create Quiz Flow
```
User (JWT Token)
    ↓
POST /api/quizzes { title, description }
    ↓
authRoutes.js → protect middleware
    ↓
Verify JWT → Extract user ID
    ↓
quizController.createQuiz()
    ↓
Quiz.create({ title, description, createdBy: user._id })
    ↓
MongoDB saves quiz
    ↓
Return quiz data to client
```

### Example 2: Submit Quiz Flow
```
User (JWT Token)
    ↓
POST /api/quizzes/:id/submit { answers: [...] }
    ↓
protect middleware → Verify user
    ↓
resultController.submitQuiz()
    ↓
1. Find quiz
    ↓
2. Get all questions
    ↓
3. Compare answers with correctAnswer
    ↓
4. Calculate score
    ↓
5. Save result to database
    ↓
6. Return score and details
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────┐
│     Input Validation Layer      │  ← express-validator
├─────────────────────────────────┤
│     Authentication Layer        │  ← JWT verification
├─────────────────────────────────┤
│     Authorization Layer         │  ← Role & ownership checks
├─────────────────────────────────┤
│     Data Access Layer           │  ← Mongoose validation
├─────────────────────────────────┤
│     Database Layer              │  ← MongoDB constraints
└─────────────────────────────────┘
```

---

## 📊 File Size Overview

```
Total Project Size: ~1,500+ lines of code

Breakdown:
├── Models            (~300 lines)
├── Controllers       (~600 lines)
├── Middleware        (~150 lines)
├── Routes            (~150 lines)
├── Config            (~50 lines)
├── Server            (~70 lines)
└── Documentation     (~1,000+ lines)
```

---

This is your complete project structure! All files are already created and ready to use. 🚀
