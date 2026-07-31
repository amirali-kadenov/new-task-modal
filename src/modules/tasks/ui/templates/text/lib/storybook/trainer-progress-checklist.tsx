import { useCallback, useEffect, useMemo, useState } from 'react'

import type {
  TemplateGroupFixture,
  TemplateGroupTaskRef,
} from './render-template-groups'
import {
  clearAllTrainerChecklistProgress,
  clearTrainerChecklistProgress,
  readTrainerChecklistProgress,
  TRAINER_CHECKLIST_CHANGE_EVENT,
} from './trainer-checklist-storage'

import styles from './trainer-progress-checklist.module.scss'

export type ChecklistVariantSource = {
  /** e.g. Equation/before — shown as label */
  key: string
  label: string
  /** e.g. Templates/Equation/before — localStorage key */
  rootTitle: string
  groups: TemplateGroupFixture[]
}

type Props = {
  variants: ChecklistVariantSource[]
}

const taskRefsForGroup = (
  fixture: TemplateGroupFixture | undefined,
): TemplateGroupTaskRef[] => {
  if (!fixture) return []
  const raw = fixture.tasks?.length
    ? fixture.tasks
    : (() => {
        const elixirType = (fixture.task as { type?: string } | undefined)?.type
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

const buildTaskRows = (groups: TemplateGroupFixture[]) => {
  const seen = new Set<string>()
  const rows: { id: string; group: string }[] = []
  for (const g of groups) {
    for (const ref of taskRefsForGroup(g)) {
      if (!ref.id || seen.has(ref.id)) continue
      seen.add(ref.id)
      rows.push({ id: ref.id, group: g.group })
    }
  }
  return rows
}

type VariantSnapshot = {
  key: string
  label: string
  rootTitle: string
  total: number
  done: number
  checked: { id: string; group: string }[]
  unchecked: { id: string; group: string }[]
}

/** Global summary of Checklist progress across all template variants. */
export const TrainerGlobalProgressChecklist = ({ variants }: Props) => {
  const [tick, setTick] = useState(0)
  const [status, setStatus] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const reload = useCallback(() => {
    setTick((n) => n + 1)
  }, [])

  useEffect(() => {
    reload()
    const onCustom = () => reload()
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith('sb-trainer-checklist:')) reload()
    }
    const onFocus = () => reload()
    window.addEventListener(TRAINER_CHECKLIST_CHANGE_EVENT, onCustom)
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onFocus)
    const id = window.setInterval(reload, 1500)
    return () => {
      window.removeEventListener(TRAINER_CHECKLIST_CHANGE_EVENT, onCustom)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onFocus)
      window.clearInterval(id)
    }
  }, [reload])

  const snapshots: VariantSnapshot[] = useMemo(() => {
    void tick
    return variants.map((v) => {
      const rows = buildTaskRows(v.groups)
      const checkedSet = new Set(
        readTrainerChecklistProgress(v.rootTitle).tasks,
      )
      const checked = rows.filter((r) => checkedSet.has(r.id))
      const unchecked = rows.filter((r) => !checkedSet.has(r.id))
      return {
        key: v.key,
        label: v.label,
        rootTitle: v.rootTitle,
        total: rows.length,
        done: checked.length,
        checked,
        unchecked,
      }
    })
  }, [variants, tick])

  const totals = useMemo(() => {
    let done = 0
    let total = 0
    for (const s of snapshots) {
      done += s.done
      total += s.total
    }
    return { done, total }
  }, [snapshots])

  const flash = (message: string) => {
    setStatus(message)
    window.setTimeout(() => setStatus(''), 2000)
  }

  return (
    <div className={styles.root}>
      <section className={styles.explain}>
        <h3 className={styles.title}>Check-list</h3>
        <p>
          Глобальная сводка отметок из <strong>Checklist</strong> каждого
          варианта (<code>Templates/*/Trainer → Checklist</code>). Там — таблица
          задач и кнопки «Новый» / «Старый» тренажёр на хост.
        </p>
        <p>
          Отмечайте taskId после ручной проверки на стенде. Прогресс в
          localStorage браузера. Автотесты оболочки — в папке{' '}
          <strong>Flow</strong> у варианта.
        </p>
      </section>

      <div className={styles.toolbar}>
        <button type="button" className={styles.button} onClick={reload}>
          Обновить
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            clearAllTrainerChecklistProgress()
            reload()
            flash('Весь прогресс очищен')
          }}
        >
          Очистить весь прогресс
        </button>
        {status ? <span className={styles.status}>{status}</span> : null}
      </div>

      <div className={styles.summary}>
        <div className={styles.stat}>
          Всего задач: <strong>{totals.done}</strong> / {totals.total}
        </div>
        <div className={styles.stat}>
          Вариантов: <strong>{snapshots.length}</strong>
        </div>
      </div>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>По вариантам</h4>
        <ul className={styles.variantList}>
          {snapshots.map((s) => {
            const open = expanded === s.key
            return (
              <li key={s.key} className={styles.variantItem}>
                <button
                  type="button"
                  className={styles.variantToggle}
                  onClick={() => setExpanded(open ? null : s.key)}
                  aria-expanded={open}
                >
                  <span className={styles.mark}>
                    {s.done === s.total && s.total > 0 ? '[x]' : '[ ]'}
                  </span>{' '}
                  <strong>{s.label}</strong>{' '}
                  <span className={styles.meta}>
                    {s.done}/{s.total}
                  </span>
                </button>
                {open ? (
                  <div className={styles.variantDetail}>
                    <div className={styles.toolbar}>
                      <button
                        type="button"
                        className={styles.button}
                        onClick={() => {
                          clearTrainerChecklistProgress(s.rootTitle)
                          reload()
                          flash(`Очищено: ${s.label}`)
                        }}
                      >
                        Очистить этот вариант
                      </button>
                    </div>
                    {s.checked.length ? (
                      <>
                        <p className={styles.subTitle}>Отмечено</p>
                        <ul className={styles.list}>
                          {s.checked.map((r) => (
                            <li key={r.id}>
                              <span className={styles.mark}>[x]</span>{' '}
                              <code>{r.id}</code>{' '}
                              <span className={styles.meta}>({r.group})</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                    {s.unchecked.length ? (
                      <>
                        <p className={styles.subTitle}>Осталось</p>
                        <ul className={styles.list}>
                          {s.unchecked.map((r) => (
                            <li key={r.id}>
                              <span className={styles.mark}>[ ]</span>{' '}
                              <code>{r.id}</code>{' '}
                              <span className={styles.meta}>({r.group})</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p className={styles.empty}>Все задачи отмечены</p>
                    )}
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
