import clsx from 'clsx'
import type { ComponentType } from 'react'
import { useRef, useState } from 'react'

import { injectFonts } from '@/modules/task-modal/model/lib/fonts/inject-fonts'
import containerStyles from '@/modules/task-modal/ui/content/container/container.module.scss'
import contentStyles from '@/modules/task-modal/ui/content/content.module.scss'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import {
  makeStoryDeps,
  makeTranslation,
} from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import type { TextTaskSolution } from '../types.solution'
import type { TextTask } from '../types.task'

injectFonts()

export { makeStoryDeps, makeTranslation }

/** Активный solution для unit-тестов (не Storybook fixtures). */
export const makeSolution = (answerRus: string): TextTaskSolution => ({
  type: 'text',
  answer: makeTranslation(answerRus),
  content: makeTranslation('Потому что.'),
})

/** Input-mode fixture: strip embedded solution from groups dump. */
export const withoutSolution = (task: TextTask): TextTask => ({
  ...task,
  solution: null,
})

interface TextTemplateStoryProps {
  Template: ComponentType<TaskComponentProps<TextTask>>
  task: TextTask
  initialAnswer?: string
}

/**
 * Обёртка story: локальный answer state + mathInput ref + stub deps.
 * Сам Template приходит из папки шаблона.
 */
export const TextTemplateStory = ({
  Template,
  task,
  initialAnswer = '',
}: TextTemplateStoryProps) => {
  const [answer, setAnswer] = useState(initialAnswer)
  const mathInput = useRef(new Map())

  return (
    <div className={clsx('task-modal', contentStyles.container)}>
      <div className={containerStyles.container}>
        <Template
          task={task}
          deps={makeStoryDeps()}
          answer={answer}
          onChange={setAnswer}
          mathInput={mathInput}
        />
      </div>
    </div>
  )
}
