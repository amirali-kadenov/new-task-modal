import { MathText } from '@/ui/math-text/math-text'

import { prepareAdornment } from '../lib/prepare-adornment'

interface Props {
  value: string
  className?: string
  'data-testid'?: string
}

/** Renders an answerInput before/after label without italicizing plain prose. */
export const TextAdornment = ({
  value,
  className,
  'data-testid': testId,
}: Props) => {
  const prepared = prepareAdornment(value)
  if (!prepared.text) return null

  if (prepared.kind === 'plain') {
    return (
      <span data-testid={testId} className={className}>
        {prepared.text}
      </span>
    )
  }

  return (
    <span data-testid={testId} className={className}>
      <MathText inline>{prepared.text}</MathText>
    </span>
  )
}
