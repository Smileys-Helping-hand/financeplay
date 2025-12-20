# 🚀 Quick Backend Deployment to Railway

## Step 1: Go to Railway
1. Visit [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click **"New Project"**

## Step 2: Deploy Backend
1. Click **"Deploy from GitHub repo"**
2. Select: `Smileys-Helping-hand/financeplay`
3. Click on the deployment that was created

## Step 3: Configure Settings
1. Click **Settings** (gear icon)
2. Under **Root Directory**, enter: `backend`
3. Under **Start Command**, enter: `npm run build && npm start`

## Step 4: Add PostgreSQL Database
1. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will create a database and connect it automatically
3. Your DATABASE_URL will be set automatically

## Step 5: Add Environment Variables
In your backend service settings, add:

```
OPENAI_API_KEY=<your-openai-api-key>
NODE_ENV=production
```

Replace `<your-openai-api-key>` with your actual OpenAI API key.

DATABASE_URL is auto-set by Railway when you add PostgreSQL.

## Step 6: Update Schema for PostgreSQL
After deployment, you'll need to change your schema.prisma:

**Change this:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**To this:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then commit and push to trigger redeploy.

## Step 7: Get Your Backend URL
After deployment, Railway will give you a URL like:
`https://financeplay-production.up.railway.app`

## Step 8: Update Vercel Environment Variable
1. Go to your Vercel project
2. Settings → Environment Variables
3. Edit `NEXT_PUBLIC_API_URL`
4. Change to your Railway URL: `https://your-backend.railway.app`
5. Redeploy frontend

## ✅ Done!
Your backend is now running 24/7 and your frontend can connect to it!

**Cost:** Railway offers $5 free credit per month - perfect for starting!
