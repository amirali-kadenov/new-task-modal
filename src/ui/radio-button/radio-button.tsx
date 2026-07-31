import clsx from 'clsx'
import React, { useId } from 'react'

import styles from './radio-button.module.scss'

/** ME parity: SVG / HTML markup must not be escaped as text. */
export const isHtmlRadioLabel = (content: string): boolean =>
  content.includes('svg') || content.includes('<div')

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

export const RadioButton = ({
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
        styles.radioButton,
        checked && styles.checked,
        disabled && !readOnly && styles.disabled,
        readOnly && styles.readOnly,
        htmlLabel && styles.htmlLabel,
      )}
      htmlFor={id}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled || readOnly}
        className={styles.radioInput}
        aria-label={htmlLabel ? value : undefined}
      />
      <span className={styles.radioControl} aria-hidden />
      {htmlLabel ? (
        <span
          className={styles.radioLabel}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: label }}
        />
      ) : (
        <span className={styles.radioLabel}>{label}</span>
      )}
    </label>
  )
}
