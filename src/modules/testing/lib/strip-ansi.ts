/**
 * Strip ANSI / CSI escape sequences from terminal output for plain-text UI logs.
 * Vitest uses dim (`[2m`) / reset (`[22m`) etc.; without this they show as junk.
 */
const ANSI_RE =
  // eslint-disable-next-line no-control-regex -- intentional: strip ESC control sequences
  /[\u001B\u009B][[\]()#;?]*(?:(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~])|(?:\d{1,4}(?:;\d{0,4})*[ -/]*[@-~]))/g

export const stripAnsi = (text: string): string => text.replace(ANSI_RE, '')
