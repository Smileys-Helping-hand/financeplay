# 🚀 Complete Vercel Deployment Guide - FinancePlay

This guide will help you deploy both the backend and frontend to Vercel so you can start using your app in production.

## 📋 Prerequisites

- ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ GitHub repository with your code
- ✅ PostgreSQL database (we recommend [Supabase](https://supabase.com) or [Neon](https://neon.tech) - both have free tiers)
- ✅ OpenAI API key (get from [platform.openai.com](https://platform.openai.com/api-keys))

## 🎯 Step 1: Set Up Your Database

### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) and create account
2. Click "New Project"
3. Choose a name (e.g., "financeplay")
4. Set a database password (save this!)
5. Wait for project to initialize (~2 minutes)
6. Go to **Settings** → **Database** → **Connection String** → **URI**
7. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@...`)
8. Replace `[YOUR-PASSWORD]` with the password you set

### Option B: Neon

1. Go to [neon.tech](https://neon.tech) and create account
2. Click "Create Project"
3. Copy the connection string provided

## 🔧 Step 2: Deploy Backend to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Click "Add New..." → "Project"

2. **Import Your Repository**
   - Select your GitHub repository
   - Click "Import"

3. **Configure Backend Project**
   - **Project Name:** `financeplay-backend` (or your choice)
   - **Framework Preset:** Other
   - **Root Directory:** `backend` ← IMPORTANT!
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** Leave blank
   - **Install Command:** `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   DATABASE_URL=postgresql://your-connection-string-from-step-1
   OPENAI_API_KEY=sk-your-openai-api-key
   PORT=4002
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (~2-3 minutes)
   - Copy your backend URL (e.g., `https://financeplay-backend.vercel.app`)

6. **Run Database Migrations** (IMPORTANT!)
   - Go to your project's **Settings** → **Functions**
   - Or use Vercel CLI:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Link to your project
   cd backend
   vercel link
   
   # Run migrations
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

## 🎨 Step 3: Deploy Frontend to Vercel

1. **Add New Project** (or use the same repo with different root)
   - Go back to [vercel.com/new](https://vercel.com/new)
   - Import the SAME repository again

2. **Configure Frontend Project**
   - **Project Name:** `financeplay` (or your choice)
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `frontend` ← IMPORTANT!
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install`

3. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
   DATABASE_URL=postgresql://your-connection-string-from-step-1
   ```
   
   **Replace `your-backend-url.vercel.app`** with the URL from Step 2.5!

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment (~3-5 minutes)
   - You'll get a URL like `https://financeplay.vercel.app`

## 🌐 Step 4: Add Custom Domain (Optional)

### For Backend:
1. Go to backend project → **Settings** → **Domains**
2. Add: `api.yourdomain.com`
3. Configure DNS with your domain provider:
   - Type: CNAME
   - Name: api
   - Value: cname.vercel-dns.com

### For Frontend:
1. Go to frontend project → **Settings** → **Domains**
2. Add: `yourdomain.com` or `www.yourdomain.com`
3. Configure DNS with your domain provider:
   - Type: A Record (for root domain)
   - Name: @
   - Value: 76.76.21.21
   
   OR
   
   - Type: CNAME (for www)
   - Name: www
   - Value: cname.vercel-dns.com

### Update Frontend Environment Variable:
After setting up custom domain for backend, update the frontend's `NEXT_PUBLIC_API_URL`:
- Go to frontend project → **Settings** → **Environment Variables**
- Update `NEXT_PUBLIC_API_URL` to `https://api.yourdomain.com`
- Redeploy the frontend

## ✅ Step 5: Verify Everything Works

1. **Test Backend**
   - Visit: `https://your-backend-url.vercel.app/health`
   - Should see: `{"status":"ok"}`

2. **Test Frontend**
   - Visit your frontend URL
   - Try logging in
   - Check if dashboard loads

3. **Test Database Connection**
   - Create a transaction
   - Add a goal
   - Verify data persists

## 🔄 Updating Your App

Whenever you push to your GitHub repository:
- Vercel automatically rebuilds and redeploys both projects
- No manual deployment needed!

## 🐛 Troubleshooting

### "Module not found: Can't resolve '@prisma/client'"
**Solution:** Make sure `vercel-build` script runs in backend package.json:
```json
"vercel-build": "prisma generate && prisma migrate deploy"
```

### "Database connection error"
**Solution:** 
1. Verify DATABASE_URL is correct in environment variables
2. Check if database is accessible from Vercel (most managed databases allow this)
3. Ensure migrations ran successfully

### "CORS error" when frontend calls backend
**Solution:** Backend already has CORS enabled. Make sure:
1. `NEXT_PUBLIC_API_URL` in frontend matches your backend URL exactly
2. No trailing slash in the URL

### Build fails with "Out of memory"
**Solution:**
1. Go to Project Settings → General
2. Under "Build & Development Settings"
3. Add `NODE_OPTIONS="--max-old-space-size=4096"` as environment variable

### Frontend can't reach backend
**Solution:**
1. Check frontend environment variable `NEXT_PUBLIC_API_URL` is set correctly
2. Ensure you're using the PRODUCTION backend URL, not localhost
3. Test backend health endpoint in browser

## 📱 Firebase Authentication Setup

Don't forget to update Firebase configuration:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → **Authentication** → **Settings**
3. Add Authorized Domains:
   - Your frontend Vercel URL
   - Your custom domain (if using)
4. Update frontend's Firebase config if needed

## 🎉 You're Live!

Your FinancePlay app is now running on Vercel! Share your URL and start using it.

**Important URLs to Save:**
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.vercel.app`
- Database: (from your database provider)

## 💡 Tips for Production

1. **Enable Production Mode:**
   - Both projects already have `NODE_ENV=production` set

2. **Monitor Your App:**
   - Use Vercel's built-in analytics
   - Check function logs in Vercel dashboard

3. **Set Up Database Backups:**
   - Supabase: Automatic backups included
   - Neon: Configure backup schedules

4. **Secure Your Keys:**
   - Never commit `.env` files to Git
   - Rotate API keys periodically
   - Use Vercel's encrypted environment variables

## 🚨 Quick Checklist

Before going live, ensure:
- [ ] Database is set up and migrations are run
- [ ] Backend deploys successfully and `/health` endpoint works
- [ ] Frontend deploys successfully
- [ ] Environment variables are set in both projects
- [ ] Frontend can communicate with backend
- [ ] Firebase authentication is configured
- [ ] Custom domain is set up (if using)
- [ ] Test all main features work

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
