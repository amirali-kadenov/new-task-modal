import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'

import {
  SYMBOL_SECTIONS,
  type SymbolEntry,
  type SymbolSection,
} from '../math-symbol-catalog'

import { MathText } from './math-text'

const meta = {
  title: 'UI/MathText',
  component: MathText,
  parameters: {
    docs: {
      description: {
        component:
          'Рендер MathJax: блочная или инлайн-формула. В `children` — LaTeX (часто в `\\(...\\)`).',
      },
    },
  },
} satisfies Meta<typeof MathText>

export default meta
type Story = StoryObj<typeof meta>

export const Block: Story = {
  args: {
    children: '\\(x^2 + y^2 = z^2\\)',
  },
}

export const Inline: Story = {
  args: {
    children: 'Формула \\(a + b\\) в тексте',
    inline: true,
  },
}

export const Mixed: Story = {
  name: 'Mixed prose',
  args: {
    children: 'Если \\(a = 2\\) и \\(b = 3\\), то \\(a + b = 5\\).',
    inline: true,
  },
}

export const Fraction: Story = {
  args: {
    children: '\\(\\dfrac{1}{2} + \\dfrac{1}{3} = \\dfrac{5}{6}\\)',
  },
}

export const Complex: Story = {
  args: {
    children: '\\(\\sqrt{a^2 + b^2} = c\\)',
  },
}

const wrap = (tex: string) => `\\(${tex}\\)`

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

const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 12,
  background: 'var(--bg-surface, #fff)',
  border: '1px solid var(--border-subtle, #e0e0e0)',
  borderRadius: 8,
  minHeight: 72,
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
    <MathText inline>{wrap(tex)}</MathText>
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
      Каталог символов и комбинаций, которые MathText / MathJax должен корректно
      отрисовывать (калькулятор + типичные школьные формулы).
    </p>
    {sections.map((section) => {
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
          'Полный каталог операторов, сравнений, дробей, корней, греческих букв и типовых комбинаций для визуальной проверки MathJax.',
      },
    },
  },
  render: () => <SymbolCatalog sections={SYMBOL_SECTIONS} />,
}
