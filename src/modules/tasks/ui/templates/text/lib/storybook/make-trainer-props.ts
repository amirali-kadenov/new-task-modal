import { useStore } from '@/modules/task-modal/model/store/task-modal-store'
import type { TaskModalActions } from '@/modules/task-modal/model/types/actions'
import type {
  TaskModalHostProps,
  TaskModalProps,
  TaskModalState,
} from '@/modules/task-modal/model/types/props'
import { pickTranslationText } from '@/modules/tasks/lib/translation-utils'
import type { Task, TaskSolution } from '@/types/api/task'
import type { User } from '@/types/api/api'

import { stripMathDelimiters } from '../strip-math-delimiters'
import type { TextTask } from '../types.task'

import { withoutSolution } from './text-template-story'

const translate = (value: unknown): string => {
  if (typeof value === 'string') return value
  return pickTranslationText(value)
}

const noop = () => {}
const asyncNoop = async () => {}

const GiveAttempt = 10
const ShowSolution = 20
const ShowCorrect = 30

const STORY_USER: User = {
  id: 1,
  firstname: 'Story',
  surname: 'User',
} as User

/** Per-task wrong-attempt counter for heart animation (3 → 2 → 1 → solution). */
const wrongAttemptsByTaskId = new Map<string, number>()

/** Mentor chat socket handlers registered via `joinToRoom` (Storybook echo). */
type SocketHandler = { when: string; execute: (payload: unknown) => void }
let mentorSocketHandlers: SocketHandler[] = []

/** Normalize answers for Storybook local check (strips `\(...\)`, whitespace). */
export const normalizeTrainerAnswer = (value: string): string =>
  stripMathDelimiters(value).replace(/\s+/g, '').toLowerCase()

/** Plain answer text (Translation-unwrapped) backing a fixture's `solution`. */
export const getFixtureAnswerString = (
  solution: TaskSolution | null | undefined,
): string => {
  if (solution == null || typeof solution === 'string') {
    return typeof solution === 'string' ? solution : ''
  }
  if (typeof solution.answer === 'string') return solution.answer
  if (solution.answer && typeof solution.answer === 'object') {
    return pickTranslationText(solution.answer)
  }
  return ''
}

const makeActions = (): TaskModalActions => ({
  onLoadLesson: noop,
  onTaskAnswerChanged: noop,
  onTaskDescriptionChanged: noop,
  preventClearSelectedIndexes: noop,
  onShowPrevTask: noop,
  onShowNextTask: noop,
  onShowVideoExplanation: asyncNoop,
  onCheckAnswer: asyncNoop,
  reverseAnswerForReversedTable: (answer) => answer,
  onShowSolution: asyncNoop,
  onOpenTheoryModal: noop,
  onCloseTheoryModal: noop,
  onAddTaskMistakeModalOpen: noop,
  onAddTaskMistakeModalClose: noop,
  onTimeElapsedModalClose: noop,
  isLastPenaltyTaskAtPosition: () => false,
})

const makeHostProps = (): TaskModalHostProps => ({
  lessonId: 1,
  userProgress: 50,
  fontSizeFactor: 1,
  socket: {},
  isTesting: true,
  location: {
    pathname: '/',
    search: '',
    hash: '',
    key: 'story',
  },
  history: {
    length: 1,
    action: 'POP',
    location: {
      pathname: '/',
      search: '',
      hash: '',
      state: null,
    },
    push: noop,
    replace: noop,
    go: noop,
    goBack: noop,
    goForward: noop,
    block: () => noop,
    listen: () => noop,
    createHref: () => '/',
  },
})

/** Storybook API hint strings (opt-in via `withHints`). */
export const STORY_HINT1 = 'Storybook подсказка 1'
export const STORY_HINT2 = 'Storybook подсказка 2'

/** Distinct 11-char YouTube id so plays can assert against MOCK_THEORY. */
export const STORY_THEORY_VIDEO_ID = 'TrnrStory01'
export const STORY_THEORY_VIDEO_URL = `https://youtube.com/embed/${STORY_THEORY_VIDEO_ID}`

export type MakeTrainerPropsOptions = {
  withHints?: boolean
  withTheory?: boolean
}

/** Zustand TaskModalState for a single-task Storybook trainer session (input mode). */
export const makeTrainerState = (
  task: TextTask,
  options: MakeTrainerPropsOptions = {},
): TaskModalState => {
  const inputTask = withoutSolution(task) as unknown as Task
  const withTheory = Boolean(options.withTheory)
  return {
    activeTask: inputTask,
    isLoading: false,
    tasks: [inputTask],
    isOurPupil: true,
    isStartedToday: true,
    timeLeft: null,
    hasTheory: withTheory,
    currentUser: STORY_USER as TaskModalState['currentUser'],
    selectedIndexes: [],
    lockVersion: null,
    characterTexts: {
      yourAnswerIsCorrect: ['Верно!'],
      yourAnswerIsNotCorrect: ['Попробуйте ещё раз'],
    },
    selectedCharacter: null,
    lesson: {
      id: 1,
      title: 'Storybook',
    } as unknown as TaskModalState['lesson'],
    isTheoryHide: !withTheory,
    userProgress: 50,
    isReloadPageConfirmationOpen: false,
    isTimeElapsedModalOpen: false,
    correctTextIndex: 0,
    incorrecTextIndex: 0,
    lockVersionConflict: false,
    initialTasksCount: 1,
    checkUserAnswerResult: 0,
    isShowingSolution: false,
    isShowingVideoExplanation: false,
    isVideoButtonClicked: false,
    isSaving: false,
    selectedTheory: null,
    locatedCountry: null,
  }
}

