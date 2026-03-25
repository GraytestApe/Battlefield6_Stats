# AGENTS Instructions

- Stack: Vite + React + TypeScript static dashboard for GitHub Pages.
- Keep `data/api-data.json` as the UI build-time data input.
- Update `scripts/fetch-data.ts` when upstream API fields change; preserve schema validation + fallback behavior.
- Keep `.github/workflows/dashboard-pages.yml` aligned with Pages deployment requirements.
- Before finishing substantial changes, run: `npm run data:fetch`, `npm run check`, and `npm run build:app`.
- Keep UI components reusable in `src/components` and avoid adding dependencies unless they materially improve maintainability.
