#!/bin/bash

DIR="/home/shubhamkumarpatel9911/.gemini/antigravity/scratch/neet-server"
PORT=8000

case "$1" in
  start)
    # Stop existing first
    fuser -k $PORT/tcp >/dev/null 2>&1 || true
    pkill -f "ssh -R 80:localhost:$PORT" >/dev/null 2>&1 || true
    
    cd "$DIR"
    nohup python3 -m http.server $PORT > python_server.log 2>&1 &
    nohup ssh -R 80:localhost:$PORT -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null nokey@localhost.run > tunnel.log 2>&1 &
    
    echo "Starting server and tunnel..."
    sleep 5
    
    URL=$(grep -oE "[a-zA-Z0-9.-]+\.lhr\.life" tunnel.log | tail -n 1)
    if [ -n "$URL" ]; then
      echo "Server started successfully!"
      echo "Public URL: https://$URL"
      echo "Local URL:  http://localhost:$PORT"
    else
      echo "Server started, but tunnel URL is still establishing."
      echo "Check logs using: tail -n 20 $DIR/tunnel.log"
    fi
    ;;
  stop)
    fuser -k $PORT/tcp >/dev/null 2>&1 || true
    pkill -f "ssh -R 80:localhost:$PORT" >/dev/null 2>&1 || true
    echo "Server and tunnel stopped."
    ;;
  status)
    PID_PY=$(lsof -t -i :$PORT)
    PID_SSH=$(pgrep -f "ssh -R 80:localhost:$PORT")
    
    if [ -n "$PID_PY" ]; then
      echo "Python server is RUNNING (PID $PID_PY)"
    else
      echo "Python server is STOPPED"
    fi
    
    if [ -n "$PID_SSH" ]; then
      echo "SSH tunnel is RUNNING (PID $PID_SSH)"
      URL=$(grep -oE "[a-zA-Z0-9.-]+\.lhr\.life" "$DIR/tunnel.log" | tail -n 1)
      if [ -n "$URL" ]; then
        echo "Public URL: https://$URL"
      fi
    else
      echo "SSH tunnel is STOPPED"
    fi
    ;;
  *)
    echo "Usage: $0 {start|stop|status}"
    exit 1
    ;;
esac
