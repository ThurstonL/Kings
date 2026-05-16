#!/bin/zsh
set -euo pipefail

agent="com.thepregames.kings.frontend"
user_domain="gui/$(id -u)"
launch_agent="$HOME/Library/LaunchAgents/${agent}.plist"
source_plist="/Users/thurston/Workspace/Kings/launchd/${agent}.plist"
manual_log="/Users/thurston/Workspace/Kings/logs/frontend.manual.log"

agent_is_loaded() {
  launchctl print "$user_domain/$agent" >/dev/null 2>&1
}

agent_is_healthy() {
  lsof -nP -iTCP:3002 -sTCP:LISTEN >/dev/null 2>&1
}

wait_for_running_state() {
  local attempts="${1:-20}"

  for _ in $(seq 1 "$attempts"); do
    if launchctl print "$user_domain/$agent" 2>/dev/null | rg -q 'state = running'; then
      return 0
    fi
    sleep 0.5
  done

  return 1
}

wait_for_health() {
  local attempts="${1:-30}"

  for _ in $(seq 1 "$attempts"); do
    if agent_is_healthy; then
      return 0
    fi
    sleep 0.5
  done

  return 1
}

kill_orphans() {
  pkill -f "http.server 3002" 2>/dev/null || true
}

install_agent() {
  mkdir -p "$HOME/Library/LaunchAgents"
  cp "$source_plist" "$launch_agent"
  echo "Installed $launch_agent"
}

require_agent() {
  if [[ ! -f "$launch_agent" ]]; then
    echo "Missing LaunchAgent: $launch_agent" >&2
    exit 1
  fi
}

start_agent() {
  require_agent

  if agent_is_loaded; then
    launchctl kickstart -k "$user_domain/$agent"
    wait_for_running_state || true
  else
    mkdir -p "/Users/thurston/Workspace/Kings/logs"
    nohup /Users/thurston/Workspace/Kings/scripts/run_frontend.sh </dev/null >>"$manual_log" 2>&1 &
  fi

  wait_for_health || {
    echo "Timed out waiting for $agent to become healthy" >&2
    exit 1
  }
}

stop_agent() {
  if agent_is_loaded; then
    launchctl bootout "$user_domain/$agent" 2>/dev/null || launchctl bootout "$user_domain" "$launch_agent"
  fi

  kill_orphans
  sleep 1
}

status_agent() {
  echo "== $agent =="
  if agent_is_loaded; then
    launchctl print "$user_domain/$agent" 2>/dev/null | sed -n '1,20p'
  elif agent_is_healthy; then
    echo "manual fallback running"
  else
    echo "not loaded"
  fi
}

show_logs() {
  tail -n 40 /Users/thurston/Workspace/Kings/logs/*.log
}

case "${1:-}" in
  install)
    install_agent
    ;;
  start)
    kill_orphans
    start_agent
    ;;
  stop)
    stop_agent
    ;;
  restart)
    kill_orphans
    start_agent
    ;;
  status)
    status_agent
    ;;
  logs)
    show_logs
    ;;
  *)
    echo "Usage: $0 {install|start|stop|restart|status|logs}"
    exit 1
    ;;
esac
