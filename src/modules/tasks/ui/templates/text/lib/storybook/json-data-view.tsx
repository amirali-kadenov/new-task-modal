import type { CSSProperties } from 'react'

import type { TextTask } from '../types.task'

import type { TrainerLaunch } from './trainer-launch-links'

const preStyle: CSSProperties = {
  margin: 0,
  padding: 12,
  fontSize: 12,
  lineHeight: 1.45,
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}

const sectionStyle: CSSProperties = {
  marginBottom: 16,
}

const titleStyle: CSSProperties = {
  margin: '0 0 8px',
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
}

const pretty = (value: unknown): string => JSON.stringify(value, null, 2)

export type TaskDataContext = {
  id?: string
  group?: string
  grade?: number
  launch?: TrainerLaunch | null
  index?: number
}

type JsonBlockProps = {
  heading: string
  comment: string
  value: unknown
}

const JsonBlock = ({ heading, comment, value }: JsonBlockProps) => (
  <div style={sectionStyle}>
    <h4 style={titleStyle}>{heading}</h4>
    <pre style={preStyle}>{`// ${comment}\n${pretty(value)}`}</pre>
  </div>
)

/** One task as JSONC blocks: context / structure / solution. */
export const JsonDataView = ({
  context,
  task,
}: {
  context: TaskDataContext
  task: TextTask
}) => {
  const { solution, ...taskWithoutSolution } = task
  return (
    <div>
      <JsonBlock
        heading="Контекст"
        comment="Контекст задачи"
        value={{
          ...(context.index != null ? { index: context.index } : {}),
          id: context.id,
          group: context.group,
          grade: context.grade,
          launch: context.launch ?? undefined,
        }}
      />
      <JsonBlock
        heading="Задание"
        comment="Структура задания"
        value={taskWithoutSolution}
      />
      <JsonBlock
        heading="Ответ"
        comment="Структура ответа"
        value={solution ?? null}
      />
    </div>
  )
}

/** Numbered list of group/task JSONC sections. */
export const JsonDataList = ({
  items,
}: {
  items: Array<{
    key: string
    index: number
    label: string
    context: TaskDataContext
    task: TextTask
  }>
}) => (
  <div>
    {items.map((item) => (
      <section
        key={item.key}
        style={{
          marginBottom: 40,
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: 24,
        }}
      >
        <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>
          {item.index}. <code>{item.label}</code>
        </h3>
        <JsonDataView
          context={{ ...item.context, index: item.index }}
          task={item.task}
        />
      </section>
    ))}
  </div>
)
