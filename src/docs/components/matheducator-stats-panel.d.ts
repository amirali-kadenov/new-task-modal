declare module '@matheducator/StatsPanel' {
  import type { ComponentType } from 'react'

  type StatsPanelProps = {
    embedded?: boolean
    token?: string
    apiBase?: string
  }

  const StatsPanel: ComponentType<StatsPanelProps>
  export default StatsPanel
}
