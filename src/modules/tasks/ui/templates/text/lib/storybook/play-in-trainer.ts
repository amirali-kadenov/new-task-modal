import { expect, userEvent, waitFor, within } from 'storybook/test'

import { runPlayStep } from '@/testing/play-step'
import { withOnDemandPlay } from '@/testing/with-on-demand-play'
import { withTrackedPlay } from '@/testing/with-tracked-play'
import type { TaskSolution } from '@/types/api/task'
import {
  assertNoRawMathDelimiters,
  waitForMathJax,
} from '@/ui/math-text/assert-mathjax-dom'

import { stripMathDelimiters } from '../strip-math-delimiters'
import type { TextTask } from '../types.task'

import { pickTask, resolveTrainerGroup } from './create-text-template-stories'
import {
  getFixtureAnswerString,
  STORY_THEORY_VIDEO_ID,
} from './make-trainer-props'
import type { TemplateGroupFixture } from './render-template-groups'
import {
  PLAY_CASES_CALC_OVERFLOW,
  PLAY_CASES_CORRECT,
  PLAY_CASES_HINTS,
  PLAY_CASES_OPEN,
  PLAY_CASES_SHOW_ANSWER,
  PLAY_CASES_THEORY,
  PLAY_CASES_WRONG,
} from './trainer-play-cases'

export {
  PLAY_CASES_CALC_OVERFLOW,
  PLAY_CASES_CORRECT,
  PLAY_CASES_HINTS,
  PLAY_CASES_OPEN,
  PLAY_CASES_SHOW_ANSWER,
  PLAY_CASES_THEORY,
  PLAY_CASES_WRONG,
  TRAINER_STORY_DOCS,
  trainerPlayParameters,
} from './trainer-play-cases'

/** Same separator the app uses to join multi-input answers (`;;`). */
const MULTI_ANSWER_SEPARATOR = ';;'

/** `Проверить` — see `deps.localize.checkAnswer` in `make-trainer-props.ts`. */
const CHECK_BUTTON_NAME = 'Проверить'
const DEV_STEP_DELAY_MS = 400

const isAutomatedRun = () =>
  Boolean(import.meta.env.VITEST) ||
  (typeof window !== 'undefined' &&
    (window.location.href.includes('__vitest__') ||
      document.title.includes('Vitest Browser')))

/** When true, Storybook UI plays skip settle / typing delay (same as Vitest). */
let instantPlay = false

const skipPlayDelays = () => isAutomatedRun() || instantPlay

/**
 * Run play helpers without DEV_STEP_DELAY / userEvent delay (Storybook UI).
 * Nesting is not supported — outer call wins until finally.
 */
export const withInstantPlay = async <T>(fn: () => Promise<T>): Promise<T> => {
  instantPlay = true
  try {
    return await fn()
  } finally {
    instantPlay = false
  }
}

/** No-op under Vitest / instant mode; pauses when watched in Storybook UI. */
const settle = (ms: number) =>
  skipPlayDelays()
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        setTimeout(resolve, ms)
      })

const makeStoryUser = () =>
  userEvent.setup({
    delay: skipPlayDelays() ? undefined : 120,
  })

/** LaTeX-ish plain text to type per input, derived from `task.solution`. */
const getAnswerPartsToType = (
  solution: TaskSolution | string | null | undefined,
) => {
  const raw = getFixtureAnswerString(solution)
  const stripped = stripMathDelimiters(raw).trim()
  if (!stripped) return []
  return stripped.split(MULTI_ANSWER_SEPARATOR)
}

interface MakePlayArgs {
  groups: TemplateGroupFixture[]
  fallbackTask: TextTask
}

type PlayCanvasArgs = {
  canvasElement: HTMLElement
  args?: { group?: string; taskId?: string }
}

/** Escape a value for use inside a `querySelector` attribute matcher. */
const escapeAttributeValue = (value: string) => value.replace(/"/g, '\\"')

/** Wrong answer parts for multi-input: mutate each `;;` segment separately. */
const makeWrongPartsForAttempt = (
  solution: TaskSolution | string | null | undefined,
  attempt: 1 | 2 | 3,
) => {
  const parts = getAnswerPartsToType(solution)
  if (parts.length === 0) {
    const base =
      stripMathDelimiters(getFixtureAnswerString(solution)).trim() || '0'
    return [`${base}${attempt}`]
  }
  return parts.map((part) => `${part.trim() || '0'}${attempt}`)
}

const findCheckButton = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement)
  return canvas.findByRole('button', {
    name: CHECK_BUTTON_NAME,
  })
}

