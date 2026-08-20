import { useEffect, useState } from 'react'

import { formatChecklistCheckedAt } from './trainer-checklist-storage'
import {
  markTrainerVerifiedTask,
  readTrainerVerifiedProgress,
  TRAINER_VERIFIED_CHANGE_EVENT,
  unmarkTrainerVerifiedTask,
} from './trainer-verified-storage'

interface Props {
  rootTitle?: string
  taskId?: string
}

/** Top-of-section «проверен» mark — independent of the Тесты checklist below. */
export const TaskVerifiedCheckbox = ({ rootTitle, taskId }: Props) => {
  const [checked, setChecked] = useState(false)
  const [checkedAt, setCheckedAt] = useState<string | null>(null)

  const sync = () => {
    if (!taskId) {
      setChecked(false)
      setCheckedAt(null)
      return
    }
    const progress = readTrainerVerifiedProgress(rootTitle)
    const isChecked = progress.tasks.includes(taskId)
    setChecked(isChecked)
    setCheckedAt(isChecked ? (progress.verifiedAt?.[taskId] ?? null) : null)
  }

  useEffect(() => {
    sync()
    const onChange = () => sync()
    window.addEventListener(TRAINER_VERIFIED_CHANGE_EVENT, onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener(TRAINER_VERIFIED_CHANGE_EVENT, onChange)
      window.removeEventListener('storage', onChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync on taskId/rootTitle
  }, [taskId, rootTitle])

  const toggle = () => {
    if (!taskId) return
    if (checked) {
      unmarkTrainerVerifiedTask(rootTitle, taskId)
    } else {
      markTrainerVerifiedTask(rootTitle, taskId)
    }
    sync()
  }

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
        cursor: taskId ? 'pointer' : 'default',
        fontSize: 13,
        color: '#111827',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={!taskId}
        onChange={toggle}
        style={{ width: 16, height: 16, accentColor: '#16a34a' }}
      />
      <span style={{ fontWeight: 600 }}>проверен</span>
      {checked ? (
        <span style={{ color: '#6b7280', fontWeight: 400 }}>
          {checkedAt
            ? `отмечено ${formatChecklistCheckedAt(checkedAt)}`
            : 'отмечено'}
        </span>
      ) : (
        <span style={{ color: '#9ca3af', fontWeight: 400 }}>не отмечено</span>
      )}
    </label>
  )
}
