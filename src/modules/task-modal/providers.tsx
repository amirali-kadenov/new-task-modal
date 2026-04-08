import { MathJaxContext, type MathJax3Config } from 'better-react-mathjax'

import { ReactQueryProvider } from '@/lib/providers/query-provider'

interface Props {
  children: React.ReactNode
}

const MATH_JAX_CONFIG: MathJax3Config = {
  loader: { load: ['input/tex', 'output/chtml'] },
  options: {
    renderActions: {
      addMenu: [], // disables MathJax context menu
    },
  },
}

export const TaskModalProviders = ({ children }: Props) => {
  return (
    <ReactQueryProvider>
      <MathJaxContext config={MATH_JAX_CONFIG}>{children}</MathJaxContext>
    </ReactQueryProvider>
  )
}
