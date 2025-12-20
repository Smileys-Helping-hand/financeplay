# 🚀 Deploy Backend to Railway - Complete Guide

## Step 1: Sign up for Railway

1. Go to [railway.app](https://railway.app)
2. Click "Login" or "Start a New Project"
3. Sign in with GitHub (recommended - will auto-connect your repo)

## Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: **financeplay**
4. Railway will detect it's a monorepo

## Step 3: Configure Backend Service

1. After selecting the repo, Railway will ask you to configure
2. Set **Root Directory** to: `backend`
3. Railway will auto-detect it's a Node.js Express app
4. The build command will be: `npm install && npx prisma generate`
5. The start command will be: `npm start`

## Step 4: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. **IMPORTANT**: Railway auto-connects DATABASE_URL to your service

## Step 5: Add Environment Variables

In your backend service settings, add these variables:

```
NODE_ENV=production
OPENAI_API_KEY=<your-openai-api-key>
```

Replace `<your-openai-api-key>` with your actual OpenAI API key.

*Note: DATABASE_URL is automatically set by Railway when you add PostgreSQL*

## Step 6: Update Prisma Schema for PostgreSQL

You need to change your database provider from SQLite to PostgreSQL:

**File:** `backend/prisma/schema.prisma`

Change this:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

To this:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Commit and push this change:
```powershell
git add backend/prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push origin main
```

## Step 7: Deploy & Run Migrations

Railway will automatically deploy when you push. After deployment:

1. Go to your backend service in Railway dashboard
2. Click on "Deployments" tab
3. Wait for deployment to complete (green checkmark)
4. Once deployed, you need to run database migrations

### Run Migrations in Railway

Railway doesn't run migrations automatically. You have two options:

**Option A: One-time migration via Railway CLI**
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Link to your project: `railway link`
4. Run migration: `railway run npx prisma migrate deploy`

**Option B: Add migration to build command** (Recommended)
1. Go to backend service settings
2. Find "Build Command"
3. Change it to: `npm install && npx prisma generate && npx prisma migrate deploy`
4. Redeploy

## Step 8: Get Your Backend URL

1. In Railway, go to your backend service
2. Click on "Settings" tab
3. Scroll to "Domains"
4. Click "Generate Domain"
5. Railway will give you a URL like: `https://financeplay-production.up.railway.app`
6. **COPY THIS URL** - you'll need it for the frontend

## Step 9: Update Frontend Environment Variables

Now you need to tell your frontend (on Vercel) where the backend is:

1. Go to [vercel.com](https://vercel.com)
2. Open your **financeplay** project
3. Go to "Settings" → "Environment Variables"
4. Find `NEXT_PUBLIC_API_URL`
5. Change the value to your Railway URL (from Step 8)
   - Example: `https://financeplay-production.up.railway.app`
6. Click "Save"
7. Go to "Deployments" tab
8. Find the latest deployment
9. Click "..." menu → "Redeploy"

## Step 10: Test Everything

1. Visit your Vercel frontend: `https://financeplay.vercel.app`
2. Click "Create Account"
3. Enter your name and email
4. You should be redirected to the dashboard
5. Try adding a transaction
6. Check if it saves (refresh the page - data should persist)

## Troubleshooting

### Problem: Backend won't start
- **Check logs**: Railway dashboard → Service → "Deployments" → Click deployment → "View Logs"
- **Common issue**: Missing environment variables
- **Solution**: Double-check OPENAI_API_KEY and DATABASE_URL are set

### Problem: Database connection error
- **Error**: "Can't reach database server"
- **Solution**: Make sure PostgreSQL is added and linked to your backend service

### Problem: Migrations failing
- **Error**: "Migration engine error"
- **Solution**: Run `railway run npx prisma migrate reset` (WARNING: deletes all data)
- **Better solution**: Make sure schema.prisma uses `provider = "postgresql"`

### Problem: Frontend can't connect to backend
- **Error**: CORS or Network Error in browser console
- **Solution**: Make sure NEXT_PUBLIC_API_URL in Vercel points to correct Railway URL
- **Check**: Railway URL should NOT have trailing slash

### Problem: 404 on Railway URL
- **Check**: Make sure Root Directory is set to `backend`
- **Check**: Build and start commands are correct
- **Solution**: Redeploy with correct settings

## Quick Reference

### Railway Settings for Backend:
- **Root Directory**: `backend`
- **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
- **Start Command**: `npm start`
- **Port**: Railway auto-detects from your code (4002)

### Environment Variables Needed:
- `DATABASE_URL` (auto-set by Railway)
- `NODE_ENV=production`
- `OPENAI_API_KEY=<your-key>`

### After Setup:
- Backend URL: `https://your-app.up.railway.app`
- Frontend URL: `https://financeplay.vercel.app`
- Database: PostgreSQL on Railway

## Cost

Railway gives you:
- $5 free credit per month
- Your app will likely use ~$3-5/month
- Database included in the free tier initially

## Next Steps After Deployment

1. Connect your domain (xpfinance.com) to Vercel
2. Add custom domain to Railway if needed
3. Monitor your app in Railway dashboard
4. Set up error tracking (optional: Sentry)
5. Enable auto-deploy: Railway will auto-deploy on every git push

---

**🎉 You're done! Your app is now live and production-ready!**

Visit your live site and start using XPFinance! 🚀
