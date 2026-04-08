import { useState } from 'react'

import AudioIcon from '@/assets/icons/audio/audio.svg'
import PauseIcon from '@/assets/icons/audio/pause.svg'
import PlayIcon from '@/assets/icons/audio/play.svg'
import { useAppState } from '@/modules/task-modal/model/store/task-modal-store'
import { getDescriptionTranslation } from '@/modules/tasks/ui/common/task-description/model/get-description-translation'
import { Loader } from '@/ui/loader/loader'

import type { TaskModalDependencies } from '../../task-modal/model/types/props'
import { AudioQuery } from '../model/audio-query'
import { usePlayAudio } from '../model/use-play-audio'

import styles from './audio-button.module.scss'

interface Props {
  deps: TaskModalDependencies
}

export const AudioButton = ({ deps }: Props) => {
  const { activeTask } = useAppState()
  const text = getDescriptionTranslation(activeTask, deps)

  const { data: audio, isLoading } = AudioQuery.useAudio(text, deps)

  const { isPlaying, playAudio, pauseAudio } = usePlayAudio({ audio, text })

  const [isActive, setIsActive] = useState(false)

  if (!isActive) {
    const handleClick = () => {
      setIsActive(true)
      playAudio()
    }

    return (
      <AudioIcon role="button" className={styles.audio} onClick={handleClick} />
    )
  }

  if (isLoading) {
    return <Loader className={styles.audio} variant={Loader.variants.black} />
  }

  if (isPlaying) {
    return (
      <PauseIcon role="button" className={styles.audio} onClick={pauseAudio} />
    )
  }

  return <PlayIcon role="button" className={styles.audio} onClick={playAudio} />
}