const findRadioByValue = (canvasElement: HTMLElement, value: string) =>
  canvasElement.querySelector<HTMLElement>(
    `input[type="radio"][value="${escapeAttributeValue(value)}"]`,
  )

type MathQuillField = {
  latex: (v?: string) => string
  focus?: () => void
  typedText?: (text: string) => void
}

/**
 * Prefer MathQuill API over `userEvent.keyboard`: Storybook vitest/browser
 * often fails to focus MathQuill's hidden textarea, so keystrokes never land.
 * `latex()` / `typedText()` still fire the field `edit` handler → store update.
 */
const getMathQuillField = (field: HTMLElement): MathQuillField => {
  if (!window.MathQuill?.getInterface) {
    throw new Error(
      'MathQuill is not loaded — ensure `.storybook/preview.tsx` imports `./mathquill-bootstrap`',
    )
  }
  const MQ = window.MathQuill.getInterface(2) as unknown as {
    (el: HTMLElement): MathQuillField | undefined
  }
  const mathField = MQ(field)
  if (!mathField) {
    throw new Error('MathQuill MathField not found on [data-input]')
  }
  return mathField
}

const setMathFieldLatex = (field: HTMLElement, value: string) => {
  const mathField = getMathQuillField(field)
  mathField.focus?.()
  // Clear then type so the `edit` handler always sees a change.
  mathField.latex('')
  if (value.length === 0) return
  if (mathField.typedText) {
    for (const char of value) {
      mathField.typedText(char)
    }
  } else {
    mathField.latex(value)
  }
}

const fillAllMathFields = async (
  canvasElement: HTMLElement,
  _user: ReturnType<typeof makeStoryUser>,
  values: string[],
) => {
  const fields = canvasElement.querySelectorAll<HTMLElement>('[data-input]')
  if (fields.length === 0) {
    throw new Error('No [data-input] MathInput fields found')
  }

  for (const [index, field] of Array.from(fields).entries()) {
    const value = values[index] ?? values[0] ?? ''
    setMathFieldLatex(field, value)
    await settle(DEV_STEP_DELAY_MS)
  }
}

const submitCheck = async (
  canvasElement: HTMLElement,
  user: ReturnType<typeof makeStoryUser>,
) => {
  const checkButton = await findCheckButton(canvasElement)
  await waitFor(() => expect(checkButton).toBeEnabled())
  await settle(DEV_STEP_DELAY_MS)
  await user.click(checkButton)
}

/**
 * Shared `play` for every domain's `InTrainer` story: enters the fixture's
 * correct `task.solution` answer and clicks "Проверить", then asserts the
 * trainer accepted it (the check button resets to disabled — see
 * `handleCorrectAnswer` in `use-check-answer.ts`, which clears the input on
 * a correct check).
 *
 * Most domains answer via `MathInput`(s) (`[data-input]`), so the raw
 * solution text (split on the multi-input separator) is typed into them.
 * The `test` domain answers via a radio group instead (`input[type=radio]`
 * whose `value` is the option letter, e.g. `"B"`) — when a matching radio
 * exists for the raw solution string, it's clicked instead of typing.
 *
 * Skips silently when the selected group's fixture has no `solution` (e.g.
 * `AllGroups`-only fixtures without a resolved answer) — nothing to assert.
 */
/** Play against a concrete fixture task (gallery section / local panel). */
export const runPlayCorrectAnswerForTask =
  (task: TextTask) =>
  async ({ canvasElement }: PlayCanvasArgs) => {
    const user = makeStoryUser()
    const rawAnswer = getFixtureAnswerString(task.solution).trim()
    if (!rawAnswer) return

    const checkButton = await findCheckButton(canvasElement)
    await settle(DEV_STEP_DELAY_MS)

    const radioInput = findRadioByValue(canvasElement, rawAnswer)

    if (radioInput) {
      await user.click(radioInput)
    } else {
      const parts = getAnswerPartsToType(task.solution)
      if (parts.length === 0) return
      await fillAllMathFields(canvasElement, user, parts)
    }

    await waitFor(() => expect(checkButton).toBeEnabled())
    await settle(DEV_STEP_DELAY_MS)
    await user.click(checkButton)
    await waitFor(() => expect(checkButton).toBeDisabled())
    await settle(DEV_STEP_DELAY_MS)
  }

