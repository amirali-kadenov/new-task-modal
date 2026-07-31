import { composeStories } from '@storybook/react-vite'
import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  HEART_DECREASE_ANIMATION_MS,
} from './heart-decrease-animation'
import * as stories from './heart-decrease-animation.stories'

const {
  ThreeToTwo,
  TwoToOne,
  OneToZero,
  PenaltyTwoLives,
  PenaltyOneLife,
  AllVariants,
} = composeStories(stories)

afterEach(() => {
  vi.useRealTimers()
})

describe('HeartDecreaseAnimation', () => {
  it.each([
    { Story: ThreeToTwo, asset: '3-to-2', label: '3→2' },
    { Story: TwoToOne, asset: '2-to-1', label: '2→1' },
    { Story: OneToZero, asset: '1-to-0', label: '1→0' },
    { Story: PenaltyTwoLives, asset: '2-to-1', label: 'penalty 2 lives' },
    { Story: PenaltyOneLife, asset: '1-to-0', label: 'penalty 1 life' },
  ])('renders $label webp ($asset)', ({ Story, asset }) => {
    const { container } = render(<Story />)
    const img = container.querySelector('img')
    expect(img).toBeTruthy()
    expect(img?.getAttribute('src') ?? '').toMatch(new RegExp(asset))
  })

  it('renders all three variants', () => {
    const { container } = render(<AllVariants />)
    const imgs = container.querySelectorAll('img')
    expect(imgs).toHaveLength(3)
    expect(imgs[0]?.getAttribute('src') ?? '').toMatch(/3-to-2/)
    expect(imgs[1]?.getAttribute('src') ?? '').toMatch(/2-to-1/)
    expect(imgs[2]?.getAttribute('src') ?? '').toMatch(/1-to-0/)
  })

  it('calls onComplete after animation duration', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()
    render(<ThreeToTwo onComplete={onComplete} />)

    expect(onComplete).not.toHaveBeenCalled()
    vi.advanceTimersByTime(HEART_DECREASE_ANIMATION_MS - 1)
    expect(onComplete).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('resets cache-bust fragment when attemptsCount changes', () => {
    const { container, rerender } = render(
      <ThreeToTwo attemptsCount={1} livesCount={3} />,
    )
    const src1 = container.querySelector('img')?.getAttribute('src') ?? ''
    expect(src1).toMatch(/#.*-1$/)

    rerender(<ThreeToTwo attemptsCount={2} livesCount={3} />)
    const src2 = container.querySelector('img')?.getAttribute('src') ?? ''
    expect(src2).toMatch(/2-to-1/)
    expect(src2).toMatch(/#.*-2$/)
    expect(src2).not.toBe(src1)
  })
})
