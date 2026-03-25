# Battlefield 6 Stats Dashboard

A public, static dashboard designed for GitHub Pages.

- **Frontend:** Vite + React + TypeScript
- **Data source at build time:** `data/api-data.json`
- **Automation:** GitHub Actions refreshes data every 15 minutes and redeploys

---

## 1) Architecture at a glance

This project separates data ingestion from UI rendering:

1. `scripts/fetch-data.ts` calls external APIs, validates/normalizes responses with Zod, and writes `data/api-data.json`.
2. React imports that JSON during build (`src/data.ts`) and renders a static site.
3. GitHub Actions runs on push + every 15 minutes (`*/15 * * * *`), refreshes data, builds `dist/`, and deploys to GitHub Pages.

Why this is GitHub Pages-friendly:
- No server runtime required
- No client-side secret usage
- Pure static artifact deployment

---

## 2) Repository structure

```text
.
├── .github/workflows/dashboard-pages.yml   # CI refresh + pages deploy
├── data/api-data.json                      # normalized build-time input
├── scripts/fetch-data.ts                   # data fetch + normalization
├── src/
│   ├── components/
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
├── AGENTS.md
├── package.json
└── vite.config.ts
```

---

## 3) Local development

### Prerequisites
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

### Refresh data locally
### Run data fetch manually

```bash
npm run data:fetch
```

### Start dev server
### Start local dev server

```bash
npm run dev
```

### Validate + build
```bash
npm run check
npm run build
```

---

## 4) Environment variables / GitHub configuration

Supported by `fetch-data.ts`:

- `BATTLEFIELD_APP_ID` *(optional)*: overrides default app id (`1517290`)
- `BATTLEFIELD_PLAYERS_ENDPOINT` *(optional)*: custom endpoint returning `topPlayers`
- `BATTLEFIELD_API_KEY` *(optional)*: bearer token for protected APIs

Configure in GitHub:

### Repository **Secrets**
- `BATTLEFIELD_API_KEY` *(only when required by your upstream API)*

### Repository **Variables**
- `BATTLEFIELD_APP_ID` *(optional)*
- `BATTLEFIELD_PLAYERS_ENDPOINT` *(optional)*

---

## 5) Scheduled refresh + deploy behavior

Workflow file: `.github/workflows/dashboard-pages.yml`

Triggers:
- Push to `main`
- Scheduled every 15 minutes
- Manual dispatch

Execution flow:
1. `npm ci`
2. `npm run data:fetch`
3. `npm run build:app`
4. upload `dist/`
5. deploy with Pages action

Resilience:
- Data fetch step is allowed to fail without blocking deployment.
- If fetching fails, workflow warns and deploys using existing repository JSON.

---

## 6) GitHub Pages compatibility notes

- Vite `base` is set automatically in CI from `GITHUB_REPOSITORY`, so assets resolve under `/<repo-name>/`.
- Deployment uses official Pages actions (`configure-pages`, `upload-pages-artifact`, `deploy-pages`).
- Workflow also writes `dist/.nojekyll` for compatibility.

---

## 7) First-time publish checklist

1. Push repository to GitHub.
2. In **Settings → Pages**, set Source to **GitHub Actions**.
3. Add optional vars/secrets listed above.
4. Trigger workflow (`push` or manual dispatch).
5. Open the published Pages URL from workflow output.

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

## Notes on API customization

If you have a richer Battlefield API:
- update `scripts/fetch-data.ts` schemas + mapping logic.
- keep output shape aligned to `src/types.ts`.
- keep normalization and fallback behavior so the dashboard remains resilient.
