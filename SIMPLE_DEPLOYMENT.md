# 🚀 Combined Single Deployment Guide

## ✅ What Changed
Your backend API is now inside the frontend as Next.js API routes. **One deployment = Full working app!**

---

## 📋 Quick Deploy (5 minutes)

### Step 1: Get Free PostgreSQL (2 min)

1. Go to **https://neon.tech**
2. Sign up with GitHub
3. Create project: `financeplay`
4. **Copy your connection string** - looks like:
   ```
   postgresql://neondb_owner:xxxxx@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Deploy to Vercel (3 min)

```powershell
# Make sure you're in the frontend directory
cd frontend

# Deploy
vercel --prod
```

When prompted:
- **Set up and deploy?** → `Y`
- **Which scope?** → Your account
- **Link to existing project?** → `N` (or `Y` if you already have one)
- **Project name?** → `financeplay`
- **In which directory?** → `./` (press Enter)
- **Override settings?** → `N`

### Step 3: Add Environment Variables in Vercel

After deployment, add these in **Vercel Dashboard**:

1. Go to your project → **Settings** → **Environment Variables**
2. Add these 2 variables:

   **DATABASE_URL**
   ```
   postgresql://your-connection-string-from-neon
   ```

   **OPENAI_API_KEY**
   ```
   your-openai-api-key-here
   ```

3. **Redeploy** → Go to **Deployments** tab → Click ⋯ → **Redeploy**

### Step 4: Run Database Migrations

```powershell
# In frontend folder, set your DATABASE_URL temporarily
$env:DATABASE_URL="your-neon-connection-string"

# Run migrations
npx prisma migrate deploy
```

---

## ✅ Done!

Your complete app (frontend + backend) is now at:
**https://financeplay-xxx.vercel.app**

Test it:
1. Visit your URL
2. Click "Sign Up"  
3. Create an account
4. Start using the app!

---

## 🔧 For Local Development

Update `frontend/.env.local`:
```env
DATABASE_URL="your-neon-connection-string"
OPENAI_API_KEY="your-openai-api-key"
NEXT_PUBLIC_API_URL=""
```

Then run:
```powershell
cd frontend
npx prisma migrate deploy
npm run dev
```

Visit: http://localhost:3005

---

## 📁 What Was Changed

1. ✅ **Added Prisma to frontend** - Database now integrated
2. ✅ **Created API routes** - `/app/api/data/user/login` and `/app/api/data/user/init`
3. ✅ **Updated auth.ts** - Now uses local `/api` instead of external backend
4. ✅ **Updated build scripts** - Automatically generates Prisma client
5. ✅ **One deployment** - No separate backend needed!

---

## 🎯 Benefits

✅ One deployment instead of two  
✅ Simpler configuration  
✅ No CORS issues  
✅ Faster (no external API calls)  
✅ Easier to manage  

---

**Need help?** Let me know if any step fails!
