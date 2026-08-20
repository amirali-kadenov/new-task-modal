import clsx from 'clsx'
import type { ComponentType, CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { ReactActivity } from '@/lib/wrappers/react-activity'
import { Canvas } from '@/modules/canvas/canvas'
import { Chat } from '@/modules/chat/chat'
import { useCalcSetup } from '@/modules/task-modal/model/hooks/layout/use-calc-setup'
import { useInputFocus } from '@/modules/task-modal/model/hooks/layout/use-input-focus'
import { useTaskModalRefs } from '@/modules/task-modal/model/hooks/layout/use-refs'
import { useOpenState } from '@/modules/task-modal/model/hooks/use-open-state'
import { isCalcForceHidden } from '@/modules/task-modal/model/lib/calc-visibility-param'
import { injectFonts } from '@/modules/task-modal/model/lib/fonts/inject-fonts'
import { isShellFitContent } from '@/modules/task-modal/model/lib/shell-fit-param'
import {
  useAppState,
  useStore,
} from '@/modules/task-modal/model/store/task-modal-store'
import { TaskModalProviders } from '@/modules/task-modal/providers'
import contentStyles from '@/modules/task-modal/ui/content/content.module.scss'
import { TaskModalControls } from '@/modules/task-modal/ui/content/controls/controls'
import { TaskModalHeader } from '@/modules/task-modal/ui/content/header/header'
import { TaskHints } from '@/modules/task-modal/ui/content/task-hints/task-hints'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import {
  applyTrainerState,
  type TrainerStateTab,
} from '@/modules/trainer/lib/apply-trainer-state'

import type { TextTask } from '../types.task'

import {
  makeTrainerProps,
  resetTrainerSession,
  type MakeTrainerPropsOptions,
} from './make-trainer-props'
import styles from './text-template-trainer.module.scss'

injectFonts()

interface Props {
  Template: ComponentType<TaskComponentProps<TextTask>>
  /** Fixture task; may include `solution` for local checkAnswer. */
  task: TextTask
  initialAnswer?: string
  /** Declarative trainer visual state (All States tabs). */
  stateTab?: TrainerStateTab
  /** Opt-in Storybook mocks (hints / theory). */
  trainerOptions?: MakeTrainerPropsOptions
  /**
   * When true (default), calculator stays open for visual stories.
   * Set false to exercise production overflow → close behavior.
   */
  forceCalcOpen?: boolean
}

const taskAreaStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: 'var(--space-8) var(--space-16)',
}

/**
 * Clear all registered MathQuill fields (avoids multi-input sync race on reset).
 */
const clearMathInputs = (
  mathInput: ReturnType<typeof useTaskModalRefs>['mathInput'],
) => {
  mathInput.current?.forEach((field) => {
    field.setLatex('')
  })
}

/**
 * Storybook trainer shell: header + task + actions + calculator + Chat/Canvas.
 * Mirrors TaskModal composition (Providers + content + overlays).
 */
