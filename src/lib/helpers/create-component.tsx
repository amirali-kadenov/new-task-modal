import clsx from 'clsx'
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

interface Props<P extends BaseProps> {
  element?: ElementType
  className?: string
  defaultProps?: P
}

interface BaseProps {
  children?: ReactNode
  className?: string
}

export const createComponent = <P extends BaseProps>({
  element: Element = 'div',
  className,
  defaultProps,
}: Props<P>) => {
  type ComponentProps = P & ComponentPropsWithoutRef<typeof Element>

  const Component = (props: ComponentProps) => {
    return (
      <Element
        {...defaultProps}
        {...props}
        className={clsx(props.className, className)}
      />
    )
  }

  return Component
}
