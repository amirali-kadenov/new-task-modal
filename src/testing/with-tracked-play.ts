import {
  markRemainingFailed,
  resetPlayResults,
  type PlayCaseDef,
} from './play-results'
import { findPlayScope, withOnDemandPlay } from './with-on-demand-play'

type PlayFn<T> = (context: T) => Promise<void> | void

const errorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message
  if (err == null) return 'Unknown error'
  if (
    typeof err === 'string' ||
    typeof err === 'number' ||
    typeof err === 'boolean' ||
    typeof err === 'bigint'
  ) {
    return String(err)
  }
  try {
    return JSON.stringify(err) ?? 'Unknown error'
  } catch {
    return 'Unknown error'
  }
}

/**
 * On-demand play that resets a named case checklist before running.
 * Steps should call `runPlayStep` inside `play`.
 */
export const withTrackedPlay = <T extends { canvasElement: HTMLElement }>(
  cases: PlayCaseDef[],
  play: PlayFn<T>,
): PlayFn<T> =>
  withOnDemandPlay(
    async (context) => {
      resetPlayResults(findPlayScope(context.canvasElement), cases)
      try {
        await play(context)
      } catch (err) {
        markRemainingFailed(errorMessage(err))
        throw err
      }
    },
    { trackDefaultCase: false },
  )
