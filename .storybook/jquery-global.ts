/** Sets `window.jQuery` before MathQuill's IIFE is evaluated. */
import jQuery from 'jquery'

declare global {
  interface Window {
    jQuery: typeof jQuery
    $: typeof jQuery
  }
}

window.jQuery = jQuery
window.$ = jQuery
