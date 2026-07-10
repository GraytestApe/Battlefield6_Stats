# Battlefield 6 Stats Dashboard

This repo builds a static dashboard (GitHub Pages) for two players:
- **Gman 810**
- **HxC Noob Killer**

## Quick start (no API key required)

1. Install deps:

```bash
npm ci
```

2. Pull data + run app:

```bash
npm run data:fetch
npm run dev
```

3. Open the local URL printed by Vite (usually `http://localhost:5173`).

By default, `data:fetch` tries public tracker profile pages (no key) for those two players.

## Optional: use your own BF6 API endpoint

Create `.env.local` if you want to force your own provider:

```bash
BATTLEFIELD_PLAYER_TAGS=Gman 810,HxC Noob Killer
BATTLEFIELD_PLAYER_PLATFORM=xbox
# Option A: endpoint that returns normalized array rows
BATTLEFIELD_PLAYERS_ENDPOINT=https://your-bf6-api.example.com/top-players

# Option B: per-player endpoint template
BATTLEFIELD_PLAYER_STATS_ENDPOINT_TEMPLATE=https://your-bf6-api.example.com/player?name={name}&platform={platform}

# Optional auth header value (sent as Bearer and TRN-Api-Key)
BATTLEFIELD_API_KEY=your_api_key
```

## How data works

- `scripts/fetch-data.ts` fetches API data and writes normalized JSON to `data/api-data.json`.
- The React app reads that JSON at build time.
- Fetch order for top players:
  1. `BATTLEFIELD_PLAYERS_ENDPOINT` (if set)
  2. `BATTLEFIELD_PLAYER_STATS_ENDPOINT_TEMPLATE` (if set)
  3. Public tracker page scrape (no key)
  4. Fallback sample rows + alert

## Deploy to GitHub Pages

1. In repo **Settings → Pages**, use **GitHub Actions**.
2. Optional repository variables/secrets (only if you want custom API provider):
   - `BATTLEFIELD_PLAYER_TAGS`
   - `BATTLEFIELD_PLAYER_PLATFORM`
   - `BATTLEFIELD_PLAYERS_ENDPOINT`
   - `BATTLEFIELD_PLAYER_STATS_ENDPOINT_TEMPLATE`
   - `BATTLEFIELD_API_KEY` (secret)
3. Push to `main`.

Workflow `.github/workflows/dashboard-pages.yml` rebuilds every 15 minutes.
