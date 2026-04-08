import clsx from 'clsx'
import type { ReactNode, RefObject } from 'react'

import CloseIcon from '@/assets/icons/close.svg'
import ArrowBackIcon from '@/assets/icons/header/arrow-back.svg'
import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { Button, ButtonColor, ButtonLayout } from '@/ui/button/button'
import { FlexRow } from '@/ui/layout/flex-row/flex-row'

import s from './top-bar.module.scss'

interface Props {
  children: ReactNode
  deps: TaskModalDependencies
  ref?: RefObject<HTMLDivElement | null>
  className?: string
  titleClassName?: string
  onGoBack?: () => void
  onClose: () => void
}

export const TopBar = ({
  children,
  deps,
  ref,
  className,
  titleClassName,
  onGoBack,
  onClose,
}: Props) => {
  const isArabic = deps.helpers.ArabicNumeralUtils.isArabic()
  const direction = deps.helpers.ArabicNumeralUtils.getDirection()

  return (
    <FlexRow ref={ref} className={clsx(s.container, className)} dir={direction}>
      {onGoBack && (
        <Button
          color={ButtonColor.White}
          layout={ButtonLayout.Icon}
          onClick={onGoBack}
          className={s.button}
        >
          <ArrowBackIcon />
        </Button>
      )}

      <h1 className={clsx(s.title, isArabic && s.rtl, titleClassName)}>
        {children}
      </h1>

      <Button
        color={ButtonColor.White}
        layout={ButtonLayout.Icon}
        onClick={onClose}
        className={s.button}
      >
        <CloseIcon width={20} height={20} />
      </Button>
    </FlexRow>
  )
}
