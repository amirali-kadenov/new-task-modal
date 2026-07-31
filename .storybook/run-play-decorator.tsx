import type { Decorator } from '@storybook/react-vite'
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'

import { PlayResultsPanel } from '@/testing/play-results-panel'
import {
  createPlayScopeId,
  resetPlayResults,
  subscribePlayResults,
  type PlayCaseDef,
  type PlayCaseResult,
} from '@/testing/play-results'
import {
  isAutomatedInteractionRun,
  PLAY_SCOPE_ATTR,
  RUN_PLAY_LABEL,
  RUN_PLAY_TEST_ID,
} from '@/testing/with-on-demand-play'

const barStyle: CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  background: '#111827',
  color: '#f9fafb',
  fontSize: 13,
}

const barRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
}

const buttonStyle: CSSProperties = {
  padding: '6px 12px',
  fontSize: 13,
  fontWeight: 600,
  color: '#111827',
  cursor: 'pointer',
  background: '#fbbf24',
  border: 'none',
  borderRadius: 6,
}

type PlayCasesParam = PlayCaseDef[] | undefined

const InteractionChrome = ({
  storyName,
  playCases,
  children,
}: {
  storyName: string
  playCases: PlayCasesParam
  children: ReactNode
}) => {
  const [scopeId] = useState(createPlayScopeId)

  const initialDefs = useMemo<PlayCaseDef[]>(
    () =>
      playCases?.length
        ? playCases
        : [{ id: 'interaction', label: storyName }],
    [playCases, storyName],
  )

  const [cases, setCases] = useState<PlayCaseResult[]>(() =>
    resetPlayResults(scopeId, initialDefs),
  )

  useEffect(() => {
    setCases(resetPlayResults(scopeId, initialDefs))
  }, [scopeId, initialDefs])

  useEffect(() => subscribePlayResults(scopeId, setCases), [scopeId])

  return (
    <div {...{ [PLAY_SCOPE_ATTR]: scopeId }}>
      <div style={barStyle} role="region" aria-label="Interaction controls">
        <div style={barRowStyle}>
          <button
            type="button"
            data-testid={RUN_PLAY_TEST_ID}
            style={buttonStyle}
          >
            {RUN_PLAY_LABEL}
          </button>
          <span>Play will not start until you press this button.</span>
        </div>
        <PlayResultsPanel cases={cases} />
      </div>
      {children}
    </div>
  )
}

/**
 * Shows "Run interaction" + checklist when the story has a `play` function
 * and we are in Storybook UI (not Vitest). Play helpers wait for this click.
 */
export const withRunPlayButton: Decorator = (Story, context) => {
  const hasPlay = typeof context.playFunction === 'function'
  const skip = context.parameters.skipRunPlayButton === true
  const inDocs = context.viewMode === 'docs'
  if (!hasPlay || skip || inDocs || isAutomatedInteractionRun()) {
    return <Story />
  }

  const playCases = context.parameters.playCases as PlayCasesParam

  return (
    <InteractionChrome storyName={context.name} playCases={playCases}>
      <Story />
    </InteractionChrome>
  ) as ReactNode
}
