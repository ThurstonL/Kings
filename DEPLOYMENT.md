# Deployment: King's Cup on `kings.thepregames.com`

## Overview

This app is a static Vite frontend served on port `3002` behind the shared Cloudflare Tunnel.

```
Browser -> kings.thepregames.com -> Cloudflare -> cloudflared -> Mac Mini (localhost:3002)
```

Service management (start, stop, restart, status) is handled centrally from `thepregames-home`:

```bash
cd /Users/thurston/Workspace/the-pregames/thepregames-home
./scripts/manage_services.sh restart kings
```

## Build and deploy

```bash
cd /Users/thurston/Workspace/the-pregames/kings
npm run build
cd /Users/thurston/Workspace/the-pregames/thepregames-home
./scripts/manage_services.sh restart kings
```

## Cloudflare tunnel config

`~/.cloudflared/config.yml` should include:

```yaml
ingress:
  - hostname: kings.thepregames.com
    service: http://127.0.0.1:3002
```

After editing the tunnel config, restart the tunnel:

```bash
./scripts/manage_services.sh restart tunnel
```

## DNS record

- Type: `CNAME`
- Name: `kings`
- Target: `0e701604-97ec-4b12-928d-6edc6ec00183.cfargotunnel.com`
- Proxy status: `Proxied`

## Verify

```bash
curl -I http://127.0.0.1:3002
curl -I https://kings.thepregames.com
```

Expected: `HTTP/1.0 200 OK` locally, `HTTP/2 200` publicly.
