import { FONTS_CONFIG } from './font-paths'

// Load fonts dynamically when the library is first used
const loadFonts = async () => {
  await Promise.all(
    FONTS_CONFIG.map((f) => {
      const fontFace = new FontFace(f.family, `url(${f.url})`, {
        weight: f.weight,
        style: 'normal',
        display: 'swap',
      })
      return fontFace.load().then((loaded) => document.fonts.add(loaded))
    }),
  )
}

/**
 * Call this function once to initialize the library.
 * Loads fonts dynamically the first time.
 */
let fontsLoaded = false

export const loadFontsOnce = async () => {
  if (fontsLoaded) return

  await loadFonts()
  fontsLoaded = true
}
