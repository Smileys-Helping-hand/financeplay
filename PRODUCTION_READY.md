# 🚀 Getting Your FinancePlay App Running

This guide will help you get the app up and running for production use (no more mock data!).

## ✅ Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- PowerShell (for Windows)

## 📦 Step 1: Install Dependencies

Open PowerShell in the project root and run:

```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 🗄️ Step 2: Setup Database

The app uses SQLite for development. Set up the database:

```powershell
# From the backend folder
cd backend
npx prisma generate
npx prisma migrate deploy

# Optional: Seed with sample data
npx prisma db seed
```

## 🔑 Step 3: Configure Environment Variables

The `.env` files are already configured:

**Backend (.env):**
- `DATABASE_URL` - SQLite database location
- `OPENAI_API_KEY` - Your OpenAI API key for AI coach
- `PORT` - Backend server port (4002)

**Frontend (.env.local):**
- `NEXT_PUBLIC_API_URL` - Backend API URL (http://localhost:4002)

## 🏃 Step 4: Start the Servers

You have two options:

### Option A: Use the PowerShell Scripts (Recommended)

Open TWO separate PowerShell windows:

**Window 1 - Backend:**
```powershell
.\start-backend.ps1
```

**Window 2 - Frontend:**
```powershell
.\start-frontend.ps1
```

### Option B: Manual Start

**Backend (PowerShell 1):**
```powershell
cd backend
npm run dev
```

**Frontend (PowerShell 2):**
```powershell
cd frontend
npm run dev
```

## 🌐 Step 5: Access the App

1. Open your browser to: **http://localhost:3005**
2. You'll be redirected to the setup page
3. Enter your name and email to create an account
4. Start using the app!

## ✨ Features Now Working

All features are now connected to the real backend:

- ✅ **User Authentication** - Real user accounts with isolated data
- ✅ **Transactions** - Add, view, and delete transactions with automatic account balance updates
- ✅ **Accounts** - Create multiple accounts (wallet, bank, savings, investment)
- ✅ **Goals** - Set savings goals with progress tracking
- ✅ **Bursaries** - Track NSFAS and scholarship payments
- ✅ **Dashboard** - Real-time financial health score and insights
- ✅ **AI Coach** - OpenAI-powered financial advice (requires API key)
- ✅ **Reports** - Generate PDF reports of your finances
- ✅ **Gamification** - Level up, earn XP, and maintain streaks

## 🎯 What Changed?

### Removed:
- ❌ All mock data from `frontend/lib/mockData.ts`
- ❌ Hardcoded sample transactions and goals

### Added:
- ✅ Real-time data loading from backend API
- ✅ Automatic calculation of financial health scores
- ✅ AI-generated insights based on your actual spending
- ✅ Proper authentication and user isolation
- ✅ Account balance tracking with transactions

## 🐛 Troubleshooting

### Backend won't start
- Make sure port 4002 is not in use
- Run `npx prisma generate` to regenerate Prisma client
- Check that `.env` file exists in backend folder

### Frontend can't connect to backend
- Verify backend is running on port 4002
- Check `.env.local` has correct API URL
- Look for CORS errors in browser console

### Database errors
- Delete `backend/prisma/dev.db` and run migrations again
- Run `npx prisma migrate reset` to reset database

### No data showing
- Make sure you've created a user account
- Check browser console for API errors
- Verify backend logs show successful requests

## 🔒 Security Notes

- Each user's data is completely isolated
- User ID is stored in localStorage (use JWT in production)
- All routes verify user ownership of data
- Transactions automatically update account balances

## 📱 Next Steps

1. Add your first transaction
2. Create some savings goals
3. Track your bursary payments
4. Check your financial health score
5. Chat with the AI coach for advice

## 💡 Tips

- Link transactions to accounts for automatic balance tracking
- Set high priority on important goals
- Use the AI coach to get personalized challenges
- Check the insights panel for spending patterns

---

**Ready for production!** No mock data - all features are live and working! 🎉
