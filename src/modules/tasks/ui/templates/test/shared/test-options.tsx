import clsx from 'clsx'

import {
  RadioButtonGroup,
  type RadioOption,
} from '@/ui/radio-button/radio-button-group'

import type { TestTaskDescription } from '../lib/types.task'

import styles from './test.module.scss'

interface Props {
  name: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  description: TestTaskDescription
  disabled?: boolean
  readOnly?: boolean
}

export const TestOptions = ({
  name,
  options,
  value,
  onChange,
  description,
  disabled = false,
  readOnly = false,
}: Props) => {
  const horizontal = Boolean(description.isHorizontal)
  const wrap = Boolean(description.isWrapVariants)

  return (
    <div
      data-testid="test-options"
      data-layout={horizontal ? 'horizontal' : 'vertical'}
    >
      <RadioButtonGroup
        className={clsx(
          styles.radioGroup,
          horizontal && styles.radioGroupHorizontal,
          wrap && styles.radioGroupWrap,
        )}
        name={name}
        options={options}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        ariaLabel="test-options"
      />
    </div>
  )
}
