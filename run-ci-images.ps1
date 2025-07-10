# PowerShell script to run CI-built Docker images
# M324 Todo List - CI Image Runner

Write-Host " M324 Todo List - Running CI-Built Images" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Step 1: Authenticate with GitHub Container Registry
Write-Host "`n Step 1: Authenticating with GitHub Container Registry..." -ForegroundColor Yellow
Write-Host "Note: You'll need to use your GitHub username and Personal Access Token" -ForegroundColor Cyan

# Login command (user will need to enter credentials)
docker login ghcr.io

if ($LASTEXITCODE -ne 0) {
    Write-Host " Docker login failed. Please check your credentials." -ForegroundColor Red
    Write-Host "Use your GitHub username and the Personal Access Token (ghp_...) as password" -ForegroundColor Yellow
    exit 1
}

# Step 2: Pull latest images from CI
Write-Host "`n Step 2: Pulling latest CI-built images..." -ForegroundColor Yellow

Write-Host "Pulling backend image..." -ForegroundColor Cyan
docker pull ghcr.io/eltdrfrs/m324_projekt_todolist/todo-backend:latest

Write-Host "Pulling frontend image..." -ForegroundColor Cyan  
docker pull ghcr.io/eltdrfrs/m324_projekt_todolist/todo-frontend:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host " Failed to pull images. Check if CI has run successfully." -ForegroundColor Red
    exit 1
}

# Step 3: Stop existing containers if running
Write-Host "`n Step 3: Stopping existing containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.ci.yml down --remove-orphans

# Step 4: Start the application
Write-Host "`n Step 4: Starting M324 Todo List application..." -ForegroundColor Yellow
docker-compose -f docker-compose.ci.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host " Failed to start containers." -ForegroundColor Red
    exit 1
}

# Step 5: Show status and URLs
Write-Host "`n Step 5: Application Status" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

Start-Sleep -Seconds 5

# Check container status
Write-Host "`n Container Status:" -ForegroundColor Cyan
docker-compose -f docker-compose.ci.yml ps

Write-Host "`n Application URLs:" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:8080/api" -ForegroundColor White
Write-Host "Health Check: http://localhost:8080/api/actuator/health" -ForegroundColor White
Write-Host "MySQL: localhost:3306 (user: todouser, pass: todopass)" -ForegroundColor White

Write-Host "`n Useful Commands:" -ForegroundColor Cyan
Write-Host "View logs: docker-compose -f docker-compose.ci.yml logs -f" -ForegroundColor White
Write-Host "Stop app: docker-compose -f docker-compose.ci.yml down" -ForegroundColor White
Write-Host "Restart: docker-compose -f docker-compose.ci.yml restart" -ForegroundColor White

Write-Host " M324 Todo List is now running with CI-built images!" -ForegroundColor Green
Write-Host "Check the URLs above to access your application." -ForegroundColor Yellow
