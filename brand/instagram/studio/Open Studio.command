#!/bin/bash
# Double-click to open the SpeakUp Post Studio in your browser (needs nothing extra on a Mac).
cd "$(dirname "$0")"
PORT=8765
lsof -ti tcp:$PORT >/dev/null 2>&1 || (python3 -m http.server $PORT >/dev/null 2>&1 &)
sleep 1
open "http://localhost:$PORT/"
echo "SpeakUp Post Studio is open at http://localhost:$PORT  (close this window when you are done)"
