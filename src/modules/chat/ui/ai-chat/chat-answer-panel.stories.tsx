import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { expect, within } from 'storybook/test'

import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'
import { joinMathAnswers } from '@/modules/tasks/ui/templates/text/lib/join-math-answers'

import { ChatAnswerPanel } from './chat-answer-panel'

const deps = makeTaskModalDeps()

const bubbleStyle: CSSProperties = {
  maxWidth: 320,
  margin: '0 auto',
  padding: '12px 16px',
  background: 'var(--bg-surface, #fff)',
  border: '1px solid var(--border-subtle, #e0e0e0)',
  borderRadius: 12,
}

const resizableBubbleStyle: CSSProperties = {
  ...bubbleStyle,
  resize: 'horizontal',
  overflow: 'auto',
  width: 320,
  minWidth: 100,
  maxWidth: '100%',
  border: '1px dashed var(--border-strong, #999)',
}

const sectionStyle: CSSProperties = {
  marginBottom: 24,
}

const labelStyle: CSSProperties = {
  margin: '0 0 8px',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary, #666)',
}

const withFrame = (): Decorator => (Story) => (
  <div style={{ padding: 16 }}>
    <Story />
  </div>
)

/** Same shape as the reported bug: a pupil typing garbage into a numeric
 * field, and the full Russian number-reading as the correct answer for
 * "прочитайте число 59114" — the correct answer must wrap, never truncate,
 * however narrow the chat bubble is. */
const GARBAGE_USER_ANSWER =
  'девятьсот пятьдесят три целых семь десятых и еще немного лишнего текста'
const LONG_CORRECT_READING = joinMathAnswers([
  'пятьдесят девять тысяч сто четырнадцать',
])

const meta = {
  title: 'Chat/AnswerPanel',
  component: ChatAnswerPanel,
  decorators: [withFrame()],
  parameters: {
    docs: {
      description: {
        component:
          'Блок «ваш / верный ответ» в пузыре AI-чата (after «Показать ответ»). Обратите внимание: `.row` ограничен `max-width: 100vw` / `375px` в SCSS — это верхняя граница, реальная ширина всё равно определяется родителем, поэтому узкий контейнер ниже её корректно сужает строку.',
      },
    },
  },
} satisfies Meta<typeof ChatAnswerPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Wrong + correct',
  render: () => (
    <div style={bubbleStyle}>
      <ChatAnswerPanel userAnswer="7" correctAnswer="12" deps={deps} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Ваш ответ:')).toBeVisible()
    await expect(canvas.getByText('Верный ответ:')).toBeVisible()
  },
}

export const Truncation: Story = {
  name: 'Answer truncation',
  parameters: {
    docs: {
      description: {
        story:
          'Длинный «ваш ответ» обрезается многоточием — он может быть произвольным мусором. Длинный «верный ответ» никогда не обрезается, а переносится: это и была основная ошибка (ответ обрезался до одной буквы). Верхний блок можно тянуть за правый нижний угол — обрезание пересчитывается и при сужении, и при расширении.',
      },
    },
  },
  render: () => (
    <>
      <div style={sectionStyle}>
        <p style={labelStyle}>
          Тяните за угол — проверка сужения/расширения строки
        </p>
        <div style={resizableBubbleStyle}>
          <ChatAnswerPanel
            userAnswer={GARBAGE_USER_ANSWER}
            correctAnswer={LONG_CORRECT_READING}
            deps={deps}
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <p style={labelStyle}>
          Длинный «ваш ответ» в узком пузыре — обрезается многоточием
        </p>
        <div style={bubbleStyle}>
          <ChatAnswerPanel
            userAnswer={GARBAGE_USER_ANSWER}
            correctAnswer=""
            deps={deps}
          />
        </div>
      </div>

      <div>
        <p style={labelStyle}>
          Длинный «верный ответ» в узком пузыре — переносится, не обрезается
        </p>
        <div style={bubbleStyle}>
          <ChatAnswerPanel
            userAnswer=""
            correctAnswer={LONG_CORRECT_READING}
            deps={deps}
          />
        </div>
      </div>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByText('Ваш ответ:').at(0)).toBeVisible()
    await expect(canvas.getAllByText('Верный ответ:').at(0)).toBeVisible()

    // The correct answer must never show a truncation ellipsis, however
    // long/narrow the bubble — only the user answer is allowed to truncate.
    const correctAnswerLabel = canvas.getAllByText('Верный ответ:').at(0)
    const correctAnswerRow = correctAnswerLabel?.closest('div')
    await expect(
      correctAnswerRow?.querySelector('[aria-hidden="true"]'),
    ).toBeNull()
  },
}
