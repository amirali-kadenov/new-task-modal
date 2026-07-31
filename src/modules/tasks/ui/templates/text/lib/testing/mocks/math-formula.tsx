import type { ReactNode } from 'react'

/** Vitest mock for `@/ui/math-text/math-formula`. */
export const MathFormula = ({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) => (
  <span data-testid="math-formula" className={className}>
    {children}
  </span>
)
