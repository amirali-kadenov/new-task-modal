import { composeStories } from '@storybook/react-vite'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import * as stories from './slider.stories'

const { Default, SingleSlide } = composeStories(stories)

describe('Slider', () => {
  it('renders a pagination dot per slide', () => {
    render(<Default />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('renders one slide content and one pagination control', () => {
    render(<SingleSlide />)
    expect(screen.getByText(/Один слайд/)).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })
})
