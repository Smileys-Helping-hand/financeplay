# ✅ Pre-Deployment Verification Checklist

Run through this checklist before deploying to ensure everything is configured correctly.

## 📦 Backend Verification

### ✅ Files Exist
- [x] `backend/vercel.json` exists
- [x] `backend/package.json` has `vercel-build` script
- [x] `backend/prisma/schema.prisma` configured for PostgreSQL
- [x] `backend/src/server.ts` exports app for serverless

### ✅ Backend Configuration
```bash
# Check backend vercel.json
cat backend/vercel.json

# Should see:
# - "src": "src/server.ts"
# - "use": "@vercel/node"
# - Routes for /health, /ai, /reports, /data
```

### ✅ Backend Package.json Scripts
```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy",
    "build": "prisma generate && tsc -b",
    "start": "node dist/server.js"
  }
}
```
✅ All present!

### ✅ Backend Dependencies
- [x] @prisma/client
- [x] express
- [x] cors
- [x] openai
- [x] All TypeScript types

## 🎨 Frontend Verification

### ✅ Files Exist
- [x] `frontend/vercel.json` exists
- [x] `frontend/package.json` configured
- [x] `frontend/next.config.js` exists
- [x] `frontend/lib/api.ts` uses environment variable

### ✅ Frontend Configuration
```bash
# Check frontend vercel.json
cat frontend/vercel.json

# Should see:
# - buildCommand with prisma generate
# - env variables section
```

### ✅ Frontend Package.json Scripts
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```
✅ All present!

### ✅ API Configuration
Check `frontend/lib/api.ts`:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
```
✅ Correctly reads from environment variable!

## 🗄️ Database Verification

### ✅ Prisma Configuration
```bash
# Check schema
cat backend/prisma/schema.prisma

# Should see:
# datasource db {
#   provider = "postgresql"
#   url = env("DATABASE_URL")
# }
```
✅ Configured for PostgreSQL!

### ✅ Migration Files
```bash
# List migrations
ls backend/prisma/migrations/

# Should see:
# - migration_lock.toml
# - 20251128100108_init/
# - 20251208161517_add_accounts_and_enhance_goals/
```
✅ Migrations ready!

## 🔐 Environment Variables Needed

### Backend Environment Variables
Copy these values for Vercel deployment:
```
DATABASE_URL=postgresql://[copy-from-supabase-or-neon]
OPENAI_API_KEY=your-openai-api-key-here
PORT=4002
NODE_ENV=production
```

### Frontend Environment Variables
```
NEXT_PUBLIC_API_URL=[your-backend-vercel-url]
DATABASE_URL=[same-as-backend]
```

## 🚀 Deployment Order

**IMPORTANT:** Deploy in this order:

1. **Backend First**
   - Get database connection string
   - Deploy backend to Vercel
   - Copy backend URL

2. **Frontend Second**
   - Use backend URL in NEXT_PUBLIC_API_URL
   - Deploy frontend to Vercel

3. **Run Migrations**
   - Ensure migrations ran during backend deployment
   - Or run manually with Vercel CLI

## 🧪 Testing After Deployment

### Test Backend
```bash
# Replace with your actual backend URL
curl https://your-backend.vercel.app/health

# Expected response:
# {"status":"ok"}
```

### Test Frontend
1. Open frontend URL in browser
2. Should see login/signup page
3. Try creating account
4. Check if dashboard loads

### Test Database
1. Create a transaction
2. Add a goal
3. View dashboard
4. Verify data persists

## 🔍 Debugging Tools

### Vercel Dashboard
- Check deployment logs
- View function execution logs
- Monitor errors

### Browser DevTools
- Check Network tab for API calls
- Look for CORS errors
- Verify API responses

### Database Client
Connect to your database with:
```bash
# Using Prisma Studio
npx prisma studio

# Or direct connection
psql "your-connection-string"
```

## ✅ Final Checklist

Before going live:

- [ ] PostgreSQL database created
- [ ] Database connection string saved
- [ ] OpenAI API key ready
- [ ] Backend deployed to Vercel
- [ ] Backend health check passes
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable set
- [ ] Migrations ran successfully
- [ ] Can create user account
- [ ] Can add transactions
- [ ] Can view dashboard
- [ ] No console errors in browser
- [ ] API calls succeed (check Network tab)

## 🎉 All Green?

If everything above checks out, your app is ready to use! 🚀

**Next Steps:**
1. Set up custom domain (optional)
2. Configure Firebase authentication
3. Invite users to test
4. Monitor Vercel analytics

## 📚 Documentation References

- `DEPLOY_TO_VERCEL_NOW.md` - Quick start guide
- `VERCEL_DEPLOY_COMPLETE.md` - Detailed instructions
- `backend/.env.example` - Backend environment template
- `frontend/.env.example` - Frontend environment template

---

**Questions or Issues?**
- Check Vercel deployment logs
- Review `VERCEL_DEPLOY_COMPLETE.md` troubleshooting section
- Verify all environment variables are set correctly
