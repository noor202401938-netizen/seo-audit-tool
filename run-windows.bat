@echo off
setlocal enabledelayedexpansion
title SEO Intelligence - Self-Hosted Launcher

echo =======================================================
echo          SEO INTELLIGENCE - LOCAL LAUNCHER
echo =======================================================
echo.

:: 1. Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in your PATH.
    echo Please install Python 3.10+ from https://www.python.org/
    pause
    exit /b 1
)

:: 2. Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

:: 3. Setup Virtual Environment
if not exist "venv\" (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

:: 4. Environment config
if not exist ".env" (
    echo [INFO] Creating .env from template...
    copy .env.example .env >nul
)

:: 5. Install Dependencies if needed
echo [INFO] Verifying backend dependencies...
pip install -q -r requirements.txt

echo [INFO] Verifying Playwright browser...
playwright install chromium >nul 2>&1

:: 6. Initialize Database
echo [INFO] Initializing database schema...
prisma generate >nul 2>&1
prisma db push >nul 2>&1

:: 7. Install Frontend Dependencies
cd frontend
if not exist "node_modules\" (
    echo [INFO] Installing frontend packages...
    call npm install --silent
)
cd ..

:: 8. Start Backend in Background
echo [INFO] Starting API backend on http://localhost:8000 ...
start /b "" venv\Scripts\python.exe -m uvicorn api:app --port 8000 > nul 2>&1

:: 9. Start Frontend in Background
echo [INFO] Starting Frontend on http://localhost:5173 ...
cd frontend
start /b "" cmd /c "npm run dev > nul 2>&1"
cd ..

:: 10. Wait 3 seconds and launch browser
timeout /t 3 /nobreak >nul
echo [SUCCESS] SEO Intelligence is running!
echo Opening http://localhost:5173 in your default browser...
start http://localhost:5173

echo.
echo =======================================================
echo   Press any key to stop all SEO Intelligence services
echo =======================================================
pause >nul

echo [INFO] Stopping services...
taskkill /f /im python.exe /fi "WINDOWTITLE eq SEO Intelligence*" >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
echo Done.