export const runPlayCorrectAnswerInTrainer =
  ({ groups, fallbackTask }: MakePlayArgs) =>
  async ({ canvasElement, args }: PlayCanvasArgs) => {
    const task = pickTask(
      groups,
      resolveTrainerGroup(groups, args?.group),
      fallbackTask,
    )
    return runPlayCorrectAnswerForTask(task)({ canvasElement })
  }

export const makePlayCorrectAnswerInTrainer = (args: MakePlayArgs) =>
  withTrackedPlay([...PLAY_CASES_CORRECT], async (ctx: PlayCanvasArgs) => {
    const task = pickTask(
      args.groups,
      resolveTrainerGroup(args.groups, ctx.args?.group),
      args.fallbackTask,
    )
    const user = makeStoryUser()
    const rawAnswer = getFixtureAnswerString(task.solution).trim()
    if (!rawAnswer) return

    const checkButton = await findCheckButton(ctx.canvasElement)

    await runPlayStep(
      PLAY_CASES_CORRECT[0].id,
      PLAY_CASES_CORRECT[0].label,
      async () => {
        await settle(DEV_STEP_DELAY_MS)
        const radioInput = findRadioByValue(ctx.canvasElement, rawAnswer)
        if (radioInput) {
          await user.click(radioInput)
        } else {
          const parts = getAnswerPartsToType(task.solution)
          if (parts.length === 0) return
          await fillAllMathFields(ctx.canvasElement, user, parts)
        }
        await waitFor(() => expect(checkButton).toBeEnabled())
      },
    )

    await runPlayStep(
      PLAY_CASES_CORRECT[1].id,
      PLAY_CASES_CORRECT[1].label,
      async () => {
        await settle(DEV_STEP_DELAY_MS)
        await user.click(checkButton)
        await waitFor(() => expect(checkButton).toBeDisabled())
        await settle(DEV_STEP_DELAY_MS)
      },
    )
  })

/** Wrong-answer play against a concrete fixture task. */
export const runPlayWrongAnswerForTask =
  (task: TextTask) =>
  async ({ canvasElement }: PlayCanvasArgs) => {
    const user = makeStoryUser()
    const canvas = within(canvasElement)
    const rawAnswer = getFixtureAnswerString(task.solution).trim()
    if (!rawAnswer) return

    await findCheckButton(canvasElement)
    await settle(DEV_STEP_DELAY_MS)

    const options = canvasElement.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]',
    )
    const radioOptions = Array.from(options).map((option) => option.value)
    const radioWrongValues = radioOptions.filter((value) => value !== rawAnswer)

    if (radioWrongValues.length > 0) {
      // Radio domains often have too few wrong options for the full 3-attempt
      // solution path — cover wrong submit + same-answer block, then stop.
      const wrong = radioWrongValues[0]
      const wrongInput = findRadioByValue(canvasElement, wrong)
      if (!wrongInput) return

      await user.click(wrongInput)
      await submitCheck(canvasElement, user)
      await waitFor(async () => {
        const button = await findCheckButton(canvasElement)
        await expect(button).toBeDisabled()
      })
      await settle(DEV_STEP_DELAY_MS)
      return
    }

    // Attempt 1 — wrong answer, hearts animate, same answer blocked.
    await fillAllMathFields(
      canvasElement,
      user,
      makeWrongPartsForAttempt(task.solution, 1),
    )
    await submitCheck(canvasElement, user)
    await waitFor(async () => {
      const button = await findCheckButton(canvasElement)
      await expect(button).toBeDisabled()
    })
    await waitFor(() =>
      expect(canvasElement.querySelector('img[alt=""]')).toBeTruthy(),
    )
    await settle(DEV_STEP_DELAY_MS)

    // Attempt 2 — distinct wrong answer, still "Проверить" (not yet "Далее").
    await fillAllMathFields(
      canvasElement,
      user,
      makeWrongPartsForAttempt(task.solution, 2),
    )
    await submitCheck(canvasElement, user)
    await waitFor(async () => {
      const button = await findCheckButton(canvasElement)
      await expect(button).toBeDisabled()
    })
    await expect(
      canvas.queryByRole('button', { name: 'Далее' }),
    ).not.toBeInTheDocument()
    await settle(DEV_STEP_DELAY_MS)

    // Attempt 3 — mock returns ShowSolution → primary button becomes "Далее".
    await fillAllMathFields(
      canvasElement,
      user,
      makeWrongPartsForAttempt(task.solution, 3),
    )
    await submitCheck(canvasElement, user)

    const nextButton = await canvas.findByRole('button', {
      name: 'Далее',
    })
    await settle(DEV_STEP_DELAY_MS)
    await user.click(nextButton)

    // Single-task session: Далее → closeModal → resetTrainerSession.
    const resetCheckButton = await findCheckButton(canvasElement)
    await waitFor(() => expect(resetCheckButton).toBeDisabled())
    await settle(DEV_STEP_DELAY_MS)
  }

