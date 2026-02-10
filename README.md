# Quiz Application API with JWT Authentication
git link: https://github.com/alinairsymova/web-back-final
site link: http://127.0.0.1:5500/quiz-frontend/index.html

A RESTful API for a quiz application built with Node.js, Express, MongoDB, and JWT authentication. Users can register, login, create quizzes, add questions, take quizzes, and view their results.

## Features

- ✅ User authentication with JWT
- ✅ Role-based access control (Admin/User)
- ✅ Users can create their own quizzes
- ✅ Create, read, update, and delete quizzes
- ✅ Add multiple-choice questions to quizzes
- ✅ Take quizzes and submit answers
- ✅ Automatic score calculation
- ✅ View quiz results and history
- ✅ Secure password hashing with bcrypt
- ✅ Input validation
- ✅ Error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## Project Structure

```
quiz-api/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── userController.js     # User management
│   ├── quizController.js     # Quiz operations
│   ├── questionController.js # Question management
│   └── resultController.js   # Quiz results
├── middleware/
│   ├── auth.js              # JWT authentication & authorization
│   └── errorHandler.js      # Global error handler
├── models/
│   ├── User.js              # User schema
│   ├── Quiz.js              # Quiz schema
│   ├── Question.js          # Question schema
│   └── Result.js            # Result schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── userRoutes.js        # User endpoints
│   ├── quizRoutes.js        # Quiz endpoints
│   ├── questionRoutes.js    # Question endpoints
│   └── resultRoutes.js      # Result endpoints
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
├── server.js               # Entry point
└── README.md               # Documentation
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd quiz-api

# Or simply navigate to the project folder
cd quiz-api
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quiz-app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important**: Change `JWT_SECRET` to a strong, random string in production!

### Step 4: Start MongoDB

Make sure MongoDB is running on your system.

**Local MongoDB:**
```bash
# On macOS/Linux
sudo systemctl start mongodb
# or
mongod

# On Windows
net start MongoDB
```

**Or use MongoDB Atlas** (cloud):
- Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Create a cluster
- Get your connection string
- Update `MONGODB_URI` in `.env`

### Step 5: Run the Application

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start at `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
<img width="726" height="229" alt="image" src="https://github.com/user-attachments/assets/69e9b234-6e42-4117-8777-383138461ed3" />

### User Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users/profile` | Get user profile | Private |
| PUT | `/api/users/profile` | Update user profile | Private |
<img width="844" height="265" alt="image" src="https://github.com/user-attachments/assets/a9c05b6e-4731-438b-8a8a-d5bb5df100f8" />

### Quizzes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/quizzes` | Create quiz | Private (Any user) |
| GET | `/api/quizzes` | Get all quizzes | Public |
| GET | `/api/quizzes/:id` | Get single quiz | Public |
| PUT | `/api/quizzes/:id` | Update quiz | Private (Creator/Admin) |
| DELETE | `/api/quizzes/:id` | Delete quiz | Private (Creator/Admin) |
<img width="988" height="495" alt="image" src="https://github.com/user-attachments/assets/3222a89a-aaef-4534-b553-e3d30792b639" />

### Questions

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/quizzes/:id/questions` | Add question to quiz | Private (Creator/Admin) |
| GET | `/api/quizzes/:id/questions` | Get quiz questions | Private |
| PUT | `/api/questions/:id` | Update question | Private (Creator/Admin) |
| DELETE | `/api/questions/:id` | Delete question | Private (Creator/Admin) |
<img width="939" height="253" alt="image" src="https://github.com/user-attachments/assets/ace37020-6773-4c64-a53d-854f22618a76" />

### Results

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/quizzes/:id/submit` | Submit quiz answers | Private |
| GET | `/api/results/my` | Get my results | Private |
| GET | `/api/results/:id` | Get specific result | Private (Owner/Admin) |
| GET | `/api/quizzes/:id/results` | Get all results for quiz | Private (Creator/Admin) |
<img width="862" height="250" alt="image" src="https://github.com/user-attachments/assets/89137e7b-c8f6-4ae9-881e-ea21d650ef74" />

## API Usage Examples

