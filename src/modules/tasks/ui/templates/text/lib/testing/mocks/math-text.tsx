import type { ReactNode } from 'react'

/** Vitest mock for `@/ui/math-text/math-text` (MathJax не нужен в jsdom). */
export const MathText = ({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) => (
  <span data-testid="math-text" className={className}>
    {children}
  </span>
)
