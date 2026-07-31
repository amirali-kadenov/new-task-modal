import type { ReactNode } from 'react'

import s from './docs-diagram.module.scss'

type Props = {
  caption?: string
  children: ReactNode
}

export function DocsDiagram({ caption, children }: Props) {
  return (
    <figure className={s.figure}>
      <div className={s.diagram}>{children}</div>
      {caption && <figcaption className={s.caption}>{caption}</figcaption>}
    </figure>
  )
}

type GridProps = {
  items: Array<{ title: string; description: string }>
}

export function DocsGrid({ items }: GridProps) {
  return (
    <div className={s.grid}>
      {items.map((item) => (
        <div key={item.title} className={s.card}>
          <strong className={s.cardTitle}>{item.title}</strong>
          <span className={s.cardDescription}>{item.description}</span>
        </div>
      ))}
    </div>
  )
}

type Zone = {
  title: string
  description: string
}

type ModalWireframeProps = {
  caption?: string
  header: Zone
  condition: Zone
  answer: Zone
  actions: Zone
  panels: Zone[]
}

function ZoneBlock({ title, description, tone }: Zone & { tone?: 'header' | 'answer' | 'actions' }) {
  return (
    <div
      className={[
        s.zone,
        tone === 'header' && s.zoneHeader,
        tone === 'answer' && s.zoneAnswer,
        tone === 'actions' && s.zoneActions,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <strong className={s.zoneTitle}>{title}</strong>
      <span className={s.zoneDescription}>{description}</span>
    </div>
  )
}

export function DocsModalWireframe({
  caption,
  header,
  condition,
  answer,
  actions,
  panels,
}: ModalWireframeProps) {
  return (
    <DocsDiagram caption={caption}>
      <div className={s.wireframe}>
        <div className={s.wireframeMain}>
          <ZoneBlock {...header} tone="header" />
          <ZoneBlock {...condition} />
          <ZoneBlock {...answer} tone="answer" />
          <ZoneBlock {...actions} tone="actions" />
        </div>
        <aside className={s.wireframeSide}>
          <p className={s.sideLabel}>Панели</p>
          {panels.map((panel) => (
            <ZoneBlock key={panel.title} {...panel} />
          ))}
        </aside>
      </div>
    </DocsDiagram>
  )
}

type Step = {
  title: string
  description?: string
}

type StepsProps = {
  caption?: string
  steps: Step[]
}

export function DocsSteps({ caption, steps }: StepsProps) {
  return (
    <DocsDiagram caption={caption}>
      <ol className={s.steps}>
        {steps.map((step, index) => (
          <li key={`${index}-${step.title}`} className={s.step}>
            <span className={s.stepIndex}>{index + 1}</span>
            <div className={s.stepBody}>
              <strong className={s.stepTitle}>{step.title}</strong>
              {step.description ? (
                <span className={s.stepDescription}>{step.description}</span>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </DocsDiagram>
  )
}

export type DocsBranchNode =
  | {
      type: 'start'
      title: string
      description?: string
      next: DocsBranchNode
    }
  | {
      type: 'question'
      title: string
      description?: string
      branches: Array<{ label: string; next: DocsBranchNode }>
    }
  | {
      type: 'outcome'
      title: string
      description?: string
    }

type BranchProps = {
  caption?: string
  tree: DocsBranchNode
}

function BranchNodeView({ node }: { node: DocsBranchNode }) {
  if (node.type === 'start') {
    return (
      <div className={s.branchBlock}>
        <div className={s.branchStart}>
          <strong className={s.branchTitle}>{node.title}</strong>
          {node.description ? (
            <span className={s.branchDescription}>{node.description}</span>
          ) : null}
        </div>
        <span className={s.branchDown} aria-hidden>
          ↓
        </span>
        <BranchNodeView node={node.next} />
      </div>
    )
  }

  if (node.type === 'outcome') {
    return (
      <div className={s.branchOutcome}>
        <strong className={s.branchTitle}>{node.title}</strong>
        {node.description ? (
          <span className={s.branchDescription}>{node.description}</span>
        ) : null}
      </div>
    )
  }

  return (
    <div className={s.branchBlock}>
      <div className={s.branchQuestion}>
        <strong className={s.branchTitle}>{node.title}</strong>
        {node.description ? (
          <span className={s.branchDescription}>{node.description}</span>
        ) : null}
      </div>
      <div
        className={[s.branchFork, node.branches.length > 2 ? s.branchForkWide : '']
          .filter(Boolean)
          .join(' ')}
      >
        {node.branches.map((branch) => (
          <div key={branch.label} className={s.branchPath}>
            <span className={s.branchLabel}>{branch.label}</span>
            <span className={s.branchDown} aria-hidden>
              ↓
            </span>
            <BranchNodeView node={branch.next} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function DocsBranch({ caption, tree }: BranchProps) {
  return (
    <DocsDiagram caption={caption}>
      <div className={s.branch}>
        <BranchNodeView node={tree} />
      </div>
    </DocsDiagram>
  )
}
