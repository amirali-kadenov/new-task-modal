import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { addons } from 'storybook/preview-api'

import { templateKeyFromRootTitle } from '@/modules/testing/lib/template-options'
import {
  EVENTS,
  type DonePayload,
  type LogPayload,
  type ResultsPayload,
  type TestScope,
} from '@/modules/testing/lib/test-runner-events'
import type { PlayCaseResult } from '@/testing/play-results'
import { PlayResultsPanel } from '@/testing/play-results-panel'

type CatalogScope = Extract<TestScope, 'allGroups' | 'allTasks'>
type RunStatus = 'idle' | 'running' | 'pass' | 'fail'

const SCOPE_LABEL: Record<CatalogScope, string> = {
  allGroups: 'все группы',
  allTasks: 'все задачи',
}

const panelStyle: CSSProperties = {
  marginBottom: 24,
  padding: '12px 14px',
  background: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
}

const rowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 12,
  marginBottom: 12,
}

const buttonStyle: CSSProperties = {
  padding: '10px 16px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  background: '#fff',
  color: '#111827',
}

const hintStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: '#6b7280',
}

const summaryStyle: CSSProperties = {
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
  userSelect: 'none',
  padding: '4px 0',
}

const logStyle: CSSProperties = {
  marginTop: 8,
  marginBottom: 0,
  maxHeight: 280,
  overflow: 'auto',
  padding: 12,
  fontSize: 12,
  whiteSpace: 'pre-wrap',
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
}

/**
 * Top-of-catalog control: rewrite visual PNG baselines for every section in
 * this Groups / Tasks story (template + scope, no single-task filter).
 * Shows checkbox results + live runner log.
 */
export const CatalogUpdateSnapshotsButton = ({
  rootTitle,
  scope,
}: {
  rootTitle?: string
  scope: CatalogScope
}) => {
  const template = templateKeyFromRootTitle(rootTitle)
  const [runStatus, setRunStatus] = useState<RunStatus>('idle')
  const [caseResults, setCaseResults] = useState<PlayCaseResult[]>([])
  const [log, setLog] = useState('')
  const [logsOpen, setLogsOpen] = useState(false)
  const waitingRef = useRef(false)
  const logRef = useRef('')

  useEffect(() => {
    const channel = addons.getChannel()

    const onLog = (payload: LogPayload) => {
      if (payload.suite !== 'visual' || !waitingRef.current) return
      const next = logRef.current + payload.chunk
      logRef.current = next
      setLog(next)
    }

    const onResults = (payload: ResultsPayload) => {
      if (payload.suite !== 'visual' || !waitingRef.current) return
      setCaseResults(
        payload.cases.map((c) => ({
          id: c.id,
          label: c.label,
          status: c.status,
          error: c.error,
          descriptionRu: c.descriptionRu,
        })),
      )
    }

    const onDone = (payload: DonePayload) => {
      if (payload.suite !== 'visual' || !waitingRef.current) return
      waitingRef.current = false
      const passed = payload.exitCode === 0
      setRunStatus(passed ? 'pass' : 'fail')
    }

    channel.on(EVENTS.LOG, onLog)
    channel.on(EVENTS.RESULTS, onResults)
    channel.on(EVENTS.DONE, onDone)
    return () => {
      channel.off(EVENTS.LOG, onLog)
      channel.off(EVENTS.RESULTS, onResults)
      channel.off(EVENTS.DONE, onDone)
    }
  }, [])

  if (!template) return null

  const busy = runStatus === 'running'

  const onClick = () => {
    if (busy) return
    const ok = window.confirm(
      `Перезаписать PNG-эталоны для всех секций ${template} (${SCOPE_LABEL[scope]})?`,
    )
    if (!ok) return

    waitingRef.current = true
    logRef.current = ''
    setLog('')
    setCaseResults([])
    setRunStatus('running')
    setLogsOpen(true)
    addons.getChannel().emit(EVENTS.RUN, {
      suite: 'visual',
      scope,
      grade: 'all',
      template,
      task: '',
      updateSnapshots: true,
    })
  }

  const onStop = () => {
    if (!busy) return
    addons.getChannel().emit(EVENTS.STOP, { suite: 'visual' })
    waitingRef.current = false
    setRunStatus('fail')
    const next = `${logRef.current}\n=== stopped by user ===\n`
    logRef.current = next
    setLog(next)
  }

  const checklist: PlayCaseResult[] = [
    {
      id: 'update-snapshots',
      label: 'Обновить скриншоты',
      descriptionRu: `Default + Solution для ${SCOPE_LABEL[scope]} · ${template}`,
      status:
        runStatus === 'idle'
          ? 'pending'
          : runStatus === 'running'
            ? 'running'
            : runStatus,
    },
    ...caseResults.filter((c) => c.id !== 'update-snapshots'),
  ]

  return (
    <div
      data-visual-hide=""
      style={panelStyle}
      role="region"
      aria-label="Visual snapshots"
    >
      <div style={rowStyle}>
        <button
          type="button"
          style={{
            ...buttonStyle,
            opacity: busy ? 0.6 : 1,
            cursor: busy ? 'wait' : 'pointer',
          }}
          disabled={busy}
          onClick={onClick}
        >
          Обновить скриншоты
        </button>
        {busy ? (
          <button type="button" style={buttonStyle} onClick={onStop}>
            Стоп
          </button>
        ) : null}
        <p style={hintStyle}>
          Эталоны для {SCOPE_LABEL[scope]} шаблона <code>{template}</code>
        </p>
      </div>

      <PlayResultsPanel cases={checklist} header="Результаты" />

      {logsOpen || log ? (
        <details
          open={logsOpen || Boolean(log)}
          onToggle={(e) => setLogsOpen((e.target as HTMLDetailsElement).open)}
          style={{ marginTop: 12 }}
        >
          <summary style={summaryStyle}>Логи</summary>
          <pre style={logStyle}>{log || '—'}</pre>
        </details>
      ) : null}
    </div>
  )
}
