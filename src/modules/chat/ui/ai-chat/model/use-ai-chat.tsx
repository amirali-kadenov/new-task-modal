import { useEffect } from 'react'

import { useShowSolution } from '@/modules/task-modal/model/hooks/api/use-show-solution'
import { useShowVideoExplanation } from '@/modules/task-modal/model/hooks/api/use-show-video-explanation'
import { useTheory } from '@/modules/task-modal/model/hooks/api/use-theory'
import { useAppState } from '@/modules/task-modal/model/store/task-modal-store'
import type { TaskModalProps } from '@/modules/task-modal/model/types/props'

import { createTextMessage } from '../../../model/helpers'
import { SolutionMessage } from '../solution-message'

import { useAiChatStore } from './ai-chat-store'
import {
  INITIAL_MESSAGES,
  MOCK_THEORY,
  VIDEO_EXPLANATION_TEXT,
} from './constants'
import { translateContent } from './lib'
import type { MyVideoMessageType } from './types'

interface Args {
  props: TaskModalProps
}

export const useAiChat = ({ props }: Args) => {
  const state = useAppState()
  const { locatedCountry, activeTask } = state
  const { deps } = props
  const user = deps.global.getUser()

  const {
    messages,
    isHintShown,
    isSolutionShown,
    isTheoryShown,
    taskId,
    setIsHintShown,
    setIsSolutionShown,
    setIsTheoryShown,
    addMessages,
    reset,
  } = useAiChatStore()

  useEffect(() => {
    if (activeTask.id !== taskId) {
      reset(activeTask.id)
    }
  }, [activeTask.id, taskId, reset])

  const showSolution = useShowSolution({ props })
  const showVideoExplanation = useShowVideoExplanation({ props })

  const isTheorySet = useTheory({
    props,
    isTheoryShown,
    onLoad: (theory) => {
      const url = theory?.content
        ? translateContent(theory.content, deps, locatedCountry)
        : null

      const theoryMessage = url
        ? ({
            id: Date.now(),
            type: 'my-video',
            url: url,
          } as MyVideoMessageType)
        : MOCK_THEORY

      addMessages(...INITIAL_MESSAGES, theoryMessage)

      setIsTheoryShown(true)
    },
  })

  const handleViewExample = async () => {
    setIsHintShown(true)

    addMessages({
      id: Date.now(),
      text: 'Смотреть пример',
      senderUserId: 0,
      senderFullname: 'Pupil',
      sentAt: new Date().toISOString(),
      isFromPupil: true,
      type: 'text',
    })

    await showVideoExplanation((response) => {
      const exampleVideo: MyVideoMessageType = response.videoUrl
        ? {
            id: 0,
            type: 'my-video',
            url: response.videoUrl,
          }
        : {
            id: 0,
            type: 'my-video',
            url: 'https://youtube.com/embed/174g9gLVGqA?modestbranding=1&rel=0&iv_load_policy=3&playsinline=1',
          }

      addMessages(
        {
          id: Date.now(),
          text: VIDEO_EXPLANATION_TEXT,
          senderUserId: 0,
          senderFullname: 'AI-чат',
          sentAt: new Date().toISOString(),
          isFromPupil: false,
          type: 'text',
        },
        exampleVideo,
      )
    })
  }

  const handleShowAnswer = async () => {
    setIsSolutionShown(true)

    addMessages({
      id: Date.now(),
      text: 'Показать ответ',
      senderUserId: 0,
      senderFullname: 'Pupil',
      sentAt: new Date().toISOString(),
      isFromPupil: true,
      type: 'text',
    })

    await showSolution({
      onSuccess: (response) => {
        addMessages({
          id: Date.now(),
          text: (
            <SolutionMessage
              solution={response.solution}
              deps={deps}
              state={state}
            />
          ),
          senderUserId: 0,
          senderFullname: 'AI-чат',
          sentAt: new Date().toISOString(),
          isFromPupil: false,
          type: 'text',
        })
      },
    })
  }

  const handleSend = (text: string) => {
    const newMessage = createTextMessage(text, user)
    addMessages(newMessage)
  }

  return {
    messages,
    isTheorySet,
    isHintShown,
    isSolutionShown,
    handleSend,
    handleViewExample,
    handleShowAnswer,
    addMessages,
  }
}
