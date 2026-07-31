import { useCallback, useEffect, useMemo, useState } from 'react'

import type { PlayCaseResult } from '@/testing/play-results'
import { PlayResultsPanel } from '@/testing/play-results-panel'

import { TEMPLATE_VARIANT_KEYS, getTaskIdsForTemplate } from '../lib/template-options'
import {
  isAnySuiteBusy,
  isHubBusy,
  isSuiteBusy,
  startSuiteRun,
  stopSuiteRun,
  useTestRunStore,
} from '../lib/test-run-store'
import {
  GRADES,
  SCOPE_LABELS,
  type TestGrade,
  type TestScope,
  type TestSuite,
} from '../lib/test-runner-events'

import styles from './test-suite-runner.module.scss'

type Status = 'idle' | 'running' | 'passed' | 'failed'

const STATUS_COLOR: Record<Status, string> = {
  idle: '#6b7280',
  running: '#2563eb',
  passed: '#16a34a',
  failed: '#dc2626',
}

const STATUS_LABEL: Record<Status, string> = {
  idle: 'ожидание',
  running: 'идёт…',
  passed: 'успех',
  failed: 'падение',
}

type Props = {
  suite: TestSuite
  label: string
  /** Short “what this suite covers” line (legacy). */
  description?: string
  /** Block «Назначение» — preferred over description alone. */
  purpose?: string
  /** Shown when probe fails (e.g. e2e host down). */
  hintWhenUnreachable?: string
  /** Optional URL to probe before enabling Run (e.g. http://localhost:8888/). */
  probeUrl?: string
}

export const useTemplateOptions = (): string[] => TEMPLATE_VARIANT_KEYS

export const useTaskOptions = (
  template: string,
  grade: TestGrade = 'all',
): string[] =>
  useMemo(() => {
    const ids = getTaskIdsForTemplate(template)
    if (grade === 'all') return ids
    const prefix = `${grade}_`
    return ids.filter((id) => id.startsWith(prefix))
  }, [template, grade])

