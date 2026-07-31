/**
 * Storybook base for chat e2e. Chat input/file/voice flows are driven against
 * the `Chat/Chat` story (mocked API + local message list), not matheducator —
 * that app has no stable guest chat route and needs pupil auth credentials.
 */
export const STORYBOOK_BASE =
  process.env.STORYBOOK_BASE ?? 'http://localhost:6006'

export const chatStoryUrl = (storyId = 'chat-chat--default'): string =>
  `${STORYBOOK_BASE}/iframe.html?id=${storyId}&viewMode=story`
