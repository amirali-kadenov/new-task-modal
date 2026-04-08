import { AnimatePresence, motion, type Variants } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'

import { ChatLayoutSkeleton } from './chat-layout-skeleton'
import s from './chat-layout.module.scss'

interface Props {
  isLoading?: boolean
  messageNodes: ReactNode[]
  messageKeys: number[]
  children: ReactNode
}

export const ChatLayout = ({
  isLoading,
  messageNodes,
  messageKeys,
  children,
}: Props) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!messagesEndRef.current) return

    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messageNodes.length])

  return (
    <div className={s.body}>
      {isLoading ? (
        <ChatLayoutSkeleton key="skeleton" />
      ) : (
        <motion.ul
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
          className={s.messages}
        >
          <AnimatePresence mode="popLayout">
            {messageNodes.map((node, index) => (
              <motion.li
                className={s.item}
                key={messageKeys[index]}
                layout
                variants={ITEM_VARIANTS}
              >
                {node}
              </motion.li>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </motion.ul>
      )}

      {children}
    </div>
  )
}

// CONSTANTS

const ANIMATION_DURATION = 0.12

const CONTAINER_VARIANTS: Variants = {
  visible: {
    transition: {
      staggerChildren: ANIMATION_DURATION,
    },
  },
}

const ITEM_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(4px)',
    transition: { duration: ANIMATION_DURATION, ease: 'easeOut' },
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(4px)',
    transition: { duration: ANIMATION_DURATION, ease: 'easeIn' },
  },
}
