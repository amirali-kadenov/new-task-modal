import { type PlayCaseResult } from './play-results'
import styles from './play-results-panel.module.scss'

type Props = {
  cases: PlayCaseResult[]
  header?: string
}

export const PlayResultsPanel = ({ cases, header = 'Results' }: Props) => {
  if (cases.length === 0) return null

  return (
    <div className={styles.results} aria-label="Test results">
      <div className={styles.resultsHeader}>{header}</div>
      <ul className={styles.resultsList}>
        {cases.map((item) => {
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
                  role="checkbox"
                  checked={checked}
                  aria-checked={checked}
                  aria-disabled
                  tabIndex={-1}
                  data-testid={`play-result-${item.id}`}
                  data-status={item.status}
                  readOnly
                />
                <span className={styles.resultLabel}>
                  <span className={styles.resultTitle}>
                    {item.label}
                    {isRunning ? ' — running' : null}
                  </span>
                  {item.descriptionRu ? (
                    <span className={styles.resultDesc}>{item.descriptionRu}</span>
                  ) : null}
                  {failed && item.error ? (
                    <span className={styles.resultError}>{item.error}</span>
                  ) : null}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
