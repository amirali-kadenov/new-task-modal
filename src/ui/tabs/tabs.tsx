import { clsx } from 'clsx'
import { useState, type ReactNode } from 'react'

import styles from './tabs.module.scss'

interface Tab {
  title: string
  subtitle?: string
  content: () => ReactNode
}

interface Props {
  tabs: Tab[]
  className?: string
}

export const Tabs = ({ tabs, className }: Props) => {
  const [activeTab, setActiveTab] = useState(0)

  const ContentComponent = tabs[activeTab].content

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.header}>
        {tabs.map((tab, index) => {
          return (
            <button
              key={tab.title}
              className={clsx(styles.tab, activeTab === index && styles.active)}
              onClick={() => setActiveTab(index)}
            >
              <span className={styles.title}>{tab.title}</span>
              {tab.subtitle && (
                <span className={styles.subtitle}>{tab.subtitle}</span>
              )}
            </button>
          )
        })}
      </div>

      <div className={styles.content}>
        <ContentComponent />
      </div>
    </div>
  )
}
