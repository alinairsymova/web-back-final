# Complete Setup Instructions

## Quick Start (5 Minutes)

### Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (v14 or higher) - Check: `node --version`
- ✅ MongoDB installed or MongoDB Atlas account
- ✅ A code editor (VS Code recommended)
- ✅ Postman or similar API testing tool (optional)

---

## Step-by-Step Installation

### 1. Install Node.js (if not installed)

**Windows:**
- Download from [nodejs.org](https://nodejs.org/)
- Run the installer
- Verify: Open Command Prompt and type `node --version`

**macOS:**
```bash
# Using Homebrew
brew install node

# Verify
node --version
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
```

### 2. Install MongoDB

**Option A: Local MongoDB**

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run installer with default settings
3. MongoDB runs as a service automatically

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Option B: MongoDB Atlas (Cloud - Recommended for beginners)**

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for free account
3. Create a new cluster (Free tier available)
4. Wait for cluster to be created (2-3 minutes)
5. Click "Connect" → "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database user password
8. Use this string in your `.env` file

Example Atlas connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/quiz-app?retryWrites=true&w=majority
```

### 3. Setup the Project

**Step 3.1: Navigate to project directory**
```bash
cd quiz-api
```

**Step 3.2: Install dependencies**
```bash
npm install
```

This will install:
- express - Web framework
- mongoose - MongoDB ODM
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- dotenv - Environment variables
- cors - Cross-origin resource sharing
- express-validator - Input validation
- nodemon - Auto-restart (dev)

**Step 3.3: Configure environment**

Create `.env` file:
```bash
# On macOS/Linux
cp .env.example .env

# On Windows (PowerShell)
copy .env.example .env

# On Windows (Command Prompt)
copy .env.example .env
```

Edit `.env` file with your settings:

**For Local MongoDB:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quiz-app
JWT_SECRET=my_super_secret_key_change_in_production_12345
JWT_EXPIRE=7d
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/quiz-app?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_key_change_in_production_12345
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important**: 
- Change `JWT_SECRET` to a random string (at least 32 characters)
- Never commit `.env` to version control

### 4. Verify MongoDB is Running

**Local MongoDB:**
```bash
# Check if MongoDB is running
# On macOS/Linux
ps aux | grep mongod

# On Windows (PowerShell)
Get-Process mongod

# Or try connecting
mongosh
# or
mongo
```

If not running:
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows - should run automatically as service
```

**MongoDB Atlas:**
- Check your cluster status in Atlas dashboard
- Should show "Active" status

### 5. Start the Application

**Development mode (recommended for testing):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

### 6. Test the API

**Using curl (Terminal/Command Prompt):**
```bash
curl http://localhost:5000
```

**Using browser:**
Open: `http://localhost:5000`

You should see:
```json
{
  "success": true,
  "message": "Quiz Application API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "users": "/api/users",
    "quizzes": "/api/quizzes",
    "questions": "/api/questions",
    "results": "/api/results"
  }
}
```

---

## Common Issues & Solutions

### Issue 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
Change PORT in `.env` to another number (e.g., 3000, 8000)

Or kill the process using port 5000:

```bash
# On macOS/Linux
lsof -ti:5000 | xargs kill -9

# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Issue 2: MongoDB Connection Failed

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
1. Make sure MongoDB is running
2. Check MONGODB_URI in `.env`
3. For Atlas, check:
   - Correct username/password
   - IP whitelist (add 0.0.0.0/0 for testing)
   - Network access settings

### Issue 3: Module Not Found

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# On Windows
rmdir /s node_modules
npm install
```

### Issue 4: JWT Secret Not Set

**Error:**
```
Error: JWT_SECRET is not defined
```

**Solution:**
Make sure `.env` file exists and has JWT_SECRET defined

### Issue 5: Nodemon Command Not Found

**Error:**
```
'nodemon' is not recognized as an internal or external command
```

**Solution:**
```bash
# Install nodemon globally
npm install -g nodemon

# Or use npm start instead
npm start
```

---

## Testing Your Installation

### Test 1: Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test 2: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from response!

### Test 3: Create a Quiz

```bash
curl -X POST http://localhost:5000/api/quizzes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Quiz",
    "description": "My first quiz"
  }'
```

If all tests pass, your installation is complete! ✅

---

## Next Steps

1. ✅ Read `README.md` for API documentation
2. ✅ Check `POSTMAN_GUIDE.md` for testing examples
3. ✅ Install Postman for easier API testing
4. ✅ Install MongoDB Compass to view database
5. ✅ Start building your quiz application!

---

## Development Tools (Optional but Recommended)

### MongoDB Compass
- GUI for MongoDB
- Download: [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
- Connect to: `mongodb://localhost:27017`

### Postman
- API testing tool
- Download: [postman.com/downloads](https://www.postman.com/downloads/)
- Import endpoints from `POSTMAN_GUIDE.md`

### VS Code Extensions
- REST Client - Test API from VS Code
- MongoDB for VS Code - View database
- Thunder Client - Postman alternative

---

## Project Structure Overview

```
quiz-api/
├── config/          # Database configuration
├── controllers/     # Business logic
├── middleware/      # Auth & error handling
├── models/         # Database schemas
├── routes/         # API endpoints
├── .env            # Environment variables (create this)
├── .env.example    # Template
├── server.js       # Entry point
└── package.json    # Dependencies
```

---

## Quick Reference

### Start server:
```bash
npm run dev  # Development with auto-restart
npm start    # Production
```

### Stop server:
```bash
Ctrl + C     # In terminal where server is running
```

### View logs:
Server logs appear in the terminal

### Check MongoDB:
```bash
mongosh      # MongoDB shell
show dbs     # List databases
use quiz-app # Switch to quiz database
show collections  # List collections
```

---

## Getting Help

1. Check error messages carefully
2. Review this guide's troubleshooting section
3. Check MongoDB connection
4. Verify all environment variables
5. Ensure all dependencies are installed
6. Check Node.js version compatibility

---

## Success Checklist

- [ ] Node.js installed and working
- [ ] MongoDB installed/configured
- [ ] Project dependencies installed
- [ ] `.env` file created and configured
- [ ] Server starts without errors
- [ ] Can access http://localhost:5000
- [ ] Can register a user
- [ ] Can login and get JWT token
- [ ] Can create a quiz

If all checked, you're ready to go! 🚀
