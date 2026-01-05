# FinancePlay - Quick Deploy to Vercel

Write-Host "🚀 FinancePlay - Deploying to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-Not (Test-Path "frontend")) {
    Write-Host "❌ Error: frontend directory not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    exit 1
}

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-Not $vercelInstalled) {
    Write-Host "📦 Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Navigate to frontend directory
Set-Location frontend

Write-Host "✅ Installing dependencies..." -ForegroundColor Green
npm install

Write-Host ""
Write-Host "✅ Running Prisma generate..." -ForegroundColor Green
npx prisma generate

Write-Host ""
Write-Host "📝 Important: Make sure to set these environment variables in Vercel:" -ForegroundColor Yellow
Write-Host "  - DATABASE_URL (required)" -ForegroundColor White
Write-Host "  - OPENAI_API_KEY (optional)" -ForegroundColor White
Write-Host ""

# Deploy
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Add environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "  2. Run database migrations: vercel env pull && npx prisma migrate deploy" -ForegroundColor White
Write-Host "  3. Test your app at the provided URL" -ForegroundColor White
Write-Host ""

Set-Location ..
