import { injectFonts } from '@/modules/task-modal/model/lib/fonts/inject-fonts'
import { initTestRunChannel } from '@/modules/testing/lib/test-run-store'
import type { Preview } from '@storybook/react-vite'
import { MathJaxContext, type MathJax3Config } from 'better-react-mathjax'
import type { ReactNode } from 'react'

import 'react-toastify/dist/ReactToastify.css'

import '@/styles/_index.scss'
import './buttons-reset.css'

// import './preview-overrides.css'
import './docs-overrides.css'
import './mathquill-bootstrap'
import { withRunPlayButton } from './run-play-decorator'

injectFonts()
initTestRunChannel()

/** MathJax typesetting races against unmount; swallow only that rejection. */
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const message =
      event.reason instanceof Error
        ? event.reason.message
        : String(event.reason ?? '')
    if (message.startsWith('Typesetting failed:')) {
      event.preventDefault()
    }
  })
}

const MATH_JAX_CONFIG: MathJax3Config = {
  loader: { load: ['input/tex', 'output/chtml'] },
  chtml: { matchFontHeight: false },
  options: {
    renderActions: {
      addMenu: [],
    },
  },
}

const withMathJax = (
  Story: () => ReactNode,
  context: {
    parameters: { noPadding?: boolean }
    name: string
    viewMode?: string
  },
) => {
  const isDocs = context.viewMode === 'docs'
  const noPadding =
    context.parameters.noPadding === true || context.name === 'In Trainer'

  return (
    <MathJaxContext config={MATH_JAX_CONFIG}>
      <div
        style={{
          padding: noPadding ? 0 : 24,
          background: isDocs ? 'transparent' : 'var(--bg-canvas)',
          minHeight: '100%',
        }}
      >
        <Story />
      </div>
    </MathJaxContext>
  )
}

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [withRunPlayButton, withMathJax],
  parameters: {
    viewMode: 'docs',
    layout: 'fullscreen',
    options: {
      storySort: {
        order: [
          'Documentation',
          [
            'Introduction',
            'Architecture',
            'Templates',
            'Design System',
            'Development',
            'Deployment',
          ],
          'Internals',
          [
            'Обзор',
            'Ленивая загрузка',
            'Стили',
            'Область задания',
            'Математика',
            'Монтирование',
            'Контракт с хостом',
            'Состояние',
            'Проверка ответа',
            'Шаблоны',
            'Как добавить шаблон',
            'Разрешённые задания',
            'Старый экран',
            'Переключатели',
            'Язык и направление',
            'Панели',
            'Сборка стилей',
            'Словарь',
          ],
          'Testing',
          [
            'Overview',
            'Запуск',
            'Данные и логика',
            'В окне задачи',
            'В живом приложении',
            'Падения',
          ],
          'Statistics',
          [
            'Overview',
            'Interface',
            'Tables',
            'Generation',
            'Panel',
          ],
          'Design System',
          'Templates',
          'Canvas',
          'Chat',
          'Trainer',
          'UI',
        ],
      },
    },
    backgrounds: {
      default: 'canvas',
      values: [{ name: 'canvas', value: 'var(--bg-canvas, #f5f5f5)' }],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
