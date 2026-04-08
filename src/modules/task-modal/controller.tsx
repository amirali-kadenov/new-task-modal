import { createRoot, type Root } from 'react-dom/client'

import { ErrorBoundary } from '@/lib/error-boundary/error-boundary'

import { injectFonts } from './model/lib/fonts/inject-fonts'
import type { TaskModalProps } from './model/types/props'
import { TaskModal } from './task-modal'

declare global {
  interface HTMLElement {
    instance?: Root
  }
}

const WRAPPER_ID = 'task-modal-wrapper'
const ROOT_ID = 'task-modal-root'

const removeRootElement = () => {
  const rootElement = document.getElementById(ROOT_ID)
  if (!rootElement) return

  if (rootElement.instance) rootElement.instance.unmount()

  rootElement.remove()
}

const createRootElement = () => {
  const rootElement = document.createElement('div')
  rootElement.id = ROOT_ID
  rootElement.style.cssText = 'height:100%'
  rootElement.style.position = 'relative'

  const wrapper = document.getElementById(WRAPPER_ID)
  wrapper?.appendChild(rootElement)

  return rootElement
}

const getRoot = () => {
  removeRootElement()

  const rootElement = createRootElement()
  const root = createRoot(rootElement)

  rootElement.instance = root

  return root
}

export const TaskModalController = (props: TaskModalProps) => {
  setTimeout(() => {
    injectFonts()

    const root = getRoot()

    const closeModal = () => {
      props.closeModal()
      root.unmount()
    }

    root.render(
      <ErrorBoundary>
        <TaskModal {...props} closeModal={closeModal} />
      </ErrorBoundary>,
    )
  }, 0)

  return null
}
