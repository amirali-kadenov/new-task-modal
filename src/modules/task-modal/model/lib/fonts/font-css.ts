// fontCss.ts

import HalvarBd from '/public/fonts/HalvarMittel-Bd.woff2'
import HalvarRg from '/public/fonts/HalvarMittel-Rg.woff2'
import PlatformBd from '/public/fonts/Platform-Bold-Desktop.woff2'
import PlatformRg from '/public/fonts/Platform-Regular-Desktop.woff2'

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