export const runPlayWrongAnswerInTrainer =
  ({ groups, fallbackTask }: MakePlayArgs) =>
  async ({ canvasElement, args }: PlayCanvasArgs) => {
    const task = pickTask(
      groups,
      resolveTrainerGroup(groups, args?.group),
      fallbackTask,
    )
    return runPlayWrongAnswerForTask(task)({ canvasElement })
  }

export const makePlayWrongAnswerInTrainer = (args: MakePlayArgs) =>
  withTrackedPlay([...PLAY_CASES_WRONG], async (ctx: PlayCanvasArgs) => {
    const task = pickTask(
      args.groups,
      resolveTrainerGroup(args.groups, ctx.args?.group),
      args.fallbackTask,
    )
    const rawAnswer = getFixtureAnswerString(task.solution).trim()
    if (!rawAnswer) return

    const user = makeStoryUser()
    const canvas = within(ctx.canvasElement)
    await findCheckButton(ctx.canvasElement)
    await settle(DEV_STEP_DELAY_MS)

    const options = ctx.canvasElement.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]',
    )
    const radioOptions = Array.from(options).map((option) => option.value)
    const radioWrongValues = radioOptions.filter((value) => value !== rawAnswer)

    if (radioWrongValues.length > 0) {
      await runPlayStep(
        PLAY_CASES_WRONG[0].id,
        PLAY_CASES_WRONG[0].label,
        async () => {
          const wrongInput = findRadioByValue(
            ctx.canvasElement,
            radioWrongValues[0],
          )
          if (!wrongInput) return
          await user.click(wrongInput)
          await submitCheck(ctx.canvasElement, user)
          await waitFor(async () => {
            const button = await findCheckButton(ctx.canvasElement)
            await expect(button).toBeDisabled()
          })
        },
      )
      await runPlayStep(
        PLAY_CASES_WRONG[1].id,
        PLAY_CASES_WRONG[1].label,
        async () => {
          // Radio path often cannot reach «Далее» — assert still blocked.
          await expect(
            canvas.queryByRole('button', { name: 'Далее' }),
          ).not.toBeInTheDocument()
        },
      )
      return
    }

    await runPlayStep(
      PLAY_CASES_WRONG[0].id,
      PLAY_CASES_WRONG[0].label,
      async () => {
        await fillAllMathFields(
          ctx.canvasElement,
          user,
          makeWrongPartsForAttempt(task.solution, 1),
        )
        await submitCheck(ctx.canvasElement, user)
        await waitFor(async () => {
          const button = await findCheckButton(ctx.canvasElement)
          await expect(button).toBeDisabled()
        })
        await waitFor(() =>
          expect(ctx.canvasElement.querySelector('img[alt=""]')).toBeTruthy(),
        )
        await settle(DEV_STEP_DELAY_MS)

        await fillAllMathFields(
          ctx.canvasElement,
          user,
          makeWrongPartsForAttempt(task.solution, 2),
        )
        await submitCheck(ctx.canvasElement, user)
        await waitFor(async () => {
          const button = await findCheckButton(ctx.canvasElement)
          await expect(button).toBeDisabled()
        })
        await expect(
          canvas.queryByRole('button', { name: 'Далее' }),
        ).not.toBeInTheDocument()
        await settle(DEV_STEP_DELAY_MS)
      },
    )

    await runPlayStep(
      PLAY_CASES_WRONG[1].id,
      PLAY_CASES_WRONG[1].label,
      async () => {
        await fillAllMathFields(
          ctx.canvasElement,
          user,
          makeWrongPartsForAttempt(task.solution, 3),
        )
        await submitCheck(ctx.canvasElement, user)
        const nextButton = await canvas.findByRole('button', { name: 'Далее' })
        await settle(DEV_STEP_DELAY_MS)
        await user.click(nextButton)
        const resetCheckButton = await findCheckButton(ctx.canvasElement)
        await waitFor(() => expect(resetCheckButton).toBeDisabled())
        await settle(DEV_STEP_DELAY_MS)
      },
    )
  })

