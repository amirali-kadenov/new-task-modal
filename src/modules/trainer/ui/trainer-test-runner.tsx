import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  casesForSuite,
  initialCaseResults,
  runTrainerSuite,
  TRAINER_SUITE_OPTIONS,
  type TrainerCaseResult,
  type TrainerSuiteId,
} from '../lib/run-trainer-suites'
import { getTrainerVariant, TRAINER_VARIANTS } from '../lib/trainer-variants'

import type { TrainerPlaygroundArgs } from './trainer-playground'
import styles from './trainer-test-runner.module.scss'

type Props = TrainerPlaygroundArgs

export const TrainerTestRunner = ({
  variantKey: variantKeyArg,
  group: groupArg,
}: Props) => {
  const [variantKey, setVariantKey] = useState(variantKeyArg)
  const [group, setGroup] = useState(groupArg)
  const [suite, setSuite] = useState<TrainerSuiteId>('trainer')
  const [results, setResults] = useState<TrainerCaseResult[]>(() =>
    initialCaseResults('trainer'),
  )
  const [running, setRunning] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVariantKey(variantKeyArg)
  }, [variantKeyArg])

  useEffect(() => {
    setGroup(groupArg)
  }, [groupArg])

  const variant = useMemo(() => getTrainerVariant(variantKey), [variantKey])

  useEffect(() => {
    if (!variant.groupIds.includes(group)) {
      setGroup(variant.defaultGroup)
    }
  }, [variant, group])

  const resolvedGroup = variant.groupIds.includes(group)
    ? group
    : variant.defaultGroup

  const onVariantChange = (nextKey: string) => {
    const next = getTrainerVariant(nextKey)
    setVariantKey(next.key)
    setGroup(next.defaultGroup)
  }

  const onSuiteChange = (next: TrainerSuiteId) => {
    setSuite(next)
    if (!running) {
      setResults(initialCaseResults(next))
    }
  }

  const runSuite = useCallback(
    async (suiteId: TrainerSuiteId) => {
      const canvasElement = stageRef.current
      if (!canvasElement || running) return

      setSuite(suiteId)
      setResults(initialCaseResults(suiteId))
      setRunning(true)

      try {
        await runTrainerSuite(suiteId, {
          canvasElement,
          args: { variantKey, group: resolvedGroup },
          onCaseUpdate: (updated) => {
            setResults((prev) =>
              prev.map((item) => (item.id === updated.id ? updated : item)),
            )
          },
        })
      } finally {
        setRunning(false)
      }
    },
    [running, variantKey, resolvedGroup],
  )

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <label className={styles.field}>
          <span className={styles.label}>Шаблон</span>
          <select
            data-testid="trainer-test-template-select"
            value={variant.key}
            disabled={running}
            onChange={(e) => onVariantChange(e.target.value)}
          >
            {TRAINER_VARIANTS.map((v) => (
              <option key={v.key} value={v.key}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Группа</span>
          <select
            data-testid="trainer-test-group-select"
            value={resolvedGroup}
            disabled={running}
            onChange={(e) => setGroup(e.target.value)}
          >
            {variant.groupIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Набор</span>
          <select
            data-testid="trainer-test-suite-select"
            value={suite}
            disabled={running}
            onChange={(e) => onSuiteChange(e.target.value as TrainerSuiteId)}
          >
            {TRAINER_SUITE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryButton}
          data-testid="trainer-run-trainer-tests"
          disabled={running}
          onClick={() => void runSuite('trainer')}
        >
          Запустить тесты тренажёра
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          data-testid="trainer-run-canvas-chat-tests"
          disabled={running}
          onClick={() => void runSuite('canvasChat')}
        >
          Запустить доску и чат
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          data-testid="trainer-run-selected-tests"
          disabled={running}
          onClick={() => void runSuite(suite)}
        >
          Запустить выбранное
        </button>
        {running ? (
          <span className={styles.runningHint}>Выполняется…</span>
        ) : null}
      </div>

      <div className={styles.results} aria-label="Результаты тестов">
        <div className={styles.resultsHeader}>Результаты</div>
        <ul className={styles.resultsList}>
          {results.map((item) => {
            const checked = item.status === 'pass'
            const failed = item.status === 'fail'
            const isRunning = item.status === 'running'
            return (
              <li key={item.id} className={styles.resultItem}>
                <label
                  className={
                    failed
                      ? styles.resultFail
                      : checked
                        ? styles.resultPass
                        : styles.resultPending
                  }
                >
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    checked={checked}
                    aria-checked={checked}
                    aria-disabled
                    tabIndex={-1}
                    data-testid={`trainer-result-${item.id}`}
                    data-status={item.status}
                    readOnly
                  />
                  <span className={styles.resultLabel}>
                    {item.label}
                    {isRunning ? ' — выполняется' : null}
                    {failed && item.error ? ` — ${item.error}` : null}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
        <p className={styles.hint}>
          Кейсы в наборе «{suite}»: {casesForSuite(suite).join(', ')}. Ниже —
          idle-тренажёр для сценариев.
        </p>
      </div>

      <div
        className={styles.stage}
        ref={stageRef}
        data-testid="trainer-test-stage"
        key={`${variant.key}:${resolvedGroup}:test-stage`}
      >
        {variant.render(resolvedGroup, 'idle')}
      </div>
    </div>
  )
}
