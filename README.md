# Battlefield 6 Stats Dashboard (GitHub Pages)

A polished, fully static dashboard that is rebuilt and deployed automatically on GitHub Pages every 15 minutes.

## Why this architecture

This project uses **Vite + React + TypeScript** for a simple and maintainable static frontend.

- **Static hosting fit:** Vite outputs plain static files in `dist/`, ideal for GitHub Pages.
- **Secure data flow:** API fetch runs in CI via `scripts/fetch-data.ts`, not in client code.
- **Reliable automation:** GitHub Actions handles scheduled refresh + rebuild + deploy.
- **Low complexity:** no server runtime, no SSR, no database requirement.

## Project structure

```text
.
├── .github/workflows/dashboard-pages.yml
├── AGENTS.md
├── data/
│   └── api-data.json
├── scripts/
│   └── fetch-data.ts
├── src/
│   ├── components/
│   │   ├── SectionCard.tsx
│   │   └── SummaryCard.tsx
│   ├── App.tsx
│   ├── data.ts
│   ├── main.tsx
│   ├── styles.css
│   └── types.ts
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Data flow

1. `scripts/fetch-data.ts` calls external API endpoints (Steam Web API by default).
2. Responses are validated and normalized via Zod.
3. Partial failures are tolerated via `Promise.allSettled`:
   - successful sections still render
   - degraded/error states are written to `alerts`
4. Normalized output is written to `data/api-data.json`.
5. Frontend imports that JSON at build-time (`src/data.ts`) and renders static HTML/CSS/JS.

## Local development

### Prerequisites

- Node.js 22+
- npm 11+

### Install

```bash
npm ci
```

### Run data fetch manually

```bash
npm run data:fetch
```

### Start local dev server

```bash
npm run dev
```

### Build production static files

```bash
npm run build
```

### Build frontend only (using existing JSON)

```bash
npm run build:app
```

## Environment variables and GitHub secrets

`fetch-data.ts` supports:

- `BATTLEFIELD_APP_ID` (optional): Steam app ID override (default `1517290`)
- `BATTLEFIELD_PLAYERS_ENDPOINT` (optional): custom endpoint returning `topPlayers` JSON array
- `BATTLEFIELD_API_KEY` (optional secret): bearer token for endpoints that require auth

### In GitHub, configure

- **Repository Secret**
  - `BATTLEFIELD_API_KEY` (only if your endpoint requires auth)
- **Repository Variables**
  - `BATTLEFIELD_APP_ID` (optional)
  - `BATTLEFIELD_PLAYERS_ENDPOINT` (optional)

No secrets are exposed in client-side code.

## Scheduled updates (every 15 minutes)

Workflow: `.github/workflows/dashboard-pages.yml`

Triggers:
- `push` to `main`
- `schedule` with cron `*/15 * * * *`
- manual `workflow_dispatch`

Pipeline steps:
1. install dependencies
2. fetch + normalize latest API data
3. build static site
4. upload artifact
5. deploy to GitHub Pages

## GitHub Pages deployment details

- Vite `base` is auto-set in CI from `GITHUB_REPOSITORY` so assets resolve under `/<repo-name>/`.
- Deployment uses official Pages actions:
  - `actions/configure-pages`
  - `actions/upload-pages-artifact`
  - `actions/deploy-pages`

## Manual publishing steps

1. Push this repository to GitHub.
2. In GitHub repo settings:
   - Enable **Pages** → Source: **GitHub Actions**.
3. (Optional) add the secrets/vars listed above.
4. Push to `main` or run the workflow manually.
5. Visit the Pages URL from workflow output.

## Seed fallback note

The committed `data/api-data.json` is intentionally a fallback seed payload so first-time deployments still render meaningful content before the first live fetch runs. CI/local fetch jobs (`npm run data:fetch`) will overwrite it with current API output.

## Notes on API customization

If you have a richer Battlefield API:
- update `scripts/fetch-data.ts` schemas + mapping logic.
- keep output shape aligned to `src/types.ts`.
- keep normalization and fallback behavior so the dashboard remains resilient.
