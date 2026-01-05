# FinancePlay - Unified Deployment Guide

## 🎉 Backend and Frontend Consolidated!

Your FinancePlay app has been successfully consolidated into a **single Next.js application**. The backend API routes are now part of the Next.js app, eliminating the need for a separate backend deployment.

## What Changed?

### ✅ Consolidated Architecture
- **Before**: Separate frontend (Next.js) and backend (Express) deployments
- **After**: Single Next.js application with built-in API routes
- **Benefit**: No CORS issues, simpler deployment, faster performance

### 🔧 Technical Changes
1. Backend routes migrated to Next.js API routes:
   - `/api/data/*` - All data operations (transactions, goals, accounts, bursaries)
   - `/api/ai/coach` - AI coaching functionality
   - `/api/reports/weekly` - PDF report generation
   - `/api/data/user/login` - User authentication
   - `/api/data/user/init` - User registration

2. Dependencies updated:
   - Added `pdfkit` for PDF generation
   - All backend logic now runs in Next.js serverless functions

3. Removed proxy routes:
   - Deleted `/api/ai/route.ts` (was proxying to backend)
   - Deleted `/api/reports/[...path]/route.ts` (was proxying to backend)

## Deployment Instructions

### Option 1: Deploy to Vercel (Recommended)

1. **Push your code to GitHub** (if not already done)
   ```powershell
   git add .
   git commit -m "Consolidated frontend and backend"
   git push
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory
   - Add environment variables:
     - `DATABASE_URL` - Your PostgreSQL connection string
     - `OPENAI_API_KEY` - Your OpenAI API key (optional, will use fallback if not set)
     - `NEXTAUTH_SECRET` - Random secret for session encryption
   - Click "Deploy"

3. **That's it!** Your app is live on a single domain with both frontend and backend.

### Option 2: Deploy to Railway

1. **Create a new Railway project**:
   ```powershell
   cd frontend
   railway init
   ```

2. **Add environment variables** in Railway dashboard:
   - `DATABASE_URL`
   - `OPENAI_API_KEY` (optional)

3. **Deploy**:
   ```powershell
   railway up
   ```

### Option 3: Local Development

1. **Set up environment variables**:
   Create `.env.local` in the `frontend` folder:
   ```env
   DATABASE_URL="your-postgres-connection-string"
   OPENAI_API_KEY="your-openai-key"
   ```

2. **Run the development server**:
   ```powershell
   cd frontend
   npm run dev
   ```

3. **Access the app**:
   - Frontend: http://localhost:3005
   - API: http://localhost:3005/api/*

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `OPENAI_API_KEY` | No | OpenAI API key (fallback responses used if not set) |

## API Endpoints

All API endpoints are now available at `/api/*`:

### User Management
- `POST /api/data/user/init` - Register new user
- `POST /api/data/user/login` - Login user

### Data Operations
- `GET /api/data/snapshot` - Get user's financial snapshot
- `POST /api/data/transactions` - Create transaction
- `DELETE /api/data/transactions/:id` - Delete transaction
- `POST /api/data/goals` - Create goal
- `PUT /api/data/goals/:id` - Update goal
- `DELETE /api/data/goals/:id` - Delete goal
- `POST /api/data/accounts` - Create account
- `GET /api/data/accounts` - Get all accounts
- `PUT /api/data/accounts/:id` - Update account
- `DELETE /api/data/accounts/:id` - Delete account
- `POST /api/data/bursaries` - Create bursary
- `DELETE /api/data/bursaries/:id` - Delete bursary

### AI & Reports
- `POST /api/ai/coach` - Chat with AI coach
- `GET /api/reports/weekly` - Download weekly PDF report

## Database Setup

Your app uses PostgreSQL. Make sure to:

1. **Create a database** on a service like:
   - [Neon](https://neon.tech) (recommended - free tier)
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)

2. **Run migrations**:
   ```powershell
   cd frontend
   npx prisma migrate deploy
   ```

3. **Seed the database** (optional):
   ```powershell
   npx prisma db seed
   ```

## Testing the Deployment

Once deployed, test these features:

1. ✅ Sign up / Login
2. ✅ Add transactions
3. ✅ Create goals
4. ✅ Chat with AI coach
5. ✅ Generate weekly report

## Troubleshooting

### Login keeps failing
- **Solution**: This was caused by the backend not running. Now that everything is unified, login should work!
- Check that `DATABASE_URL` is set correctly in your deployment environment

### AI Coach not working
- **Solution**: Set `OPENAI_API_KEY` in your environment variables
- If not set, the app will use fallback responses

### Database connection errors
- **Solution**: Verify your `DATABASE_URL` is correct and the database is accessible from your deployment platform

## Next Steps

1. ✅ Deploy to your preferred platform
2. Set up custom domain (optional)
3. Monitor with Vercel Analytics or similar
4. Set up error tracking with Sentry (optional)

## Benefits of This Architecture

- **Single deployment** - No need to manage separate frontend and backend
- **No CORS issues** - Everything runs on the same domain
- **Better performance** - API routes are serverless functions co-located with your frontend
- **Simpler maintenance** - One codebase, one deployment
- **Cost-effective** - Only pay for one deployment

---

**Need help?** Check the logs in your deployment platform for any errors.
