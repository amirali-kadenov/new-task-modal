import type { MathInputRef } from '@/ui/math-input/types'

import type { MathInputRefType } from '../model/types'

import { setMathInputRef } from './set-math-input-ref'

type Args = {
  onChange: (answer: string) => void
  separator: string
  mathInput: MathInputRefType
}

export const getMultipleInputHandlers = ({
  onChange,
  separator,
  mathInput,
}: Args) => {
  const setRef = (ref: MathInputRef | null) => setMathInputRef(ref, mathInput)

  const handleChange = () => {
    const inputMap = mathInput.current
    if (!inputMap) return

    const values: string[] = []

    inputMap.forEach((item) => {
      values.push(item.getLatex())
    })

    const answer = values.join(separator)
    onChange(answer)
  }

  return {
    setRef,
    handleChange,
  }
}
