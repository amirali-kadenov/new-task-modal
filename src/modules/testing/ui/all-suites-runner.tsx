import { useCallback, useState } from 'react'

import { PlayResultsPanel } from '@/testing/play-results-panel'

import {
  isAnySuiteBusy,
  isHubBusy,
  startHubRun,
  stopHubRun,
  useTestRunStore,
  type HubSuiteStatus,
} from '../lib/test-run-store'
import {
  GRADES,
  SCOPE_HINTS,
  SCOPE_LABELS,
  SUITE_LABELS,
  type TestGrade,
  type TestScope,
  type TestSuite,
} from '../lib/test-runner-events'

import { useTemplateOptions, useTaskOptions } from './test-suite-runner'
import styles from './test-suite-runner.module.scss'

const SUITES: TestSuite[] = ['unit', 'interactions', 'e2e']

const SUITE_CHECK_LABELS: Record<TestSuite, string> = {
  unit: 'Данные и логика (unit)',
  interactions: 'В окне задачи (integration)',
  e2e: 'В живом приложении (e2e)',
}

const SUITE_HINTS: Record<TestSuite, string> = {
  unit: 'без браузера: fixtures, classify, логика задания',
  interactions: 'сценарии в Storybook',
  e2e: 'настоящее приложение (порт 8888)',
}

/** Plan order: layouts → grade tasks → all. */
const SCOPE_ORDER: TestScope[] = ['allGroups', 'allTasks', 'all']

const STATUS_COLOR: Record<HubSuiteStatus, string> = {
  idle: '#6b7280',
  pending: '#9ca3af',
  running: '#2563eb',
  passed: '#16a34a',
  failed: '#dc2626',
  skipped: '#9ca3af',
}

const STATUS_LABEL: Record<HubSuiteStatus, string> = {
  idle: 'ожидание',
  pending: 'в очереди',
  running: 'идёт…',
  passed: 'успех',
  failed: 'падение',
  skipped: 'пропуск',
}

