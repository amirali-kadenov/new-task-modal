import { fontCss } from './font-css'

let injected = false

export function injectFonts() {
  if (injected) return

  const style = document.createElement('style')
  style.textContent = fontCss

  document.head.appendChild(style)

  injected = true
}
