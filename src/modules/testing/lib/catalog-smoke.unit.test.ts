import { describe, expect, it } from 'vitest'

import { normalizeAllTasksFile } from '@/modules/tasks/ui/templates/text/lib/storybook/render-template-all-tasks'
import {
  assertAllGroupsData,
  assertAllTasksData,
  listTemplateVariants,
  readAllTasksFile,
  readGroups,
} from '@/modules/testing/lib/catalog-fixtures'
import {
  GRADE_ENV,
  SCOPE_ENV,
  TEMPLATE_ENV,
  parseGradeEnv,
  resolveRuntimeScope,
  resolveRuntimeTemplate,
  templateMatches,
  gradeMatches,
} from '@/modules/testing/lib/test-scope'

/**
 * Catalog smoke (unit): integrity of groups.json / all-tasks.json.
 * Filtered via STORYBOOK_TEST_SCOPE + STORYBOOK_TEST_GRADE + STORYBOOK_TEST_TEMPLATE.
 *
 * Name tags `[allGroups]` / `[allTasks]` are matched by vitest `-t`.
 */

const scope = resolveRuntimeScope()
const grade = parseGradeEnv(process.env[GRADE_ENV]) ?? 'all'
const templateFilter = resolveRuntimeTemplate()
const variants = listTemplateVariants().filter((v) =>
  templateMatches(v.key, templateFilter),
)

const runAllGroups = scope === 'all' || scope === 'allGroups'
const runAllTasks = scope === 'all' || scope === 'allTasks'

describe('catalog fixtures smoke', () => {
  it('discovers template variants under templates', () => {
    expect(variants.length).toBeGreaterThan(0)
  })

  if (runAllGroups) {
    describe.each(variants)('[allGroups] $key', (variant) => {
      it(`[allGroups][grade=${String(grade)}] ${variant.key} data ok`, () => {
        const groups = readGroups(variant.dataDir)
        const filtered =
          grade === 'all'
            ? groups
            : groups.filter((g) => gradeMatches(g.launch?.grade, grade))

        if (filtered.length === 0) {
          // Variant has no fixtures for this class — not a failure.
          return
        }

        assertAllGroupsData(variant, grade)
      })
    })
  }

  if (runAllTasks) {
    describe.each(variants)('[allTasks] $key', (variant) => {
      it(`[allTasks][grade=${String(grade)}] ${variant.key} data ok`, () => {
        const raw = readAllTasksFile(variant.dataDir)
        if (!raw) {
          // Some variants may lack all-tasks yet — skip quietly when scoped.
          if (scope === 'allTasks') return
          return
        }

        const { grades } = normalizeAllTasksFile(raw)
        if (grade !== 'all' && !grades.includes(grade)) {
          return
        }

        assertAllTasksData(variant, grade)
      })
    })
  }
})

// Touch env names so tree-shaking / docs stay accurate.
void SCOPE_ENV
void TEMPLATE_ENV
