# AgriRental System 🚜

A full-stack **Agricultural Machinery Rental & Maintenance Platform** that connects farmers with machinery owners.

## Features

- 🌾 **Farmer Portal** — Browse and book machinery
- 🚜 **Owner Portal** — List machines and manage bookings  
- 🛡️ **Admin Portal** — System administration and analytics
- 🤖 **AgriBot AI** — Gemini-powered farming assistant chatbot
- 📊 **Database Viewer** — Admin can see all registered farmers & owners
- 💳 **Secure Payments** — Stripe integration (test mode)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| AI | Google Gemini 1.5 Flash |
| Auth | JWT |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/agri-rental-system.git
cd agri-rental-system
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env:
#   VITE_GEMINI_API_KEY=<your Gemini API key from https://aistudio.google.com/app/apikey>
npm install
npm run dev
```

### 4. Open in Browser
Visit `http://localhost:5173`

## Portal Access

| Portal | URL | Default Credentials |
|--------|-----|---------------------|
| Admin Portal | `/admin-login` | Register with role=admin via MongoDB |
| Farmer Portal | `/farmer-portal` | Register at `/register` with role=farmer |
| Owner Portal | `/owner-portal` | Register at `/register` with role=owner |

## Creating an Admin Account

Run this in MongoDB shell:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

## Gemini API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create a free API key
3. Add it to `frontend/.env` as `VITE_GEMINI_API_KEY=your_key`

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/agri-rental-system
JWT_SECRET=your_secret_key
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## License
MIT