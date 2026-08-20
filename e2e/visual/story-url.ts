/**
 * Storybook iframe URLs for template Groups / Tasks catalog stories.
 * Kept free of `@/*` so Playwright resolution stays self-contained.
 */

export const STORYBOOK_BASE =
  process.env.STORYBOOK_BASE ?? 'http://localhost:6006'

/** Storybook id sanitize: lowercase, non-alnum → `-`. */
export const sanitizeStoryIdPart = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const storyIdFromTitle = (title: string, exportName = 'all'): string =>
  `${sanitizeStoryIdPart(title)}--${sanitizeStoryIdPart(exportName)}`

/**
 * Build iframe URL with optional Storybook args (e.g. group / grade).
 * Args encoding matches Storybook's `name:value;name2:value2` form.
 */
export const templateCatalogStoryUrl = (
  storyId: string,
  args?: Record<string, string | number | undefined>,
): string => {
  const params = new URLSearchParams({
    id: storyId,
    viewMode: 'story',
  })
  if (args) {
    const parts: string[] = []
    for (const [key, value] of Object.entries(args)) {
      if (value == null || value === '') continue
      // Storybook args: spaces → `+`; keep `_` / digits as-is.
      const encoded = String(value).replace(/ /g, '+').replace(/;/g, ' ')
      parts.push(`${key}:${encoded}`)
    }
    if (parts.length > 0) params.set('args', parts.join(';'))
  }
  return `${STORYBOOK_BASE}/iframe.html?${params.toString()}`
}
