#!/bin/zsh
set -euo pipefail

cd /Users/thurston/Workspace/Kings/dist
exec /usr/bin/python3 -m http.server 3002 --bind 127.0.0.1
