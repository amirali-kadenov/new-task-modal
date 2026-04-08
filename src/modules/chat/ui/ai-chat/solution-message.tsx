import { ErrorBoundary } from '@/lib/error-boundary/error-boundary'
import type { TaskSolution } from '@/types/api/task'
import { MathText } from '@/ui/math-text/math-text'
import { SpoilerText } from '@/ui/spoiler/spoiler'

import type {
  TaskModalDependencies,
  TaskModalState,
} from '../../../task-modal/model/types/props'
import { getDescriptionTranslation } from '../../../tasks/ui/common/task-description/model/get-description-translation'

interface Props {
  solution: TaskSolution
  deps: TaskModalDependencies
  state: TaskModalState
}

export const SolutionMessage = ({ solution, deps, state }: Props) => {
  return (
    <ErrorBoundary>
      <SpoilerText>
        УСЛОВИЕ
        <br />
        {getDescriptionTranslation(state.activeTask, deps)}
        <br />
        <br />
        <b style={{ fontWeight: 'bold !important' }}>
          Верный ответ:{' '}
          <MathText inline>
            {deps.global.translateTasks(solution.answer)}
          </MathText>
        </b>
      </SpoilerText>
    </ErrorBoundary>
  )
}

// const MyVideoMessage = ({ message }: { message: MyVideoMessageType }) => {
//   const ref = useRef<HTMLIFrameElement>(null)

//   return <YoutubeVideo url={message.url} />
//   // return (
//   //   <div
//   //     key={message.id}
//   //     style={{
//   //       minHeight: 206,
//   //       height: 206,
//   //       width: 300,
//   //       borderRadius: 12,
//   //       overflow: 'hidden',
//   //     }}
//   //   >
//   //     <iframe
//   //       title="Теория"
//   //       id="video-iframe"
//   //       width="100%"
//   //       height="100%"
//   //       src={`${message.url}${message.url.includes('?p=') ? '&' : '?'}&rel=0&controls=0&modestbranding=1&showinfo=0&autoplay=0`}
//   //       allowFullScreen={true}
//   //       // allow="autoplay *"
//   //     />
//   //   </div>
//   // )
// }
