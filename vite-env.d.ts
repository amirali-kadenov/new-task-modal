/// <reference types="vite-plugin-svgr/client" />
// import 'react'
declare module '*.svg' {
  import * as React from 'react'
  const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default content
}

declare global {
  interface Window {
    FlutterJS: {
      postMessage: (message: string) => void
    }
  }
}

interface ImportMetaEnv {
  readonly VITE_LAUNCH_BASE?: string
  readonly VITE_STATS_STATIC?: string
  readonly VITE_MATH_EDUCATOR_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
