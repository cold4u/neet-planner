#!/bin/bash
# Kill any existing server on port 8000
fuser -k 8000/tcp || true

# Start Python HTTP server
cd /home/shubhamkumarpatel9911/.gemini/antigravity/scratch/neet-server
nohup python3 -m http.server 8000 > python_server.log 2>&1 &
echo "Python server started on port 8000."

# Start SSH tunnel using localhost.run
rm -f tunnel.log
nohup ssh -R 80:localhost:8000 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null nokey@localhost.run > tunnel.log 2>&1 &
echo "SSH tunnel started."

# Wait a few seconds for the tunnel to establish and print the log
sleep 5
echo "--- Tunnel Log ---"
cat tunnel.log
echo "------------------"
