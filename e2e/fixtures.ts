/**
 * Live-trainer e2e fixtures — one entry per template variant under
 * `src/modules/tasks/ui/templates/.../data/`.
 *
 * Built at import time from `groups.json` (+ `task.json` fallback).
 * See `load-template-fixtures.ts`.
 */

export {
  loadTemplateFixtures,
  loadAllTasksFixtures,
  loadScopedTemplateFixtures,
  TEMPLATE_FIXTURES,
  SCOPED_TEMPLATE_FIXTURES,
  type TemplateFixture,
} from './load-template-fixtures'
