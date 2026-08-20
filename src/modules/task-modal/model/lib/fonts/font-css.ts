// fontCss.ts

import HalvarBd from '@/assets/fonts/HalvarMittel-Bd.woff2?inline'
import HalvarRg from '@/assets/fonts/HalvarMittel-Rg.woff2?inline'
import PlatformBd from '@/assets/fonts/Platform-Bold-Desktop.woff2?inline'
import PlatformRg from '@/assets/fonts/Platform-Regular-Desktop.woff2?inline'

export const fontCss = `
  @font-face {
    font-family: "Halvar Mittel";
    src: url(${HalvarRg}) format("woff2");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Halvar Mittel";
    src: url(${HalvarBd}) format("woff2");
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Platform";
    src: url(${PlatformRg}) format("woff2");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Platform";
    src: url(${PlatformBd}) format("woff2");
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
`
