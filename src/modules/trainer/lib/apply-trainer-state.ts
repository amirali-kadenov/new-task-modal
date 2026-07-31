import { useAiChatStore } from '@/modules/chat/ui/ai-chat/model/ai-chat-store'
import {
  INITIAL_MESSAGES,
  MOCK_THEORY,
  VIDEO_EXPLANATION_TEXT,
} from '@/modules/chat/ui/ai-chat/model/constants'
import type { AiChatMessageType } from '@/modules/chat/ui/ai-chat/model/types'
import { useStore } from '@/modules/task-modal/model/store/task-modal-store'
import {
  getFixtureAnswerString,
  resetTrainerSession,
  STORY_HINT1,
} from '@/modules/tasks/ui/templates/text/lib/storybook'
import { stripMathDelimiters } from '@/modules/tasks/ui/templates/text/lib/strip-math-delimiters'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'

export type TrainerStateTab =
  | 'idle'
  | 'wrong'
  | 'solution'
  | 'canvasChat'
  | 'hint'
  | 'videoExplanation'

const GiveAttempt = 10
const ShowSolution = 20
const ShowVideoExplanation = 40

const FALLBACK_VIDEO_URL =
  'https://youtube.com/embed/174g9gLVGqA?modestbranding=1&rel=0&iv_load_policy=3&playsinline=1'

const answerFromSolution = (task: TextTask): string => {
  const raw = getFixtureAnswerString(task.solution).trim() || '1'
  return stripMathDelimiters(raw).trim() || '1'
}

const wrongFromSolution = (task: TextTask): string => {
  const raw = answerFromSolution(task)
  return `${raw}1`
}

const seedVideoExplanationChat = (task: TextTask, videoUrl: string) => {
  const messages: AiChatMessageType[] = [
    ...INITIAL_MESSAGES,
    MOCK_THEORY,
    {
      id: Date.now() + 1,
      text: 'Смотреть пример',
      senderUserId: 0,
      senderFullname: 'Pupil',
      sentAt: new Date().toISOString(),
      isFromPupil: true,
      type: 'text',
    },
    {
      id: Date.now() + 2,
      text: VIDEO_EXPLANATION_TEXT,
      senderUserId: 0,
      senderFullname: 'AI-чат',
      sentAt: new Date().toISOString(),
      isFromPupil: false,
      type: 'text',
    },
    {
      id: Date.now() + 3,
      type: 'my-video',
      url: videoUrl,
    },
  ]

  useAiChatStore.setState({
    taskId: task.id,
    isTheoryShown: true,
    isHintShown: true,
    isSolutionShown: false,
    messages,
  })
}

/**
 * Declaratively put the shared trainer store into a visual state for All States tabs.
 * Call after mount (after TextTemplateTrainer's resetTrainerSession).
 */
export const applyTrainerState = (tab: TrainerStateTab, task: TextTask) => {
  resetTrainerSession(task)

  if (tab === 'idle' || tab === 'canvasChat') {
    return
  }

  const store = useStore.getState()
  const baseTask = store.state?.activeTask
  if (!baseTask) return

  if (tab === 'hint') {
    const wrong = wrongFromSolution(task)
    store.setState({
      checkUserAnswerResult: GiveAttempt,
      incorrecTextIndex: 1,
      activeTask: {
        ...baseTask,
        solution: null,
        result: 'none',
        answer: wrong,
        attemptsCount: 1,
        isAnswerChanged: true,
        hint1: STORY_HINT1,
        hint2: null,
      },
    })
    store.setAnswer(wrong)
    store.setPrevAnswer(wrong)
    return
  }

  if (tab === 'wrong') {
    const wrong = wrongFromSolution(task)
    store.setState({
      checkUserAnswerResult: GiveAttempt,
      incorrecTextIndex: 1,
      activeTask: {
        ...baseTask,
        solution: null,
        result: 'none',
        answer: wrong,
        attemptsCount: 1,
        isAnswerChanged: true,
      },
    })
    store.setAnswer(wrong)
    store.setPrevAnswer(wrong)
    return
  }

  if (tab === 'solution') {
    const wrong = wrongFromSolution(task)
    store.setState({
      checkUserAnswerResult: ShowSolution,
      incorrecTextIndex: 1,
      activeTask: {
        ...baseTask,
        solution: task.solution ?? null,
        result: 'error',
        answer: wrong,
        attemptsCount: 3,
        isAnswerChanged: true,
      },
    })
    store.setAnswer(wrong)
    store.setPrevAnswer(wrong)
    return
  }

  if (tab === 'videoExplanation') {
    const fixtureVideoUrl =
      (task as { videoUrl?: string | null }).videoUrl || FALLBACK_VIDEO_URL
    const fixtureVideoId =
      (task as { videoId?: string | null }).videoId || '174g9gLVGqA'

    store.setState({
      checkUserAnswerResult: ShowVideoExplanation,
      isShowingVideoExplanation: true,
      isVideoButtonClicked: true,
      activeTask: {
        ...baseTask,
        videoUrl: fixtureVideoUrl,
        videoId: fixtureVideoId,
        solution: null,
        result: 'none',
        attemptsCount: 1,
        isAnswerChanged: false,
      },
    })

    seedVideoExplanationChat(task, fixtureVideoUrl)
  }
}