/** Reset zustand to a fresh input-mode session for `task`. */
export const resetTrainerSession = (
  task: TextTask,
  initialAnswer = '',
  options: MakeTrainerPropsOptions = {},
) => {
  wrongAttemptsByTaskId.set(task.id, 0)
  const store = useStore.getState()
  store.setState(makeTrainerState(task, options))
  store.setIsTaskLoaded(true)
  store.setAnswer(initialAnswer)
  store.setPrevAnswer(null)
  store.setIsAnswerChanged(false)
  store.setIsTransitioning(false)
  store.setAvailableTasks({})
}

/**
 * TaskModalProps for Storybook trainer shell.
 * Local checkAnswer / getTaskSolution use the fixture `task.solution`.
 */
export const makeTrainerProps = (
  task: TextTask,
  options: MakeTrainerPropsOptions = {},
): TaskModalProps => {
  const fixtureSolution = (task.solution ?? null) as TaskSolution | null
  const expectedAnswer = normalizeTrainerAnswer(
    getFixtureAnswerString(fixtureSolution),
  )
  const withHints = Boolean(options.withHints)
  const withTheory = Boolean(options.withTheory)

  const setState: TaskModalProps['setState'] = (arg) => {
    const store = useStore.getState()
    if (!store.state) return
    if (typeof arg === 'function') return
    store.setState(arg)
  }

  const closeModal = () => {
    resetTrainerSession(task, '', options)
  }

  return {
    activeTask: withoutSolution(task) as unknown as Task,
    deps: {
      api: {
        checkAnswer: async (submitted: { answer?: string | null }) => {
          const user = normalizeTrainerAnswer(String(submitted.answer ?? ''))
          const isCorrect = expectedAnswer.length > 0 && user === expectedAnswer

          if (isCorrect) {
            wrongAttemptsByTaskId.set(task.id, 0)
            return {
              result: ShowCorrect,
              userProgress: 50,
              lockVersion: 1,
              attemptsCount: 0,
              solution: null,
              hint1: null,
              hint2: null,
              penaltyTasks: [],
              newTasks: [],
            }
          }

          const next = (wrongAttemptsByTaskId.get(task.id) ?? 0) + 1
          wrongAttemptsByTaskId.set(task.id, next)

          if (next >= 3) {
            return {
              result: ShowSolution,
              userProgress: 50,
              lockVersion: 1,
              attemptsCount: 3,
              solution: fixtureSolution,
              hint1: null,
              hint2: null,
              penaltyTasks: [],
              newTasks: [],
            }
          }

          return {
            result: GiveAttempt,
            userProgress: 50,
            lockVersion: 1,
            attemptsCount: next,
            solution: null,
            hint1: withHints && next === 1 ? STORY_HINT1 : null,
            hint2: withHints && next === 2 ? STORY_HINT2 : null,
            penaltyTasks: [],
            newTasks: [],
          }
        },
        getTaskSolution: async () => ({
          solution: fixtureSolution,
          penaltyTasks: [],
          newTasks: [],
          lockVersion: 1,
        }),
        getVideoExplanation: async () => {
          const fixtureVideoId =
            (task as { videoId?: string | null }).videoId ?? null
          const fixtureVideoUrl =
            (task as { videoUrl?: string | null }).videoUrl ?? null
          const fixtureVideoTranslation =
            (task as { videoUrlAsTranslation?: unknown })
              .videoUrlAsTranslation ?? null
          const fallbackUrl =
            'https://youtube.com/embed/174g9gLVGqA?modestbranding=1&rel=0&iv_load_policy=3&playsinline=1'

          return {
            videoId: fixtureVideoId || '174g9gLVGqA',
            videoUrl: fixtureVideoUrl || fallbackUrl,
            videoUrlAsTranslation: fixtureVideoTranslation,
            solution: fixtureSolution,
            result: ShowSolution,
            attemptsCount: 3,
            locatedCountry:
              (task as { locatedCountry?: string }).locatedCountry ?? '',
            lockVersion: 1,
            penaltyTasks: [],
            newTasks: [],
          }
        },
        getExistsFreezingToday: async () => ({ existsToday: false }),
        getLastChatMessages: async () => ({ messages: [] }),
        sendChatMessage: async (text: string, type = 'text') => {
          const message = {
            id: Date.now(),
            text,
            type,
            senderUserId: STORY_USER.id,
            senderFullname: `${STORY_USER.firstname} ${STORY_USER.surname}`,
            sentAt: new Date().toISOString(),
            isFromPupil: true,
            isUnread: false,
          }
          mentorSocketHandlers
            .find((h) => h.when === 'new_chat_message_added')
            ?.execute(message)
          return message
        },
        getLessonById: async () =>
          withTheory
            ? {
                theory: [
                  {
                    type: 'video_url',
                    position: '1',
                    content: {
                      rus: STORY_THEORY_VIDEO_URL,
                      kaz: STORY_THEORY_VIDEO_URL,
                      eng: STORY_THEORY_VIDEO_URL,
                      school: STORY_THEORY_VIDEO_URL,
                    },
                  },
                ],
              }
            : { theory: [] },
      },
      global: {
        translate,
        translateTasks: translate,
        getLanguage: () => 'russian',
        getAbbreviatedLanguage: () => 'rus',
        saveLastAnswer: noop,
        getLastAnswer: () => null,
        isLanguageAzerbaijanSelected: () => false,
        isCalculatorInvisible: () => false,
        isLocationQalanSchool: () => false,
        getUser: () => STORY_USER,
        getUserId: () => STORY_USER.id,
      },
      localize: {
        checkAnswer: 'Проверить',
        next: 'Далее',
        personalStudyPage: { inFreezing: 'Freezing' },
      },
      lodash: {
        findLastIndex: <T>(
          array: T[] | null | undefined,
          predicate: (value: T, index: number, array: T[]) => boolean,
        ) => {
          if (!array?.length) return -1
          for (let i = array.length - 1; i >= 0; i -= 1) {
            if (predicate(array[i], i, array)) return i
          }
          return -1
        },
      },
      enums: {
        CheckUserAnswerResult: {
          GiveAttempt: 10,
          ShowSolution: 20,
          ShowCorrect: 30,
          ShowVideoExplanation: 40,
        },
        UserActionResult: {
          None: 'none',
          Correct: 'correct',
          Error: 'error',
          SolutionShown: 'solution_shown',
          VideoExplanationShown: 'video_explanation_shown',
          Answered: 'answered',
        },
        TaskDescriptionType: {
          Formula: 'formula',
          Text: 'text',
          Test: 'test',
          AnswerCell: 'answerCell',
          Equation: 'equation',
          Comparison: 'comparison',
          ColumnOperation: 'columnOperation',
          CalculateByImage: 'calculateByImage',
        },
        HttpStatusCode: {
          Forbid: 403,
          BadRequest: 400,
          Unauthorized: 401,
          InternalServerError: 500,
          Conflict: 409,
          NotAcceptable: 406,
          ValidationError: 422,
          BadGateway: 502,
        },
        TaskSourceType: {
          PersonalStudy: 10,
          Regular: 20,
          SelfWork: 30,
          Diagnostics: 40,
        },
        SocketCommand: {
          UserAway: 'user_away',
          UserOnline: 'user_online',
          UserOffline: 'user_offline',
          NewActiveTask: 'new_active_task',
          CloseActiveTask: 'close_active_task',
        },
        Country: {
          Russia: 'russia',
          Kazakhstan: 'kazakhstan',
        },
        Language: {
          Russian: 'russian',
          Kazakh: 'kazakh',
          Azerbaijan: 'azerbaijan',
        },
        LessonTheory: {
          VideoUrl: 'video_url',
          Text: 'text',
        },
      },
      toast: {},
      socketController: {
        joinToRoom: (
          _socket: unknown,
          _room: unknown,
          events: SocketHandler[] = [],
        ) => {
          mentorSocketHandlers = events
        },
        currentPupilRoom: () => 'story-pupil-room',
      },
      socket: {
        push: noop,
        currentPupilRoom: () => 'story-pupil-room',
        on: noop,
        off: noop,
      },
      cookies: {},
      helpers: {
        CyrillicTo: {
          default_numeral: (text: string) => text,
        },
        TaskHelper: {
          multipleTaskAnswerSeparator: ';;',
          isMultipleAnswerInputType: () => false,
          getAnswerInputsQuantity: () => 1,
          convertToArabicNumeral: (n: number) => String(n),
        },
        ArabicNumeralUtils: {
          isArabic: () => false,
          getDirection: () => 'ltr',
        },
      },
      eventEmitter: {
        emit: () => false,
        on: () => ({}),
        off: () => ({}),
      },
      alert: {
        showError: noop,
        showSuccessMessage: noop,
        showInfoMessage: noop,
        showWarningMessage: noop,
        showErrorMessage: noop,
      },
      featureFlags: {
        useMentorChatMediaApi: false,
      },
    } as unknown as TaskModalProps['deps'],
    state: makeTrainerState(task, options),
    setState,
    hostProps: makeHostProps(),
    actions: makeActions(),
    closeModal,
  }
}
