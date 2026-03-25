# AGENTS Instructions

- Stack: Vite + React + TypeScript static dashboard.
- Always keep `data/api-data.json` as the build-time data source used by the UI.
- Update `scripts/fetch-data.ts` if API fields change; keep resilient `Promise.allSettled` behavior.
- Keep GitHub Pages deployment in `.github/workflows/dashboard-pages.yml`.
- Run `npm run data:fetch` then `npm run build:app` before finishing major changes.
- Prefer reusable components in `src/components` and avoid unnecessary dependencies.
