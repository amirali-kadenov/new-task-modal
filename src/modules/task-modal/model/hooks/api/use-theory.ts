import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

import type { Theory } from '@/types/api/api'

import { useSetAppState } from '../../store/task-modal-store'
import type { TaskModalProps } from '../../types/props'

interface Args {
  props: TaskModalProps
  onLoad: (theory: Theory | undefined) => void
  isTheoryShown: boolean
}

const NAMESPACE = 'lesson'

export const useTheory = ({ props, onLoad, isTheoryShown }: Args) => {
  const setAppState = useSetAppState()
  const { deps, hostProps } = props
  const { global, api, alert, enums } = deps
  const { LessonTheory } = enums
  const { lessonId, personalStudyItemId, applicationType } = hostProps

  const language = useMemo(() => {
    const abbrLanguage = global.getAbbreviatedLanguage()
    return global.isLocationQalanSchool() && abbrLanguage === 'rus'
      ? 'school'
      : abbrLanguage
  }, [global])

  const { data, isSuccess, isFetched, error, isError } = useQuery({
    queryKey: [NAMESPACE, lessonId, language],
    queryFn: () => api.getLessonById(lessonId!, language),
    enabled: !!lessonId && !isTheoryShown,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (isError && error) {
      alert.showError(error)
    }
  }, [isError, error])

  useEffect(() => {
    if (isSuccess && data && !isTheoryShown) {
      const theory = data.theory.filter(
        (item) => item.type === LessonTheory.VideoUrl,
      )

      setAppState({
        lesson: { ...data, theory },
        selectedTheory: theory[0],
        locatedCountry: data.locatedCountry,
      })

      onLoad(theory[0])

      if (personalStudyItemId) {
        void api.addCoinForTheory(
          lessonId!,
          personalStudyItemId,
          applicationType,
        )
      }
    }
  }, [isSuccess, data, isTheoryShown])

  return isFetched || isTheoryShown
}
