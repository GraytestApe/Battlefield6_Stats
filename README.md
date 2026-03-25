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
- Node.js 22+
- npm 11+

### Install
```bash
npm ci
```

### Refresh data locally
```bash
npm run data:fetch
```

### Start dev server
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

