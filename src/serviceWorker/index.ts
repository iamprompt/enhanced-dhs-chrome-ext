import { onMessage } from 'webext-bridge'
import { changeIconColor, handleInstall } from '../utils/chrome'

console.log('Hello Enhanced Disney+ Hotstar')

// Listen for installation
chrome.runtime.onInstalled.addListener(handleInstall)

// Listen for scheme change -> change icon color
onMessage<{ color: string }, string>(
  'scheme-icon-change',
  ({ data, sender }) => {
    // console.log('scheme-icon-change', data)
    sender.tabId && changeIconColor(sender.tabId, data.color || 'light')
  }
)
