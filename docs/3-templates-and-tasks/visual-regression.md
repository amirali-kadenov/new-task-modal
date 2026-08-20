# Visual regression (Playwright)

Pixel baselines for template **Groups** / **Tasks** catalog stories — **Default** and **WithSolution** each.

## Why

Shared factories (`createSimpleTextTemplate`, MathInput, shared SCSS) affect many variants. Unit/interaction smoke do not catch layout/MathJax regressions on sibling templates. Visual suite compares PNG baselines.

## Coverage

By default (no env filters):

- All **39** templates
- **allGroups** + **allTasks**
- Two variants per item: `default` and `solution`
- ~2924 screenshots under `e2e/visual/__screenshots__/`

## Commands

Requires Storybook on port 6006 (`pnpm storybook`).

```bash
# Full catalog (long — tens of minutes)
pnpm test:visual

# One template
STORYBOOK_TEST_TEMPLATE=text/ui/plain pnpm test:visual

# Only groups or only tasks
STORYBOOK_TEST_SCOPE=allGroups pnpm test:visual
STORYBOOK_TEST_SCOPE=allTasks STORYBOOK_TEST_GRADE=4 pnpm test:visual

# Fast pilots only (text/plain + table/grid)
STORYBOOK_TEST_VISUAL_PILOTS=1 pnpm test:visual

# Update baselines after an intentional UI change
STORYBOOK_TEST_TEMPLATE=text/ui/plain pnpm test:visual:update
```

Env filters match the Testing hub: `STORYBOOK_TEST_SCOPE` (`all` → both scopes | `allGroups` | `allTasks`), `STORYBOOK_TEST_GRADE`, `STORYBOOK_TEST_TASK`, `STORYBOOK_TEST_TEMPLATE`.

Snapshot names look like `text_ui_plain__text_1__default.png` / `…__solution.png`.

## Storybook Testing hub

Open **Testing → Скриншотные проверки**. Default scope is **Все проверки** (Groups + Tasks). Prefer selecting a template for day-to-day runs. After filters are set, **Обновить эталоны** rewrites PNGs for that selection (disabled until a template is chosen).

### Per task / group

On template **Groups** / **Tasks** stories, open **Тесты** under a section:

- **Visual** — compare Default + Solution for that group/task
- **Обновить скриншоты** — rewrite baselines for that section only (`confirm` first)

After a green visual run **with a template selected**:

- **авто** — set automatically from history
- **просмотрено** — mark manually after reviewing diffs

A failed visual run clears **просмотрено** for that template. Status file: `test-artifacts/template-qa.json` (gitignored).

## Agent / developer workflow

1. Fix **one** template variant → open Groups/Tasks → **Тесты → Visual**, or `STORYBOOK_TEST_TEMPLATE=<key> pnpm test:visual`.
2. Change a **shared** factory / MathInput / shared SCSS → visual for the domain or full catalog.
3. Prefer template-local flags over changing shared defaults.
4. After updating baselines (panel button or `pnpm test:visual:update`) → re-run Visual → mark **просмотрено** in the hub.

## Storybook-vs-real-trainer parity

Separate suite: pixel-diffs the Storybook **Trainer/Correct** story against the same task on the real, locally running trainer host (`matheducator/reactjs_client` + backend) — catches drift between the two rendering paths (`content.tsx` real host vs `text-template-trainer.tsx` Storybook shell), not just template regressions.

Both sides render with the calculator force-hidden via `?calc=hidden` (see `isCalcForceHidden` in `src/modules/task-modal/model/lib/calc-visibility-param.ts`) so calc open/closed state can't cause false diffs.

Unlike the catalog suite, there are no committed baselines — the Storybook screenshot is captured fresh every run and written into a gitignored `__generated__/` dir, then the real host is asserted against it.

```bash
# Requires: pnpm storybook (6006) AND matheducator/reactjs_client + backend
# (LAUNCH_BASE, default http://localhost:8888) AND e2e/.auth.local.ts
# (copy from e2e/.auth.local.example.ts).
pnpm test:visual:trainer-parity

# Same STORYBOOK_TEST_* filters as the catalog suite
STORYBOOK_TEST_SCOPE=allGroups STORYBOOK_TEST_TEMPLATE=text/ui/plain pnpm test:visual:trainer-parity
```

Skips cleanly (per test, with a reason) when Storybook, the real host, or auth aren't available — same philosophy as `scripts/check-real-app-parity.mjs`.
