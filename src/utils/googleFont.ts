const GOOGLE_FONT_CSS2_URL = 'https://fonts.googleapis.com/css2'

export const getGoogleFontCSSUrl = (
  fontFamily: string[],
  weight?: number[]
) => {
  const url = new URL(GOOGLE_FONT_CSS2_URL)
  url.searchParams.append('display', 'swap')
  for (const font of fontFamily) {
    url.searchParams.append(
      'family',
      `${font}${weight ? `:wght@${weight.join(';')}` : ''}`
    )
  }
  return url.toString()
}