export const AllSuitesRunner = () => {
  const hub = useTestRunStore(useCallback((s) => s.hub, []))
  const anyBusy = useTestRunStore(useCallback((s) => isAnySuiteBusy(s), []))

  const [selected, setSelected] = useState<Record<TestSuite, boolean>>({
    unit: true,
    interactions: true,
    e2e: true,
  })
  const [scope, setScope] = useState<TestScope>('allTasks')
  const [grade, setGrade] = useState<TestGrade>(4)
  const [template, setTemplate] = useState('')
  const [task, setTask] = useState('')
  const [headed, setHeaded] = useState(false)
  const [e2eFast, setE2eFast] = useState(true)
  const templates = useTemplateOptions()
  const tasks = useTaskOptions(template, grade)

  const running = hub.running
  const suiteStatus = hub.suiteStatus
  const log = hub.log
  const cases = hub.cases
  const busy = running || anyBusy

  const anySelected = SUITES.some((s) => selected[s])
  const e2eSelected = selected.e2e
  const activeSuite = hub.active
  const casesHeader = activeSuite
    ? `Проверки — ${SUITE_LABELS[activeSuite]}`
    : 'Проверки'

  const onRun = () => {
    if (isHubBusy() || isAnySuiteBusy()) return
    startHubRun({
      selected,
      scope,
      grade,
      template,
      task,
      headed,
      e2eFast,
    })
  }

  const onStop = () => {
    stopHubRun()
  }

  const toggleSuite = (suite: TestSuite) => {
    setSelected((prev) => ({ ...prev, [suite]: !prev[suite] }))
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Запуск</h1>
          <div className={styles.purpose}>
            <h2 className={styles.purposeTitle}>Назначение</h2>
            <p className={styles.purposeBody}>
              Выберите, что проверяем, какие задания и шаблон — затем запустите.
              Отмеченные наборы идут по очереди с общими фильтрами.
            </p>
          </div>
        </div>

        <div className={styles.hubForm}>
          <div className={styles.hubRow}>
            <div className={styles.hubLabel}>Что проверяем</div>
            <div className={styles.hubControl}>
              <div className={styles.suiteChips} role="group">
                {SUITES.map((suite) => (
                  <label
                    key={suite}
                    className={
                      selected[suite]
                        ? `${styles.suiteChip} ${styles.suiteChipOn}`
                        : styles.suiteChip
                    }
                  >
                    <input
                      type="checkbox"
                      checked={selected[suite]}
                      disabled={busy}
                      onChange={() => toggleSuite(suite)}
                    />
                    {SUITE_CHECK_LABELS[suite]}
                  </label>
                ))}
              </div>
              <ul className={styles.suiteHints}>
                {SUITES.map((suite) => (
                  <li key={suite}>
                    <span className={styles.suiteHintName}>
                      {SUITE_CHECK_LABELS[suite]}
                    </span>
                    {' — '}
                    {SUITE_HINTS[suite]}
                  </li>
                ))}
              </ul>
              <p className={styles.hubNote}>
                Можно несколько — «Запустить» идёт по очереди
              </p>
            </div>
          </div>

          <div className={styles.hubRow}>
            <div className={styles.hubLabel}>Какие задания</div>
            <div className={styles.hubControl}>
              <div className={styles.scopeList} role="radiogroup">
                {SCOPE_ORDER.map((key) => (
                  <label key={key} className={styles.scopeOption}>
                    <input
                      type="radio"
                      name="hub-scope"
                      checked={scope === key}
                      disabled={busy}
                      onChange={() => setScope(key)}
                    />
                    <span className={styles.scopeText}>
                      {SCOPE_LABELS[key]}
                    </span>
                    {key === 'allTasks' && (
                      <span className={styles.gradeInline}>
                        <span className={styles.gradeInlineLabel}>Класс</span>
                        <select
                          className={styles.selectCompact}
                          value={String(grade)}
                          disabled={busy || scope !== 'allTasks'}
                          aria-label="Класс"
                          onChange={(e) => {
                            const v = e.target.value
                            setGrade(v === 'all' ? 'all' : Number(v))
                            setScope('allTasks')
                            setTask('')
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="all">все</option>
                          {GRADES.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </span>
                    )}
                  </label>
                ))}
              </div>
              <p className={styles.hubNote}>{SCOPE_HINTS[scope]}</p>
            </div>
          </div>

          <div className={styles.hubRow}>
            <div className={styles.hubLabel} id="hub-template-label">
              Шаблон
            </div>
            <div className={styles.hubControl}>
              <select
                className={styles.selectWide}
                value={template}
                disabled={busy}
                aria-labelledby="hub-template-label"
                onChange={(e) => {
                  setTemplate(e.target.value)
                  setTask('')
                }}
              >
                <option value="">все</option>
                {templates.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
              <p className={styles.hubNote}>
                Какой вариант шаблона проверять (пусто = все), например
                text/ui/plain
              </p>
            </div>
          </div>

          <div className={styles.hubRow}>
            <div className={styles.hubLabel} id="hub-task-label">
              Задача
            </div>
            <div className={styles.hubControl}>
              <select
                className={styles.selectWide}
                value={task}
                disabled={busy || !template}
                aria-labelledby="hub-task-label"
                onChange={(e) => setTask(e.target.value)}
              >
                <option value="">все</option>
                {tasks.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              <p className={styles.hubNote}>
                {template
                  ? 'taskId внутри выбранному шаблону (пусто = все задачи шаблона), например 4_1_1'
                  : 'Сначала выберите шаблон — тогда появится список задач'}
              </p>
            </div>
          </div>

          {e2eSelected && (
            <div className={styles.hubRow}>
              <div className={styles.hubLabel}>Браузер</div>
              <div className={styles.hubControl}>
                <label className={styles.hubCheck}>
                  <input
                    type="checkbox"
                    checked={headed}
                    disabled={busy}
                    onChange={(e) => setHeaded(e.target.checked)}
                  />
                  Показать окно браузера
                </label>
                <label className={styles.hubCheck}>
                  <input
                    type="checkbox"
                    checked={e2eFast}
                    disabled={busy}
                    onChange={(e) => setE2eFast(e.target.checked)}
                  />
                  Быстрый прогон
                </label>
                <p className={styles.hubNote}>
                  Быстрый — без video/trace; сними для артефактов на падениях
                </p>
              </div>
            </div>
          )}

          <div className={styles.hubActions}>
            {running ? (
              <button type="button" className={styles.stop} onClick={onStop}>
                Остановить
              </button>
            ) : (
              <button
                type="button"
                className={styles.run}
                disabled={busy || !anySelected}
                onClick={onRun}
              >
                Запустить
              </button>
            )}
          </div>
        </div>
      </header>

      <section className={styles.artifacts}>
        <h2 className={styles.sectionTitle}>Наборы</h2>
        <ul className={styles.statusList}>
          {SUITES.map((suite) => (
            <li key={suite} className={styles.statusItem}>
              <span className={styles.statusName}>{SUITE_LABELS[suite]}</span>
              <span
                className={styles.statusValue}
                style={{ color: STATUS_COLOR[suiteStatus[suite]] }}
              >
                {STATUS_LABEL[suiteStatus[suite]]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {cases.length > 0 && (
        <div className={styles.resultsWrap}>
          <PlayResultsPanel cases={cases} header={casesHeader} />
        </div>
      )}

      <details className={styles.logDetails} open={running || Boolean(log)}>
        <summary>Общий лог</summary>
        <pre className={styles.log}>{log || '—'}</pre>
      </details>
    </div>
  )
}
