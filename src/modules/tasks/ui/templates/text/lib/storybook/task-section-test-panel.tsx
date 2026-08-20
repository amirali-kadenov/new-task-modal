import type {
  ComponentType,
  CSSProperties,
  FocusEvent,
  MouseEvent,
  ReactElement,
} from 'react'
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { addons } from 'storybook/preview-api'

import { useAiChatStore } from '@/modules/chat/ui/ai-chat/model/ai-chat-store'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { templateKeyFromRootTitle } from '@/modules/testing/lib/template-options'
import {
  EVENTS,
  type DonePayload,
  type LogPayload,
  type TestGrade,
  type TestScope,
  type TestSuite,
} from '@/modules/testing/lib/test-runner-events'
import type { PlayCaseResult } from '@/testing/play-results'
import { PlayResultsPanel } from '@/testing/play-results-panel'
import { Loader } from '@/ui/loader/loader'

import type { TextTask } from '../types.task'

import {
  runPlayCanvasAndChatInTrainer,
  runPlayCorrectAnswerForTask,
  runPlayHintsForTask,
  runPlayShowAnswerInTrainer,
  runPlayTheoryInTrainer,
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

type PlayKind =
  | 'correct'
  | 'wrong'
  | 'hints'
  | 'theory'
  | 'show-answer'
  | 'canvas-chat'
type PlayStatus = 'idle' | 'running' | 'pass' | 'fail'
type SuiteStatus = 'idle' | 'running' | 'passed' | 'failed'

const PLAY_CASES = [
  ['correct', 'Правильный ответ'],
  ['wrong', 'Неправильный ответ'],
  ['hints', 'Подсказки'],
  ['theory', 'Теория'],
  ['show-answer', 'Показать ответ'],
  ['canvas-chat', 'Доска и чат'],
] as const

const PLAY_CASE_TIPS: Record<(typeof PLAY_CASES)[number][0], string> = {
  correct: 'Вводит верный ответ и проверяет, что задача принимается',
  wrong: 'Три неверных ответа → ShowSolution / «Далее»',
  hints: 'Неверные ответы → hint1 / hint2',
  theory: 'Открывает чат и проверяет видео теории',
  'show-answer': 'В чате нажимает «Показать ответ»',
  'canvas-chat': 'Открывает доску и AI-чат, проверяет базовые действия',
}

const idlePlayStatus = (): Record<PlayKind, PlayStatus> => ({
  correct: 'idle',
  wrong: 'idle',
  hints: 'idle',
  theory: 'idle',
  'show-answer': 'idle',
  'canvas-chat': 'idle',
})

const SUITE_CASES = [
  ['unit', 'Unit'],
  ['interactions', 'Interactions'],
  ['e2e', 'E2E'],
] as const

const SUITE_CASE_TIPS: Record<(typeof SUITE_CASES)[number][0], string> = {
  unit: 'Vitest unit-тесты проекта (фильтр по шаблону/задаче)',
  interactions:
    'Trainer Flow play (Correct / Wrong / Hints / …) для этой секции',
  e2e: 'Playwright E2E для этой секции',
}

const TIP = {
  checklist: 'Отметить задачу проверенной вручную (localStorage checklist)',
  run: 'Все Trainer Flow этой задачи (ответ / подсказки / теория / доска), затем Unit / Interactions / E2E',
  runFast: 'То же без пауз, тренажёр скрыт; затем suites проекта',
  stop: 'Прервать текущий прогон',
  results: 'Сводка статусов play и suites',
  details: 'Отдельный запуск play-кейсов и suites / visual',
  logs: 'Вывод suite-раннера (stdout/stderr)',
  playSection: 'Локальные play-сценарии только для этой задачи',
  suitesSection: 'Проектные suites через Storybook addon channel',
  visual: 'Сравнить PNG-эталоны Default + Solution для этой секции',
  updateSnapshots: 'Перезаписать PNG-эталоны для этой группы/задачи',
} as const

/**
 * Hover tooltip that works inside Storybook iframe (native `title` often does not).
 * Clones the child so `<summary>` / `<button>` stay valid DOM parents.
 */
const Tip = ({
  text,
  placement = 'top',
  children,
}: {
  text: string
  /** Leftmost controls: show beside the host so text is not clipped. */
  placement?: 'top' | 'right'
  children: ReactElement<{
    ref?: (node: HTMLElement | null) => void
    onMouseEnter?: (e: MouseEvent) => void
    onMouseLeave?: (e: MouseEvent) => void
    onFocus?: (e: FocusEvent) => void
    onBlur?: (e: FocusEvent) => void
  }>
}) => {
  const hostRef = useRef<HTMLElement | null>(null)
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  )

  if (!isValidElement(children)) return children

  const show = () => {
    const el = hostRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (placement === 'right') {
      setCoords({
        top: rect.top + rect.height / 2,
        left: rect.right + 8,
      })
      return
    }
    setCoords({ top: rect.top, left: rect.left + rect.width / 2 })
  }
  const hide = () => setCoords(null)

  return (
    <>
      {/* `cloneElement` injects the ref imperatively (no static JSX `ref=`
           attribute exists to attach to), so the compiler's ref-safety
           analysis can't verify it — cloning is required here to keep
           `<summary>`/`<button>` valid DOM parents (no wrapper element). */}
      {
        // eslint-disable-next-line react-hooks/refs
        cloneElement(children, {
          ref: (node: HTMLElement | null) => {
            hostRef.current = node
            children.props.ref?.(node)
          },
          onMouseEnter: (e: MouseEvent) => {
            children.props.onMouseEnter?.(e)
            show()
          },
          onMouseLeave: (e: MouseEvent) => {
            children.props.onMouseLeave?.(e)
            hide()
          },
          onFocus: (e: FocusEvent) => {
            children.props.onFocus?.(e)
            show()
          },
          onBlur: (e: FocusEvent) => {
            children.props.onBlur?.(e)
            hide()
          },
        })
      }
      {coords
        ? createPortal(
            <span
              role="tooltip"
              style={{
                position: 'fixed',
                top: placement === 'right' ? coords.top : coords.top - 8,
                left: coords.left,
                transform:
                  placement === 'right'
                    ? 'translateY(-50%)'
                    : 'translate(-50%, -100%)',
                zIndex: 99999,
                boxSizing: 'border-box',
                width: 'max-content',
                maxWidth: 260,
                padding: '6px 10px',
                borderRadius: 6,
                background: '#111827',
                color: '#f9fafb',
                fontSize: 12,
                fontWeight: 500,
                lineHeight: 1.35,
                textAlign: 'left',
                whiteSpace: 'normal',
                pointerEvents: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              }}
            >
              {text}
            </span>,
            document.body,
          )
        : null}
    </>
  )
}

