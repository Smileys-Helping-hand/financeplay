# Backend Deployment to Vercel

## 📋 Prerequisites
- Vercel account
- PostgreSQL database (Vercel Postgres, Neon, or other)
- OpenAI API key (optional)

## 🚀 Deployment Steps

### 1. **Prepare Your Database**
Since Vercel uses serverless functions, you need a cloud database. SQLite won't work in production.

**Option A: Vercel Postgres (Recommended)**
- Create a new Vercel Postgres database in your Vercel dashboard
- Copy the `DATABASE_URL` connection string

**Option B: Neon.tech (Free Tier)**
- Sign up at https://neon.tech
- Create a new project
- Copy the connection string

**Option C: Railway Postgres**
- Create a PostgreSQL database on Railway
- Copy the connection string

### 2. **Update Your DATABASE_URL**
The connection string format:
```
postgresql://user:password@host:5432/database?sslmode=require
```

### 3. **Deploy to Vercel**

#### Via Vercel Dashboard:

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **IMPORTANT**: Set **Root Directory** to `backend`
4. Configure Build Settings:
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `dist` (or leave empty)
   - Install Command: `npm install`

5. Add Environment Variables:
   ```
   DATABASE_URL=your_postgres_connection_string
   OPENAI_API_KEY=your_openai_key (optional)
   NODE_ENV=production
   ```

6. Click **Deploy**

#### Via Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Navigate to backend folder
cd backend

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? financeplay-backend
# - In which directory? ./ (current directory is already backend)
# - Override settings? No

# Add environment variables
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
vercel env add NODE_ENV

# Deploy to production
vercel --prod
```

### 4. **Run Database Migrations**

After first deployment, you need to run migrations:

```bash
# Set your DATABASE_URL locally for migration
export DATABASE_URL="your_vercel_postgres_url"

# Run migrations
npx prisma migrate deploy

# Or use Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
```

Alternatively, migrations run automatically during build via the `vercel-build` script.

### 5. **Update Frontend to Use Vercel Backend**

Update your frontend environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

Or in Vercel frontend settings:
```
NEXT_PUBLIC_API_URL=https://financeplay-backend.vercel.app
```

## 📝 Configuration Files Created

### `vercel.json`
- Configures Vercel to use Node.js runtime
- Routes all API requests to server.ts
- Sets up environment variables

### `.vercelignore`
- Excludes unnecessary files from deployment
- Reduces deployment size

### Updated `package.json`
- Added `vercel-build` script for automatic Prisma setup
- Ensures migrations run during deployment

### Updated `src/server.ts`
- Exports app for Vercel serverless functions
- Maintains local development compatibility

## ✅ Testing Your Deployment

Once deployed, test these endpoints:

```bash
# Health check
curl https://your-backend.vercel.app/health

# Should return: {"status":"ok"}
```

## 🔧 Common Issues & Solutions

### Issue: "Cannot find module '@prisma/client'"
**Solution**: Ensure `vercel-build` script runs `prisma generate`

### Issue: "Database connection failed"
**Solution**: 
- Verify DATABASE_URL is set in Vercel environment variables
- Ensure database allows connections from any IP (0.0.0.0/0)
- Check connection string format includes `?sslmode=require`

### Issue: "Route not found"
**Solution**: Check vercel.json routes match your API structure

### Issue: "Function timeout"
**Solution**: Vercel free tier has 10s timeout. Optimize long-running queries.

## 📊 Monitoring

- View logs: `vercel logs` or in Vercel Dashboard
- Check deployments: https://vercel.com/dashboard
- Monitor database: Use your database provider's dashboard

## 🔄 Redeployment

Every push to your main branch auto-deploys if connected to GitHub.

Manual redeploy:
```bash
cd backend
vercel --prod
```

## 🌐 Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update frontend `NEXT_PUBLIC_API_URL`

---

**Note**: Remember to update your frontend's API URL environment variable after backend deployment!
