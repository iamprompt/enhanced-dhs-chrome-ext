import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.config'

export default defineConfig(async ({ mode }) => {
  const { EDHS_MODE } = loadEnv(mode, process.cwd(), 'EDHS') as { EDHS_MODE: string }

  const publicDir = ['STAGING', 'DEVELOPMENT', 'PRE-RELEASE', 'PRERELEASE'].includes(EDHS_MODE?.toUpperCase() || '')
    ? 'public-prerelease'
    : 'public'

  return {
    publicDir,
    plugins: [react(), crx({ manifest })],
  }
})
