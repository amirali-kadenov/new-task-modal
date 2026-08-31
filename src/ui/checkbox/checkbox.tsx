import clsx from 'clsx'
import React, { useId } from 'react'

import { isHtmlRadioLabel } from '../radio-button/radio-button'

import styles from './checkbox.module.scss'

interface Props {
  name: string
  value: string
  label: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  /** Non-interactive, but keeps default/checked look (no gray, no hover). */
  readOnly?: boolean
}

/** Radio's twin for tasks with more than one correct answer. */
export const Checkbox = ({
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
  readOnly = false,
}: Props) => {
  const id = useId()
  const htmlLabel = isHtmlRadioLabel(label)

  return (
    <label
      className={clsx(
        styles.checkbox,
        checked && styles.checked,
        disabled && !readOnly && styles.disabled,
        readOnly && styles.readOnly,
        htmlLabel && styles.htmlLabel,
      )}
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled || readOnly}
        className={styles.checkboxInput}
        aria-label={htmlLabel ? value : undefined}
      />
      <span className={styles.checkboxControl} aria-hidden />
      {htmlLabel ? (
        <span
          className={styles.checkboxLabel}
          dangerouslySetInnerHTML={{ __html: label }}
        />
      ) : (
        <span className={styles.checkboxLabel}>{label}</span>
      )}
    </label>
  )
}
