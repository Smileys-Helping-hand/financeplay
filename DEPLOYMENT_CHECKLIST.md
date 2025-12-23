# 🚀 Quick Deployment Checklist

## Current Status
- ✅ Frontend on Vercel
- ❌ Backend not deployed (causing network error)

## Fix the Network Error - Deploy Backend Now

### Step 1: Deploy Backend to Railway (15 minutes)

1. **Go to Railway**
   - Visit [railway.app](https://railway.app)
   - Login with GitHub

2. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `financeplay` repository
   - Set **Root Directory**: `backend`

3. **Add Database**
   - Click "+ New" → "Database" → "PostgreSQL"
   - Railway auto-connects DATABASE_URL

4. **Add Environment Variables**
   ```
   NODE_ENV=production
   OPENAI_API_KEY=your-key-here
   PORT=4002
   ```

5. **Update Build Settings**
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`

6. **Deploy**
   - Railway will auto-deploy
   - Wait for green checkmark
   - Copy your Railway URL (e.g., `https://financeplay-production.up.railway.app`)

### Step 2: Update Frontend Environment Variable

1. **Go to Vercel Dashboard**
   - Open your project settings
   - Go to "Environment Variables"

2. **Add Backend URL**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
   Replace with your actual Railway URL

3. **Redeploy Frontend**
   - Go to "Deployments"
   - Click "..." on latest deployment → "Redeploy"

### Step 3: Test
- Visit your domain
- Try signing in
- Should work! ✨

## Important Note

Before deploying, update Prisma to use PostgreSQL:

In `backend/prisma/schema.prisma`, change:
```prisma
provider = "sqlite"
```
To:
```prisma
provider = "postgresql"
```

Then commit and push to trigger Railway deployment.
