import { composeStories } from '@storybook/react-vite'
import { render, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import * as stories from './heart-decrease-animation.stories'

const {
  ThreeToTwo,
  TwoToOne,
  OneToZero,
  PenaltyTwoLives,
  PenaltyOneLife,
  AllVariants,
} = composeStories(stories)

describe('HeartDecreaseAnimation', () => {
  it.each([
    { Story: ThreeToTwo, asset: '3-to-2', label: '3→2' },
    { Story: TwoToOne, asset: '2-to-1', label: '2→1' },
    { Story: OneToZero, asset: '1-to-0', label: '1→0' },
    { Story: PenaltyTwoLives, asset: '2-to-1', label: 'penalty 2 lives' },
    { Story: PenaltyOneLife, asset: '1-to-0', label: 'penalty 1 life' },
  ])('renders $label webp ($asset)', ({ Story, asset }) => {
    const { container } = render(<Story />)
    const img = within(container).getByAltText('')
    expect(img).toBeInTheDocument()
    expect(img.getAttribute('src') ?? '').toMatch(new RegExp(asset))
  })

  it('renders all three variants', () => {
    const { container } = render(<AllVariants />)
    const imgs = within(container).getAllByAltText('')
    expect(imgs).toHaveLength(3)
    expect(imgs[0]?.getAttribute('src') ?? '').toMatch(/3-to-2/)
    expect(imgs[1]?.getAttribute('src') ?? '').toMatch(/2-to-1/)
    expect(imgs[2]?.getAttribute('src') ?? '').toMatch(/1-to-0/)
  })

  it('appends useId cache-bust fragment to src', () => {
    const { container, rerender, unmount } = render(
      <ThreeToTwo attemptsCount={1} livesCount={3} />,
    )
    const src1 = within(container).getByAltText('').getAttribute('src') ?? ''
    expect(src1).toMatch(/3-to-2\.webp#.+$/)

    rerender(<ThreeToTwo attemptsCount={2} livesCount={3} />)
    const src2 = within(container).getByAltText('').getAttribute('src') ?? ''
    expect(src2).toMatch(/2-to-1\.webp#.+$/)
    expect(src2).not.toBe(src1)

    const fragment1 = src1.split('#')[1]
    const fragment2 = src2.split('#')[1]
    expect(fragment2).toBe(fragment1)

    unmount()
    const { container: remounted } = render(
      <ThreeToTwo attemptsCount={1} livesCount={3} />,
    )
    const src3 = within(remounted).getByAltText('').getAttribute('src') ?? ''
    expect(src3.split('#')[1]).not.toBe(fragment1)
  })
})
