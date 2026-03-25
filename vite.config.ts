import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isCi = process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  plugins: [react()],
  base: isCi && repoName ? `/${repoName}/` : '/'
})
