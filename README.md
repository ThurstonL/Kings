# King's Cup

King's Cup is a React + TypeScript + Vite web app for running a King's Cup game in the browser.

## Local development

```bash
cd /Users/thurston/Workspace/the-pregames/kings
npm install
npm run dev
```

The Vite dev server runs on port `5173` by default.

## Production build

```bash
cd /Users/thurston/Workspace/the-pregames/kings
npm run build
```

The production output is written to `dist/`.

## Deployment

This app is deployed as a static site behind the existing Cloudflare Tunnel used for `thepregames.com`.

- Public URL: `https://kings.thepregames.com`
- Local origin: `http://127.0.0.1:3002`
- Runtime: macOS LaunchAgent `com.thepregames.kings.frontend`

Deployment details and service-management steps are documented in [DEPLOYMENT.md](./DEPLOYMENT.md).
