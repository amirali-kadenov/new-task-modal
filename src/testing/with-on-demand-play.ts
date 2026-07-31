import {
  DEFAULT_INTERACTION_CASE_ID,
  getPlayResults,
  markRemainingFailed,
  resetPlayResults,
  setActivePlayScope,
  updatePlayCase,
  type PlayScopeId,
} from './play-results'

/** Button injected by Storybook decorator; click starts the play function. */
export const RUN_PLAY_TEST_ID = 'sb-run-play'
export const RUN_PLAY_LABEL = 'Run interaction'

/** Marks the decorator root so a play can find the block it renders in. */
export const PLAY_SCOPE_ATTR = 'data-play-scope'

/** Used under Vitest, where the decorator chrome is not rendered at all. */
const HEADLESS_PLAY_SCOPE: PlayScopeId = 'play-scope-headless'

/**
 * True under Vitest (jsdom or browser runner).
 * `import.meta.env.VITEST` alone is unreliable in Storybook's Chromium project.
 */
export const isAutomatedInteractionRun = (): boolean => {
  if (import.meta.env.VITEST) return true
  if (typeof window === 'undefined') return false
  if (window.location.href.includes('__vitest__')) return true
  if (document.title.includes('Vitest Browser')) return true
  if (document.querySelector('link[href*="__vitest__"]')) return true
  return false
}

/**
 * A docs page hosts several story blocks, so every lookup below stays inside
 * `canvasElement` — otherwise every play would bind to the first block's button.
 */
export const findPlayScope = (canvasElement: HTMLElement): PlayScopeId =>
  canvasElement
    .querySelector<HTMLElement>(`[${PLAY_SCOPE_ATTR}]`)
    ?.getAttribute(PLAY_SCOPE_ATTR) ?? HEADLESS_PLAY_SCOPE

/**
 * In Storybook UI, wait until the user clicks this block's "Run interaction".
 * Under Vitest the play runs immediately.
 */
export const waitForRunPlayClick = (canvasElement: HTMLElement) =>
  new Promise<void>((resolve) => {
    const findButton = () =>
      canvasElement.querySelector<HTMLElement>(
        `[data-testid="${RUN_PLAY_TEST_ID}"]`,
      )

    const existing = findButton()
    if (existing) {
      existing.addEventListener('click', () => resolve(), { once: true })
      return
    }

    const observer = new MutationObserver(() => {
      const button = findButton()
      if (!button) return
      observer.disconnect()
      button.addEventListener('click', () => resolve(), { once: true })
    })
    observer.observe(canvasElement, { childList: true, subtree: true })
  })

type PlayFn<T> = (context: T) => Promise<void> | void

export type OnDemandPlayOptions = {
  /**
   * When true (default), publish a single checklist case for the whole play.
   * Set false when the play uses `withTrackedPlay` / `runPlayStep` instead.
   */
  trackDefaultCase?: boolean
  /** Label for the default interaction case (Storybook story name). */
  defaultCaseLabel?: string
}

const errorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message
  return String(err ?? 'Unknown error')
}

/**
 * Wrap a story `play` so it only auto-runs under Vitest.
 * In Storybook UI it waits for the Run interaction button.
 * Optionally tracks a single default checklist case.
 */
export const withOnDemandPlay =
  <T extends { canvasElement: HTMLElement }>(
    play: PlayFn<T>,
    options: OnDemandPlayOptions = {},
  ): PlayFn<T> =>
  async (context) => {
    const trackDefault = options.trackDefaultCase !== false
    const label = options.defaultCaseLabel ?? 'Interaction'

    if (!isAutomatedInteractionRun()) {
      await waitForRunPlayClick(context.canvasElement)
    }

    if (trackDefault) {
      const scope = findPlayScope(context.canvasElement)
      const existing = getPlayResults(scope)
      const existingDefault = existing.find(
        (c) => c.id === DEFAULT_INTERACTION_CASE_ID,
      )
      if (existing.length === 0) {
        resetPlayResults(scope, [{ id: DEFAULT_INTERACTION_CASE_ID, label }])
      } else {
        setActivePlayScope(scope)
      }
      updatePlayCase(DEFAULT_INTERACTION_CASE_ID, {
        status: 'running',
        label: existingDefault?.label ?? label,
      })
    }

    try {
      await play(context)
      if (trackDefault) {
        updatePlayCase(DEFAULT_INTERACTION_CASE_ID, { status: 'pass' })
      }
    } catch (err) {
      if (trackDefault) {
        updatePlayCase(DEFAULT_INTERACTION_CASE_ID, {
          status: 'fail',
          error: errorMessage(err),
        })
        markRemainingFailed(errorMessage(err))
      }
      throw err
    }
  }
