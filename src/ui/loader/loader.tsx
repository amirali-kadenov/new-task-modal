import clsx from 'clsx'
import { type SVGProps } from 'react'

import Spinner from '@/assets/icons/spinner.svg'
import type { VariantsRecord } from '@/types/utils'

import styles from './loader.module.scss'

type Variants = 'white' | 'black'

type Props = SVGProps<SVGSVGElement> & {
  variant?: Variants
}

export const Loader = ({ variant, className, ...props }: Props) => {
  return (
    <Spinner
      className={clsx(styles.loader, className, variant && styles[variant])}
      {...props}
    />
  )
}

const Variants: VariantsRecord<Variants> = {
  white: 'white',
  black: 'black',
}

Loader.variants = Variants
