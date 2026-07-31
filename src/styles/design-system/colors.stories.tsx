import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState, type CSSProperties } from 'react'

const SEMANTIC_GROUPS: { title: string; tokens: string[] }[] = [
  {
    title: 'Background',
    tokens: [
      '--bg-canvas',
      '--bg-surface',
      '--bg-subtle',
      '--bg-disabled',
      '--bg-inverse',
      '--bg-brand',
      '--bg-brand-pressed',
      '--bg-brand-disabled',
    ],
  },
  {
    title: 'Text',
    tokens: [
      '--text-primary',
      '--text-secondary',
      '--text-tertiary',
      '--text-disabled',
      '--text-brand',
      '--text-brand-pressed',
      '--text-error',
      '--text-accent',
      '--text-on-brand',
    ],
  },
  {
    title: 'Border',
    tokens: [
      '--border-default',
      '--border-strong',
      '--border-subtle',
      '--border-focus',
      '--border-error',
    ],
  },
  {
    title: 'Status background',
    tokens: [
      '--status-bg-error',
      '--status-bg-warning',
      '--status-bg-success',
      '--status-bg-info',
    ],
  },
  {
    title: 'Status foreground',
    tokens: [
      '--status-fg-error',
      '--status-fg-warning',
      '--status-fg-success',
      '--status-fg-info',
    ],
  },
]

const PALETTE: { name: string; shades: { token: string; hex: string }[] }[] = [
  {
    name: 'Blue',
    shades: [
      { token: '$blue-900', hex: '#000a19' },
      { token: '$blue-800', hex: '#002153' },
      { token: '$blue-700', hex: '#0038bc' },
      { token: '$blue-600', hex: '#004fc5' },
      { token: '$blue-500', hex: '#0066fe' },
      { token: '$blue-400', hex: '#3d8afe' },
      { token: '$blue-300', hex: '#79a9ff' },
      { token: '$blue-200', hex: '#b6d3ff' },
      { token: '$blue-100', hex: '#ddebff' },
      { token: '$blue-50', hex: '#f4f8ff' },
    ],
  },
  {
    name: 'Orange',
    shades: [
      { token: '$orange-900', hex: '#4d1f08' },
      { token: '$orange-800', hex: '#752f0f' },
      { token: '$orange-700', hex: '#9c3f15' },
      { token: '$orange-600', hex: '#c34f1b' },
      { token: '$orange-500', hex: '#ff752c' },
      { token: '$orange-400', hex: '#ff955c' },
      { token: '$orange-300', hex: '#ffb48c' },
      { token: '$orange-200', hex: '#ffd2ba' },
      { token: '$orange-100', hex: '#ffe5d7' },
      { token: '$orange-50', hex: '#fff4ec' },
    ],
  },
  {
    name: 'Graphit',
    shades: [
      { token: '$graphit-900', hex: '#0a0a0a' },
      { token: '$graphit-800', hex: '#1a1a1a' },
      { token: '$graphit-700', hex: '#2c2c2c' },
      { token: '$graphit-600', hex: '#4a4a4a' },
      { token: '$graphit-500', hex: '#7a7a7a' },
      { token: '$graphit-400', hex: '#b4b4b4' },
      { token: '$graphit-300', hex: '#d6d6d6' },
      { token: '$graphit-200', hex: '#eaeaea' },
      { token: '$graphit-100', hex: '#f5f5f5' },
      { token: '$graphit-50', hex: '#fafafa' },
    ],
  },
  {
    name: 'Red',
    shades: [
      { token: '$red-900', hex: '#3a0a0a' },
      { token: '$red-800', hex: '#6c1111' },
      { token: '$red-700', hex: '#951a1a' },
      { token: '$red-600', hex: '#c12a24' },
      { token: '$red-500', hex: '#ff4a4a' },
      { token: '$red-400', hex: '#ff7575' },
      { token: '$red-300', hex: '#ffa5a5' },
      { token: '$red-200', hex: '#fcdcdc' },
      { token: '$red-100', hex: '#ffe7e7' },
      { token: '$red-50', hex: '#fff5f5' },
    ],
  },
  {
    name: 'Black',
    shades: [
      { token: '$black-100', hex: '#000' },
      { token: '$black-90', hex: '#1a1a1a' },
      { token: '$black-80', hex: '#2c2c2c' },
      { token: '$black-70', hex: '#4a4a4a' },
      { token: '$black-60', hex: '#7a7a7a' },
      { token: '$black-50', hex: '#9a9a9a' },
      { token: '$black-40', hex: '#b4b4b4' },
      { token: '$black-30', hex: '#d6d6d6' },
      { token: '$black-20', hex: '#eaeaea' },
      { token: '$black-10', hex: '#f5f5f5' },
    ],
  },
  {
    name: 'Yellow',
    shades: [
      { token: '$yellow-500', hex: '#fed702' },
      { token: '$yellow-400', hex: '#ffe24a' },
    ],
  },
  {
    name: 'Green',
    shades: [
      { token: '$green-800', hex: '#0a3d21' },
      { token: '$green-500', hex: '#21ef69' },
      { token: '$green-400', hex: '#33d266' },
      { token: '$green-100', hex: '#def9e7' },
    ],
  },
  {
    name: 'White',
    shades: [{ token: '$white', hex: '#fff' }],
  },
]

const pageStyle: CSSProperties = {
  padding: 24,
  fontFamily: 'var(--font-halvar)',
  background: 'var(--bg-canvas)',
  color: 'var(--text-primary)',
  minHeight: '100vh',
}

const sectionTitleStyle: CSSProperties = {
  margin: '24px 0 12px',
  fontSize: 18,
  fontWeight: 700,
}

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gap: 12,
}

const swatchStyle = (token: string): CSSProperties => ({
  height: 64,
  borderRadius: 'var(--radius-s)',
  border: '1px solid var(--border-default)',
  background: `var(${token})`,
})

const labelStyle: CSSProperties = {
  marginTop: 6,
  fontSize: 12,
  color: 'var(--text-secondary)',
  wordBreak: 'break-all',
}

const ColorsPreview = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.dataset.theme = 'dark'
    } else {
      delete root.dataset.theme
    }

    return () => {
      delete root.dataset.theme
    }
  }, [theme])

  return (
    <div style={pageStyle}>
      <button
        type="button"
        onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        style={{
          padding: '8px 16px',
          borderRadius: 'var(--radius-s)',
          border: '1px solid var(--border-default)',
          background: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Theme: {theme} (toggle)
      </button>

      <h2 style={sectionTitleStyle}>Semantic tokens</h2>
      {SEMANTIC_GROUPS.map((group) => (
        <div key={group.title}>
          <h3 style={{ ...sectionTitleStyle, fontSize: 14 }}>{group.title}</h3>
          <div style={gridStyle}>
            {group.tokens.map((token) => (
              <div key={token}>
                <div style={swatchStyle(token)} />
                <div style={labelStyle}>{token}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <h2 style={sectionTitleStyle}>Palette (SCSS reference)</h2>
      {PALETTE.map((scale) => (
        <div key={scale.name}>
          <h3 style={{ ...sectionTitleStyle, fontSize: 14 }}>{scale.name}</h3>
          <div style={gridStyle}>
            {scale.shades.map((shade) => (
              <div key={shade.token}>
                <div
                  style={{
                    ...swatchStyle('--bg-surface'),
                    background: shade.hex,
                  }}
                />
                <div style={labelStyle}>
                  {shade.token}
                  <br />
                  {shade.hex}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: 'Design System/Colors',
  component: ColorsPreview,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ColorsPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
