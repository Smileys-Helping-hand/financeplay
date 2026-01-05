# FinancePlay - Local Development

Write-Host "🚀 Starting FinancePlay (Unified App)..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-Not (Test-Path "frontend")) {
    Write-Host "❌ Error: frontend directory not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    exit 1
}

# Navigate to frontend directory
Set-Location frontend

# Check for .env.local
if (-Not (Test-Path ".env.local")) {
    Write-Host "⚠️  No .env.local file found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Creating .env.local from .env.example..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env.local"
    Write-Host ""
    Write-Host "✅ Created .env.local" -ForegroundColor Green
    Write-Host "📝 Please edit .env.local and add your DATABASE_URL" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Example:" -ForegroundColor White
    Write-Host "  DATABASE_URL='postgresql://user:password@localhost:5432/financeplay'" -ForegroundColor Gray
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        Set-Location ..
        exit 0
    }
}

Write-Host "✅ Installing dependencies..." -ForegroundColor Green
npm install

Write-Host ""
Write-Host "✅ Generating Prisma Client..." -ForegroundColor Green
npx prisma generate

Write-Host ""
Write-Host "🚀 Starting development server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend & API: http://localhost:3005" -ForegroundColor White
Write-Host "API Routes: http://localhost:3005/api/*" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

npm run dev

Set-Location ..
