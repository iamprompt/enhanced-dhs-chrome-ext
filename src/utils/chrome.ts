import type { selectedOptions } from '../@types/options'
import { defaultOptions } from './const'

export const getUserPreferences = async () => {
  const data = await chrome.storage.local.get(['options'])
  return (data.options as selectedOptions) || {}
}

export const handleInstall = async (
  details: chrome.runtime.InstalledDetails
) => {
  const existingUserPreferences = (await getUserPreferences()) || {}
  chrome.storage.local.set({
    options: { ...defaultOptions, ...existingUserPreferences },
  })
}

export const changeIconColor = (tabId: number, color: string) => {
  chrome.action.setIcon({
    tabId,
    path: {
      16: `../../assets/icons/d_action_icon_${color}16.png`,
      32: `../../assets/icons/d_action_icon_${color}32.png`,
      48: `../../assets/icons/d_action_icon_${color}48.png`,
    },
  })
}
