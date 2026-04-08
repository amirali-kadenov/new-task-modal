import { createComponent } from '@/lib/helpers/create-component'

import styles from './input.module.scss'

export const Input = createComponent({
  className: styles.input,
  element: 'input',
})

export const InputAsSpan = createComponent({
  className: styles.input,
  element: 'span',
})