export const TextTemplateTrainer = ({
  Template,
  task,
  initialAnswer = '',
  stateTab = 'idle',
  trainerOptions,
  forceCalcOpen = true,
}: Props) => {
  const withHints = trainerOptions?.withHints
  const withTheory = trainerOptions?.withTheory
  const resolvedOptions = useMemo(
    () => ({ withHints, withTheory }),
    [withHints, withTheory],
  )
  const baseProps = useMemo(
    () => makeTrainerProps(task, resolvedOptions),
    [task, resolvedOptions],
  )
  const refs = useTaskModalRefs()
  const chat = useOpenState(
    stateTab === 'canvasChat' || stateTab === 'videoExplanation',
  )
  const canvas = useOpenState(false)
  const [ready, setReady] = useState(false)
  const [sessionKey, setSessionKey] = useState(0)
  const fitContent = isShellFitContent(window.location.search)

  const closeTrainer = useCallback(() => {
    clearMathInputs(refs.mathInput)
    resetTrainerSession(task, '', resolvedOptions)
    setSessionKey((key) => key + 1)
  }, [refs.mathInput, task, resolvedOptions])

  const props = useMemo(
    () => ({ ...baseProps, closeModal: closeTrainer }),
    [baseProps, closeTrainer],
  )

  useEffect(() => {
    resetTrainerSession(task, initialAnswer, resolvedOptions)
    if (stateTab !== 'idle') {
      applyTrainerState(stateTab, task)
    }
    setReady(true)

    return () => {
      clearMathInputs(refs.mathInput)
      useStore.setState({
        state: null,
        answer: '',
        prevAnswer: null,
        isTaskLoaded: false,
        isAnswerChanged: false,
        isTransitioning: false,
        availableTasks: null,
      })
      setReady(false)
    }
    // refs is stable from useRef bag
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, initialAnswer, stateTab, resolvedOptions])

  if (!ready) return null

  return (
    <TaskModalProviders>
      <div className={clsx(styles.shell, fitContent && styles.shellFitContent)}>
        <TrainerBody
          key={sessionKey}
          Template={Template}
          props={props}
          refs={refs}
          chat={chat}
          canvas={canvas}
          forceCalcOpen={forceCalcOpen}
        />

        <div className={styles.overlays}>
          <ReactActivity visible={canvas.isOpen}>
            <Canvas onClose={canvas.close} />
          </ReactActivity>

          <ReactActivity visible={chat.isOpen}>
            <TrainerChat props={props} onClose={chat.close} />
          </ReactActivity>
        </div>
      </div>
    </TaskModalProviders>
  )
}

interface BodyProps {
  Template: ComponentType<TaskComponentProps<TextTask>>
  props: ReturnType<typeof makeTrainerProps>
  refs: ReturnType<typeof useTaskModalRefs>
  chat: ReturnType<typeof useOpenState>
  canvas: ReturnType<typeof useOpenState>
  forceCalcOpen: boolean
}

/** Inner body — only mounts after store.state is set (useAppState-safe). */
const TrainerBody = ({
  Template,
  props,
  refs,
  chat,
  canvas,
  forceCalcOpen,
}: BodyProps) => {
  const { activeTask } = useAppState()
  const answer = useStore((s) => s.answer)
  const setAnswer = useStore((s) => s.setAnswer)
  const setIsAnswerChanged = useStore((s) => s.setIsAnswerChanged)

  const calcState = useCalcSetup({
    refs,
    activeTask,
    isTesting: props.hostProps.isTesting,
  })
  const forcedOpenCalcState = forceCalcOpen
    ? {
        ...calcState,
        isEnabled: true,
        // Force open for visual stories; hide when solution is shown (host parity)
        isOpen: !activeTask.solution,
        isSetupFinished: true,
      }
    : calcState
  // `?calc=hidden` wins over `forceCalcOpen` — used to pixel-diff this story
  // against the live trainer with the same param (see calc-visibility-param).
  const storyCalcState = isCalcForceHidden(window.location.search)
    ? { ...forcedOpenCalcState, isEnabled: false, isOpen: false }
    : forcedOpenCalcState
  const lastFocusedInput = useInputFocus({
    refs,
    activeTask,
    calcState: storyCalcState,
  })

  const onChange = (value: string) => {
    setAnswer(value)
    setIsAnswerChanged(true)
  }

  const { root, header, taskContainer, mathInput } = refs

  return (
    <div
      ref={root}
      className={clsx('task-modal', contentStyles.container, styles.body)}
    >
      <TaskModalHeader props={props} ref={header} />

      <div style={taskAreaStyle} ref={taskContainer}>
        <Template
          task={activeTask}
          deps={props.deps}
          answer={answer}
          onChange={onChange}
          mathInput={mathInput}
        />
        <TaskHints />
      </div>

      <TaskModalControls
        props={{
          ...props,
          activeTask: activeTask,
        }}
        refs={refs}
        calcState={storyCalcState}
        lastFocusedInput={lastFocusedInput}
        modals={{ chat, canvas }}
        isAdjusting={false}
      />
    </div>
  )
}

/** Chat with live zustand `activeTask` (same as TaskModalContainer). */
const TrainerChat = ({
  props,
  onClose,
}: {
  props: ReturnType<typeof makeTrainerProps>
  onClose: () => void
}) => {
  const { activeTask } = useAppState()
  return <Chat props={{ ...props, activeTask: activeTask }} onClose={onClose} />
}
