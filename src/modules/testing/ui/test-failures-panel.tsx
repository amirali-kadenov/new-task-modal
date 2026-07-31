import { useEffect, useState } from 'react'
import { addons } from 'storybook/preview-api'

import {
  EVENTS,
  SCOPE_LABELS,
  SUITE_LABELS,
  type HistoryListResultPayload,
  type HistoryReadResultPayload,
  type HistoryRunRecord,
} from '../lib/test-runner-events'

import failStyles from './test-failures-panel.module.scss'
import styles from './test-suite-runner.module.scss'

const formatTime = (ts: number): string => {
  if (!ts) return '—'
  try {
    return new Date(ts).toLocaleString('ru-RU')
  } catch {
    return String(ts)
  }
}

export const TestFailuresPanel = () => {
  const [runs, setRuns] = useState<HistoryRunRecord[]>([])
  const [selected, setSelected] = useState<HistoryRunRecord | null>(null)
  const [log, setLog] = useState('')
  const [loading, setLoading] = useState(false)

  const refresh = () => {
    setLoading(true)
    addons.getChannel().emit(EVENTS.HISTORY_LIST)
  }

  useEffect(() => {
    const channel = addons.getChannel()

    const onList = (payload: HistoryListResultPayload) => {
      const failed = (payload.runs ?? []).filter((r) => r.exitCode !== 0)
      setRuns(failed)
      setLoading(false)
      if (selected) {
        const still = failed.find((r) => r.id === selected.id)
        if (!still) setSelected(null)
      }
    }

    const onRead = (payload: HistoryReadResultPayload) => {
      setLog(payload.log || payload.error || '—')
    }

    channel.on(EVENTS.HISTORY_LIST_RESULT, onList)
    channel.on(EVENTS.HISTORY_READ_RESULT, onRead)
    channel.emit(EVENTS.HISTORY_LIST)

    return () => {
      channel.off(EVENTS.HISTORY_LIST_RESULT, onList)
      channel.off(EVENTS.HISTORY_READ_RESULT, onRead)
    }
    // intentionally once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openRun = (run: HistoryRunRecord) => {
    setSelected(run)
    setLog('Загрузка…')
    addons.getChannel().emit(EVENTS.HISTORY_READ, {
      persistDir: run.persistDir,
    })
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Падения</h1>
          <div className={styles.purpose}>
            <h2 className={styles.purposeTitle}>Назначение</h2>
            <p className={styles.purposeBody}>
              История неудачных прогонов: что запускали, когда упало, и полный
              лог. Файлы сохраняются на диск рядом с проектом.
            </p>
          </div>
        </div>
        <div className={styles.toolbar}>
          <div className={styles.runGroup}>
            <button
              type="button"
              className={styles.run}
              disabled={loading}
              onClick={refresh}
            >
              {loading ? 'Обновляю…' : 'Обновить'}
            </button>
          </div>
        </div>
      </header>

      {runs.length === 0 ? (
        <div className={styles.hint}>
          Пока нет сохранённых падений. Запустите набор и дождитесь ошибки —
          запись появится здесь.
        </div>
      ) : (
        <div className={failStyles.layout}>
          <ul className={failStyles.list}>
            {runs.map((run) => (
              <li key={run.id}>
                <button
                  type="button"
                  className={
                    selected?.id === run.id
                      ? failStyles.itemActive
                      : failStyles.item
                  }
                  onClick={() => openRun(run)}
                >
                  <span className={failStyles.itemTitle}>
                    {SUITE_LABELS[run.suite]}
                  </span>
                  <span className={failStyles.itemMeta}>
                    {formatTime(run.finishedAt)}
                    {' · '}
                    {SCOPE_LABELS[run.scope]}
                    {' · класс '}
                    {run.grade}
                    {run.template ? ` · ${run.template}` : ''}
                  </span>
                  {run.failedCaseLabels && run.failedCaseLabels.length > 0 && (
                    <span className={failStyles.itemFail}>
                      {run.failedCaseLabels.slice(0, 3).join('; ')}
                      {run.failedCaseLabels.length > 3 ? '…' : ''}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className={failStyles.detail}>
            {selected ? (
              <>
                <div className={styles.persist}>
                  Файлы: <code>{selected.persistDir}</code>
                  {' · '}
                  <a
                    href={`/${selected.persistDir}/log.txt`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    лог
                  </a>
                  {' · '}
                  <a
                    href={`/${selected.persistDir}/`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    папка
                  </a>
                </div>
                <pre className={styles.log}>{log || '—'}</pre>
              </>
            ) : (
              <p className={failStyles.placeholder}>
                Выберите прогон слева, чтобы увидеть лог.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
