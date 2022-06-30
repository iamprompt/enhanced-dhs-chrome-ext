import { fontSizeOptions } from '../../@types'

/**
 * Default Font Size Settings
 */
const FontSizeOptions: fontSizeOptions = {
  normal: {
    text: 'Normal',
    classText: 'text-sm',
    plusSize: 0,
    textLocale: 'popupFontSizeNormalText',
  },
  large: {
    text: 'Large',
    classText: 'text-base',
    plusSize: 25,
    textLocale: 'popupFontSizeLargeText',
  },
  huge: {
    text: 'Huge',
    classText: 'text-xl',
    plusSize: 50,
    textLocale: 'popupFontSizeHugeText',
  },
}

export default FontSizeOptions
