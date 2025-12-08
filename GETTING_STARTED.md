# FinancePlay - Personal Finance Management

Your personal finance tracking application is now ready to use with your own data!

## 🚀 Access Your App

**Frontend:** http://localhost:3005  
**Backend API:** http://localhost:4002

## ✅ What's Ready

- ✅ Clean database - no mock data
- ✅ Backend running on port 4002
- ✅ Frontend running on port 3005
- ✅ Full CRUD operations for all data
- ✅ OpenAI integration for AI coach

## 📝 Getting Started

1. **First Time Setup**
   - Visit http://localhost:3005/setup
   - Enter your name and email
   - Click "Get Started"

2. **Add Your Data**
   - **Accounts**: Click "Accounts" in the sidebar (NEW!)
     - Add your wallets (cash on hand)
     - Add bank accounts (checking, savings)
     - Add investment accounts
     - Track total balance across all accounts
   
   - **Transactions**: Click "Transactions" in the sidebar
     - Add income, expenses, savings
     - Categories: food, transport, rent, education, etc.
     - Link transactions to specific accounts (optional)
     - Edit or delete transactions anytime
   
   - **Goals**: Click "Goals" in the sidebar
     - Set savings targets with categories
     - Enable auto-save feature for monthly contributions
     - Choose priority levels
     - Track progress
     - Update amounts as you save
   
   - **Bursaries**: Click "Bursaries" in the sidebar
     - Add NSFAS or other funding
     - Track payment dates
     - Manage multiple bursaries

3. **Use the Dashboard**
   - View spending overview
   - See financial insights
   - Check your financial health score

4. **AI Coach**
   - Get personalized financial advice
   - Ask questions about budgeting
   - Get help with financial planning

## 🎯 Features

### Accounts Page (NEW!)
- ✅ Add multiple accounts (wallets, bank accounts, savings, investments)
- ✅ Track balance for each account
- ✅ Different account types with visual icons and colors
- ✅ Update balances easily
- ✅ See total balance across all accounts
- ✅ Delete accounts when no longer needed

### Transactions Page
- ✅ Add new transactions (income/expenses)
- ✅ **Link transactions to specific accounts for automatic balance updates**
- ✅ **Preview how transactions will affect account balances**
- ✅ Categorize spending
- ✅ Delete transactions (balances auto-restore)
- ✅ View transaction history with account information
- ✅ See which account was used for each transaction

### Goals Page (ENHANCED!)
- ✅ Create savings goals with categories (emergency, vacation, purchase, etc.)
- ✅ Set target amounts and deadlines
- ✅ Track progress with visual indicators
- ✅ Priority levels (high, medium, low)
- ✅ Auto-save feature - set monthly auto-save amounts
- ✅ Update progress manually
- ✅ Delete completed/unwanted goals

### Bursaries Page
- ✅ Add funding sources (NSFAS, etc.)
- ✅ Track monthly amounts
- ✅ Monitor payment dates
- ✅ Add notes for each bursary
- ✅ Delete old bursaries

### Dashboard
- View spending breakdown by category
- See total expenses and savings
- Financial health score
- Quick insights and recommendations

### Reports
- Generate weekly/monthly summaries
- Export financial reports

## 🔧 Managing the Application

### Start Servers
```powershell
# Backend
cd backend
npm run dev

# Frontend (in separate terminal)
cd frontend
npm run dev
```

Or use the shortcut scripts:
```powershell
.\start-backend.ps1
.\start-frontend.ps1
```

### Stop Servers
Close the PowerShell windows or press `Ctrl+C` in each terminal

## 💡 Tips

- Start by adding a few transactions to see the dashboard populate
- Set at least one goal to track your savings progress
- Use descriptive names for transactions to make reports clearer
- Update goal progress regularly to stay motivated
- Check the AI coach for personalized advice

Enjoy tracking your finances! 💰
