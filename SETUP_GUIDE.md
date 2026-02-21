# Setup Guide

Complete step-by-step guide to set up and run the Agricultural Machinery Rental System.

## Prerequisites

### Required Software
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

### Optional
- **MongoDB Compass** - GUI for MongoDB
- **Postman** - API testing tool

## Installation Steps

### 1. MongoDB Setup

#### Windows
1. Download MongoDB Community Server
2. Install with default settings
3. MongoDB will run as a Windows service automatically
4. Verify installation:
```bash
mongod --version
```

#### Start MongoDB (if not running)
```bash
# Windows
net start MongoDB

# Or run manually
mongod --dbpath C:\data\db
```

### 2. Clone Project

```bash
git clone <repository-url>
cd agri-rental-system
```

### 3. Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/agri-rental-system

# JWT Secret (change this!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Stripe (Test Mode) - Optional for now
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Email Configuration (Optional for now)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@agrirental.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### Seed Database with Sample Data

```bash
npm run seed
```

This will create:
- 1 Admin user
- 2 Owner users
- 2 Farmer users
- 6 Sample machines
- Sample bookings and payments

#### Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

Server will run on `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

#### Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Verification

### 1. Check Backend
Open browser and visit: `http://localhost:5000/api/health`

You should see:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 2. Check Frontend
Open browser and visit: `http://localhost:5173`

You should see the AgriRental homepage.

### 3. Test Login

Use demo credentials:
- **Admin**: admin@agrirental.com / admin123
- **Owner**: rajesh@example.com / owner123
- **Farmer**: amit@example.com / farmer123

## Stripe Payment Setup (Optional)

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Sign up for a free account
3. Switch to Test Mode (toggle in dashboard)

### 2. Get API Keys
1. Go to Developers → API Keys
2. Copy "Publishable key" (starts with `pk_test_`)
3. Copy "Secret key" (starts with `sk_test_`)

### 3. Update Configuration

**Backend `.env`:**
```env
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
```

**Frontend:** Create `.env` file:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

### 4. Test Payment
Use Stripe test card:
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

## Email Setup (Optional)

### Using Gmail

1. **Enable 2-Factor Authentication** in your Google Account
2. **Generate App Password**:
   - Go to Google Account → Security
   - 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update Backend `.env`**:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=generated_app_password_here
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
net start MongoDB
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill process using port or change PORT in `.env`

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Install dependencies
```bash
npm install
```

### CORS Error in Frontend
**Solution**: Ensure backend is running and FRONTEND_URL in backend `.env` matches your frontend URL

## Development Workflow

### 1. Start Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Make Changes
- Backend changes auto-reload with nodemon
- Frontend changes hot-reload with Vite

### 3. Test Features
- Use Postman or browser to test APIs
- Check browser console for errors
- Monitor terminal for server logs

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

Build output will be in `frontend/dist/`

## Deployment

### Backend Deployment (Heroku Example)
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create agri-rental-backend

# Add MongoDB
heroku addons:create mongolab

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set STRIPE_SECRET_KEY=your_key

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel Example)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

## Next Steps

1. **Customize**: Update branding, colors, and content
2. **Add Features**: Implement additional functionality
3. **Security**: Change JWT_SECRET, add rate limiting
4. **Testing**: Write unit and integration tests
5. **Monitoring**: Add logging and error tracking

## Support

For issues:
1. Check console logs
2. Verify environment variables
3. Ensure all services are running
4. Check MongoDB connection
5. Review API documentation

## Common Commands Reference

```bash
# Backend
npm run dev          # Start development server
npm start           # Start production server
npm run seed        # Seed database

# Frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build

# MongoDB
mongod              # Start MongoDB
mongo               # Open MongoDB shell
```
