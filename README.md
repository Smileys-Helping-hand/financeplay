# 💰 XPFinance (FinancePlay)

A gamified personal finance management app designed for students and young professionals. Track expenses, set savings goals, manage bursaries, and get AI-powered financial advice - all while leveling up and earning XP!

🌐 **Domain:** xpfinance

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Stack](https://img.shields.io/badge/stack-Next.js%20Full%20Stack-blue)
![Database](https://img.shields.io/badge/database-PostgreSQL%20%2B%20Prisma-orange)

## 🚀 Quick Start - Unified Deployment

**Important Update:** The frontend and backend have been consolidated into a **single Next.js application**!

### Local Development

```bash
cd frontend
npm install
npx prisma migrate dev
npm run dev
```

Open http://localhost:3005

### Deploy to Production

See [UNIFIED_DEPLOYMENT.md](./UNIFIED_DEPLOYMENT.md) for complete instructions.

**Quick Vercel Deploy:**
1. Push to GitHub
2. Import to Vercel (root: `frontend`)
3. Add `DATABASE_URL` env variable
4. Deploy!

## ✨ Features

### 💳 Transaction Management
- Add income and expenses with categories
- Link transactions to specific accounts for automatic balance tracking
- View transaction history with filtering and sorting
- Delete transactions with automatic balance reversal

### 🏦 Account Management
- Create multiple accounts (wallet, bank, savings, investment)
- Track balances across all accounts
- Visual account overview with total balance
- Color-coded account types

### 🎯 Goals & Savings
- Set savings goals with target amounts and deadlines
- Priority-based goal tracking (high, medium, low)
- Progress visualization with completion percentages
- Update goal progress manually or automatically

### 🎓 Bursary & Scholarship Tracking
- Track NSFAS and other bursary payments
- Record monthly allowances and payment schedules
- Notes for each funding source
- Next payment date reminders

### 📊 Financial Insights
- Real-time financial health score (0-100)
- AI-generated spending insights
- Category-based expense breakdown
- Spending trends and patterns

### 🎮 Gamification
- Level up by completing financial activities
- Earn XP for transactions and achieving goals
- Maintain daily streaks
- Collect achievement badges
- Daily challenges for bonus XP

### 🤖 AI Coach
- OpenAI-powered financial advisor
- Personalized spending challenges
- Multiple personality modes (friendly, strict, humorous)
- Context-aware advice based on your spending

### 📈 Reports & Analytics
- Generate PDF financial reports
- Spending charts and visualizations
- Category breakdowns with progress bars
- Monthly overview summaries

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd financeplay
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Setup database**
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

4. **Configure environment variables**

Backend `.env` is already configured:
- `DATABASE_URL` - SQLite database
- `PORT=4002` - API server port
- `OPENAI_API_KEY` - Your OpenAI key (optional)

Frontend `.env.local` is already configured:
- `NEXT_PUBLIC_API_URL=http://localhost:4002`

5. **Start the servers**

Option A - Use PowerShell scripts (Windows):
```powershell
# Terminal 1
.\start-backend.ps1

# Terminal 2
.\start-frontend.ps1
```

Option B - Manual start:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the app**
- Open browser to `http://localhost:3005`
- Create your account on the setup page
- Start tracking your finances!

## 📁 Project Structure

```
financeplay/
├── backend/
│   ├── src/
│   │   ├── server.ts           # Express server
│   │   ├── middleware/
│   │   │   └── auth.ts         # Authentication middleware
│   │   ├── routes/
│   │   │   ├── ai.ts           # AI coach endpoints
│   │   │   ├── data.ts         # CRUD operations
│   │   │   └── report.ts       # PDF report generation
│   │   └── utils/
│   │       ├── prompt.ts       # AI prompt templates
│   │       └── report-builder.ts
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Database migrations
│   └── package.json
│
├── frontend/
│   ├── app/                    # Next.js 14 app directory
│   │   ├── page.tsx           # Home/redirect page
│   │   ├── setup/             # User onboarding
│   │   ├── dashboard/         # Main dashboard
│   │   ├── transactions/      # Transaction management
│   │   ├── accounts/          # Account management
│   │   ├── goals/             # Savings goals
│   │   ├── bursaries/         # Bursary tracking
│   │   ├── reports/           # PDF reports
│   │   └── settings/          # User settings
│   ├── components/
│   │   ├── coach/             # AI coach panel
│   │   ├── dashboard/         # Dashboard widgets
│   │   ├── gamification/      # XP & leveling
│   │   └── ui/                # Reusable components
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   ├── store.ts           # Zustand state management
│   │   ├── types.ts           # TypeScript types
│   │   └── dataLoader.ts      # Data fetching & calculations
│   └── package.json
│
├── PRODUCTION_READY.md        # Production setup guide
├── DOMAIN_SUGGESTIONS.md      # 50+ domain name ideas
└── README.md                  # This file
```

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** SQLite with Prisma ORM
- **AI:** OpenAI GPT-4
- **PDF:** PDFKit for report generation

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 🔐 Security & Authentication

- User authentication via localStorage user ID
- Each user's data is completely isolated
- All API routes verify user ownership
- CORS enabled for development
- Production ready - implement JWT tokens for enhanced security

## 📝 Key Endpoints

### Data API (`/data/*`)
- `POST /data/user/init` - Create/get user account
- `GET /data/snapshot` - Get all user data
- `POST /data/transactions` - Add transaction
- `DELETE /data/transactions/:id` - Delete transaction
- `POST /data/goals` - Create goal
- `PUT /data/goals/:id` - Update goal progress
- `POST /data/accounts` - Create account
- `GET /data/accounts` - List accounts
- `POST /data/bursaries` - Add bursary

### AI API (`/ai/*`)
- `POST /ai/coach` - Chat with AI coach

### Reports API (`/reports/*`)
- `GET /reports/weekly` - Generate PDF report

## 🎯 What's New (Production Ready)

### ✅ Removed
- All mock data
- Hardcoded sample transactions
- Static insights and health scores

### ✅ Added
- Real-time data loading from backend
- Automatic financial health calculation
- Dynamic AI-generated insights
- Proper authentication flow
- Account balance tracking with transactions
- Complete CRUD operations for all entities
- Error handling and loading states

## 🌐 Domain Name Ideas

Check [DOMAIN_SUGGESTIONS.md](DOMAIN_SUGGESTIONS.md) for 50+ domain name suggestions!

Top recommendations:
1. **FinancePlay.io** - Perfect brand match
2. **CashQuest.app** - Emphasizes gamification
3. **StudentStash.co.za** - South African student market
4. **LevelUpMoney.com** - Clear value proposition
5. **MziMoney.co.za** - Local flavor

## 🐛 Troubleshooting

See [PRODUCTION_READY.md](PRODUCTION_READY.md) for detailed troubleshooting steps.

Common issues:
- **Backend won't start:** Check port 4002 availability
- **Frontend can't connect:** Verify backend is running
- **No data showing:** Create user account first
- **Database errors:** Run `npx prisma migrate reset`

## 📚 Additional Documentation

- [PRODUCTION_READY.md](PRODUCTION_READY.md) - Complete setup guide
- [DOMAIN_SUGGESTIONS.md](DOMAIN_SUGGESTIONS.md) - Domain name ideas
- [GETTING_STARTED.md](GETTING_STARTED.md) - Quick start guide
- [AUTHENTICATION.md](AUTHENTICATION.md) - Auth setup details
- [SECURITY.md](SECURITY.md) - Security best practices

## 🚀 Deployment

### Backend
- Deploy to Heroku, Railway, or any Node.js hosting
- Set environment variables
- Use PostgreSQL for production (update DATABASE_URL)
- Add HTTPS

### Frontend
- Deploy to Vercel (recommended for Next.js)
- Set `NEXT_PUBLIC_API_URL` to production backend
- Configure custom domain
- Enable analytics

## 🤝 Contributing

This is a production-ready personal finance app. Feel free to fork and customize for your needs!

## 📄 License

Private project - All rights reserved

## 👨‍💻 Author

Built with ❤️ for students and young professionals

---

**Status:** ✅ Production Ready - All features working with real backend!

**Current Version:** 1.0.0

**Last Updated:** December 2025
