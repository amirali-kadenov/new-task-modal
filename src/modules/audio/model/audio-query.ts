import { useQuery } from '@tanstack/react-query'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'

const NAMESPACE = 'audio'

export const AudioQuery = {
  useAudio: (text: string, deps: TaskModalDependencies) => {
    const language = deps.global.getLanguage()

    return useQuery({
      queryKey: [NAMESPACE, language, text],
      queryFn: () => fetchAudio({ deps, language, text }),
    })
  },
}

interface Args {
  deps: TaskModalDependencies
  language: string
  text: string
}

const fetchAudio = async ({ deps, text, language }: Args) => {
  try {
    const response = await deps.api.getConvertedTextToSpeech(
      language,
      deps.global.translateTasks(text),
    )

    return response
  } catch (error) {
    deps.alert.showError(error)
    return null
  }
}
