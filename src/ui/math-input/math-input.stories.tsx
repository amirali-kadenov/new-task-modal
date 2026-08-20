import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type CSSProperties, type ReactNode } from 'react'

import '../../../.storybook/mathquill-bootstrap'

import {
  getMathQuillTex,
  ALL_MATH_SYMBOLS_MATHQUILL_TEX,
  isAllMathSymbolsSection,
  SYMBOL_SECTIONS,
  type SymbolSection,
} from '../math-symbol-catalog'

import { MathInput } from './math-input'

const meta = {
  title: 'Math UI/MathInput',
  component: MathInput,
  parameters: {
    docs: {
      description: {
        component:
          'Поле MathQuill для ввода и редактирования LaTeX-формул. Контролируется через `formula` / `onMathFieldChanged`.',
      },
    },
  },
} satisfies Meta<typeof MathInput>

export default meta
type Story = StoryObj<typeof meta>

const ControlledMathInput = ({
  formula: initial,
  className,
  style,
}: {
  formula: string
  className?: string
  style?: CSSProperties
}) => {
  const [formula, setFormula] = useState(initial)
  return (
    <MathInput
      formula={formula}
      onMathFieldChanged={setFormula}
      className={className}
      style={style}
    />
  )
}

export const Default: Story = {
  args: {
    formula: 'x^2',
  },
  render: (args) => <ControlledMathInput formula={args.formula ?? ''} />,
}

export const Empty: Story = {
  args: {
    formula: '',
  },
  render: (args) => <ControlledMathInput formula={args.formula ?? ''} />,
}

export const Fraction: Story = {
  args: {
    formula: '\\frac{a}{b}',
  },
  render: (args) => <ControlledMathInput formula={args.formula ?? ''} />,
}

export const Complex: Story = {
  args: {
    formula: '\\sqrt{x^2+y^2}=z',
  },
  render: (args) => <ControlledMathInput formula={args.formula ?? ''} />,
}

// ---------------------------------------------------------------------------
// Symbol catalog (MathQuill-compatible subset)
// ---------------------------------------------------------------------------

const sectionTitleStyle: CSSProperties = {
  margin: '28px 0 12px',
  fontSize: 16,
  fontWeight: 700,
}

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: 12,
}

const comboGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 12,
}

const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 12,
  background: 'var(--bg-surface, #fff)',
  border: '1px solid var(--border-subtle, #e0e0e0)',
  borderRadius: 8,
  minHeight: 88,
  maxWidth: '100%',
}

const allSymbolsWrapStyle: CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  padding: 12,
  overflowX: 'auto',
  background: 'var(--bg-surface, #fff)',
  border: '1px solid var(--border-subtle, #e0e0e0)',
  borderRadius: 8,
}

const allSymbolsFieldStyle: CSSProperties = {
  boxSizing: 'border-box',
  width: 'max-content',
  maxWidth: 'none',
  minWidth: 0,
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

const SymbolCard = ({ label, tex }: { label: string; tex: string }) => (
  <div style={cardStyle}>
    <span style={labelStyle}>{label}</span>
    <ControlledMathInput formula={tex} />
    <code style={texStyle}>{tex}</code>
  </div>
)

const mathQuillSections = (): SymbolSection[] =>
  SYMBOL_SECTIONS.map((section) => ({
    ...section,
    items: section.items.flatMap((item) => {
      const tex = getMathQuillTex(item)
      if (tex === null) return []
      return [{ ...item, tex }]
    }),
  })).filter((section) => section.items.length > 0)

const SymbolCatalog = ({
  sections,
}: {
  sections: SymbolSection[]
}): ReactNode => (
  <div style={{ maxWidth: '100%', minWidth: 0 }}>
    <p style={{ margin: '0 0 8px', color: 'var(--text-secondary, #666)' }}>
      Каталог символов и комбинаций для MathInput / MathQuill. Команды, которые
      MathQuill не поддерживает (например <code>\\angle</code>,{' '}
      <code>\\triangle</code>, индексный корень), скрыты; <code>\\dfrac</code>{' '}
      заменён на <code>\\frac</code>.
    </p>
    {sections.map((section) => {
      if (isAllMathSymbolsSection(section.title)) {
        return (
          <section
            key={section.title}
            style={{ maxWidth: '100%', minWidth: 0 }}
          >
            <h3 style={sectionTitleStyle}>{section.title}</h3>
            <div style={allSymbolsWrapStyle}>
              <ControlledMathInput
                formula={ALL_MATH_SYMBOLS_MATHQUILL_TEX}
                style={allSymbolsFieldStyle}
              />
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
              <SymbolCard
                key={`${section.title}:${item.label}`}
                label={item.label}
                tex={item.tex}
              />
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
          'Каталог операторов, дробей, корней, греческих букв и школьных комбинаций в редактируемых полях MathQuill.',
      },
    },
  },
  render: () => <SymbolCatalog sections={mathQuillSections()} />,
}
