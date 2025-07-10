# PowerShell script to run CI-built Docker images (No Auth Version)
# M324 Todo List - CI Image Runner

Write-Host "🚀 M324 Todo List - Running CI-Built Images" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Step 1: Try pulling images without authentication first
Write-Host "`n📦 Step 1: Pulling latest CI-built images..." -ForegroundColor Yellow
Write-Host "Note: Trying without authentication first (public images)" -ForegroundColor Cyan

Write-Host "Pulling backend image..." -ForegroundColor Cyan
docker pull ghcr.io/eltdrfrs/m324_projekt_todolist/todo-backend:latest

Write-Host "Pulling frontend image..." -ForegroundColor Cyan  
docker pull ghcr.io/eltdrfrs/m324_projekt_todolist/todo-frontend:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to pull images without authentication." -ForegroundColor Red
    Write-Host "⚠️  This likely means:" -ForegroundColor Yellow
    Write-Host "   1. CI workflow hasn't run successfully yet" -ForegroundColor White
    Write-Host "   2. Images are private and need authentication" -ForegroundColor White
    Write-Host "   3. Repository or image names are incorrect" -ForegroundColor White
    Write-Host "`n💡 Solutions:" -ForegroundColor Cyan
    Write-Host "   - Check GitHub Actions tab to see if CI completed" -ForegroundColor White
    Write-Host "   - Create/update your Personal Access Token" -ForegroundColor White
    Write-Host "   - Make sure repository is public or images are public" -ForegroundColor White
    exit 1
}

# Step 2: Stop existing containers if running
Write-Host "`n🛑 Step 2: Stopping existing containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.ci.yml down --remove-orphans

# Step 3: Start the application
Write-Host "`n🚀 Step 3: Starting M324 Todo List with CI images..." -ForegroundColor Yellow
docker-compose -f docker-compose.ci.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start containers. Check docker-compose.ci.yml configuration." -ForegroundColor Red
    exit 1
}

# Step 4: Show container status
Write-Host "`n📊 Step 4: Container Status..." -ForegroundColor Yellow
docker-compose -f docker-compose.ci.yml ps

# Step 5: Display access information
Write-Host "`n🌐 Application URLs:" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:8080/api" -ForegroundColor White
Write-Host "Health Check: http://localhost:8080/api/actuator/health" -ForegroundColor White
Write-Host "MySQL: localhost:3306 (user: todouser, pass: todopass)" -ForegroundColor White

Write-Host "`n📋 Useful Commands:" -ForegroundColor Cyan
Write-Host "View logs: docker-compose -f docker-compose.ci.yml logs -f" -ForegroundColor White
Write-Host "Stop app: docker-compose -f docker-compose.ci.yml down" -ForegroundColor White
Write-Host "Restart: docker-compose -f docker-compose.ci.yml restart" -ForegroundColor White

Write-Host "`n🎉 M324 Todo List is now running with CI-built images!" -ForegroundColor Green
Write-Host "Check the URLs above to access your application." -ForegroundColor Yellow
