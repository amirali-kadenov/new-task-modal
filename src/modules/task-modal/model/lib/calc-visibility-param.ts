/**
 * Shared URL param that force-hides the calculator (icon + panel) regardless
 * of task type / overflow logic. Used by both the real host (`content.tsx`,
 * reads `hostProps.location.search`) and Storybook trainer stories
 * (`text-template-trainer.tsx`, reads `window.location.search`) so the same
 * `?calc=hidden` deep link produces an identical calc-less render in either
 * place — needed for pixel-diffing Storybook against the live trainer.
 */
export const CALC_VISIBILITY_PARAM = 'calc'
export const CALC_HIDDEN_VALUE = 'hidden'

export const isCalcForceHidden = (search: string | undefined): boolean =>
  new URLSearchParams(search ?? '').get(CALC_VISIBILITY_PARAM) ===
  CALC_HIDDEN_VALUE
