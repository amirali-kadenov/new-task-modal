import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { expect, within } from 'storybook/test'

import { injectFonts } from '@/modules/task-modal/model/lib/fonts/inject-fonts'
import { SolutionFigureType } from '@/modules/tasks/lib/solution-types'
import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'
import { joinMathAnswers } from '@/modules/tasks/ui/templates/text/lib/join-math-answers'
import {
  makeSolution,
  makeTranslation,
} from '@/modules/tasks/ui/templates/text/lib/storybook/text-template-story'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'
import { TextSolution } from '@/modules/tasks/ui/templates/text/shared/text-solution'
import fixture from '@/modules/tasks/ui/templates/text/ui/plain/data/task.json'
import { runPlayStep } from '@/testing/play-step'
import { withTrackedPlay } from '@/testing/with-tracked-play'
import {
  ALL_MATH_SYMBOLS_TEX,
  ALL_MATH_SYMBOL_TOKENS,
  SYMBOL_SECTIONS,
} from '@/ui/math-symbol-catalog'

import { SolutionAnswerPanel } from './solution-answer-panel'
import { SolutionExplanation } from './solution-explanation'

injectFonts()

const deps = makeTaskModalDeps()
const task = fixture as unknown as TextTask

/** One inline MathJax line: every catalog glyph, space-separated islands. */
const ALL_SYMBOLS_LINE = ALL_MATH_SYMBOL_TOKENS.map(
  (tex) => `\\(${tex}\\)`,
).join(' ')

const frameStyle: CSSProperties = {
  maxWidth: 375,
  margin: '0 auto',
  padding: '16px',
  background: 'var(--bg-subtle, #f5f5f5)',
  borderRadius: 12,
}

const allSymbolsFrameStyle: CSSProperties = {
  maxWidth: '100%',
  margin: '0 auto',
  padding: '16px',
  background: 'var(--bg-subtle, #f5f5f5)',
  borderRadius: 12,
  overflowX: 'auto',
}

const symbolsLineStyle: CSSProperties = {
  whiteSpace: 'nowrap',
  width: 'max-content',
  minWidth: '100%',
}

const sectionStyle: CSSProperties = {
  marginBottom: 24,
}

const sectionTitleStyle: CSSProperties = {
  margin: '28px 0 12px',
  fontSize: 16,
  fontWeight: 700,
}

const comboBlockStyle: CSSProperties = {
  marginBottom: 16,
  padding: 12,
  background: 'var(--bg-surface, #fff)',
  border: '1px solid var(--border-subtle, #e0e0e0)',
  borderRadius: 8,
}

const labelStyle: CSSProperties = {
  margin: '0 0 8px',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary, #666)',
}

const wrapTex = (tex: string) => `\\(${tex}\\)`

/** School-formula combinations: each item is its own solution block. */
const COMBINATION_SECTIONS = SYMBOL_SECTIONS.filter((section) =>
  section.title.startsWith('Комбинации'),
)

const textSolution = {
  type: 'text' as const,
  answer: makeTranslation('10000'),
  content: makeTranslation(
    'Число «десять тысяч» записывается цифрами как \\(10000\\).',
  ),
}

const formulaSolution = 'Площадь квадрата со стороной \\(a\\): \\(S = a^2\\).'

const complexSolution = {
  type: 'complex' as const,
  answer: makeTranslation('42'),
  parts: [
    {
      type: SolutionFigureType.Text,
      content: 'Сначала сложим числа:',
    },
    {
      type: SolutionFigureType.Text,
      content: '\\(20 + 22 = 42\\)',
      center: true,
    },
    {
      type: SolutionFigureType.MultipleChoice,
      variants: [
        { text: '40', correct: false },
        { text: '42', correct: true },
        { text: '44', correct: false },
      ],
    },
  ],
}

const PLAY_CASES = [
  { id: 'showsPanel', label: 'Shows answer panel labels' },
] as const

const withFrame =
  (style: CSSProperties = frameStyle): Decorator =>
  (Story) => (
    <div style={style}>
      <Story />
    </div>
  )

