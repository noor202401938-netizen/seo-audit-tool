@echo off
title SEO Intelligence - Docker Launcher

echo =======================================================
echo      SEO INTELLIGENCE - 1-CLICK DOCKER LAUNCHER
echo =======================================================
echo.

docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not running.
    echo Please start Docker Desktop from https://www.docker.com/
    pause
    exit /b 1
)

if not exist ".env" (
    echo [INFO] Creating .env from template...
    copy .env.example .env >nul
)

echo [INFO] Building and starting containers in background...
docker compose up -d --build

echo [INFO] Waiting for web server...
timeout /t 4 /nobreak >nul

echo [SUCCESS] App is ready!
echo Opening http://localhost/app in your default browser...
start http://localhost/app

echo.
echo =======================================================
echo   Services are running in Docker background.
echo   To stop them later, run: docker compose down
echo =======================================================
pause
