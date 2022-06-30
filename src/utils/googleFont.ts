export const getGoogleFontCSSUrl = (
  fontFamily: string[],
  weight?: number[]
) => {
  let url = 'https://fonts.googleapis.com/css2?display=swap'
  for (const font of fontFamily) {
    // console.log(font)

    url += `&family=${font}`
    if (weight) {
      url += `:wght@${weight.join(';')}`
    }
  }
  return url
}
