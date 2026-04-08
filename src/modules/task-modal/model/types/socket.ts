import type { TextMessage } from '@/types/api/api'

export interface SocketOptions {
  timeout?: number
  transport?: unknown
  encode?: (payload: unknown, callback: (encoded: string) => void) => void
  decode?: (payload: string, callback: (decoded: unknown) => void) => void
  heartbeatIntervalMs?: number
  reconnectAfterMs?: (tries: number) => number
  logger?: (kind: string, msg: string, data: unknown) => void
  longpollerTimeout?: number
  params?: Record<string, unknown>
}

export interface Push {
  receive(status: string, callback: (response: unknown) => void): Push
  resend(timeout: number): void
  send(): void
  reset(): void
  startTimeout(): void
  trigger(status: string, response: unknown): void
}

export interface Channel {
  topic: string
  params: Record<string, unknown>
  socket: Socket
  state: string
  joinedOnce: boolean
  pushBuffer: unknown[]

  join(timeout?: number): Push
  leave(timeout?: number): Push
  on(
    event: string,
    callback: (payload: unknown, ref?: string, joinRef?: string) => void,
  ): void
  off(event: string): void
  push(event: string, payload: unknown, timeout?: number): Push
  onClose(callback: () => void): void
  onError(callback: (reason: unknown) => void): void
  onMessage(event: string, payload: unknown, ref: string): unknown

  isClosed(): boolean
  isErrored(): boolean
  isJoined(): boolean
  isJoining(): boolean
  isLeaving(): boolean
}

export interface Socket {
  disconnect(callback?: () => void, code?: number, reason?: string): void
  connect(params?: Record<string, unknown>): void
  channel(topic: string, chanParams?: Record<string, unknown>): Channel
  push(data: {
    topic: string
    event: string
    payload: unknown
    ref?: string
    join_ref?: string
  }): void
  onOpen(callback: () => void): void
  onClose(callback: (event: unknown) => void): void
  onError(callback: (error: unknown) => void): void
  onMessage(callback: (msg: unknown) => void): void
  isConnected(): boolean
  connectionState(): 'connecting' | 'open' | 'closing' | 'closed'
  log(kind: string, msg: string, data?: unknown): void
  makeRef(): string
  sendHeartbeat(): void
  flushSendBuffer(): void
}

export interface Presence {
  syncState(
    currentState: unknown,
    newState: unknown,
    onJoin?: () => void,
    onLeave?: () => void,
  ): unknown
  syncDiff(
    currentState: unknown,
    diff: { joins: unknown; leaves: unknown },
    onJoin?: () => void,
    onLeave?: () => void,
  ): unknown
  list(
    presences: unknown,
    chooser?: (key: string, pres: unknown) => unknown,
  ): unknown[]
}

interface SocketEvent {
  when: string
  execute: (payload: TextMessage) => void
}

export interface SocketController {
  currentTeacherRoom(): string
  currentPupilRoom(): string
  userPresencesRoom(): string
  connectAndSubscribeToEvents(room: string, events: SocketEvent[]): Socket
  connect(): Socket
  connectAndJoinToRoom(room: string): Socket
  joinToRoom(socket: Socket, room: string, events?: SocketEvent[]): void
  leaveFromRoom(socket: Socket, room: string, events?: SocketEvent[]): void
  push(socket: Socket, room: string, event: string, payload?: unknown): void
  disconnect(socket: Socket): void
  isConnected(socket: Socket): boolean
}
