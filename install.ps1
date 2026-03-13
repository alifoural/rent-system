# RentFlow One-Click Installer for Windows
# This script automates the setup of RentFlow using Docker and Git.

$RepoUrl = "https://github.com/alifoural/rent-system.git"
$ProjectDir = "rent-system"

Write-Host "--- RentFlow Windows Setup ---" -ForegroundColor Cyan

# 1. Check for Git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Git is not installed. Please install Git from https://git-scm.com/downloads" -ForegroundColor Red
    pause
    exit
}

# 2. Check for Docker
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Docker is not detected. Please install Docker Desktop from https://www.docker.com/products/docker-desktop/" -ForegroundColor Red
    pause
    exit
}

# 3. Clone Repository
if (!(Test-Path $ProjectDir)) {
    Write-Host "[*] Cloning repository..." -ForegroundColor Yellow
    git clone $RepoUrl
}
Set-Location $ProjectDir

# 4. Create .env file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "[*] Creating .env file..." -ForegroundColor Yellow
    $EnvContent = @"
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=asset_management
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5433/asset_management
"@
    $EnvContent | Out-File -FilePath ".env" -Encoding ascii
}

# 5. Build and Start Docker
Write-Host "[*] Starting RentFlow via Docker Compose..." -ForegroundColor Yellow
docker-compose up -d --build

Write-Host ""
Write-Host "--- Setup Complete! ---" -ForegroundColor Green
Write-Host "The app should be running at: http://localhost:8000" -ForegroundColor Green
Write-Host "The API docs are available at: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
pause
