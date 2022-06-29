import { onMessage, sendMessage } from 'webext-bridge'
import { EdgeStyleOptions, FontOptions } from '../utils/options'
import type { selectedOptions } from '../@types/options'
import { getlinkHTMLHeader } from '../utils/htmlElems'
import vdoClassSelector from '../utils/classSubtitle'
import { defaultOptions } from '../utils/const'

/**
 * Changing the action icon depending on Dark/Light mode
 * @param e Media Query List / Event
 */
const toggleActionIconScheme = async (
  e: MediaQueryListEvent | MediaQueryList
) => {
  await sendMessage('scheme-icon-change', {
    color: e.matches ? 'dark' : 'light',
  })
}

const winMedia = window.matchMedia('(prefers-color-scheme: light)')
toggleActionIconScheme(winMedia) // Toggle Action Icon for first time
winMedia.addEventListener('change', toggleActionIconScheme) // Register the listener when the user changes their mode

/**
 * Get Selected Preferences from a browser's storage
 * @returns Selected options
 */
const getSelectedOptionsStorage = () => {
  return new Promise<selectedOptions>((resolve, reject) => {
    try {
      chrome.storage.local.get(['options'], (data) => {
        const localOptions = data.options as selectedOptions
        resolve(localOptions)
      })
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Get Style Sheet
 * @returns Final Stylesheet
 */
const getStyleSheet = async () => {
  const selectedOptions = await getSelectedOptionsStorage()

  // console.log('selectedOptions', selectedOptions)

  // Create Style Tag for override elements' style
  const styleCSS = document.createElement('style')

  styleCSS.setAttribute('enhanced-dhs', '')

  const selectedOpt = {
    ...defaultOptions,
    font: FontOptions[selectedOptions.fontFamily],
    fontSize: selectedOptions.fontSize,
    fontWeight: selectedOptions.fontWeight,
    fontColor: selectedOptions.fontColor,
    fontPosition: selectedOptions.fontPosition,
    subtitleBgOpacity: selectedOptions.subtitleBg?.opacity,
    subtitleBgStatus: selectedOptions.subtitleBg?.enabled,
    noWatermark: selectedOptions.noWatermark,
    edgeStyle: EdgeStyleOptions[selectedOptions.edgeStyle?.style],
  }
  // console.log(selectedOpt)

  styleCSS.textContent += '.shaka-text-container {display: flex !important;}'

  if (selectedOptions) {
    // Change Subtitle Font
    if (selectedOpt.font) {
      // Add Google Font Stylesheet
      if (selectedOpt.font.isGoogleFont) {
        const preloadGstatic = getlinkHTMLHeader.preloadFontGstatic()
        const fontStyleSheet = getlinkHTMLHeader.loadStyleSheet.googleFont(
          [selectedOptions.fontFamily],
          FontOptions[selectedOptions.fontFamily].weight
        )
        document.head.append(preloadGstatic, fontStyleSheet)
      }

      if (selectedOpt.font.additionalGoogleFonts) {
        const fontStyleSheet = getlinkHTMLHeader.loadStyleSheet.googleFont(
          selectedOpt.font.additionalGoogleFonts,
          FontOptions[selectedOptions.fontFamily].weight
        )
        document.head.append(fontStyleSheet)
      }

      // Add Additional Font Stylesheet
      selectedOpt.font.libUrl?.forEach((url: string) => {
        const fontStyleSheet = getlinkHTMLHeader.loadStyleSheet.url(url)
        document.head.append(fontStyleSheet)
      })

      styleCSS.textContent += `${vdoClassSelector.subtitleSpanText} {font-family: ${selectedOpt.font.fontFamily} !important; font-weight: ${selectedOpt.fontWeight} !important;}` // Change Subtitle Font
    }
  }

  styleCSS.textContent += `${vdoClassSelector.subtitleSpanText} {color: ${
    selectedOpt.fontColor || '#FFFFFF'
  } !important;}` // Change Subtitle Color

  // if (selectedOpt.subtitleBgStatus) {
  styleCSS.textContent += `${vdoClassSelector.subtitleSpanText} {background-color: rgba(0,0,0,${selectedOpt.subtitleBgOpacity}) !important; border-radius: 1rem; padding: 1rem 2rem;}` // Change Subtitle Background Opacity
  // }

  // Add Transparent Subtitle Background
  // styleCSS.textContent += `${vdoClassSelector.subtitleSpanText} {background-color: transparent !important;}`

  // Arrange Position of Subtitle
  styleCSS.textContent += `${vdoClassSelector.subtitleTextContainer} {bottom: ${
    selectedOpt.fontPosition + 10
  }% !important;}`

  if (selectedOpt.fontSize) {
    styleCSS.textContent += `${
      vdoClassSelector.subtitleContainer
    } {font-size: ${
      28 + selectedOpt.fontSize
    }px !important;} @media (max-width: 768px) {${
      vdoClassSelector.subtitleContainer
    } {font-size: ${16 + selectedOpt.fontSize}px !important;}}`
  }

  if (selectedOpt.edgeStyle) {
    const cssEdgeStyle = selectedOpt.edgeStyle.cssStyle?.('black')
    if (cssEdgeStyle)
      styleCSS.textContent += `${vdoClassSelector.subtitleSpanText} {${cssEdgeStyle}}`
  }

  if (selectedOpt.noWatermark) {
    // Remove D+HS Icon in fullscreen
    styleCSS.textContent += `${vdoClassSelector.vdoWatermark} {display: none !important;}`
  }

  return styleCSS
}

/**
 * Run for the first load
 */
;(async () => {
  const resetStyleSheet = document.createElement('style')
  resetStyleSheet.id = 'enhancedDHS-reset'
  resetStyleSheet.textContent +=
    '.shaka-text-container {display: none !important;}'
  document.head.append(resetStyleSheet)
  document.head.append(await getStyleSheet())
})()

/**
 * Recieve the signal when the users have changed their display mode (light/dark)
 */
onMessage('updatePreferences', async ({ data }) => {
  const dhsInjectElems = document.querySelectorAll('[enhanced-dhs]')
  if (dhsInjectElems.length > 0) {
    // Remove All previous stylesheet
    for (const elem of dhsInjectElems) {
      elem.remove()
    }
  }

  document.head.append(await getStyleSheet()) // Append Changed Stylesheet
})
