# Single Deployment Configuration

Your app is now configured to work in two modes:

## Development Mode (Current)
- Backend runs on port 4002
- Frontend runs on port 3005
- Frontend calls backend directly at `http://localhost:4002`

## Production Mode (Single Deployment)
- Everything runs as one Next.js app
- API routes in `/app/api/*` proxy to backend routes
- Set `NEXT_PUBLIC_API_URL="/api"` in production

## Environment Variables

### Development (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:4002"
BACKEND_URL="http://localhost:4002"
```

### Production (.env.production or Vercel)
```env
NEXT_PUBLIC_API_URL="/api"
BACKEND_URL="http://localhost:4002"  # Or your backend service URL
```

## How It Works

1. **Client-side requests** go to `NEXT_PUBLIC_API_URL`
2. **API routes** (in `/app/api`) proxy requests to `BACKEND_URL`
3. For single deployment, both values work together seamlessly

## Deployment Options

### Option 1: Combined Deployment (Recommended)
Deploy frontend to Vercel with backend code integrated:
- Copy `backend/src` to `frontend/lib/backend`
- API routes use the backend code directly
- Set `NEXT_PUBLIC_API_URL="/api"`

### Option 2: Separate Services
Deploy frontend and backend separately:
- Deploy backend to Railway/Render
- Deploy frontend to Vercel
- Set `BACKEND_URL` to your backend service URL
- Set `NEXT_PUBLIC_API_URL="/api"` (uses proxy routes)

### Option 3: Current Setup
Keep them separate for development:
- Run backend with `npm run dev` in backend folder
- Run frontend with `npm run dev` in frontend folder
- Frontend connects directly to backend

## Authentication

- Sidebar and navigation are hidden on public pages (/, /login, /signup)
- Users must be logged in to see the dashboard and other features
- Authentication state is checked before showing navigation elements