const meta = {
  title: 'Trainer/TaskSolution',
  component: SolutionAnswerPanel,
  parameters: {
    docs: {
      description: {
        component:
          'Общий UI решения в тренажёре: панель «ваш / правильный ответ» и блок объяснения (текст, формула, complex parts).',
      },
    },
  },
} satisfies Meta<typeof SolutionAnswerPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Panel + explanation',
  decorators: [withFrame()],
  parameters: {
    playCases: [...PLAY_CASES],
  },
  render: () => (
    <>
      <SolutionAnswerPanel
        userAnswer="1000"
        correctAnswer="10000"
        deps={deps}
      />
      <SolutionExplanation solution={textSolution} deps={deps} />
    </>
  ),
  play: withTrackedPlay([...PLAY_CASES], async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await runPlayStep('showsPanel', 'Shows answer panel labels', async () => {
      await expect(canvas.getByText('Ваш ответ:')).toBeVisible()
      await expect(canvas.getByText('Правильный ответ:')).toBeVisible()
      await expect(canvas.getByText('Объяснение')).toBeVisible()
    })
  }),
}

export const AnswerPanel: Story = {
  name: 'Answer panel',
  decorators: [withFrame()],
  render: () => (
    <>
      <div style={sectionStyle}>
        <p style={labelStyle}>Wrong + correct</p>
        <SolutionAnswerPanel userAnswer="7" correctAnswer="12" deps={deps} />
      </div>
      <div style={sectionStyle}>
        <p style={labelStyle}>Correct only</p>
        <SolutionAnswerPanel
          userAnswer=""
          correctAnswer={joinMathAnswers(['\\frac{1}{2}'])}
          deps={deps}
        />
      </div>
      <div style={sectionStyle}>
        <p style={labelStyle}>Multiline correct</p>
        <SolutionAnswerPanel
          userAnswer=""
          correctAnswer={joinMathAnswers([
            '\\frac{7}{23}',
            '\\frac{8}{23}',
            '\\frac{10}{23}',
            '\\frac{12}{23}',
            '\\frac{13}{23}',
          ])}
          deps={deps}
        />
      </div>
      <div>
        <p style={labelStyle}>User only</p>
        <SolutionAnswerPanel userAnswer="3" correctAnswer="" deps={deps} />
      </div>
    </>
  ),
}

export const Explanation: Story = {
  name: 'Explanation variants',
  decorators: [withFrame()],
  render: () => (
    <>
      <div style={sectionStyle}>
        <p style={labelStyle}>Text content</p>
        <SolutionExplanation solution={textSolution} deps={deps} />
      </div>
      <div style={sectionStyle}>
        <p style={labelStyle}>Formula string</p>
        <SolutionExplanation solution={formulaSolution} deps={deps} />
      </div>
      <div style={sectionStyle}>
        <p style={labelStyle}>Complex parts</p>
        <SolutionExplanation solution={complexSolution} deps={deps} />
      </div>
      <div>
        <p style={labelStyle}>Error</p>
        <SolutionExplanation
          solution={{ error: makeTranslation('Не удалось загрузить решение') }}
          deps={deps}
        />
      </div>
    </>
  ),
}

export const FullTemplate: Story = {
  name: 'Full text solution',
  decorators: [withFrame()],
  parameters: {
    docs: {
      description: {
        story:
          'Полный solution-view текстового шаблона: заголовок, условие, панель ответа, объяснение.',
      },
    },
  },
  render: () => {
    const solutionTask = {
      ...task,
      solution: makeSolution('10000'),
    }
    return (
      <TextSolution
        task={solutionTask}
        deps={deps}
        answer="1000"
        solution={solutionTask.solution}
      />
    )
  },
}

export const AllSymbols: Story = {
  name: 'All symbols',
  decorators: [withFrame(allSymbolsFrameStyle)],
  parameters: {
    docs: {
      description: {
        story:
          'Все математические символы в одну строку + школьные комбинации — каждая формула в своём блоке через UI решения.',
      },
    },
  },
  render: () => (
    <>
      <section>
        <h3 style={sectionTitleStyle}>Все математические символы</h3>
        <div style={symbolsLineStyle}>
          <SolutionAnswerPanel
            userAnswer={ALL_MATH_SYMBOLS_TEX}
            correctAnswer={ALL_SYMBOLS_LINE}
            deps={deps}
          />
          <SolutionExplanation solution={ALL_SYMBOLS_LINE} deps={deps} />
        </div>
      </section>

      {COMBINATION_SECTIONS.map((section) => (
        <section key={section.title}>
          <h3 style={sectionTitleStyle}>{section.title}</h3>
          {section.items.map((item) => {
            const formula = wrapTex(item.tex)
            return (
              <div
                key={`${section.title}:${item.label}`}
                style={comboBlockStyle}
              >
                <p style={labelStyle}>{item.label}</p>
                <SolutionAnswerPanel
                  userAnswer=""
                  correctAnswer={formula}
                  deps={deps}
                />
                <SolutionExplanation solution={formula} deps={deps} />
              </div>
            )
          })}
        </section>
      ))}
    </>
  ),
}
