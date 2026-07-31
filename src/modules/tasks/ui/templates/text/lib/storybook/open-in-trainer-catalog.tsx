import { useCallback, useEffect, useMemo, useState } from 'react'

import type {
  TemplateGroupFixture,
  TemplateGroupTaskRef,
} from './render-template-groups'
import {
  clearTrainerChecklistProgress,
  readTrainerChecklistProgress,
  setTrainerChecklistTasks,
  slugFromRootTitle,
} from './trainer-checklist-storage'
import {
  buildTrainerLaunchUrls,
  type TrainerLaunch,
} from './trainer-launch-links'

import styles from './open-in-trainer-catalog.module.scss'

export type CatalogTaskRow = {
  id: string
  group: string
  launch?: TrainerLaunch
}

type Props = {
  groups: TemplateGroupFixture[]
  rootTitle?: string
  selectedGroup: string
  selectedTaskId?: string
  onSelectTask: (group: string, taskId: string) => void
  onSelectGroup: (group: string) => void
}

const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}

const downloadText = (filename: string, text: string) => {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Local copy of getGroupTaskRefs — avoid circular import with stories helpers. */
const taskRefsForGroup = (
  fixture: TemplateGroupFixture | undefined,
): TemplateGroupTaskRef[] => {
  if (!fixture) return []
  const raw = fixture.tasks?.length
    ? fixture.tasks
    : (() => {
        const elixirType = fixture.task?.type
        if (!elixirType || !fixture.launch) return []
        const prefix = 'Elixir.Task_'
        const id = elixirType.startsWith(prefix)
          ? elixirType.slice(prefix.length)
          : elixirType.replace(/^Elixir\./, '')
        return id ? [{ id, launch: fixture.launch }] : []
      })()

  const seen = new Set<string>()
  const unique: TemplateGroupTaskRef[] = []
  for (const ref of raw) {
    if (!ref.id || seen.has(ref.id)) continue
    seen.add(ref.id)
    unique.push(ref)
  }
  return unique
}

const buildTaskRows = (groups: TemplateGroupFixture[]): CatalogTaskRow[] => {
  const seen = new Set<string>()
  const rows: CatalogTaskRow[] = []
  for (const g of groups) {
    for (const ref of taskRefsForGroup(g)) {
      if (!ref.id || seen.has(ref.id)) continue
      seen.add(ref.id)
      rows.push({ id: ref.id, group: g.group, launch: ref.launch })
    }
  }
  return rows
}

const tasksMarkdown = (
  rows: CatalogTaskRow[],
  checked: Set<string>,
): string =>
  rows
    .map((r) => `- [${checked.has(r.id) ? 'x' : ' '}] ${r.id} (${r.group})`)
    .join('\n')

type ChecklistToolbarProps = {
  onSelectAll: () => void
  onClearChecks: () => void
  onCopy: () => void
  onDownload: () => void
  status: string
  disabled?: boolean
}

const ChecklistToolbar = ({
  onSelectAll,
  onClearChecks,
  onCopy,
  onDownload,
  status,
  disabled,
}: ChecklistToolbarProps) => (
  <div className={styles.toolbar}>
    <button
      type="button"
      className={styles.toolButton}
      onClick={onSelectAll}
      disabled={disabled}
    >
      Отметить все
    </button>
    <button
      type="button"
      className={styles.toolButton}
      onClick={onClearChecks}
      disabled={disabled}
    >
      Снять все
    </button>
    <button
      type="button"
      className={styles.toolButton}
      onClick={onCopy}
      disabled={disabled}
    >
      Скопировать
    </button>
    <button
      type="button"
      className={styles.toolButton}
      onClick={onDownload}
      disabled={disabled}
    >
      Скачать .md
    </button>
    {status ? <span className={styles.status}>{status}</span> : null}
  </div>
)

const LaunchCell = ({ launch }: { launch?: TrainerLaunch }) => {
  if (!launch?.chapterId || !launch?.lessonId || launch.taskIndex == null) {
    return <span className={styles.emptyDash}>—</span>
  }
  const { launchUrl, launchOldUrl } = buildTrainerLaunchUrls(launch)
  return (
    <>
      <td className={styles.launchCell} onClick={(e) => e.stopPropagation()}>
        <a
          className={styles.launchLink}
          href={launchUrl}
          target="_blank"
          rel="noreferrer"
        >
          Новый
        </a>
      </td>
      <td className={styles.launchCell} onClick={(e) => e.stopPropagation()}>
        <a
          className={styles.launchLink}
          href={launchOldUrl}
          target="_blank"
          rel="noreferrer"
        >
          Старый
        </a>
      </td>
    </>
  )
}

/** Catalog table for Checklist: tasks + launch links, progress in localStorage. */
export const OpenInTrainerCatalog = ({
  groups,
  rootTitle,
  selectedGroup,
  selectedTaskId,
  onSelectTask,
}: Props) => {
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(() => {
    const p = readTrainerChecklistProgress(rootTitle)
    return new Set(p.tasks)
  })
  const [progressStatus, setProgressStatus] = useState('')
  const [tasksStatus, setTasksStatus] = useState('')

  const taskRows = useMemo(() => buildTaskRows(groups), [groups])
  const slug = slugFromRootTitle(rootTitle)

  const persist = useCallback(
    (tasks: Set<string>) => {
      setTrainerChecklistTasks(rootTitle, [...tasks])
    },
    [rootTitle],
  )

  useEffect(() => {
    const p = readTrainerChecklistProgress(rootTitle)
    setCheckedTasks(new Set(p.tasks))
  }, [rootTitle])

  const toggleTaskCheck = (id: string) => {
    setCheckedTasks((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      persist(next)
      return next
    })
  }

  const flash = (setStatus: (s: string) => void, message: string) => {
    setStatus(message)
    window.setTimeout(() => setStatus(''), 2000)
  }

  const saveProgress = () => {
    persist(checkedTasks)
    flash(setProgressStatus, 'Прогресс сохранён')
  }

  const clearProgress = () => {
    clearTrainerChecklistProgress(rootTitle)
    setCheckedTasks(new Set())
    flash(setProgressStatus, 'Прогресс очищен')
  }

  return (
    <div className={styles.root}>
      <div className={styles.progressBar}>
        <p className={styles.hint}>
          Отмечайте проверенные taskId. Состояние — в localStorage. Сводка по
          всем шаблонам: Trainer → Check-list.
        </p>
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.toolButton}
            onClick={saveProgress}
          >
            Сохранить прогресс
          </button>
          <button
            type="button"
            className={styles.toolButton}
            onClick={clearProgress}
          >
            Очистить прогресс
          </button>
          {progressStatus ? (
            <span className={styles.status}>{progressStatus}</span>
          ) : null}
        </div>
      </div>

      <div className={styles.panel} data-testid="open-trainer-tasks-table">
        <div className={styles.panelHeader}>
          <h4 className={styles.panelTitle}>
            Все задачи ({taskRows.length})
          </h4>
          <ChecklistToolbar
            disabled={!taskRows.length}
            status={tasksStatus}
            onSelectAll={() => {
              const next = new Set(taskRows.map((r) => r.id))
              setCheckedTasks(next)
              persist(next)
            }}
            onClearChecks={() => {
              const next = new Set<string>()
              setCheckedTasks(next)
              persist(next)
            }}
            onCopy={async () => {
              await copyText(tasksMarkdown(taskRows, checkedTasks))
              flash(setTasksStatus, 'Скопировано')
            }}
            onDownload={() => {
              downloadText(
                `${slug}-tasks.md`,
                tasksMarkdown(taskRows, checkedTasks),
              )
              flash(setTasksStatus, 'Скачано')
            }}
          />
        </div>
        {taskRows.length ? (
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkCell} />
                  <th className={styles.numCell}>№</th>
                  <th>taskId</th>
                  <th>group</th>
                  <th className={styles.launchCell}>Новый</th>
                  <th className={styles.launchCell}>Старый</th>
                </tr>
              </thead>
              <tbody>
                {taskRows.map((row, index) => {
                  const active =
                    row.id === selectedTaskId && row.group === selectedGroup
                  const hasLaunch =
                    row.launch?.chapterId &&
                    row.launch?.lessonId &&
                    row.launch.taskIndex != null
                  return (
                    <tr
                      key={row.id}
                      className={
                        active
                          ? `${styles.row} ${styles.rowActive}`
                          : styles.row
                      }
                      onClick={() => {
                        onSelectTask(row.group, row.id)
                        toggleTaskCheck(row.id)
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className={styles.checkCell}>
                        <input
                          type="checkbox"
                          checked={checkedTasks.has(row.id)}
                          readOnly
                          tabIndex={-1}
                          aria-label={`Отметить ${row.id}`}
                        />
                      </td>
                      <td className={styles.numCell}>{index + 1}</td>
                      <td>
                        <code>{row.id}</code>
                      </td>
                      <td>
                        <code>{row.group}</code>
                      </td>
                      {hasLaunch ? (
                        <LaunchCell launch={row.launch} />
                      ) : (
                        <>
                          <td className={styles.launchCell}>
                            <span className={styles.emptyDash}>—</span>
                          </td>
                          <td className={styles.launchCell}>
                            <span className={styles.emptyDash}>—</span>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={styles.empty}>Нет задач в groups.json</p>
        )}
      </div>
    </div>
  )
}
