/**
 * Storybook-only URL param that makes the trainer story's phone-frame shell
 * (`text-template-trainer.module.scss` `.shell`, normally hardcoded to
 * `min(100dvh, 812px)`) size to its actual content instead. Opt-in — other
 * trainer stories (Flow/*, and especially Calc Overflow, which relies on a
 * constrained height to trigger its overflow behavior) keep the default
 * fixed-height frame. Used by the trainer-parity visual check so the
 * Storybook capture's height matches the real host's content-driven height.
 */
export const SHELL_FIT_PARAM = 'fit'
export const SHELL_FIT_CONTENT_VALUE = 'content'

export const isShellFitContent = (search: string | undefined): boolean =>
  new URLSearchParams(search ?? '').get(SHELL_FIT_PARAM) ===
  SHELL_FIT_CONTENT_VALUE
