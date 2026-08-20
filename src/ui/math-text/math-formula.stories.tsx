import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'

import {
  isAllMathSymbolsSection,
  SYMBOL_SECTIONS,
  type SymbolEntry,
  type SymbolSection,
} from '../math-symbol-catalog'

import { MathFormula } from './math-formula'

const meta = {
  title: 'Math UI/MathFormula',
  component: MathFormula,
  parameters: {
    docs: {
      description: {
        component:
          'Хелпер над MathText: оборачивает строку LaTeX в `\\(...\\)` для инлайн-рендера.',
      },
    },
  },
} satisfies Meta<typeof MathFormula>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'x^2 + y^2',
  },
}

export const Fraction: Story = {
  args: {
    children: '\\frac{n}{m}',
  },
}

export const Sqrt: Story = {
  args: {
    children: '\\sqrt{2}',
  },
}

export const Long: Story = {
  name: 'Long expression',
  args: {
    children: '(a+b)^2 = a^2 + 2ab + b^2',
  },
}

const sectionTitleStyle: CSSProperties = {
  margin: '28px 0 12px',
  fontSize: 16,
  fontWeight: 700,
}

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: 12,
}

const comboGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 12,
}

const wrapRowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '8px 12px',
  alignItems: 'center',
  maxWidth: '100%',
}

const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 12,
  background: 'var(--bg-surface, #fff)',
  border: '1px solid var(--border-subtle, #e0e0e0)',
  borderRadius: 8,
  minHeight: 72,
  maxWidth: '100%',
  overflow: 'hidden',
}

const labelStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary, #666)',
}

const texStyle: CSSProperties = {
  fontSize: 11,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  color: 'var(--text-tertiary, #888)',
  wordBreak: 'break-all',
}

const SymbolCard = ({ label, tex }: SymbolEntry) => (
  <div style={cardStyle}>
    <span style={labelStyle}>{label}</span>
    <MathFormula>{tex}</MathFormula>
    <code style={texStyle}>{tex}</code>
  </div>
)

const SymbolCatalog = ({
  sections,
}: {
  sections: SymbolSection[]
}): ReactNode => (
  <div>
    <p style={{ margin: '0 0 8px', color: 'var(--text-secondary, #666)' }}>
      Каталог символов и комбинаций через MathFormula (сырой LaTeX без ручной
      обёртки <code>\\(...\\)</code>).
    </p>
    {sections.map((section) => {
      if (isAllMathSymbolsSection(section.title)) {
        return (
          <section key={section.title}>
            <h3 style={sectionTitleStyle}>{section.title}</h3>
            <div style={{ ...cardStyle, ...wrapRowStyle }}>
              {section.items.map((item) => (
                <MathFormula key={item.tex}>{item.tex}</MathFormula>
              ))}
            </div>
          </section>
        )
      }
      const isCombo = section.title.startsWith('Комбинации')
      return (
        <section key={section.title}>
          <h3 style={sectionTitleStyle}>{section.title}</h3>
          <div style={isCombo ? comboGridStyle : gridStyle}>
            {section.items.map((item) => (
              <SymbolCard key={`${section.title}:${item.label}`} {...item} />
            ))}
          </div>
        </section>
      )
    })}
  </div>
)

export const AllSymbols: Story = {
  name: 'All symbols & combinations',
  parameters: {
    docs: {
      description: {
        story:
          'Тот же каталог, что у MathText, но через MathFormula — проверка автообёртки в \\(...\\).',
      },
    },
  },
  render: () => <SymbolCatalog sections={SYMBOL_SECTIONS} />,
}
