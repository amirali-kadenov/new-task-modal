import {
  updatePlayCase,
  type PlayCaseDef,
} from './play-results'

const errorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message
  return String(err ?? 'Unknown error')
}

/**
 * Runs one named play assertion step and publishes its status to the results bus.
 */
export const runPlayStep = async (
  id: string,
  label: string,
  fn: () => Promise<void> | void,
): Promise<void> => {
  updatePlayCase(id, { label, status: 'running' })
  try {
    await fn()
    updatePlayCase(id, { status: 'pass' })
  } catch (err) {
    updatePlayCase(id, { status: 'fail', error: errorMessage(err) })
    throw err
  }
}

export const playCasesFromDefs = (defs: PlayCaseDef[]): PlayCaseDef[] => defs
