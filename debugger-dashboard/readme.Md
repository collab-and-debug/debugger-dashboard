# Debugger Dashboard

A lightweight React dashboard that connects to a shared debugging session. It lets users **create/join a session**, shows **presence**, and displays live **breakpoint hits** and **variable scopes** coming from a backend via WebSocket.

## Features

- Create or join a session using a session ID
- Real-time connection status (connected / connecting / disconnected)
- Shared presence bar for active users
- Live event feed (e.g., breakpoint hits, variable updates)
- Breakpoints panel and variables panel

## Prerequisites

- Node.js (LTS recommended)
- A compatible backend that exposes:
  - `POST /session/create`
  - `POST /session/join`
  - WebSocket endpoint for session events and snapshots

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables (Vite):

   - `VITE_BACKEND_URL` (HTTP)
     - Example: `http://localhost:3000`
   - `VITE_WS_URL` (optional override for WebSocket)
     - Example: `ws://localhost:3000`

   If `VITE_WS_URL` is not set, the app derives the WebSocket URL from `VITE_BACKEND_URL`.

## Run (development)

```bash
npm run dev
```

Open the URL shown in the terminal.

## Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## How to use

1. Open the app and choose one:
   - **Create Session**: enter your name, click **Create**, and navigate to the generated session page.
   - **Join Session**: enter your name and an existing session ID, click **Join**.

2. On the session page, the dashboard will:
   - connect to the backend via WebSocket using the session ID from the route
   - request a snapshot on connect
   - render breakpoints/variables as events arrive

## Notes

- The app is wired to send a `request-snapshot` message on WebSocket connect.
- For presence and event updates, the backend must emit events containing `type` and related payload data.
- This project uses a `HashRouter`, so routes look like `#/session/<id>`.

