import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from '@storybook/react-vite';
import * as projectAnnotations from './preview';

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);

/** MathJax unmount races — also register here for the Vitest browser runner. */
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const message =
      event.reason instanceof Error
        ? event.reason.message
        : String(event.reason ?? '')
    if (message.startsWith('Typesetting failed:')) {
      event.preventDefault()
    }
  })
}