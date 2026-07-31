import type { CSSProperties } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import type { Translation } from '@/types/api/task'
import { MathText } from '@/ui/math-text/math-text'

import type { TestTaskDescription } from '../lib/types.task'

import styles from './test.module.scss'

interface Props {
  description: TestTaskDescription
  deps: TaskModalDependencies
}

const translateValue = (
  value: Translation | string | null | undefined,
  translate: (value: Translation | string) => string,
): string => {
  if (value == null || value === '') return ''
  if (isTranslation(value)) return translate(value)
  return typeof value === 'string' ? value : ''
}

export const TestQuestion = ({ description, deps }: Props) => {
  const translate = (value: Translation | string) =>
    deps.global.translateTasks(value)

  const question = translateValue(description.question, translate)
  const questionAfter = translateValue(description.questionAfter, translate)

  const questionStyle: CSSProperties = {}
  if (description.questionFontSize) {
    questionStyle.fontSize = description.questionFontSize
  }
  if (description.questionAlign) {
    questionStyle.textAlign =
      description.questionAlign as CSSProperties['textAlign']
  }

  return (
    <>
      {question ? (
        <div
          className={styles.question}
          data-testid="test-question"
          style={
            Object.keys(questionStyle).length > 0 ? questionStyle : undefined
          }
        >
          <MathText>{question}</MathText>
        </div>
      ) : null}
      {questionAfter ? (
        <div className={styles.questionAfter}>
          <MathText>{questionAfter}</MathText>
        </div>
      ) : null}
    </>
  )
}