### 1. Register a User

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```
<img width="1919" height="946" alt="image" src="https://github.com/user-attachments/assets/1a82ccf7-a25c-4531-ab17-6cd12fc3baac" />

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```
<img width="1894" height="868" alt="image" src="https://github.com/user-attachments/assets/3edafae0-f5c6-4a5a-8e24-6283dce23064" />

### 2. Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```
<img width="1919" height="878" alt="image" src="https://github.com/user-attachments/assets/1f28936b-7502-4143-9146-a0c4605f29cb" />

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### 3. Create a Quiz

```bash
POST http://localhost:5000/api/quizzes
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "JavaScript Basics",
  "description": "Test your knowledge of JavaScript fundamentals"
}
```
<img width="1814" height="807" alt="image" src="https://github.com/user-attachments/assets/3cdfd9dc-b864-4395-a721-49ecd9fb7ce5" />
<img width="1897" height="863" alt="image" src="https://github.com/user-attachments/assets/138d0b04-1084-4502-ba04-bed9d20b6510" />


### 4. Add Questions to Quiz

```bash
POST http://localhost:5000/api/quizzes/<quiz_id>/questions
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "questionText": "What is the output of typeof null?",
  "options": ["object", "null", "undefined", "number"],
  "correctAnswer": 0
}
```
<img width="1890" height="863" alt="image" src="https://github.com/user-attachments/assets/7a23268d-541d-4f3f-98c8-3aa72e620d14" />

### 5. Submit Quiz Answers

```bash
POST http://localhost:5000/api/quizzes/<quiz_id>/submit
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "answers": [
    {
      "questionId": "507f1f77bcf86cd799439011",
      "selectedAnswer": 0
    },
    {
      "questionId": "507f1f77bcf86cd799439012",
      "selectedAnswer": 2
    }
  ]
}
```
<img width="1850" height="858" alt="image" src="https://github.com/user-attachments/assets/5795d8f3-bba2-4c82-afb1-ada570d1e879" />

**Response:**
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "score": 8,
    "totalQuestions": 10,
    "percentage": "80.00",
    "result": {
      "_id": "507f1f77bcf86cd799439013",
      "user": "507f1f77bcf86cd799439011",
      "quiz": "507f1f77bcf86cd799439014",
      "score": 8,
      "totalQuestions": 10
    }
  }
}
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token is received upon successful registration or login.

## Database Schema

### User
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Quiz
```javascript
{
  title: String,
  description: String,
  createdBy: ObjectId (ref: User),
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Question
```javascript
{
  quiz: ObjectId (ref: Quiz),
  questionText: String,
  options: [String],
  correctAnswer: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Result
```javascript
{
  user: ObjectId (ref: User),
  quiz: ObjectId (ref: Quiz),
  score: Number,
  totalQuestions: Number,
  answers: [{
    question: ObjectId (ref: Question),
    selectedAnswer: Number,
    isCorrect: Boolean
  }],
  submittedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing with Postman

1. Import the API endpoints into Postman
2. Create an environment with base URL: `http://localhost:5000`
3. Register a user and save the token
4. Set the token in Authorization header for protected routes
5. Test all endpoints

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for stateless authentication
- Role-based access control
- Input validation
- MongoDB injection protection
- CORS enabled

## Development Tips

1. **Auto-restart during development**: Use `npm run dev` with nodemon
2. **Test with different roles**: Create both admin and user accounts
3. **Database GUI**: Use MongoDB Compass to view your data
4. **API Testing**: Use Postman, Insomnia, or Thunder Client (VS Code)

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running on your system.

### JWT Error
```
Error: Not authorized to access this route
```
**Solution**: Check if you're sending the correct token in Authorization header.

### Validation Error
```
Error: Duplicate field value entered
```
**Solution**: Email or username already exists. Use different credentials.

## Future Enhancements

- [ ] Add quiz categories
- [ ] Timer for quizzes
- [ ] Question shuffling
- [ ] Multiple quiz attempts
- [ ] Leaderboard system
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Quiz sharing functionality
- [ ] File upload for questions (images)

## License

MIT License - Feel free to use this project for learning purposes.

## Author

Created as a final project demonstration for backend development with Node.js and MongoDB.

## Support

For questions or issues, please create an issue in the repository.


