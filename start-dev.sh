#!/bin/bash

echo "Starting Vent Platform Development Environment..."
echo

echo "Starting Backend Server..."
cd backend && npm install && npm run dev &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo "Starting Frontend Server..."
cd ../frontend && npm install && npm run dev &
FRONTEND_PID=$!

echo
echo "Development servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop all servers..."

# Wait for user to stop
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
