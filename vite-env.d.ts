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
