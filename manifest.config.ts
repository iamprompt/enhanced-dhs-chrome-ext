import { defineManifest } from '@crxjs/vite-plugin'
import { loadEnv } from 'vite'

export default defineManifest(async ({ command, mode }) => {
  const { EDHS_VERSION } = loadEnv(mode, process.cwd(), 'EDHS') as {
    EDHS_VERSION: string
  }

  const [major, minor, patch, label = '0'] = EDHS_VERSION.replace(
    /[^\d\n.]/g,
    ''
  ).split(/[.-]/)

  return {
    manifest_version: 3,
    name: '__MSG_appName__',
    description: '__MSG_appDesc__',
    author: 'Supakarn Laorattanakul',
    default_locale: 'en',
    version: `${major}.${minor}.${patch}.${label}`,
    version_name: EDHS_VERSION,
    icons: {
      '32': 'assets/icons/enhanced_dhs32.png',
      '48': 'assets/icons/enhanced_dhs48.png',
      '64': 'assets/icons/enhanced_dhs64.png',
      '128': 'assets/icons/enhanced_dhs128.png',
      '256': 'assets/icons/enhanced_dhs256.png',
    },
    permissions: ['storage'],
    host_permissions: ['https://*.hotstar.com/*', 'https://hotstar.com/*'],
    background: {
      service_worker: 'src/serviceWorker/index.ts',
      type: 'module',
    },
    content_scripts: [
      {
        js: ['src/contentScript/index.ts'],
        matches: ['https://*.hotstar.com/*', 'https://hotstar.com/*'],
      },
    ],
    action: {
      default_title: 'Enhance your Hotstar',
      default_popup: 'src/popup/index.html',
      default_icon: {
        16: 'assets/icons/d_action_icon_default16.png',
        32: 'assets/icons/d_action_icon_default32.png',
        48: 'assets/icons/d_action_icon_default48.png',
      },
    },
  }
})
