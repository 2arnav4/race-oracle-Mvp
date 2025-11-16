#!/bin/bash

# Race Oracle - Quick Start Script
# This script starts both backend and frontend

echo "🏎️  Race Oracle - Starting..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.10+"
    exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Python and Node.js found"
echo ""

# Start backend in background
echo "🚀 Starting backend..."
cd backend/src
python3 main.py &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
sleep 2

# Go back to root
cd ../..

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo ""
echo "✅ Backend started on http://localhost:8000"
echo "🚀 Starting frontend..."
echo ""
echo "   Frontend will start on http://localhost:5173"
echo ""
echo "📝 Open your browser to: http://localhost:5173"
echo ""
echo "To stop: Press Ctrl+C"
echo ""

# Start frontend
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
