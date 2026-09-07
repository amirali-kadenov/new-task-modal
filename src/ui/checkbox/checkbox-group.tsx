import clsx from 'clsx'

import type { RadioOption } from '../radio-button/radio-button-group'

import { Checkbox } from './checkbox'
import styles from './checkbox-group.module.scss'

/** Backend joins the parts of a multi-part answer with this separator. */
export const MULTIPLE_ANSWER_SEPARATOR = ';;'

export const parseMultiValue = (value: string | undefined): string[] =>
  (value ?? '')
    .split(MULTIPLE_ANSWER_SEPARATOR)
    .map((part) => part.trim())
    .filter(Boolean)

/**
 * Serialize picks in the order the options are shown, not the order they were
 * clicked: the checker compares parts element-wise, so "B;;C" and "C;;B" are
 * not the same string to it.
 */
export const serializeMultiValue = (
  options: RadioOption[],
  picked: readonly string[],
): string =>
  options
    .filter((option) => picked.includes(option.value))
    .map((option) => option.value)
    .join(MULTIPLE_ANSWER_SEPARATOR)

interface Props {
  name: string
  options: RadioOption[]
  /** Letters joined by `;;`, e.g. `B;;C;;E`. */
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  readOnly?: boolean
  className?: string
  ariaLabel?: string
  /** Told to the pupil above the list; omit to hide. */
  hint?: string
}

export const CheckboxGroup = ({
  name,
  options,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  className,
  ariaLabel,
  hint,
}: Props) => {
  const picked = parseMultiValue(value)

  const toggle = (option: string) => {
    const next = picked.includes(option)
      ? picked.filter((item) => item !== option)
      : [...picked, option]
    onChange(serializeMultiValue(options, next))
  }

  return (
    <div className={clsx(className)}>
      {hint ? <p className={styles.hint}>{hint}</p> : null}
      <div
        className={styles.container}
        role="group"
        aria-label={ariaLabel}
        data-testid="checkbox-group"
      >
        {options.map((option) => (
          <Checkbox
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            checked={picked.includes(option.value)}
            onChange={() => toggle(option.value)}
            disabled={disabled || option.disabled}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  )
}
