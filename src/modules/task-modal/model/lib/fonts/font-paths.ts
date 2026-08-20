// src/utils/fontPaths.ts
import HalvarBd from '@/assets/fonts/HalvarMittel-Bd.woff2?inline'
import HalvarRg from '@/assets/fonts/HalvarMittel-Rg.woff2?inline'
import PlatformBd from '@/assets/fonts/Platform-Bold-Desktop.woff2?inline'
import PlatformRg from '@/assets/fonts/Platform-Regular-Desktop.woff2?inline'

const FONT_PATHS = {
  'Halvar Mittel': { 400: HalvarRg, 700: HalvarBd },
  Platform: { 400: PlatformRg, 700: PlatformBd },
}

export const FONTS_CONFIG = [
  {
    family: 'Halvar Mittel',
    weight: '400',
    url: FONT_PATHS['Halvar Mittel'][400],
  },
  {
    family: 'Halvar Mittel',
    weight: '700',
    url: FONT_PATHS['Halvar Mittel'][700],
  },
  { family: 'Platform', weight: '400', url: FONT_PATHS['Platform'][400] },
  { family: 'Platform', weight: '700', url: FONT_PATHS['Platform'][700] },
]
