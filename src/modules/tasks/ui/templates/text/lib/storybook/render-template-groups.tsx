import type { ComponentType, ReactNode } from 'react'

import type { TaskComponentProps } from '@/modules/tasks/model/types'

import type { TextTask } from '../types.task'

import { CatalogUpdateSnapshotsButton } from './catalog-update-snapshots-button'
import { TaskSectionTestPanel } from './task-section-test-panel'
import { TaskVerifiedCheckbox } from './task-verified-checkbox'
import { TextTemplateStory, withoutSolution } from './text-template-story'
import { TrainerLaunchLinks, type TrainerLaunch } from './trainer-launch-links'

export interface TemplateGroupFixture {
  group: string
  count?: number
  task: TextTask
  launch?: TrainerLaunch
  /** All taskIds in this structural group with launch coords for OpenInTrainer. */
  tasks?: TemplateGroupTaskRef[]
}

export type TemplateGroupTaskRef = {
  id: string
  launch: TrainerLaunch
}

interface Props {
  Template: ComponentType<TaskComponentProps<TextTask>>
  groups: TemplateGroupFixture[]
  /** Main template title, e.g. `Templates/Text/before`. */
  rootTitle?: string
}

const variantLabelStyle = {
  margin: '0 0 8px',
  fontSize: 12,
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
}

const Variant = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) => (
  <div style={{ marginBottom: 20 }}>
    <div style={variantLabelStyle}>{label}</div>
    {children}
  </div>
)

const MissingSolution = ({ group }: { group: string }) => (
  <div style={{ color: '#b91c1c', fontSize: 13 }}>
    Missing <code>task.solution</code> for <code>{group}</code> — regenerate
    groups with <code>generate-text-template-groups.mjs</code>.
  </div>
)

/** Рендерит structural groups: Default + WithSolution на каждую. */
export const RenderTemplateGroups = ({
  Template,
  groups,
  rootTitle,
}: Props) => {
  return (
    <div>
      <CatalogUpdateSnapshotsButton rootTitle={rootTitle} scope="allGroups" />
      {groups.map(({ group, count, task, launch }, index) => {
        return (
          <section
            key={group}
            data-group={group}
            style={{
              marginBottom: 48,
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: 32,
            }}
          >
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>
              {index + 1}. <code>{group}</code>
              {count != null ? (
                <span
                  style={{ marginLeft: 8, color: '#6b7280', fontWeight: 400 }}
                >
                  ({count})
                </span>
              ) : null}
            </h3>

            <div data-visual-hide="">
              <TaskVerifiedCheckbox rootTitle={rootTitle} taskId={task.id} />
              <TrainerLaunchLinks launch={launch} />
            </div>

            <div data-visual-target="default">
              <Variant label="Default">
                <TextTemplateStory
                  Template={Template}
                  task={withoutSolution(task)}
                />
              </Variant>
            </div>

            <div data-visual-target="solution">
              <Variant label="WithSolution">
                {task.solution ? (
                  <TextTemplateStory Template={Template} task={task} />
                ) : (
                  <MissingSolution group={group} />
                )}
              </Variant>
            </div>

            <div data-visual-hide="">
              <TaskSectionTestPanel
                Template={Template}
                task={task}
                sectionKey={`all-groups:${group}`}
                rootTitle={rootTitle}
              />
            </div>
          </section>
        )
      })}
    </div>
  )
}
