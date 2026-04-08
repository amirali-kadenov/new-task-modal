import { useRef, type CSSProperties } from 'react'

import { useOnModalDotSelected } from '../../model/hooks/api/use-on-modal-dot-selected'
import type { TaskModalProps } from '../../model/types/props'

import { TaskModalDotList } from './task-modal-dot-list'

interface Props {
  modalProps: TaskModalProps
}

const style: CSSProperties = {
  height: 'auto',
  position: 'fixed',
  bottom: 0,
  opacity: 0.5,
  borderTop: '1px solid blue',
  borderRadius: 0,
}

export const OldProgressBar = ({ modalProps }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  const onModalDotSelected = useOnModalDotSelected({
    props: modalProps,
  })

  return (
    <div className="task-modal" style={style} ref={ref}>
      <div className="modal-body" style={{ padding: 0 }}>
        <TaskModalDotList
          style={{ margin: 0 }}
          taskModalProps={modalProps}
          onSelected={onModalDotSelected}
        />
      </div>
    </div>
  )
}
