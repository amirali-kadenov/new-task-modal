import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'

const SPACING_TOKENS = [
  { token: '--space-4', px: 4 },
  { token: '--space-8', px: 8 },
  { token: '--space-12', px: 12 },
  { token: '--space-16', px: 16 },
  { token: '--space-24', px: 24 },
  { token: '--space-32', px: 32 },
  { token: '--space-40', px: 40 },
  { token: '--space-48', px: 48 },
  { token: '--space-64', px: 64 },
  { token: '--space-128', px: 128 },
] as const

const pageStyle: CSSProperties = {
  padding: 24,
  fontFamily: 'var(--font-halvar)',
  background: 'var(--bg-canvas)',
  color: 'var(--text-primary)',
  minHeight: '100vh',
}

const SpacingPreview = () => (
  <div style={pageStyle}>
    <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700 }}>
      Spacing
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {SPACING_TOKENS.map(({ token, px }) => (
        <div
          key={token}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 140,
              fontSize: 12,
              color: 'var(--text-secondary)',
              flexShrink: 0,
            }}
          >
            {token}
            <br />
            {px}px
          </div>
          <div
            style={{
              width: `var(${token})`,
              height: 24,
              background: 'var(--bg-brand)',
              borderRadius: 'var(--radius-xs)',
            }}
          />
        </div>
      ))}
    </div>
  </div>
)

const meta = {
  title: 'Design System/Spacing',
  component: SpacingPreview,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SpacingPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
