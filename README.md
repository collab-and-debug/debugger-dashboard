# Collab Debugger Dashboard

A real-time collaborative debugging dashboard that lets multiple developers share a live debug session — watching breakpoints, variable scopes, and debugger events together as they happen.

---

## What It Does

- **Create or join a session** with a shared session ID
- **See breakpoints** hit in real time, attributed to each user
- **Inspect variable scopes** (local, global, etc.) as they update
- **Live event feed** showing all debugger events chronologically
- **User presence bar** showing who is currently in the session
- **WebSocket-powered** with automatic reconnection
- **Skeleton loading states** while the connection is establishing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v7 |
| Build tool | Vite 5 + `@vitejs/plugin-react` |
| Real-time | WebSocket (native browser API) |
| Notifications | `react-hot-toast` |
| Loading states | `react-loading-skeleton` |
| Deployment | Vercel (frontend), Railway (backend) |

---

## Project Structure

```
debugger-dashboard/
├── index.html                  # Vite HTML entry point
├── vite.config.js              # Vite + React plugin config
├── package.json
├── .env                        # Environment variables (see below)
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Router setup + Toaster
    ├── styles.css              # Global styles
    ├── session-layout.css      # Session page flex layout
    ├── pages/
    │   ├── HomePage.jsx        # Create / Join session UI
    │   └── SessionPage.jsx     # Live debug session view
    ├── components/
    │   ├── BreakpointPanel.jsx # List of active breakpoints
    │   ├── LiveFeed.jsx        # Scrolling event feed
    │   ├── StatusBadge.jsx     # Connected / Connecting / Disconnected pill
    │   ├── UserPresenceBar.jsx # Avatars of users in session
    │   └── variablesPanel.jsx  # Collapsible variable scope viewer
    └── hooks/
        └── useWebsockets.js    # WebSocket hook with reconnect logic
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### 1. Clone the repo

```bash
git clone https://github.com/collab-and-debug/debugger-dashboard.git
cd debugger-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
VITE_BACKEND_URL=https://your-backend.onrender.com
VITE_WS_URL=wss://your-backend.onrender.com
```

> For local development, use `http://localhost:3000` and `ws://localhost:3000`.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_BACKEND_URL` | HTTP base URL for the session REST API | `https://api.example.com` |
| `VITE_WS_URL` | WebSocket URL for real-time events | `wss://api.example.com` |

> All Vite environment variables must be prefixed with `VITE_` to be exposed to the browser.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start local dev server at `localhost:5173` |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build locally |

---

## WebSocket Message Types

The dashboard listens for and sends the following message types over the WebSocket connection:

| Type | Direction | Description |
|---|---|---|
| `SESSION_SNAPSHOT` | Server → Client | Full state dump on join (breakpoints, variables, users) |
| `BREAKPOINT_HIT` | Server → Client | A new breakpoint was hit |
| `BREAKPOINT_REMOVED` | Server → Client | A breakpoint was removed |
| `VARIABLE_UPDATE` | Server → Client | Variable scopes updated |
| `USER_JOINED` / `user-joined` | Server → Client | A user joined the session |
| `USER_LEFT` / `user-left` | Server → Client | A user left the session |
| `request-snapshot` | Client → Server | Sent on connect to request current state |

---

## Dev Tools Panel

When running in development mode (`npm run dev`), a **Dev Tools** panel appears at the bottom of the session page with buttons to manually fire test events:

- **+ Breakpoint** — sends a `BREAKPOINT_HIT` event
- **− Breakpoint** — sends a `BREAKPOINT_REMOVED` event
- **Send Variables** — sends a `VARIABLE_UPDATE` with sample scopes
- **Send Join** — sends a `USER_JOINED` event
- **Send Snapshot** — sends a `SESSION_SNAPSHOT` with sample data

This lets you test the UI without a real debugger extension connected.

---

## Deployment

### Frontend — Vercel

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `VITE_BACKEND_URL`
   - `VITE_WS_URL`
4. Deploy — Vercel auto-detects Vite

Live: [https://debugger-dashboard.vercel.app](https://debugger-dashboard.vercel.app)

### Backend — Render

The backend (session REST API + WebSocket server) is deployed separately on [Render](https://render.com). See the backend repo for setup instructions.

---

## Known Fixes Applied

The following bugs were fixed from the original repository:

| Issue | Fix |
|---|---|
| `App.js` at root was empty — no router or app shell | Created `src/App.jsx` with `BrowserRouter`, `Routes`, and `Toaster` |
| `vite.config.js` missing — JSX transform not configured | Added `vite.config.js` with `@vitejs/plugin-react` |
| `VITE_WS_URL` missing from `.env` — WebSocket always failed | Added `VITE_WS_URL` to `.env` |
| `process.env.NODE_ENV` used in `SessionPage.jsx` — invalid in Vite | Replaced with `import.meta.env.DEV` |
| `vite: ^8.0.10` in `package.json` — version doesn't exist | Pinned to `vite: ^5.4.19` (latest stable) |
| Nested duplicate `debugger-dashboard/debugger-dashboard/` folder | Cleaned up; single flat project structure |

---

## License

MIT
