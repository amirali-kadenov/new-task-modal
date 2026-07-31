import type { ComponentType, CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { addons } from 'storybook/preview-api'

import { useAiChatStore } from '@/modules/chat/ui/ai-chat/model/ai-chat-store'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import {
  EVENTS,
  type DonePayload,
  type LogPayload,
  type TestSuite,
} from '@/modules/testing/lib/test-runner-events'

import type { PlayCaseResult } from '@/testing/play-results'
import { PlayResultsPanel } from '@/testing/play-results-panel'
import { Loader } from '@/ui/loader/loader'

import type { TextTask } from '../types.task'

import {
  runPlayCanvasAndChatInTrainer,
  runPlayCorrectAnswerForTask,
  runPlayWrongAnswerForTask,
  withInstantPlay,
} from './play-in-trainer'
import { TextTemplateTrainer } from './text-template-trainer'
import {
  formatChecklistCheckedAt,
  markTrainerChecklistTask,
  readTrainerChecklistProgress,
  TRAINER_CHECKLIST_CHANGE_EVENT,
  unmarkTrainerChecklistTask,
} from './trainer-checklist-storage'

type PlayKind = 'correct' | 'wrong' | 'canvas-chat'
type PlayStatus = 'idle' | 'running' | 'pass' | 'fail'
type SuiteStatus = 'idle' | 'running' | 'passed' | 'failed'

const PLAY_CASES = [
  ['correct', 'Правильный ответ'],
  ['wrong', 'Неправильный ответ'],
  ['canvas-chat', 'Доска и чат'],
] as const

const SUITE_CASES = [
  ['unit', 'Unit'],
  ['interactions', 'Interactions'],
  ['e2e', 'E2E'],
] as const

const PLAY_STATUS_COLOR: Record<PlayStatus, string> = {
  idle: '#6b7280',
  running: '#2563eb',
  pass: '#16a34a',
  fail: '#dc2626',
}

const SUITE_STATUS_COLOR: Record<SuiteStatus, string> = {
  idle: '#6b7280',
  running: '#2563eb',
  passed: '#16a34a',
  failed: '#dc2626',
}

const playStatusToCase = (status: PlayStatus): PlayCaseResult['status'] =>
  status === 'idle' ? 'pending' : status

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

const rowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  alignItems: 'center',
  marginBottom: 16,
}

interface Props {
  Template: ComponentType<TaskComponentProps<TextTask>>
  task: TextTask
  /** Stable key so suite listeners stay per-section. */
  sectionKey: string
  /** Storybook template title for Checklist localStorage key. */
  rootTitle?: string
}

/**
 * Collapsed-by-default per-section tests: local play + suite spawn via addon channel.
 */
/** Off-screen mount: plays still hit real DOM / toBeVisible; layout does not jump. */
const HIDDEN_TRAINER_STYLE: CSSProperties = {
  position: 'fixed',
  left: -10000,
  top: 0,
  width: 1024,
  height: 800,
  overflow: 'hidden',
  zIndex: -1,
}

const VISIBLE_TRAINER_STYLE: CSSProperties = {
  marginTop: 24,
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  overflow: 'hidden',
  minHeight: 420,
}

/**
 * userEvent/focus call scrollIntoView and jump Storybook docs to the top.
 * Pin window scroll only while play interacts with the trainer DOM.
 */
