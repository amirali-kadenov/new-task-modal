import clsx from 'clsx'
import type { FC, ReactNode } from 'react'

import s from './loading-wrapper.module.scss'

interface Props {
  isLoading: boolean
  loader: FC
  children: ReactNode
  fitContent?: boolean
}

export const LoadingWrapper = ({
  isLoading,
  loader: Loader,
  children,
  fitContent,
}: Props) => {
  return (
    <>
      {isLoading && <Loader />}

      {isLoading && (
        <div className={clsx(s.invisible, fitContent && s.fitContent)}>
          {children}
        </div>
      )}

      {!isLoading && children}
    </>
  )
}
