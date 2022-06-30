import { edgeStyleOptions } from '../../@types'

/**
 * Default Edge Style Settings
 */
const EdgeStyleOptions: edgeStyleOptions = {
  none: { text: 'None', textLocale: 'popupEdgeNoneText' },
  outline: {
    text: 'Outline',
    textLocale: 'popupEdgeOutlineText',
    cssStyle: (color: string) =>
      `text-shadow: -3px -3px 0 ${color}, 0 -3px 0 ${color}, 3px -3px 0 ${color}, 3px 0 0 ${color}, 3px 3px 0 ${color}, 0 3px 0 ${color}, -3px 3px 0 ${color}, -3px 0 0 ${color};`,
  },
  dropShadow: {
    text: 'Drop Shadow',
    textLocale: 'popupEdgeDropShadowText',
    cssStyle: (color: string) =>
      `text-shadow: ${color} 2px 2px 2.5px, ${color} 2px 2px 3.5px, ${color} 2px 2px 4.5px`,
  },
}

export default EdgeStyleOptions