const withPinnedScroll = async (
  fn: () => Promise<void>,
  notify?: (locked: boolean) => void,
): Promise<void> => {
  const x = window.scrollX
  const y = window.scrollY
  const scrollingEl = document.scrollingElement
  const scrollTop = scrollingEl?.scrollTop ?? y

  const proto = Element.prototype
  const originalScrollIntoView = proto.scrollIntoView
  proto.scrollIntoView = function scrollIntoViewNoop() {
    /* pinned */
  }

  const focusProto = HTMLElement.prototype
  const originalFocus = focusProto.focus
  focusProto.focus = function focusNoScroll(
    this: HTMLElement,
    options?: FocusOptions,
  ) {
    return originalFocus.call(this, { ...options, preventScroll: true })
  }

  const restore = () => {
    if (window.scrollX !== x || window.scrollY !== y) {
      window.scrollTo(x, y)
    }
    if (scrollingEl && scrollingEl.scrollTop !== scrollTop) {
      scrollingEl.scrollTop = scrollTop
    }
  }

  notify?.(true)
  const intervalId = window.setInterval(restore, 50)
  try {
    await fn()
  } finally {
    window.clearInterval(intervalId)
    proto.scrollIntoView = originalScrollIntoView
    focusProto.focus = originalFocus
    restore()
    requestAnimationFrame(restore)
    notify?.(false)
  }
}

const isStoppedError = (err: unknown) =>
  err instanceof Error && err.message === 'Tests stopped'