export const runPlayCanvasAndChatInTrainer = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement
}) => {
  const user = makeStoryUser()
  const canvas = within(canvasElement)

  const openCanvasButton = await canvas.findByRole('button', {
    name: 'Открыть доску',
  })
  await user.click(openCanvasButton)
  const closeCanvasButton = await canvas.findByTitle('Закрыть доску')
  await waitFor(() => expect(closeCanvasButton).toBeVisible())
  await user.click(closeCanvasButton)

  const openChatButton = await canvas.findByRole('button', {
    name: 'Открыть чат',
  })
  await user.click(openChatButton)
  const chatHeading = await canvas.findByRole('heading', { name: 'AI-чат' })

  const showExample = await canvas.findByRole('button', {
    name: 'Смотреть пример',
  })
  await user.click(showExample)
  const thumbnails = await canvas.findAllByAltText('Video thumbnail')
  await expect(thumbnails.length).toBeGreaterThan(0)

  const showAnswer = await canvas.findByRole('button', {
    name: 'Показать ответ',
  })
  await user.click(showAnswer)
  await canvas.findByText(/Верный ответ:/)

  const mentorTab = await canvas.findByText('Ментор')
  await user.click(mentorTab)

  const chatInput = await canvas.findByPlaceholderText('Cообщение...')
  await user.click(chatInput)
  await user.keyboard('Привет!')
  await user.keyboard('{Enter}')
  await canvas.findByText('Привет!')

  const topBar = chatHeading.parentElement
  const closeChatButton = topBar?.querySelector('button:last-of-type')
  if (!closeChatButton) return
  await user.click(closeChatButton)
}

export const makePlayCanvasAndChatInTrainer = withOnDemandPlay(
  runPlayCanvasAndChatInTrainer,
)

/** Play against a concrete fixture task (gallery section / local panel). */
export const runPlayHintsForTask =
  (task: TextTask) =>
  async ({ canvasElement }: PlayCanvasArgs) => {
    const user = makeStoryUser()
    const canvas = within(canvasElement)
    const rawAnswer = getFixtureAnswerString(task.solution).trim()
    if (!rawAnswer) return

    await findCheckButton(canvasElement)
    await settle(DEV_STEP_DELAY_MS)

    const options = canvasElement.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]',
    )
    const radioOptions = Array.from(options).map((option) => option.value)
    const radioWrongValues = radioOptions.filter((value) => value !== rawAnswer)

    if (radioWrongValues.length > 0) {
      const wrongInput = findRadioByValue(canvasElement, radioWrongValues[0])
      if (!wrongInput) return
      await user.click(wrongInput)
      await submitCheck(canvasElement, user)
      await canvas.findByTestId('task-hint-1')
      return
    }

    await fillAllMathFields(
      canvasElement,
      user,
      makeWrongPartsForAttempt(task.solution, 1),
    )
    await submitCheck(canvasElement, user)
    await canvas.findByTestId('task-hint-1')

    await settle(DEV_STEP_DELAY_MS)
    await fillAllMathFields(
      canvasElement,
      user,
      makeWrongPartsForAttempt(task.solution, 2),
    )
    await submitCheck(canvasElement, user)
    await canvas.findByTestId('task-hint-2')
    await settle(DEV_STEP_DELAY_MS)
  }

