/** Vitest mock for `@/ui/math-input/math-input` (MathQuill не работает в jsdom). */
interface MockProps {
  formula?: string
  className?: string
  id?: string
}

export const MathInput = ({ formula, className, id }: MockProps) => (
  <input
    data-testid="math-input"
    data-input-id={id}
    className={className}
    defaultValue={formula}
    readOnly
  />
)
