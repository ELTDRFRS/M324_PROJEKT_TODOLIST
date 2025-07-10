# PowerShell script to run CI-built Docker images with authentication
# M324 Todo List - CI Image Runner (With Auth)

Write-Host "M324 Todo List - Running CI-Built Images (With Authentication)" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green

# Step 1: Login to GitHub Container Registry
Write-Host ""
Write-Host "Step 1: Authenticating with GitHub Container Registry..." -ForegroundColor Yellow
Write-Host "Please enter your GitHub credentials:" -ForegroundColor Cyan
Write-Host "Username: ELTDRFRS" -ForegroundColor White
Write-Host "Password: Use your Personal Access Token (starts with ghp_...)" -ForegroundColor White

$loginResult = docker login ghcr.io --username ELTDRFRS

if ($LASTEXITCODE -ne 0) {
    Write-Host "Authentication failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "SOLUTIONS:" -ForegroundColor Yellow
    Write-Host "1. Make sure you're using your Personal Access Token as password" -ForegroundColor White
    Write-Host "2. Or make the GitHub packages public (easier option)" -ForegroundColor White
    Write-Host ""
    Write-Host "To make packages public:" -ForegroundColor Cyan
    Write-Host "- Go to https://github.com/ELTDRFRS/M324_PROJEKT_TODOLIST" -ForegroundColor White
    Write-Host "- Click 'Packages' tab" -ForegroundColor White
    Write-Host "- For each package: Settings > Change visibility > Make Public" -ForegroundColor White
    exit 1
}

# Step 2: Pull images
Write-Host ""
Write-Host "Step 2: Pulling authenticated images..." -ForegroundColor Yellow

Write-Host "Pulling backend image..." -ForegroundColor Cyan
docker pull ghcr.io/eltdrfrs/m324_projekt_todolist/todo-backend:latest

Write-Host "Pulling frontend image..." -ForegroundColor Cyan  
docker pull ghcr.io/eltdrfrs/m324_projekt_todolist/todo-frontend:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to pull images even after authentication." -ForegroundColor Red
    exit 1
}

# Step 3: Stop existing containers
Write-Host ""
Write-Host "Step 3: Stopping existing containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.ci.yml down --remove-orphans

# Step 4: Start application
Write-Host ""
Write-Host "Step 4: Starting M324 Todo List..." -ForegroundColor Yellow
docker-compose -f docker-compose.ci.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start containers." -ForegroundColor Red
    exit 1
}

# Step 5: Show status
Write-Host ""
Write-Host "Container Status:" -ForegroundColor Yellow
docker-compose -f docker-compose.ci.yml ps

# Step 6: Show URLs
Write-Host ""
Write-Host "SUCCESS! Application URLs:" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:8080/api" -ForegroundColor White
Write-Host "Health Check: http://localhost:8080/api/actuator/health" -ForegroundColor White

Write-Host ""
Write-Host "M324 Todo List is now running with CI-built images!" -ForegroundColor Green