export const TaskSectionTestPanel = ({
  Template,
  task,
  sectionKey,
  rootTitle,
}: Props) => {
  const trainerRootRef = useRef<HTMLDivElement>(null)
  const [showTrainer, setShowTrainer] = useState(false)
  /** Instant «Запустить быстро»: trainer mounted off-screen, checklist-only UI. */
  const [trainerOffscreen, setTrainerOffscreen] = useState(false)
  const [playStatus, setPlayStatus] = useState<Record<PlayKind, PlayStatus>>({
    correct: 'idle',
    wrong: 'idle',
    'canvas-chat': 'idle',
  })
  const [playError, setPlayError] = useState<string | null>(null)
  const [suiteStatus, setSuiteStatus] = useState<
    Record<TestSuite, SuiteStatus>
  >({
    unit: 'idle',
    interactions: 'idle',
    e2e: 'idle',
  })
  const [suiteLog, setSuiteLog] = useState('')
  const [e2eHeaded, setE2eHeaded] = useState(false)
  const [allRunning, setAllRunning] = useState(false)
  const [showChecklist, setShowChecklist] = useState(false)
  const [scrollLocked, setScrollLocked] = useState(false)
  /** Bump to remount trainer between plays (fresh lives / chat actions). */
  const [trainerKey, setTrainerKey] = useState(0)
  const [taskChecked, setTaskChecked] = useState(false)
  const [taskCheckedAt, setTaskCheckedAt] = useState<string | null>(null)
  const logRef = useRef('')
  const allRunningRef = useRef(false)
  const stopRequestedRef = useRef(false)
  const activeSuiteRef = useRef<TestSuite | null>(null)
  const lastSuitePassedRef = useRef(false)
  const suiteDoneResolverRef = useRef<(() => void) | null>(null)

  const syncChecklistMark = () => {
    if (!task.id) {
      setTaskChecked(false)
      setTaskCheckedAt(null)
      return
    }
    const progress = readTrainerChecklistProgress(rootTitle)
    const checked = progress.tasks.includes(task.id)
    setTaskChecked(checked)
    setTaskCheckedAt(checked ? (progress.checkedAt?.[task.id] ?? null) : null)
  }

  useEffect(() => {
    syncChecklistMark()
    const onChange = () => syncChecklistMark()
    window.addEventListener(TRAINER_CHECKLIST_CHANGE_EVENT, onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener(TRAINER_CHECKLIST_CHANGE_EVENT, onChange)
      window.removeEventListener('storage', onChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync on task/rootTitle
  }, [task.id, rootTitle])

  const toggleChecklistMark = () => {
    if (!task.id) return
    if (taskChecked) {
      unmarkTrainerChecklistTask(rootTitle, task.id)
    } else {
      markTrainerChecklistTask(rootTitle, task.id)
    }
    syncChecklistMark()
  }

  const appendLog = (chunk: string) => {
    const next = logRef.current + chunk
    logRef.current = next
    setSuiteLog(next)
  }

  const clearLog = () => {
    logRef.current = ''
    setSuiteLog('')
  }

  const assertNotStopped = () => {
    if (stopRequestedRef.current) {
      throw new Error('Tests stopped')
    }
  }

  const stopTests = () => {
    if (!stopRequestedRef.current) {
      stopRequestedRef.current = true
      appendLog('\n=== stopped by user ===\n')
    }
    const suite = activeSuiteRef.current
    if (suite) {
      lastSuitePassedRef.current = false
      setSuiteStatus((prev) => ({ ...prev, [suite]: 'failed' }))
      activeSuiteRef.current = null
      const resolve = suiteDoneResolverRef.current
      suiteDoneResolverRef.current = null
      resolve?.()
    }
  }

  useEffect(() => {
    const channel = addons.getChannel()

    const onLog = (payload: LogPayload) => {
      if (payload.suite !== activeSuiteRef.current) return
      appendLog(payload.chunk)
    }

    const onDone = (payload: DonePayload) => {
      if (payload.suite !== activeSuiteRef.current) return
      const passed = payload.exitCode === 0
      lastSuitePassedRef.current = passed
      setSuiteStatus((prev) => ({
        ...prev,
        [payload.suite]: passed ? 'passed' : 'failed',
      }))
      activeSuiteRef.current = null
      const resolve = suiteDoneResolverRef.current
      suiteDoneResolverRef.current = null
      resolve?.()
    }

    channel.on(EVENTS.LOG, onLog)
    channel.on(EVENTS.DONE, onDone)
    return () => {
      channel.off(EVENTS.LOG, onLog)
      channel.off(EVENTS.DONE, onDone)
    }
  }, [sectionKey])

  const waitForTrainerRoot = async (): Promise<HTMLElement | null> => {
    // Wait a tick so trainer mounts into trainerRootRef.
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve())
    })
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 50)
    })
    return trainerRootRef.current
  }

  /** Fresh shell per play — prior wrong/hint state hides «Смотреть пример». */
  const remountFreshTrainer = async (
    offscreen: boolean,
  ): Promise<HTMLElement | null> => {
    useAiChatStore.getState().reset(task.id)
    setTrainerKey((key) => key + 1)
    setTrainerOffscreen(offscreen)
    setShowTrainer(true)
    return waitForTrainerRoot()
  }

  const runPlay = async (
    kind: PlayKind,
    options?: { offscreen?: boolean },
  ): Promise<boolean> => {
    if (!allRunningRef.current) stopRequestedRef.current = false
    assertNotStopped()
    const offscreen = options?.offscreen === true
    let passed = false

    try {
      await withPinnedScroll(async () => {
        assertNotStopped()
        setShowChecklist(true)
        setPlayError(null)
        setPlayStatus((prev) => ({ ...prev, [kind]: 'running' }))

        const root = await remountFreshTrainer(offscreen)
        assertNotStopped()
        if (!root) {
          const message = 'Trainer root not mounted'
          setPlayStatus((prev) => ({ ...prev, [kind]: 'fail' }))
          setPlayError(message)
          appendLog(`=== play:${kind} ===\n${message}\n`)
          return
        }

        try {
          if (kind === 'correct') {
            await runPlayCorrectAnswerForTask(task)({ canvasElement: root })
          } else if (kind === 'wrong') {
            await runPlayWrongAnswerForTask(task)({ canvasElement: root })
          } else {
            await runPlayCanvasAndChatInTrainer({ canvasElement: root })
          }
          assertNotStopped()
          setPlayStatus((prev) => ({ ...prev, [kind]: 'pass' }))
          passed = true
        } catch (err) {
          if (isStoppedError(err)) {
            setPlayStatus((prev) => ({ ...prev, [kind]: 'fail' }))
            throw err
          }
          const message = err instanceof Error ? err.message : String(err)
          setPlayStatus((prev) => ({ ...prev, [kind]: 'fail' }))
          setPlayError(message)
          appendLog(`=== play:${kind} ===\n${message}\n`)
        }
      }, setScrollLocked)
    } catch (err) {
      if (!isStoppedError(err)) throw err
    } finally {
      if (!allRunningRef.current) stopRequestedRef.current = false
    }

    return passed
  }

  const runSuite = async (suite: TestSuite): Promise<boolean> => {
    assertNotStopped()
    if (activeSuiteRef.current) return false
    setShowChecklist(true)
    lastSuitePassedRef.current = false
    await new Promise<void>((resolve) => {
      if (!allRunningRef.current) clearLog()
      appendLog(`=== ${suite} ===\n`)
      activeSuiteRef.current = suite
      suiteDoneResolverRef.current = resolve
      setSuiteStatus((prev) => ({ ...prev, [suite]: 'running' }))
      addons.getChannel().emit(EVENTS.RUN, {
        suite,
        headed: suite === 'e2e' ? e2eHeaded : undefined,
      })
    })
    return lastSuitePassedRef.current
  }

  const runAll = async (instant: boolean) => {
    stopRequestedRef.current = false
    setShowChecklist(true)
    setPlayError(null)
    clearLog()
    setPlayStatus({
      correct: 'idle',
      wrong: 'idle',
      'canvas-chat': 'idle',
    })
    allRunningRef.current = true
    setAllRunning(true)
    let allPassed = true
    try {
      const plays = async () => {
        for (const [kind] of PLAY_CASES) {
          assertNotStopped()
          const ok = await runPlay(kind, { offscreen: instant })
          if (!ok) allPassed = false
        }
      }
      if (instant) {
        await withInstantPlay(plays)
        // Drop off-screen trainer so the page stays checklist-only.
        setShowTrainer(false)
        setTrainerOffscreen(false)
      } else {
        await plays()
      }

      if (allPassed && !stopRequestedRef.current && task.id) {
        markTrainerChecklistTask(rootTitle, task.id)
        appendLog(`=== checklist: marked ${task.id} ===\n`)
        syncChecklistMark()
      }
    } catch (err) {
      if (!isStoppedError(err)) throw err
    } finally {
      allRunningRef.current = false
      setAllRunning(false)
      stopRequestedRef.current = false
    }
  }

  const anyPlayRunning = Object.values(playStatus).some((s) => s === 'running')
  const anySuiteRunning = Object.values(suiteStatus).some(
    (s) => s === 'running',
  )
  const busy = anyPlayRunning || anySuiteRunning || allRunning

  const checklistCases: PlayCaseResult[] = PLAY_CASES.map(([id, label]) => ({
    id,
    label,
    status: playStatusToCase(playStatus[id]),
    error: playStatus[id] === 'fail' && playError ? playError : undefined,
  }))

  return (
    <details style={{ marginTop: 24 }}>
      <summary
        style={{
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
          color: '#374151',
          userSelect: 'none',
          padding: '4px 0',
        }}
      >
        Тесты
      </summary>

      <div
        style={{
          marginTop: 16,
          padding: 20,
          background: '#f9fafb',
          borderRadius: 10,
        }}
      >
        <label
          style={{
            ...rowStyle,
            marginBottom: 16,
            gap: 10,
            cursor: task.id ? 'pointer' : 'default',
            fontSize: 13,
            color: '#111827',
          }}
        >
          <input
            type="checkbox"
            checked={taskChecked}
            disabled={!task.id}
            onChange={toggleChecklistMark}
            style={{ width: 16, height: 16, accentColor: '#16a34a' }}
          />
          <span style={{ fontWeight: 600 }}>Checklist</span>
          {taskChecked ? (
            <span style={{ color: '#6b7280', fontWeight: 400 }}>
              {taskCheckedAt
                ? `отмечено ${formatChecklistCheckedAt(taskCheckedAt)}`
                : 'отмечено'}
            </span>
          ) : (
            <span style={{ color: '#9ca3af', fontWeight: 400 }}>
              не отмечено
            </span>
          )}
        </label>

        <div style={{ ...rowStyle, marginBottom: 20, gap: 14 }}>
          <button
            type="button"
            style={buttonStyle}
            disabled={busy}
            onClick={() => void runAll(false)}
          >
            Запустить все
          </button>
          <button
            type="button"
            style={buttonStyle}
            disabled={busy}
            onClick={() => void runAll(true)}
            title="Только play этой задачи (без пауз); тренажёр скрыт"
          >
            Запустить быстро
          </button>
          {busy ? (
            <button
              type="button"
              style={{
                ...buttonStyle,
                color: '#b91c1c',
                borderColor: '#fca5a5',
                background: '#fef2f2',
              }}
              onClick={stopTests}
            >
              Остановить
            </button>
          ) : null}
          {busy ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 600,
                color: '#2563eb',
              }}
              role="status"
              aria-live="polite"
            >
              <Loader
                variant="black"
                width={18}
                height={18}
                style={{ color: '#2563eb' }}
              />
              Выполняется…
            </span>
          ) : null}
          {scrollLocked ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: '#92400e',
                background: '#fffbeb',
                border: '1px solid #fcd34d',
                borderRadius: 6,
                padding: '4px 10px',
              }}
              title="Скролл страницы зафиксирован, пока play кликает по тренажёру"
              role="status"
              aria-live="polite"
            >
              Скролл зафиксирован
            </span>
          ) : null}
        </div>

        {showChecklist ? (
          <div
            style={{
              marginBottom: 20,
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <PlayResultsPanel cases={checklistCases} header="Результаты" />
          </div>
        ) : null}

        {suiteLog ? (
          <details style={{ marginBottom: 16 }}>
            <summary
              style={{
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: '#6b7280',
                userSelect: 'none',
                padding: '8px 0',
              }}
            >
              Логи
            </summary>
            <pre
              style={{
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
              }}
            >
              {suiteLog}
            </pre>
          </details>
        ) : null}

        <details style={{ marginBottom: 8 }}>
          <summary
            style={{
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              color: '#6b7280',
              userSelect: 'none',
              padding: '8px 0',
            }}
          >
            Подробнее
          </summary>

          <div style={{ marginTop: 16, paddingTop: 8 }}>
            <div style={{ ...rowStyle, marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>
                Play (эта задача)
              </span>
            </div>
            <div style={{ ...rowStyle, marginBottom: 20 }}>
              {PLAY_CASES.map(([kind, label]) => (
                <button
                  key={kind}
                  type="button"
                  style={buttonStyle}
                  disabled={busy}
                  onClick={() => void runPlay(kind)}
                >
                  {label}
                  <span
                    style={{
                      marginLeft: 8,
                      color: PLAY_STATUS_COLOR[playStatus[kind]],
                      fontWeight: 700,
                    }}
                  >
                    {playStatus[kind]}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ ...rowStyle, marginBottom: 10, marginTop: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>
                Suites (проект)
              </span>
              <label
                style={{
                  fontSize: 13,
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  marginLeft: 8,
                }}
              >
                <input
                  type="checkbox"
                  checked={e2eHeaded}
                  disabled={busy}
                  onChange={(e) => setE2eHeaded(e.target.checked)}
                />
                E2E headed
              </label>
            </div>
            <div style={rowStyle}>
              {SUITE_CASES.map(([suite, label]) => (
                <button
                  key={suite}
                  type="button"
                  style={buttonStyle}
                  disabled={busy}
                  onClick={() => void runSuite(suite)}
                >
                  {label}
                  <span
                    style={{
                      marginLeft: 8,
                      color: SUITE_STATUS_COLOR[suiteStatus[suite]],
                      fontWeight: 700,
                    }}
                  >
                    {suiteStatus[suite]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </details>

        {(showTrainer || anyPlayRunning) && (
          <div
            ref={trainerRootRef}
            style={
              trainerOffscreen ? HIDDEN_TRAINER_STYLE : VISIBLE_TRAINER_STYLE
            }
          >
            <TextTemplateTrainer
              key={trainerKey}
              Template={Template}
              task={task}
              trainerOptions={{ withHints: true, withTheory: true }}
            />
          </div>
        )}
      </div>
    </details>
  )
}
