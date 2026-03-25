import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isCi = process.env.GITHUB_ACTIONS === 'true'
const baseFromEnv = process.env.VITE_BASE_PATH

export default defineConfig({
  plugins: [react()],
  base: baseFromEnv ?? (isCi && repoName ? `/${repoName}/` : '/')
})
