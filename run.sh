#!/usr/bin/env bash

# SEO Intelligence - Self-Hosted Launcher for Linux & macOS
set -e

echo "======================================================="
echo "         SEO INTELLIGENCE - LOCAL LAUNCHER"
echo "======================================================="
echo ""

# 1. Check Python
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed."
    echo "Please install Python 3.10+ from https://www.python.org/"
    exit 1
fi

# 2. Check Node
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed."
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# 3. Setup Virtual Environment
if [ ! -d "venv" ]; then
    echo "[INFO] Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

# 4. Environment config
if [ ! -f ".env" ]; then
    echo "[INFO] Creating .env from template..."
    cp .env.example .env
fi

# 5. Install Dependencies
echo "[INFO] Verifying backend dependencies..."
pip install -q -r requirements.txt
playwright install chromium > /dev/null 2>&1 || true

# 6. Initialize Database
echo "[INFO] Initializing database schema..."
prisma generate > /dev/null 2>&1 || true
prisma db push > /dev/null 2>&1 || true

# 7. Frontend dependencies
cd frontend
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing frontend packages..."
    npm install --silent
fi
cd ..

# 8. Function to clean up on exit
cleanup() {
    echo ""
    echo "[INFO] Stopping all background services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 9. Start Backend
echo "[INFO] Starting API backend on http://localhost:8000 ..."
uvicorn api:app --port 8000 > /dev/null 2>&1 &
BACKEND_PID=$!

# 10. Start Frontend
echo "[INFO] Starting Frontend on http://localhost:5173 ..."
cd frontend
npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!
cd ..

sleep 3
echo "[SUCCESS] SEO Intelligence is running!"
echo "Opening http://localhost:5173 ..."

# 11. Open Browser
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173 > /dev/null 2>&1 &
elif command -v open &> /dev/null; then
    open http://localhost:5173 > /dev/null 2>&1 &
fi

echo ""
echo "======================================================="
echo "        Press Ctrl+C to stop all services"
echo "======================================================="
wait
