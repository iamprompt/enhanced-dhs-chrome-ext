import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.config'

export default defineConfig(async ({ mode }) => {
  const { EDHS_MODE } = loadEnv(mode, process.cwd(), 'EDHS') as {
    EDHS_MODE: string
  }

  const MODE = EDHS_MODE?.toUpperCase() || ''

  const publicDir = ['DEVELOPMENT'].includes(MODE)
    ? 'public/development' // Development Environment Assets
    : ['STAGING', 'PRE-RELEASE', 'PRERELEASE'].includes(MODE)
    ? 'public/prerelease' // Pre-release Environment Assets
    : 'public/production' // Production Environment Assets

  return {
    publicDir,
    plugins: [react(), crx({ manifest })],
  }
})
