import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'

import s from './typography-preview.module.scss'

const SAMPLES: { className: string; mixin: string; caption: string }[] = [
  { className: s.title32, mixin: 'title-32', caption: '32px/38px, weight 700' },
  { className: s.title28, mixin: 'title-28', caption: '28px/1, weight 700' },
  { className: s.title24, mixin: 'title-24', caption: '24px/1, weight 700' },
  {
    className: s.bodyLeadBold,
    mixin: 'body-lead-bold',
    caption: '24px/29px, weight 700',
  },
  {
    className: s.bodyLeadRegular,
    mixin: 'body-lead-regular',
    caption: '24px/29px, regular',
  },
  {
    className: s.bodyLargeBold,
    mixin: 'body-large-bold',
    caption: '20px/25px, weight 700',
  },
  {
    className: s.bodyLargeRegular,
    mixin: 'body-large-regular',
    caption: '20px/25px, regular',
  },
  {
    className: s.bodyMediumBold,
    mixin: 'body-medium-bold',
    caption: '18px/23px, weight 700',
  },
  {
    className: s.bodyMediumRegular,
    mixin: 'body-medium-regular',
    caption: '18px/23px, regular',
  },
  {
    className: s.bodySmallBold,
    mixin: 'body-small-bold',
    caption: '16px/21px, weight 700',
  },
  {
    className: s.bodySmallRegular,
    mixin: 'body-small-regular',
    caption: '16px/21px, regular',
  },
  {
    className: s.labelBold,
    mixin: 'label-bold',
    caption: '14px/18px, weight 700, ls 1px',
  },
  {
    className: s.labelRegular,
    mixin: 'label-regular',
    caption: '14px/18px, regular, ls 1px',
  },
  {
    className: s.captionBold,
    mixin: 'caption-bold',
    caption: '14px/18px, weight 700',
  },
  {
    className: s.captionRegular,
    mixin: 'caption-regular',
    caption: '14px/18px, regular',
  },
]

const pageStyle: CSSProperties = {
  padding: 24,
  fontFamily: 'var(--font-halvar)',
  background: 'var(--bg-canvas)',
  color: 'var(--text-primary)',
  minHeight: '100vh',
}

const TypographyPreview = () => (
  <div style={pageStyle}>
    <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700 }}>
      Typography
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {SAMPLES.map(({ className, mixin, caption }) => (
        <div key={mixin}>
          <div className={className}>The quick brown fox — 0123456789</div>
          <div
            style={{
              marginTop: 4,
              fontSize: 12,
              color: 'var(--text-secondary)',
            }}
          >
            {mixin} · {caption}
          </div>
        </div>
      ))}
    </div>
  </div>
)

const meta = {
  title: 'Design System/Typography',
  component: TypographyPreview,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TypographyPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
