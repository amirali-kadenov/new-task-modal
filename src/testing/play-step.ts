import { updatePlayCase, type PlayCaseDef } from './play-results'

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