export const makePlayHintsInTrainer = (args: MakePlayArgs) =>
  withTrackedPlay([...PLAY_CASES_HINTS], async (ctx: PlayCanvasArgs) => {
    const task = pickTask(
      args.groups,
      resolveTrainerGroup(args.groups, ctx.args?.group),
      args.fallbackTask,
    )
    const user = makeStoryUser()
    const canvas = within(ctx.canvasElement)
    const rawAnswer = getFixtureAnswerString(task.solution).trim()
    if (!rawAnswer) return

    await findCheckButton(ctx.canvasElement)
    await settle(DEV_STEP_DELAY_MS)

    const options = ctx.canvasElement.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]',
    )
    const radioOptions = Array.from(options).map((option) => option.value)
    const radioWrongValues = radioOptions.filter((value) => value !== rawAnswer)

    await runPlayStep(
      PLAY_CASES_HINTS[0].id,
      PLAY_CASES_HINTS[0].label,
      async () => {
        if (radioWrongValues.length > 0) {
          const wrongInput = findRadioByValue(
            ctx.canvasElement,
            radioWrongValues[0],
          )
          if (!wrongInput) return
          await user.click(wrongInput)
        } else {
          await fillAllMathFields(
            ctx.canvasElement,
            user,
            makeWrongPartsForAttempt(task.solution, 1),
          )
        }
        await submitCheck(ctx.canvasElement, user)
        await canvas.findByTestId('task-hint-1')
      },
    )

    if (radioWrongValues.length > 0) {
      await runPlayStep(
        PLAY_CASES_HINTS[1].id,
        PLAY_CASES_HINTS[1].label,
        async () => {
          // Radio path: only one wrong option — hint1 is enough.
          await expect(canvas.getByTestId('task-hint-1')).toBeInTheDocument()
        },
      )
      return
    }

    await runPlayStep(
      PLAY_CASES_HINTS[1].id,
      PLAY_CASES_HINTS[1].label,
      async () => {
        await settle(DEV_STEP_DELAY_MS)
        await fillAllMathFields(
          ctx.canvasElement,
          user,
          makeWrongPartsForAttempt(task.solution, 2),
        )
        await submitCheck(ctx.canvasElement, user)
        await canvas.findByTestId('task-hint-2')
        await settle(DEV_STEP_DELAY_MS)
      },
    )
  })
export const runPlayTheoryInTrainer = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement
}) => {
  const user = makeStoryUser()
  const canvas = within(canvasElement)

  const openChatButton = await canvas.findByRole('button', {
    name: 'Открыть чат',
  })
  await user.click(openChatButton)
  await canvas.findByRole('heading', { name: 'AI-чат' })

  await waitFor(() => {
    const thumbs = canvas.getAllByAltText('Video thumbnail')
    return expect(
      thumbs.some((img) =>
        (img.getAttribute('src') ?? '').includes(STORY_THEORY_VIDEO_ID),
      ),
    ).toBe(true)
  })
}

export const makePlayTheoryInTrainer = withTrackedPlay(
  [...PLAY_CASES_THEORY],
  async ({ canvasElement }) => {
    const user = makeStoryUser()
    const canvas = within(canvasElement)

    await runPlayStep(
      PLAY_CASES_THEORY[0].id,
      PLAY_CASES_THEORY[0].label,
      async () => {
        const openChatButton = await canvas.findByRole('button', {
          name: 'Открыть чат',
        })
        await user.click(openChatButton)
        await canvas.findByRole('heading', { name: 'AI-чат' })
      },
    )

    await runPlayStep(
      PLAY_CASES_THEORY[1].id,
      PLAY_CASES_THEORY[1].label,
      async () => {
        await waitFor(() => {
          const thumbs = canvas.getAllByAltText('Video thumbnail')
          return expect(
            thumbs.some((img) =>
              (img.getAttribute('src') ?? '').includes(STORY_THEORY_VIDEO_ID),
            ),
          ).toBe(true)
        })
      },
    )
  },
)

/**
 * «Верный ответ:» inside the actual chat message bubble — the
 * interaction-controls addon renders play-case descriptions in the same
 * canvasElement, and one of them contains this exact phrase, so a plain
 * `findByText` can match either. Filter to the real message.
 */
const findAnswerLabelInMessage = (canvasElement: HTMLElement) =>
  waitFor(() => {
    const canvas = within(canvasElement)
    const matches = canvas.getAllByText(/Верный ответ:/)
    const inMessage = matches.find((el) => el.closest('[class*="message"]'))
    if (!inMessage) {
      throw new Error('"Верный ответ:" not found inside a chat message')
    }
    return inMessage
  })

