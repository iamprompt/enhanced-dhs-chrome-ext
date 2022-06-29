export interface selectedOptions {
  fontFamily: string
  fontSize: number
  fontWeight: number
  fontColor: string
  fontPosition: number
  noWatermark: boolean
  subtitleBg: {
    enabled: boolean
    opacity: number
  }
  edgeStyle: {
    style: string
    color: string
  }
}

export type fontSizeOptions = Record<
  string,
  { text: string; classText: string; plusSize: number; textLocale?: string }
>

export interface fontFamily {
  title: string
  weight: number[]
  defaultFontWeight: number
  category: string
  fontFamily: string
  additionalGoogleFonts?: string[]
  isGoogleFont?: boolean
  libUrl?: string[]
}

export type fontFamilyOptions = Record<string, fontFamily>

export type edgeStyleOptions = Record<
  string,
  { text: string; textLocale?: string; cssStyle?: (color: string) => string }
>

export type FontCategoryOptions = Record<string, Record<string, fontFamily>>

export type fontWeightsText = Record<number, string>
