import { getParentWithAttr } from '../../helpers'
import type { OpenState } from '../use-open-state'

import type { TaskModalRefs } from './use-refs'

type Args = {
  refs: TaskModalRefs
  calc: OpenState
}
export const handleCalcOverflow = ({ refs, calc }: Args) => {
  const taskContainer = refs.taskContainer.current
  if (!taskContainer) return () => null

  let onClick: (event: PointerEvent) => void = () => {}

  if (
    hasOverflow(taskContainer) ||
    exceedsAvailableHeight(taskContainer, refs)
  ) {
    calc.close()

    const triggerCalc = (isControl: boolean) => {
      if (isControl) {
        calc.open()
      } else {
        calc.close()
      }
    }

    onClick = getClickHandler({ onClick: triggerCalc })
  } else {
    const openOnce = (isControl: boolean) => {
      if (isControl) calc.open()
    }

    onClick = getClickHandler({ onClick: openOnce })
  }

  taskContainer.addEventListener('click', onClick)
  return () => {
    taskContainer.removeEventListener('click', onClick)
  }
}

const DATA_CONTROL = 'data-control'

interface GetClickHandlerArgs {
  onClick: (isControl: boolean) => void
}

const getClickHandler = ({ onClick }: GetClickHandlerArgs) => {
  const handler = (event: PointerEvent) => {
    const target = event.target

    const isElement = target instanceof HTMLElement
    if (!isElement) return

    const isControl = target.hasAttribute(DATA_CONTROL)
    const parentControl = getParentWithAttr(target, DATA_CONTROL)

    onClick(Boolean(isControl || parentControl))
  }

  return handler
}

const hasOverflow = (el: HTMLDivElement) => {
  return el.clientHeight < el.scrollHeight
}

// this is needed for first load
const exceedsAvailableHeight = (
  taskContainer: HTMLDivElement,
  refs: TaskModalRefs,
) => {
  const root = refs.root.current
  const header = refs.header.current
  const calc = refs.calc.current
  const actions = refs.actions.current
  //   debugger

  if (!calc || !actions || !root || !header) return

  const ROOT_PADDING_BOTTOM = 10 // padding bottom of task-modal root container

  const availableContentHeight =
    root.offsetHeight -
    header.offsetHeight -
    ROOT_PADDING_BOTTOM -
    actions.offsetHeight -
    calc.offsetHeight

  return taskContainer.offsetHeight > availableContentHeight
}
