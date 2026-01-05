# 🔧 Fix Login Issue - Vercel Environment Configuration

## The Problem

Your app is trying to reach the old Railway backend URL (`financeplay-production.up.railway.app`) instead of using the unified Next.js API routes.

## The Solution

### Step 1: Remove Old Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. **DELETE** these variables if they exist:
   - `NEXT_PUBLIC_API_URL` (remove completely!)
   - `BACKEND_URL` (remove completely!)
   - Any variable pointing to Railway

4. **KEEP** only these variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `OPENAI_API_KEY` - Your OpenAI API key (optional)

### Step 2: Redeploy

After removing the old environment variables:

**Option A: Automatic (recommended)**
```bash
git add .
git commit -m "Fix API configuration for unified deployment"
git push origin main
```
Vercel will automatically redeploy.

**Option B: Manual**
Go to your Vercel project and click **"Redeploy"** on the latest deployment.

## Why This Fixes It

### Before (Broken):
- Frontend tries to call: `financeplay-production.up.railway.app/data/user/login`
- Railway backend doesn't exist or isn't running → 404/500 errors
- Login fails

### After (Fixed):
- Frontend calls: `xpfinance.co.za/api/data/user/login`
- Next.js API routes handle the request → Success!
- Login works ✅

## Verification

After redeployment, check:

1. Open browser console on your site
2. Try to login
3. Network tab should show requests to:
   - ✅ `xpfinance.co.za/api/data/user/login` (NOT Railway URL)

## Complete Vercel Setup

Your Vercel environment variables should look like this:

```
DATABASE_URL = postgresql://user:pass@host/db
OPENAI_API_KEY = sk-... (optional)
```

**That's it!** No `NEXT_PUBLIC_API_URL`, no `BACKEND_URL`.

---

## Quick Commands

Push the fix:
```bash
cd E:\Projects\financeplay
git add .
git commit -m "Fix API base URL for unified deployment"
git push origin main
```

---

**After these changes, your login will work!** 🎉