const parseSectionScope = (
  sectionKey: string,
): { scope: TestScope; itemId: string } | null => {
  const sep = sectionKey.indexOf(':')
  if (sep < 0) return null
  const kind = sectionKey.slice(0, sep)
  const itemId = sectionKey.slice(sep + 1)
  if (!itemId) return null
  if (kind === 'all-groups') return { scope: 'allGroups', itemId }
  if (kind === 'all-tasks') return { scope: 'allTasks', itemId }
  return null
}

const gradeFromItemId = (itemId: string): TestGrade => {
  const match = itemId.match(/^(\d+)_/)
  return match ? Number(match[1]) : 'all'
}

type SectionFilters = {
  scope: TestScope
  grade: TestGrade
  template: string
  task: string
}

const resolveSectionFilters = (
  sectionKey: string,
  rootTitle: string | undefined,
): SectionFilters | null => {
  const section = parseSectionScope(sectionKey)
  const template = templateKeyFromRootTitle(rootTitle)
  if (!section || !template) return null
  return {
    scope: section.scope,
    grade: gradeFromItemId(section.itemId),
    template,
    task: section.itemId,
  }
}

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

const suiteStatusToCase = (status: SuiteStatus): PlayCaseResult['status'] => {
  if (status === 'idle') return 'pending'
  if (status === 'passed') return 'pass'
  if (status === 'failed') return 'fail'
  return 'running'
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
  // Saved only to be reassigned back onto the same prototype below (monkey-patch
  // restore) — never invoked standalone, so the missing `this` binding is moot.
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalScrollIntoView = proto.scrollIntoView
  proto.scrollIntoView = function scrollIntoViewNoop() {
    /* pinned */
  }

  const focusProto = HTMLElement.prototype
  // eslint-disable-next-line @typescript-eslint/unbound-method
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
  const [playStatus, setPlayStatus] =
    useState<Record<PlayKind, PlayStatus>>(idlePlayStatus)
  const [playError, setPlayError] = useState<string | null>(null)
  const [suiteStatus, setSuiteStatus] = useState<
    Record<TestSuite, SuiteStatus>
  >({
    unit: 'idle',
    interactions: 'idle',
    e2e: 'idle',
    visual: 'idle',
  })
  const [suiteLog, setSuiteLog] = useState('')
  const [allRunning, setAllRunning] = useState(false)
  const [showChecklist, setShowChecklist] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [logsOpen, setLogsOpen] = useState(false)
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
      addons.getChannel().emit(EVENTS.STOP, { suite })
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

  const scrollTrainerIntoView = () => {
    const el = trainerRootRef.current
    if (!el) return
    el.scrollIntoView({ block: 'nearest', inline: 'nearest' })
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
        return false
      }

      if (!offscreen) {
        scrollTrainerIntoView()
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve())
        })
      }

      await withPinnedScroll(async () => {
        assertNotStopped()
        try {
          if (kind === 'correct') {
            await runPlayCorrectAnswerForTask(task)({ canvasElement: root })
          } else if (kind === 'wrong') {
            await runPlayWrongAnswerForTask(task)({ canvasElement: root })
          } else if (kind === 'hints') {
            await runPlayHintsForTask(task)({ canvasElement: root })
          } else if (kind === 'theory') {
            await runPlayTheoryInTrainer({ canvasElement: root })
          } else if (kind === 'show-answer') {
            await runPlayShowAnswerInTrainer({ canvasElement: root })
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

    const filters = resolveSectionFilters(sectionKey, rootTitle)
    if (!filters) {
      appendLog(
        `=== ${suite} ===\nCannot resolve template/scope from rootTitle=${rootTitle ?? ''} sectionKey=${sectionKey}\n`,
      )
      setSuiteStatus((prev) => ({ ...prev, [suite]: 'failed' }))
      return false
    }

    setShowChecklist(true)
    lastSuitePassedRef.current = false
    await new Promise<void>((resolve) => {
      if (!allRunningRef.current) clearLog()
      appendLog(
        `=== ${suite} ${filters.template} › ${filters.task} (${filters.scope}) ===\n`,
      )
      activeSuiteRef.current = suite
      suiteDoneResolverRef.current = resolve
      setSuiteStatus((prev) => ({ ...prev, [suite]: 'running' }))
      addons.getChannel().emit(EVENTS.RUN, {
        suite,
        scope: filters.scope,
        grade: filters.grade,
        template: filters.template,
        task: filters.task,
      })
    })
    return lastSuitePassedRef.current
  }

  const runVisual = async (updateSnapshots: boolean): Promise<boolean> => {
    assertNotStopped()
    if (activeSuiteRef.current) return false

    const filters = resolveSectionFilters(sectionKey, rootTitle)
    if (!filters) {
      appendLog(
        `=== visual ===\nCannot resolve template/scope from rootTitle=${rootTitle ?? ''} sectionKey=${sectionKey}\n`,
      )
      setSuiteStatus((prev) => ({ ...prev, visual: 'failed' }))
      return false
    }

    if (updateSnapshots) {
      const ok = window.confirm(
        `Перезаписать PNG-эталоны для ${filters.template} / ${filters.task} (${filters.scope})?`,
      )
      if (!ok) return false
    }

    setShowChecklist(true)
    lastSuitePassedRef.current = false
    await new Promise<void>((resolve) => {
      if (!allRunningRef.current) clearLog()
      appendLog(
        `=== visual${updateSnapshots ? ' (update snapshots)' : ''} ${filters.template} › ${filters.task} ===\n`,
      )
      activeSuiteRef.current = 'visual'
      suiteDoneResolverRef.current = resolve
      setSuiteStatus((prev) => ({ ...prev, visual: 'running' }))
      addons.getChannel().emit(EVENTS.RUN, {
        suite: 'visual',
        scope: filters.scope,
        grade: filters.grade,
        template: filters.template,
        task: filters.task,
        updateSnapshots: updateSnapshots || undefined,
      })
    })
    return lastSuitePassedRef.current
  }

  const runAll = async (instant: boolean) => {
    stopRequestedRef.current = false
    setShowChecklist(true)
    if (instant) {
      setDetailsOpen(true)
      setLogsOpen(true)
    }
    setPlayError(null)
    clearLog()
    setPlayStatus(idlePlayStatus())
    setSuiteStatus({
      unit: 'idle',
      interactions: 'idle',
      e2e: 'idle',
      visual: 'idle',
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
        setDetailsOpen(true)
        setLogsOpen(true)
      }

      for (const [suite] of SUITE_CASES) {
        assertNotStopped()
        const ok = await runSuite(suite)
        if (!ok) allPassed = false
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
  const pinControls = busy || scrollLocked

  const showSuiteResults =
    allRunning || Object.values(suiteStatus).some((s) => s !== 'idle')

  const checklistCases: PlayCaseResult[] = [
    ...PLAY_CASES.map(([id, label]) => ({
      id,
      label,
      status: playStatusToCase(playStatus[id]),
      error: playStatus[id] === 'fail' && playError ? playError : undefined,
    })),
    ...(showSuiteResults
      ? SUITE_CASES.map(([id, label]) => ({
          id,
          label,
          status: suiteStatusToCase(suiteStatus[id]),
        }))
      : []),
  ]

  const detailedLogLines = suiteLog
    .split('\n')
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.length > 0 &&
        (line.startsWith('✓') || line.startsWith('✘') || line.includes('›')),
    )

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
        <div
          style={{
            marginBottom: 20,
            ...(pinControls
              ? {
                  position: 'sticky',
                  top: 0,
                  zIndex: 30,
                  background: '#f9fafb',
                  paddingTop: 4,
                  paddingBottom: 8,
                  borderBottom: '1px solid #e5e7eb',
                }
              : null),
          }}
        >
          <Tip text={TIP.checklist} placement="right">
            <label
              style={{
                ...rowStyle,
                marginBottom: 0,
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
              <span style={{ fontWeight: 600 }}>Тесты пройдены</span>
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
          </Tip>

          <div style={{ ...rowStyle, marginBottom: 0, gap: 14, marginTop: 16 }}>
            <Tip text={TIP.run} placement="right">
              <button
                type="button"
                style={buttonStyle}
                disabled={busy}
                onClick={() => void runAll(false)}
              >
                Запустить
              </button>
            </Tip>
            <Tip text={TIP.runFast}>
              <button
                type="button"
                style={buttonStyle}
                disabled={busy}
                onClick={() => void runAll(true)}
              >
                Запустить быстро
              </button>
            </Tip>
            {busy ? (
              <Tip text={TIP.stop}>
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
              </Tip>
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
              <Tip text="Скролл страницы зафиксирован, пока play кликает по тренажёру">
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
                  role="status"
                  aria-live="polite"
                >
                  Скролл зафиксирован
                </span>
              </Tip>
            ) : null}
          </div>
        </div>

        {showChecklist ? (
          <Tip text={TIP.results}>
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  marginBottom: 12,
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  overflow: 'hidden',
                  position: 'relative',
                  width: '100%',
                }}
              >
                <PlayResultsPanel cases={checklistCases} header="Результаты" />
              </div>
              <div
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: '#fff',
                }}
              >
                <div
                  style={{
                    padding: '10px 12px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#111827',
                    borderBottom: '1px solid #e5e7eb',
                    background: '#f8fafc',
                  }}
                >
                  Детализация проверок (лог)
                </div>
                {detailedLogLines.length > 0 ? (
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: '8px 12px',
                      fontSize: 12,
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      lineHeight: 1.5,
                      color: '#111827',
                    }}
                  >
                    {detailedLogLines.map((line, index) => (
                      <li key={`details-log-${index}`}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <div
                    style={{
                      padding: '10px 12px',
                      fontSize: 12,
                      color: '#6b7280',
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    }}
                  >
                    Пока нет строк проверок в логе.
                  </div>
                )}
              </div>
            </div>
          </Tip>
        ) : null}

        <details
          style={{ marginBottom: 16 }}
          open={detailsOpen}
          onToggle={(e) => setDetailsOpen(e.currentTarget.open)}
        >
          <Tip text={TIP.details} placement="right">
            <summary
              style={{
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: '#6b7280',
                userSelect: 'none',
                padding: '8px 0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Подробнее
            </summary>
          </Tip>

          <div style={{ marginTop: 16, paddingTop: 8 }}>
            <div style={{ ...rowStyle, marginBottom: 10 }}>
              <Tip text={TIP.playSection} placement="right">
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#6b7280',
                  }}
                >
                  Play (эта задача)
                </span>
              </Tip>
            </div>
            <div style={{ ...rowStyle, marginBottom: 20 }}>
              {PLAY_CASES.map(([kind, label], index) => (
                <Tip
                  key={kind}
                  text={PLAY_CASE_TIPS[kind]}
                  placement={index === 0 ? 'right' : 'top'}
                >
                  <button
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
                </Tip>
              ))}
            </div>

            <div style={{ ...rowStyle, marginBottom: 10, marginTop: 8 }}>
              <Tip text={TIP.suitesSection} placement="right">
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#6b7280',
                  }}
                >
                  Suites (проект)
                </span>
              </Tip>
            </div>
            <div style={rowStyle}>
              {SUITE_CASES.map(([suite, label], index) => (
                <Tip
                  key={suite}
                  text={SUITE_CASE_TIPS[suite]}
                  placement={index === 0 ? 'right' : 'top'}
                >
                  <button
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
                </Tip>
              ))}
              <Tip text={TIP.visual}>
                <button
                  type="button"
                  style={buttonStyle}
                  disabled={busy}
                  onClick={() => void runVisual(false)}
                >
                  Visual
                  <span
                    style={{
                      marginLeft: 8,
                      color: SUITE_STATUS_COLOR[suiteStatus.visual],
                      fontWeight: 700,
                    }}
                  >
                    {suiteStatus.visual}
                  </span>
                </button>
              </Tip>
              <Tip text={TIP.updateSnapshots}>
                <button
                  type="button"
                  style={buttonStyle}
                  disabled={busy}
                  onClick={() => void runVisual(true)}
                >
                  Обновить скриншоты
                </button>
              </Tip>
            </div>
          </div>
        </details>

        {logsOpen || suiteLog ? (
          <details
            style={{ marginBottom: 8 }}
            open={logsOpen}
            onToggle={(e) => setLogsOpen(e.currentTarget.open)}
          >
            <Tip text={TIP.logs} placement="right">
              <summary
                style={{
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#6b7280',
                  userSelect: 'none',
                  padding: '8px 0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Логи
              </summary>
            </Tip>
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
              {suiteLog || '—'}
            </pre>
          </details>
        ) : null}

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
              forceCalcOpen
            />
          </div>
        )}
      </div>
    </details>
  )
}
