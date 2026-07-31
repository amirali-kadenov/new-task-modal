import type { CSSProperties, ReactNode } from 'react'

/** Storybook `sanitize` (title/story → id segment). */
export const sanitizeStorySegment = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')

/** `Templates/Text/before` + `Default` → `templates-text-before--default`. */
export const toStoryId = (title: string, name: string): string =>
  `${sanitizeStorySegment(title)}--${sanitizeStorySegment(name)}`

export type StoryLinkArgs = Record<
  string,
  string | number | boolean | undefined
>

/** Encode Storybook URL args (`group:text_17;grade:4`). */
export const encodeStoryArgs = (args: StoryLinkArgs): string => {
  const parts: string[] = []
  for (const [key, value] of Object.entries(args)) {
    if (value === undefined) continue
    parts.push(`${key}:${encodeURIComponent(String(value))}`)
  }
  return parts.join(';')
}

/** In-app Storybook link: `?path=/story/...&args=...`. */
export const buildStoryHref = (
  title: string,
  name: string,
  args?: StoryLinkArgs,
): string => {
  const id = toStoryId(title, name)
  const base = `?path=/story/${id}`
  if (!args || Object.keys(args).length === 0) return base
  const encoded = encodeStoryArgs(args)
  return encoded ? `${base}&args=${encoded}` : base
}

/**
 * Base title for a template folder, e.g. `Templates/Text/before`.
 * Pass the main stories `meta.title` (without `/Tasks` etc.).
 */
export type TemplateStoryTitles = {
  root: string
  allGroups: string
  allTasks: string
  trainer: string
  data: string
}

export const templateStoryTitles = (
  rootTitle: string,
): TemplateStoryTitles => ({
  root: rootTitle,
  allGroups: `${rootTitle}/Groups`,
  allTasks: `${rootTitle}/Tasks`,
  trainer: `${rootTitle}/Trainer`,
  data: `${rootTitle}/Data`,
})

const linkStyle: CSSProperties = {
  fontSize: 13,
  color: '#2563eb',
  textDecoration: 'underline',
}

const rowStyle: CSSProperties = {
  display: 'flex',
  gap: 16,
  marginBottom: 12,
  flexWrap: 'wrap',
  alignItems: 'center',
}

type StoryLinkItem = {
  label: string
  title: string
  name: string
  args?: StoryLinkArgs
}

interface StoryDataLinksProps {
  links: StoryLinkItem[]
  className?: string
  children?: ReactNode
}

/** Internal Storybook navigation row. */
export const StoryDataLinks = ({
  links,
  className,
  children,
}: StoryDataLinksProps) => {
  if (!links.length && !children) return null

  return (
    <div className={className} style={className ? undefined : rowStyle}>
      {links.map((link) => (
        <a
          key={`${link.title}::${link.name}::${link.label}`}
          href={buildStoryHref(link.title, link.name, link.args)}
          style={linkStyle}
        >
          {link.label}
        </a>
      ))}
      {children}
    </div>
  )
}
