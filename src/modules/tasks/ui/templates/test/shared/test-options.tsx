import clsx from 'clsx'

import { CheckboxGroup } from '@/ui/checkbox/checkbox-group'
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
  /** Task admits more than one correct answer — pick with checkboxes. */
  multiple?: boolean
  /** Localized "pick every fitting option" line. */
  multipleHint?: string
}

export const TestOptions = ({
  name,
  options,
  value,
  onChange,
  description,
  disabled = false,
  readOnly = false,
  multiple = false,
  multipleHint,
}: Props) => {
  const horizontal = Boolean(description.isHorizontal)
  const wrap = Boolean(description.isWrapVariants)

  return (
    <div
      data-testid="test-options"
      data-layout={horizontal ? 'horizontal' : 'vertical'}
    >
      {multiple ? (
        <CheckboxGroup
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
          hint={multipleHint}
        />
      ) : (
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
      )}
    </div>
  )
}
