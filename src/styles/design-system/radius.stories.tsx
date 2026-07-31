import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'

const RADIUS_TOKENS = [
  { token: '--radius-xs', value: '4px' },
  { token: '--radius-s', value: '8px' },
  { token: '--radius-m', value: '12px' },
  { token: '--radius-l', value: '16px' },
  { token: '--radius-xl', value: '24px' },
  { token: '--radius-xxl', value: '999px' },
] as const

const pageStyle: CSSProperties = {
  padding: 24,
  fontFamily: 'var(--font-halvar)',
  background: 'var(--bg-canvas)',
  color: 'var(--text-primary)',
  minHeight: '100vh',
}

const RadiusPreview = () => (
  <div style={pageStyle}>
    <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700 }}>
      Radius
    </h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 16,
      }}
    >
      {RADIUS_TOKENS.map(({ token, value }) => (
        <div key={token} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 96,
              height: 96,
              margin: '0 auto',
              background: 'var(--bg-brand)',
              borderRadius: `var(${token})`,
            }}
          />
          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: 'var(--text-secondary)',
            }}
          >
            {token}
            <br />
            {value}
          </div>
        </div>
      ))}
    </div>
  </div>
)

const meta = {
  title: 'Design System/Radius',
  component: RadiusPreview,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof RadiusPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
