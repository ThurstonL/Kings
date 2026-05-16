# Deployment: King's Cup on `kings.thepregames.com`

## Overview

This app is a static Vite frontend, so it only needs:

- a local static file server on port `3002`
- one Cloudflare Tunnel ingress rule for `kings.thepregames.com`

The existing `cloudflared` tunnel service used by Liar's Dice can be reused.

```
Browser -> kings.thepregames.com -> Cloudflare -> cloudflared -> Mac Mini (localhost:3002)
```

## Build the app

```bash
cd /Users/thurston/Workspace/Kings
npm run build
```

## Install the LaunchAgent

```bash
cd /Users/thurston/Workspace/Kings
chmod +x scripts/run_frontend.sh scripts/manage_services.sh
./scripts/manage_services.sh install
launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/com.thepregames.kings.frontend.plist"
./scripts/manage_services.sh restart
```

## Update the existing Cloudflare tunnel config

Edit `/Users/thurston/.cloudflared/config.yml` and add:

```yaml
ingress:
  - hostname: liarsdice-api.thepregames.com
    service: http://127.0.0.1:3001
  - hostname: liarsdice.thepregames.com
    service: http://127.0.0.1:3000
  - hostname: kings.thepregames.com
    service: http://127.0.0.1:3002
  - service: http_status:404
```

Then restart the existing tunnel service:

```bash
cd /Users/thurston/Workspace/Liar-s-Dice
./scripts/manage_services.sh restart
```

## Add the DNS record in Cloudflare

Point `kings.thepregames.com` at the same tunnel target as the existing app.

If you are doing it manually in Cloudflare DNS:

- Type: `CNAME`
- Name: `kings`
- Target: `0e701604-97ec-4b12-928d-6edc6ec00183.cfargotunnel.com`
- Proxy status: `Proxied`

If `cloudflared tunnel route dns` is working on this machine, the equivalent command is:

```bash
cloudflared tunnel route dns <TUNNEL_NAME_OR_ID> kings.thepregames.com
```

On the current Mac Mini setup, `cloudflared tunnel route dns` may fail if the local Cloudflare
origin certificate (`cert.pem`) is missing. In that case, adding the DNS record manually in the
Cloudflare dashboard is the correct fallback.

## Verify

After restarting both services:

```bash
curl -I http://127.0.0.1:3002
curl -I https://kings.thepregames.com
```

Expected result:

- local origin responds with `HTTP/1.0 200 OK` or similar
- public hostname responds with `HTTP/2 200`
