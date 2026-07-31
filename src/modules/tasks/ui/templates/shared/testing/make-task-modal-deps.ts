import { TaskDescriptionType } from '@/modules/task-modal/model/constants'
import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { pickTranslationText } from '@/modules/tasks/lib/translation-utils'
import type { Translation } from '@/types/api/task'

/** Minimal Translation stub for stories / unit fixtures. */
export const makeTranslation = (rus: string): Translation => ({
  with_audio_player: false,
  aze: '',
  arsa: '',
  areg: '',
  kgz: '',
  uzb: '',
  eng: '',
  rus,
  kaz: '',
  school: '',
  module_name: 'Elixir.Helpers.Translation',
})

/**
 * Shared TaskModal deps stub for Storybook stories and jsdom unit tests.
 * rus translation + multi-answer separator `;;` (same as API).
 */
export const makeTaskModalDeps = (): TaskModalDependencies =>
  ({
    global: {
      translateTasks: (value: unknown) => pickTranslationText(value),
    },
    enums: {
      TaskDescriptionType,
    },
    helpers: {
      TaskHelper: {
        multipleTaskAnswerSeparator: ';;',
      },
    },
  }) as unknown as TaskModalDependencies

/** @deprecated Prefer `makeTaskModalDeps` — kept as alias for existing call sites. */
export const makeDeps = makeTaskModalDeps

/** @deprecated Prefer `makeTaskModalDeps` — kept as alias for existing call sites. */
export const makeStoryDeps = makeTaskModalDeps