/** Open chat → «Показать ответ» (gallery section / local panel). */
export const runPlayShowAnswerInTrainer = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement
}) => {
  const user = makeStoryUser()
  const canvas = within(canvasElement)

  const openChatButton = await canvas.findByRole('button', {
    name: 'Открыть чат',
  })
  await user.click(openChatButton)
  await canvas.findByRole('heading', { name: 'AI-чат' })

  const showAnswer = await canvas.findByRole('button', {
    name: 'Показать ответ',
  })
  await user.click(showAnswer)
  await findAnswerLabelInMessage(canvasElement)
  await waitFor(() => {
    const calcKeys = canvasElement.querySelectorAll('[data-calc]')
    return expect(calcKeys.length).toBe(0)
  })
}

export const makePlayShowAnswerInTrainer = withTrackedPlay(
  [...PLAY_CASES_SHOW_ANSWER],
  async ({ canvasElement }) => {
    const user = makeStoryUser()
    const canvas = within(canvasElement)

    await runPlayStep(
      PLAY_CASES_SHOW_ANSWER[0].id,
      PLAY_CASES_SHOW_ANSWER[0].label,
      async () => {
        const openChatButton = await canvas.findByRole('button', {
          name: 'Открыть чат',
        })
        await user.click(openChatButton)
        await canvas.findByRole('heading', { name: 'AI-чат' })
      },
    )

    await runPlayStep(
      PLAY_CASES_SHOW_ANSWER[1].id,
      PLAY_CASES_SHOW_ANSWER[1].label,
      async () => {
        const showAnswer = await canvas.findByRole('button', {
          name: 'Показать ответ',
        })
        await user.click(showAnswer)
        const answerLabel = await findAnswerLabelInMessage(canvasElement)
        await waitFor(() => {
          const calcKeys = canvasElement.querySelectorAll('[data-calc]')
          return expect(calcKeys.length).toBe(0)
        })

        // Chat spoiler condition+answer must typeset — no raw `\(...\)` left.
        const messageRoot =
          answerLabel.closest('[class*="message"]') ?? canvasElement
        await waitForMathJax(messageRoot)
        assertNoRawMathDelimiters(messageRoot)
      },
    )
  },
)

/** Long content hides calculator (gallery section / local panel). */
export const runPlayCalcOverflowInTrainer = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement
}) => {
  await findCheckButton(canvasElement)
  await waitFor(() => {
    const calcKeys = canvasElement.querySelectorAll('[data-calc]')
    return expect(calcKeys.length).toBe(0)
  })
}

export const makePlayCalcOverflowInTrainer = withTrackedPlay(
  [...PLAY_CASES_CALC_OVERFLOW],
  async ({ canvasElement }) => {
    await runPlayStep(
      PLAY_CASES_CALC_OVERFLOW[0].id,
      PLAY_CASES_CALC_OVERFLOW[0].label,
      async () => {
        await runPlayCalcOverflowInTrainer({ canvasElement })
      },
    )
  },
)
export const makePlayOpenInTrainer = () =>
  withTrackedPlay([...PLAY_CASES_OPEN], async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await runPlayStep(
      PLAY_CASES_OPEN[0].id,
      PLAY_CASES_OPEN[0].label,
      async () => {
        const newLink = await canvas.findByRole('link', {
          name: 'Новый тренажёр',
        })
        await expect(newLink).toHaveAttribute(
          'href',
          expect.stringContaining('chapterId='),
        )
      },
    )

    await runPlayStep(
      PLAY_CASES_OPEN[1].id,
      PLAY_CASES_OPEN[1].label,
      async () => {
        const oldLink = canvas.getByRole('link', { name: 'Старый тренажёр' })
        await expect(oldLink).toHaveAttribute(
          'href',
          expect.stringContaining('old=true'),
        )
      },
    )

    await runPlayStep(
      PLAY_CASES_OPEN[2].id,
      PLAY_CASES_OPEN[2].label,
      async () => {
        const openBtn = canvas.getByRole('button', { name: 'Все задачи' })
        await userEvent.click(openBtn)
        await expect(
          canvas.getByTestId('open-trainer-tasks-table'),
        ).toBeInTheDocument()
      },
    )
  })
