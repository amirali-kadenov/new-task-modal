import { useEffect, useMemo, useState } from 'react'

import {
  getGroupTaskRefs,
  pickGroup,
  pickTaskLaunch,
  TrainerLaunchLinks,
  type TemplateGroupFixture,
} from '@/modules/tasks/ui/templates/text/lib/storybook'

import type { TrainerStateTab } from '../lib/apply-trainer-state'
import { getTrainerVariant, TRAINER_VARIANTS } from '../lib/trainer-variants'

import styles from './trainer-playground.module.scss'

export type { TrainerStateTab }

export type TrainerPlaygroundArgs = {
  variantKey: string
  group: string
}

const STATE_TABS: { id: TrainerStateTab; label: string }[] = [
  { id: 'idle', label: 'Исходное' },
  { id: 'wrong', label: 'Неверный ответ' },
  { id: 'hint', label: 'Подсказка' },
  { id: 'solution', label: 'Решение' },
  { id: 'videoExplanation', label: 'Видео-объяснение' },
  { id: 'canvasChat', label: 'Доска и чат' },
]

type Props = TrainerPlaygroundArgs & {
  /** When true, show All States tabs under the toolbar (Default / AllStates). */
  showAllStates?: boolean
  /** Initial / fixed state when not using All States tabs. */
  stateTab?: TrainerStateTab
}

const asFixtures = (groups: unknown): TemplateGroupFixture[] =>
  groups as TemplateGroupFixture[]

const firstTaskId = (groups: TemplateGroupFixture[], groupId: string) =>
  getGroupTaskRefs(pickGroup(groups, groupId))[0]?.id ?? ''

export const TrainerPlayground = ({
  variantKey: variantKeyArg,
  group: groupArg,
  showAllStates = false,
  stateTab: stateTabProp = 'idle',
}: Props) => {
  const [variantKey, setVariantKey] = useState(variantKeyArg)
  const [group, setGroup] = useState(groupArg)
  const [stateTab, setStateTab] = useState<TrainerStateTab>(stateTabProp)
  const [taskId, setTaskId] = useState('')

  // Sync from Storybook Controls when args change.
  useEffect(() => {
    setVariantKey(variantKeyArg)
  }, [variantKeyArg])

  useEffect(() => {
    setGroup(groupArg)
  }, [groupArg])

  useEffect(() => {
    if (!showAllStates) {
      setStateTab(stateTabProp)
    }
  }, [stateTabProp, showAllStates])

  const variant = useMemo(() => getTrainerVariant(variantKey), [variantKey])
  const fixtures = useMemo(() => asFixtures(variant.groups), [variant.groups])

  useEffect(() => {
    if (!variant.groupIds.includes(group)) {
      setGroup(variant.defaultGroup)
    }
  }, [variant, group])

  const resolvedGroup = variant.groupIds.includes(group)
    ? group
    : variant.defaultGroup

  const taskRefs = useMemo(
    () => getGroupTaskRefs(pickGroup(fixtures, resolvedGroup)),
    [fixtures, resolvedGroup],
  )

  const refIdsKey = taskRefs.map((t) => t.id).join('|')

  useEffect(() => {
    const next = firstTaskId(fixtures, resolvedGroup)
    setTaskId((prev) => (taskRefs.some((t) => t.id === prev) ? prev : next))
    // taskRefs rebuilt each render — depend on stable key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedGroup, fixtures, refIdsKey])

  const resolvedTaskId =
    (taskId && taskRefs.some((t) => t.id === taskId) ? taskId : undefined) ??
    taskRefs[0]?.id ??
    ''

  const launch = pickTaskLaunch(fixtures, resolvedGroup, resolvedTaskId)

  const onVariantChange = (nextKey: string) => {
    const next = getTrainerVariant(nextKey)
    setVariantKey(next.key)
    setGroup(next.defaultGroup)
  }

  const activeTab = showAllStates ? stateTab : stateTabProp

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <label className={styles.field}>
          <span className={styles.label}>Шаблон</span>
          <select
            data-testid="trainer-template-select"
            value={variant.key}
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
            data-testid="trainer-group-select"
            value={resolvedGroup}
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
          <span className={styles.label}>Задача</span>
          <select
            data-testid="trainer-task-select"
            value={resolvedTaskId}
            disabled={!taskRefs.length}
            onChange={(e) => setTaskId(e.target.value)}
          >
            {taskRefs.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.launch}>
          <TrainerLaunchLinks launch={launch} className={styles.launchLinks} />
        </div>
      </div>

      {showAllStates && (
        <div className={styles.allStates}>
          <div className={styles.allStatesHeader}>Все состояния</div>
          <div
            className={styles.tabs}
            role="tablist"
            aria-label="Состояния тренажёра"
          >
            {STATE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={stateTab === tab.id}
                className={stateTab === tab.id ? styles.tabActive : styles.tab}
                onClick={() => setStateTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <p className={styles.tabHint}>
            Вкладки только переключают UI-состояния (один общий store).
            Интеракционные тесты — в истории Trainer → Tests.
          </p>
        </div>
      )}

      <div
        className={styles.stage}
        key={`${variant.key}:${resolvedGroup}:${activeTab}`}
      >
        {variant.render(resolvedGroup, activeTab)}
      </div>
    </div>
  )
}

export const defaultTrainerArgs = (): TrainerPlaygroundArgs => {
  // Prefer Text/plain — full play coverage (correct / wrong / canvas+chat) in Templates.
  const preferred =
    TRAINER_VARIANTS.find((v) => v.key === 'Text/plain') ?? TRAINER_VARIANTS[0]
  return {
    variantKey: preferred?.key ?? '',
    group: preferred?.defaultGroup ?? '',
  }
}
