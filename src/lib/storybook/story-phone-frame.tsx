import type { CSSProperties, ReactNode } from 'react'

const frameStyle: CSSProperties = {
  position: 'relative',
  width: 375,
  maxWidth: '100%',
  height: 'min(100dvh, 812px)',
  margin: '0 auto',
  // A transformed ancestor is the containing block for `position: fixed`
  // descendants, so Chat/Canvas overlays stay inside the phone instead of
  // covering the whole Storybook viewport.
  transform: 'translateZ(0)',
}

/** Phone-sized frame for stories of full-screen overlays (Chat, Canvas). */
export const StoryPhoneFrame = ({ children }: { children: ReactNode }) => (
  <div style={frameStyle}>{children}</div>
)
