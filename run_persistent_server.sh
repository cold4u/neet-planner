#!/bin/bash
# Kill any existing processes on port 8000 or ssh tunnel
fuser -k 8000/tcp || true
pkill -f "ssh -R 80:localhost:8000" || true
sleep 1

# Start python HTTP server
cd /home/shubhamkumarpatel9911/.gemini/antigravity/scratch/neet-server
python3 -m http.server 8000 > python_server.log 2>&1 &
PYTHON_PID=$!

# Start SSH tunnel
rm -f tunnel.log
ssh -R 80:localhost:8000 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null nokey@localhost.run > tunnel.log 2>&1 &
SSH_PID=$!

echo "Processes started: Python (PID $PYTHON_PID), SSH (PID $SSH_PID)"

# Wait for tunnel connection to establish and log URL
sleep 6
echo "--- Tunnel Log ---"
cat tunnel.log
echo "------------------"

# Block indefinitely to prevent process cleanup
tail -f /dev/null
