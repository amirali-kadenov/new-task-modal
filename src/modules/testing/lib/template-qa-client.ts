/**
 * Client-side template QA badge state (Storybook channel ↔ preset).
 */

import { useCallback, useEffect, useState } from 'react'
import { addons } from 'storybook/preview-api'

import {
  EVENTS,
  type QaListResultPayload,
  type QaSetReviewedResultPayload,
  type TemplateQaEntry,
} from './test-runner-events'

let cache: TemplateQaEntry[] = []
const listeners = new Set<() => void>()
let channelBound = false

const emitLocal = () => {
  for (const listener of listeners) listener()
}

const setCache = (entries: TemplateQaEntry[]) => {
  cache = entries
  emitLocal()
}

const ensureChannel = () => {
  if (channelBound || typeof window === 'undefined') return
  channelBound = true
  const channel = addons.getChannel()
  channel.on(EVENTS.QA_LIST_RESULT, (payload: QaListResultPayload) => {
    setCache(payload?.entries ?? [])
  })
  channel.on(
    EVENTS.QA_SET_REVIEWED_RESULT,
    (payload: QaSetReviewedResultPayload) => {
      if (payload?.entries) setCache(payload.entries)
    },
  )
}

export const refreshTemplateQa = (): void => {
  ensureChannel()
  addons.getChannel().emit(EVENTS.QA_LIST, {})
}

export const setTemplateReviewedClient = (
  template: string,
  reviewed: boolean,
  opts?: { note?: string; runId?: string },
): void => {
  ensureChannel()
  addons.getChannel().emit(EVENTS.QA_SET_REVIEWED, {
    template,
    reviewed,
    note: opts?.note,
    runId: opts?.runId,
  })
}

export const useTemplateQa = (
  template: string,
): TemplateQaEntry | undefined => {
  ensureChannel()
  const [, bump] = useState(0)
  useEffect(() => {
    const listener = () => bump((n) => n + 1)
    listeners.add(listener)
    refreshTemplateQa()
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const key = template.trim()
  if (!key) return undefined
  return cache.find((e) => e.template === key)
}

export const useTemplateQaActions = (template: string) => {
  const markReviewed = useCallback(() => {
    if (!template.trim()) return
    setTemplateReviewedClient(template, true)
  }, [template])
  const clearReviewed = useCallback(() => {
    if (!template.trim()) return
    setTemplateReviewedClient(template, false)
  }, [template])
  return { markReviewed, clearReviewed }
}
