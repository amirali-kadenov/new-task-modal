import { getParentWithAttr } from '../../helpers'
import type { OpenState } from '../use-open-state'

import type { TaskModalRefs } from './use-refs'

const DATA_CONTROL = 'data-control'

type Args = {
  refs: TaskModalRefs
  calc: OpenState
}

/**
 * Overflow layout: keep calc closed to free vertical space, reopen when the
 * pupil targets an answer control (`data-control`) via click or focusin.
 *
 * Listeners are attached before the initial close so an early click/focus is
 * not lost (race with React effect timing / e2e).
 */
export const handleCalcOverflow = ({ refs, calc }: Args) => {
  const taskContainer = refs.taskContainer.current
  if (!taskContainer) return () => null

  const isOverflowing =
    hasOverflow(taskContainer) ||
    Boolean(exceedsAvailableHeight(taskContainer, refs))

  const onControlGesture = (isControl: boolean) => {
    if (isOverflowing) {
      if (isControl) {
        calc.open()
      } else {
        calc.close()
      }
      return
    }

    if (isControl) {
      calc.open()
    }
  }

  const onClick = getControlGestureHandler({
    onGesture: onControlGesture,
  })
  const onFocusIn = getControlGestureHandler({
    onGesture: (isControl) => {
      // Focus only opens; never close on focus moving within the task.
      if (isControl) calc.open()
    },
  })

  taskContainer.addEventListener('click', onClick)
  taskContainer.addEventListener('focusin', onFocusIn)

  if (isOverflowing) {
    const active = document.activeElement
    const controlFocused =
      active instanceof HTMLElement &&
      (active.hasAttribute(DATA_CONTROL) ||
        Boolean(getParentWithAttr(active, DATA_CONTROL)))

    if (controlFocused) {
      calc.open()
    } else {
      calc.close()
    }
  }

  return () => {
    taskContainer.removeEventListener('click', onClick)
    taskContainer.removeEventListener('focusin', onFocusIn)
  }
}

interface GetControlGestureHandlerArgs {
  onGesture: (isControl: boolean) => void
}

const getControlGestureHandler = ({
  onGesture,
}: GetControlGestureHandlerArgs) => {
  const handler = (event: Event) => {
    const target = event.target

    const isElement = target instanceof HTMLElement
    if (!isElement) return

    const isControl = target.hasAttribute(DATA_CONTROL)
    const parentControl = getParentWithAttr(target, DATA_CONTROL)

    onGesture(Boolean(isControl || parentControl))
  }

  return handler
}

const hasOverflow = (el: HTMLDivElement) => {
  return el.clientHeight < el.scrollHeight
}

/** Exported for unit tests / Storybook overflow asserts. */
export const hasTaskContainerOverflow = hasOverflow

// this is needed for first load
const exceedsAvailableHeight = (
  taskContainer: HTMLDivElement,
  refs: TaskModalRefs,
) => {
  const root = refs.root.current
  const header = refs.header.current
  const calc = refs.calc.current
  const actions = refs.actions.current

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