export const TestSuiteRunner = ({
  suite,
  label,
  description,
  purpose,
  hintWhenUnreachable,
  probeUrl,
}: Props) => {
  const slice = useTestRunStore(
    useCallback((s) => s.suites[suite], [suite]),
  )
  const runBlocked = useTestRunStore(
    useCallback((s) => isSuiteBusy(suite, s) || isHubBusy(s) || isAnySuiteBusy(s), [suite]),
  )
  const canStop = slice.status === 'running'

  const [headed, setHeaded] = useState(false)
  const [e2eFast, setE2eFast] = useState(true)
  const [scope, setScope] = useState<TestScope>('allTasks')
  const [grade, setGrade] = useState<TestGrade>(4)
  const [template, setTemplate] = useState('')
  const [task, setTask] = useState('')
  const templates = useTemplateOptions()
  const tasks = useTaskOptions(template, grade)
  const [reachable, setReachable] = useState<boolean | null>(
    probeUrl ? null : true,
  )

  const showE2eExtras = suite === 'e2e'
  const status = slice.status
  const log = slice.log
  const cases = slice.cases
  const artifacts = slice.artifacts
  const persistDir = slice.persistDir

  useEffect(() => {
    if (!probeUrl) return
    let cancelled = false
    fetch(probeUrl, { mode: 'no-cors' })
      .then(() => {
        if (!cancelled) setReachable(true)
      })
      .catch(() => {
        if (!cancelled) setReachable(false)
      })
    return () => {
      cancelled = true
    }
  }, [probeUrl])

  const summary = useMemo(() => {
    if (cases.length === 0) return null
    const passed = cases.filter((c: PlayCaseResult) => c.status === 'pass').length
    const failed = cases.filter((c: PlayCaseResult) => c.status === 'fail').length
    const running = cases.filter((c: PlayCaseResult) => c.status === 'running').length
    const pending = cases.filter((c: PlayCaseResult) => c.status === 'pending').length
    return { passed, failed, running, pending, total: cases.length }
  }, [cases])

  const onRun = () => {
    if (runBlocked || isHubBusy() || isAnySuiteBusy()) return
    startSuiteRun({
      suite,
      scope,
      grade,
      template,
      task,
      headed: showE2eExtras ? headed : undefined,
      e2eFast: showE2eExtras ? e2eFast : undefined,
    })
  }

  const onStop = () => {
    stopSuiteRun(suite)
  }

  const runDisabled = runBlocked || reachable === false
  const formLocked = runBlocked
  const purposeText = purpose ?? description

  const images = artifacts.filter((a) => a.kind === 'image')
  const videos = artifacts.filter((a) => a.kind === 'video')
  const files = artifacts.filter((a) => a.kind === 'file')

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.intro}>
          <h1 className={styles.title}>{label}</h1>
          {purposeText && (
            <div className={styles.purpose}>
              <h2 className={styles.purposeTitle}>Назначение</h2>
              <p className={styles.purposeBody}>{purposeText}</p>
            </div>
          )}
        </div>

        <div className={styles.toolbar}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Охват</span>
            <select
              className={styles.select}
              value={scope}
              disabled={formLocked}
              onChange={(e) => setScope(e.target.value as TestScope)}
            >
              {(Object.keys(SCOPE_LABELS) as TestScope[]).map((key) => (
                <option key={key} value={key}>
                  {SCOPE_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Класс</span>
            <select
              className={styles.select}
              value={String(grade)}
              disabled={formLocked || scope === 'all'}
              onChange={(e) => {
                const v = e.target.value
                setGrade(v === 'all' ? 'all' : Number(v))
                setTask('')
              }}
            >
              <option value="all">все</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Шаблон</span>
            <select
              className={styles.selectWide}
              value={template}
              disabled={formLocked}
              title="Какой вариант шаблона проверять (пусто = все)"
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
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Задача</span>
            <select
              className={styles.selectWide}
              value={task}
              disabled={formLocked || !template}
              title={
                template
                  ? 'taskId внутри шаблона (пусто = все задачи шаблона)'
                  : 'Сначала выберите шаблон'
              }
              onChange={(e) => setTask(e.target.value)}
            >
              <option value="">все</option>
              {tasks.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </label>
          {showE2eExtras && (
            <>
              <label className={styles.toggle}>
                <span className={styles.fieldLabel}>Браузер</span>
                <span className={styles.toggleControl}>
                  <input
                    type="checkbox"
                    checked={headed}
                    disabled={formLocked}
                    onChange={(e) => setHeaded(e.target.checked)}
                  />
                  Показать окно браузера
                </span>
              </label>
              <label className={styles.toggle}>
                <span className={styles.fieldLabel}>Скорость</span>
                <span className={styles.toggleControl}>
                  <input
                    type="checkbox"
                    checked={e2eFast}
                    disabled={formLocked}
                    onChange={(e) => setE2eFast(e.target.checked)}
                  />
                  Быстрый прогон
                </span>
              </label>
            </>
          )}
          <div className={styles.runGroup}>
            <span
              className={styles.status}
              style={{ color: STATUS_COLOR[status] }}
              aria-live="polite"
            >
              {STATUS_LABEL[status]}
            </span>
            {canStop ? (
              <button type="button" className={styles.stop} onClick={onStop}>
                Остановить
              </button>
            ) : (
              <button
                type="button"
                className={styles.run}
                disabled={runDisabled}
                onClick={onRun}
              >
                Запустить
              </button>
            )}
          </div>
        </div>
      </header>

      {reachable === false && hintWhenUnreachable && (
        <div className={styles.hint}>{hintWhenUnreachable}</div>
      )}

      {showE2eExtras && headed && (
        <div className={styles.hint}>
          Откроется отдельное окно браузера на вашем экране — так можно глазами
          увидеть, где сценарий ломается. В этой странице останутся чеклист,
          снимки экрана и запись после прогона.
        </div>
      )}

      {persistDir && (
        <div className={styles.persist}>
          Файлы прогона: <code>{persistDir}</code>
          {' · '}
          <a href={`/${persistDir}/log.txt`} target="_blank" rel="noreferrer">
            лог
          </a>
        </div>
      )}

      {summary && (
        <p className={styles.summary}>
          {summary.passed} успешно / {summary.failed} упало
          {summary.running > 0 ? ` / ${summary.running} сейчас` : ''}
          {summary.pending > 0 ? ` / ${summary.pending} ждут` : ''}
          <span className={styles.summaryTotal}> · всего {summary.total}</span>
        </p>
      )}

      {cases.length > 0 && (
        <div className={styles.resultsWrap}>
          <PlayResultsPanel cases={cases} header="Проверки" />
        </div>
      )}

      {images.length > 0 && (
        <section className={styles.artifacts}>
          <h2 className={styles.sectionTitle}>Снимки экрана</h2>
          <div className={styles.artifactGrid}>
            {images.map((a) => (
              <figure key={a.name} className={styles.artifact}>
                <img src={a.dataUrl ?? a.publicUrl} alt={a.name} />
                <figcaption>{a.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {videos.length > 0 && (
        <section className={styles.artifacts}>
          <h2 className={styles.sectionTitle}>Запись экрана</h2>
          <div className={styles.artifactGrid}>
            {videos.map((a) => (
              <figure key={a.name} className={styles.artifact}>
                <video
                  className={styles.video}
                  controls
                  src={a.dataUrl ?? a.publicUrl}
                >
                  <track kind="captions" />
                </video>
                <figcaption>
                  {a.name}
                  {a.publicUrl ? (
                    <>
                      {' · '}
                      <a href={a.publicUrl} target="_blank" rel="noreferrer">
                        файл
                      </a>
                    </>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {files.length > 0 && (
        <section className={styles.artifacts}>
          <h2 className={styles.sectionTitle}>Дополнительные файлы</h2>
          <ul className={styles.fileList}>
            {files.map((a) => (
              <li key={a.name}>
                {a.publicUrl ? (
                  <a href={a.publicUrl} download={a.name}>
                    {a.name}
                  </a>
                ) : (
                  a.name
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <details className={styles.logDetails} open={status === 'failed' || status === 'running'}>
        <summary>Полный лог{status === 'failed' ? ' (падение)' : ''}</summary>
        <pre className={styles.log}>{log || '—'}</pre>
      </details>
    </div>
  )
}
