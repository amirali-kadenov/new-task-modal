/**
 * Enter trainer answers via the on-screen calculator (`button[data-calc]`),
 * matching what a pupil does. Used by live-app e2e — not Storybook.
 *
 * Only the new-modal calculator is supported (tasks in available-tasks mapping).
 * Calculator mounts only after an answer field is focused (`calcState.isOpen`).
 */
import { expect, type Locator, type Page } from '@playwright/test'

/**
 * Minimal shape of the MathQuill browser global used inside `page.evaluate`
 * callbacks. Mirrors `src/ui/math-input/types.ts`, but declared locally
 * because `e2e/tsconfig.json` doesn't include `src/**`, so that global
 * augmentation isn't visible to this program.
 */
interface MathQuillFieldHandle {
  focus?: () => void
  keystroke?: (key: string) => void
  latex?: (latex?: string) => string
}

type MathQuillGetField = (
  el: HTMLElement,
) => MathQuillFieldHandle | null | undefined

declare global {
  interface Window {
    MathQuill?: {
      getInterface: (version: number) => MathQuillGetField
    }
  }
}

const OR_ALTERNATIVE_SEPARATOR = '||'
const MULTI_ANSWER_SEPARATOR = ';;'

/** MAIN panel order in `model/symbols/main.ts` (stable layout index). */
const MAIN_KEY_INDEX: Record<string, number> = {
  '<': 0,
  '>': 1,
  '≠': 2,
  '\\neq': 2,
  '=': 3,
  Delete: 4,
  Fraction: 5,
  '\\frac': 5,
  '7': 6,
  '8': 7,
  '9': 8,
  Divide: 9,
  ':': 9,
  '\\div': 9,
  '÷': 9,
  'x²': 10,
  '^2': 10,
  '4': 11,
  '5': 12,
  '6': 13,
  Multi: 14,
  '\\cdot': 14,
  '·': 14,
  '×': 14,
  'x³': 15,
  '^3': 15,
  '1': 16,
  '2': 17,
  '3': 18,
  Minus: 19,
  '-': 19,
  '( )': 20,
  ';': 21,
  '0': 22,
  ',': 23,
  '.': 23,
  Plus: 24,
  '+': 24,
}

/** `data-calc-key` / aria-label values from Keyboard (`symbol.label`). */
const MAIN_KEY_LABEL: Record<string, string> = {
  '<': '<',
  '>': '>',
  '≠': '≠',
  '\\neq': '≠',
  '=': '=',
  Delete: 'Delete',
  Fraction: 'Fraction',
  '\\frac': 'Fraction',
  '7': '7',
  '8': '8',
  '9': '9',
  Divide: 'Divide',
  ':': 'Divide',
  '\\div': 'Divide',
  '÷': 'Divide',
  'x²': 'x²',
  '^2': 'x²',
  '4': '4',
  '5': '5',
  '6': '6',
  Multi: 'Multi',
  '\\cdot': 'Multi',
  '·': 'Multi',
  '×': 'Multi',
  'x³': 'x³',
  '^3': 'x³',
  '1': '1',
  '2': '2',
  '3': '3',
  Minus: 'Minus',
  '-': 'Minus',
  '( )': '( )',
  ';': ';',
  '0': '0',
  ',': ',',
  '.': ',',
  Plus: 'Plus',
  '+': 'Plus',
}

type CalcToken =
  | { kind: 'main'; key: string }
  | { kind: 'letter'; letter: string }
  | { kind: 'frac'; num: string; den: string }
  | { kind: 'parens'; inner: string }
  | { kind: 'nav'; key: 'ArrowDown' | 'ArrowRight' | 'ArrowLeft' }

export const taskDialog = (page: Page): Locator => page.getByRole('dialog')

/** `||` → first alternative; `;;` → one part per input field. */
export const answerParts = (answer: string): string[] => {
  const primary = answer.split(OR_ALTERNATIVE_SEPARATOR)[0]?.trim() ?? answer
  return primary
    .split(MULTI_ANSWER_SEPARATOR)
    .map((part) => part.trim())
    .filter(Boolean)
}

const resolveAnswerFields = async (page: Page): Promise<Locator> => {
  const dialog = taskDialog(page)
  const primary = dialog.locator('[data-input]')
  await primary.first().waitFor({ state: 'visible', timeout: 15_000 })
  return primary
}

const fieldAt = (page: Page, fieldIndex: number): Locator =>
  taskDialog(page).locator('[data-input]').nth(fieldIndex)

/**
 * Calculator mounts only after a `data-control` click/focus (overflow may close
 * it on tall tasks).
 *
 * `refocus: true` — click the target field (use when switching inputs).
 * `refocus: false` — only reopen calc if missing; avoid re-clicking between
 * digits (that moves the MathQuill cursor to the start).
 */
const ensureCalculatorOpen = async (
  page: Page,
  fieldIndex: number,
  { refocus = true }: { refocus?: boolean } = {},
): Promise<void> => {
  const calcKey = taskDialog(page).locator('button[data-calc]').first()

  const clickField = async () => {
    for (let tryClick = 0; tryClick < 8; tryClick += 1) {
      try {
        await resolveAnswerFields(page)
        const field = fieldAt(page, fieldIndex)
        await field.scrollIntoViewIfNeeded().catch(() => undefined)
        await field.click({ force: true, timeout: 3_000 })
        return
      } catch {
        await page.waitForTimeout(300)
      }
    }
    const field = fieldAt(page, fieldIndex)
    await field.click({ force: true, timeout: 5_000 })
  }

  if (refocus) {
    await clickField()
    await page.waitForTimeout(150)
  }

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (await calcKey.isVisible().catch(() => false)) {
      return
    }
    // Calc closed (overflow) — must click a field to reopen.
    await clickField()
    await page.waitForTimeout(250)
  }

  await calcKey.waitFor({ state: 'visible', timeout: 5_000 })
}

/**
 * Slider slides: 0 = letters, 1 = main (`calculator.tsx` order; INITIAL=1).
 * Pagination is the sibling of `.keen-slider`.
 */
const setCalcSlide = async (
  page: Page,
  fieldIndex: number,
  index: 0 | 1,
): Promise<void> => {
  await ensureCalculatorOpen(page, fieldIndex, { refocus: false })
  await page.evaluate((slideIndex) => {
    const slider = document.querySelector('[role="dialog"] .keen-slider')
    if (!slider?.parentElement) {
      throw new Error('Calculator slider not found')
    }
    const pagination = slider.parentElement.querySelector(
      '[class*="pagination"]',
    )
    const dots = pagination?.querySelectorAll(':scope > button')
    const dot = dots?.[slideIndex]
    if (!(dot instanceof HTMLElement)) {
      throw new Error(`Calculator pagination dot ${slideIndex} not found`)
    }
    dot.click()
  }, index)
  await page.waitForTimeout(300)
}

const pressMainKey = async (
  page: Page,
  fieldIndex: number,
  key: string,
): Promise<void> => {
  await setCalcSlide(page, fieldIndex, 1)
  const label = MAIN_KEY_LABEL[key] ?? key
  const index = MAIN_KEY_INDEX[key]
  if (index == null) {
    throw new Error(`No calculator main-key mapping for ${JSON.stringify(key)}`)
  }

  await page.evaluate(
    ({ label: keyLabel, index: keyIndex }) => {
      const byLabel = document.querySelector(
        `[role="dialog"] button[data-calc][data-calc-key="${keyLabel}"], [role="dialog"] button[data-calc][aria-label="${keyLabel}"]`,
      )
      if (byLabel instanceof HTMLElement) {
        byLabel.click()
        return
      }

      const slides = [
        ...document.querySelectorAll('[role="dialog"] .keen-slider__slide'),
      ]
      const main =
        slides[1] ??
        slides.find((slide) =>
          [...slide.querySelectorAll('[data-calc]')].some(
            (btn) => btn.textContent?.trim() === '7',
          ),
        )
      if (!main) {
        throw new Error('Main calculator slide not found')
      }
      const buttons = [...main.querySelectorAll('[data-calc]')]
      const button = buttons[keyIndex]
      if (!(button instanceof HTMLElement)) {
        throw new Error(
          `Calculator key ${JSON.stringify(keyLabel)} index ${keyIndex} missing (have ${buttons.length})`,
        )
      }
      button.click()
    },
    { label, index },
  )
}

const pressLetter = async (
  page: Page,
  fieldIndex: number,
  letter: string,
): Promise<void> => {
  const lower = letter.toLowerCase()
  await setCalcSlide(page, fieldIndex, 0)
  await page.evaluate((ch) => {
    const byLabel = document.querySelector(
      `[role="dialog"] button[data-calc][data-calc-key="${ch}"], [role="dialog"] button[data-calc][aria-label="${ch}"]`,
    )
    if (byLabel instanceof HTMLElement) {
      byLabel.click()
      return
    }

    const slides = [
      ...document.querySelectorAll('[role="dialog"] .keen-slider__slide'),
    ]
    const letters = slides[0]
    if (!letters) {
      throw new Error('Letters calculator slide not found')
    }
    const match = [...letters.querySelectorAll('[data-calc]')].find(
      (btn) => btn.textContent?.trim().toLowerCase() === ch,
    )
    if (!(match instanceof HTMLElement)) {
      throw new Error(
        `Letter key ${JSON.stringify(ch)} not found on calculator`,
      )
    }
    match.click()
  }, lower)
  await setCalcSlide(page, fieldIndex, 1)
}

const readBraced = (
  input: string,
  start: number,
): { value: string; next: number } => {
  if (input[start] !== '{') {
    throw new Error(`Expected '{' at ${start} in ${JSON.stringify(input)}`)
  }
  let depth = 0
  for (let i = start; i < input.length; i += 1) {
    if (input[i] === '{') depth += 1
    if (input[i] === '}') {
      depth -= 1
      if (depth === 0) {
        return { value: input.slice(start + 1, i), next: i + 1 }
      }
    }
  }
  throw new Error(`Unclosed '{' in ${JSON.stringify(input)}`)
}

/** Tokenize one answer part into calculator actions. */
export const tokenizeAnswerPart = (raw: string): CalcToken[] => {
  const input = raw.replace(/\s+/g, ' ').trim()
  const tokens: CalcToken[] = []
  let i = 0

  while (i < input.length) {
    if (input[i] === ' ') {
      i += 1
      continue
    }

    if (input.startsWith('\\frac', i)) {
      i += '\\frac'.length
      const num = readBraced(input, i)
      const den = readBraced(input, num.next)
      tokens.push({ kind: 'frac', num: num.value, den: den.value })
      i = den.next
      continue
    }

    if (input.startsWith('\\cdot', i)) {
      tokens.push({ kind: 'main', key: '\\cdot' })
      i += '\\cdot'.length
      continue
    }

    if (input.startsWith('\\neq', i)) {
      tokens.push({ kind: 'main', key: '\\neq' })
      i += '\\neq'.length
      continue
    }

    if (input.startsWith('\\div', i)) {
      tokens.push({ kind: 'main', key: ':' })
      i += '\\div'.length
      continue
    }

    if (input[i] === '\\') {
      const m = input.slice(i).match(/^\\[a-zA-Z]+/)
      throw new Error(
        `Unsupported LaTeX command in answer: ${m?.[0] ?? '\\'} (full: ${JSON.stringify(raw)})`,
      )
    }

    if (input[i] === '(') {
      let depth = 0
      let j = i
      for (; j < input.length; j += 1) {
        if (input[j] === '(') depth += 1
        if (input[j] === ')') {
          depth -= 1
          if (depth === 0) {
            tokens.push({ kind: 'parens', inner: input.slice(i + 1, j) })
            i = j + 1
            break
          }
        }
      }
      if (depth !== 0) {
        throw new Error(`Unclosed '(' in ${JSON.stringify(raw)}`)
      }
      continue
    }

    const ch = input[i]

    if (/[0-9]/.test(ch)) {
      tokens.push({ kind: 'main', key: ch })
      i += 1
      continue
    }

    if (/[a-zA-Z]/.test(ch)) {
      tokens.push({ kind: 'letter', letter: ch })
      i += 1
      continue
    }

    if ('<>≠=+-,;:.·×÷'.includes(ch)) {
      tokens.push({
        kind: 'main',
        key: ch === '·' || ch === '×' ? '\\cdot' : ch,
      })
      i += 1
      continue
    }

    throw new Error(
      `Cannot map character ${JSON.stringify(ch)} in answer ${JSON.stringify(raw)}`,
    )
  }

  return tokens
}

/**
 * Move the MathQuill cursor without Playwright `page.keyboard` — native
 * key events steal focus onto Check and can submit an answer mid-fill.
 */
const mqKeystroke = async (
  page: Page,
  fieldIndex: number,
  key: string,
): Promise<void> => {
  await page.evaluate(
    ({ index, keystroke }) => {
      const el = document.querySelectorAll('[role="dialog"] [data-input]')[
        index
      ]
      if (!(el instanceof HTMLElement) || !window.MathQuill) {
        throw new Error(`MathInput ${index} missing for keystroke`)
      }
      const field = window.MathQuill.getInterface(2)(el)
      field?.focus?.()
      field?.keystroke?.(keystroke)
    },
    { index: fieldIndex, keystroke: key },
  )
}

const playTokens = async (
  page: Page,
  fieldIndex: number,
  tokens: CalcToken[],
): Promise<void> => {
  for (const token of tokens) {
    switch (token.kind) {
      case 'main':
        await pressMainKey(page, fieldIndex, token.key)
        break
      case 'letter':
        await pressLetter(page, fieldIndex, token.letter)
        break
      case 'frac': {
        await pressMainKey(page, fieldIndex, 'Fraction')
        await playTokens(page, fieldIndex, tokenizeAnswerPart(token.num))
        await mqKeystroke(page, fieldIndex, 'Tab')
        await playTokens(page, fieldIndex, tokenizeAnswerPart(token.den))
        await mqKeystroke(page, fieldIndex, 'Tab')
        break
      }
      case 'parens': {
        await pressMainKey(page, fieldIndex, '( )')
        await playTokens(page, fieldIndex, tokenizeAnswerPart(token.inner))
        await mqKeystroke(page, fieldIndex, 'Right')
        break
      }
      case 'nav': {
        const mqKey =
          token.key === 'ArrowRight'
            ? 'Right'
            : token.key === 'ArrowLeft'
              ? 'Left'
              : token.key === 'ArrowDown'
                ? 'Down'
                : token.key
        await mqKeystroke(page, fieldIndex, mqKey)
        break
      }
      default: {
        const _exhaustive: never = token
        throw new Error(`Unknown token ${JSON.stringify(_exhaustive)}`)
      }
    }
  }
}

/**
 * If React `answer` lagged behind MathQuill, re-fire edit by re-applying the
 * current latex (no Playwright keyboard — that was wiping fields / submitting).
 */
const waitForMathQuill = async (page: Page): Promise<void> => {
  await page.waitForFunction(
    () => typeof window.MathQuill?.getInterface === 'function',
    undefined,
    { timeout: 10_000 },
  )
}

const readFieldLatex = async (
  page: Page,
  fieldIndex: number,
): Promise<string | null> => {
  return page.evaluate((index) => {
    if (typeof window.MathQuill?.getInterface !== 'function') return null
    const el = document.querySelectorAll('[role="dialog"] [data-input]')[index]
    if (!(el instanceof HTMLElement)) return null
    try {
      const field = window.MathQuill.getInterface(2)(el)
      return field?.latex?.() ?? ''
    } catch {
      return null
    }
  }, fieldIndex)
}

/** Normalize latex/answer for loose equality (digits and ops). */
const normalizeLatex = (value: string): string =>
  value.replace(/\\,/g, '').replace(/\s+/g, '').replace(/\{\}/g, '')

const expectedLatexLooksFilled = (
  latex: string | null,
  expectedPart: string,
): boolean => {
  if (latex == null || latex === '') return false
  const got = normalizeLatex(latex)
  const want = normalizeLatex(expectedPart)
  if (!want) return got.length > 0
  return got.includes(want) || want.includes(got)
}

const syncFieldLatexToStore = async (
  page: Page,
  fieldIndex: number,
): Promise<void> => {
  const checkButton = page.getByRole('button', {
    name: /Проверить|Тексеру/,
  })
  if (await checkButton.isEnabled()) return

  await waitForMathQuill(page)

  await page.evaluate((index) => {
    const el = document.querySelectorAll('[role="dialog"] [data-input]')[index]
    if (!(el instanceof HTMLElement) || !window.MathQuill) return
    const field = window.MathQuill.getInterface(2)(el)
    const latex = field?.latex?.() ?? ''
    if (!latex) return
    field?.focus?.()
    // Re-set identical latex to trigger MQ edit → onMathFieldChanged.
    field?.latex?.(latex)
  }, fieldIndex)
  await page.waitForTimeout(150)
}

const clearFieldViaCalculator = async (
  page: Page,
  fieldIndex: number,
): Promise<void> => {
  await ensureCalculatorOpen(page, fieldIndex, { refocus: true })
  for (let i = 0; i < 24; i += 1) {
    await pressMainKey(page, fieldIndex, 'Delete')
  }
}

const fillPartsOnce = async (page: Page, parts: string[]): Promise<void> => {
  await waitForMathQuill(page)
  for (const [index, part] of parts.entries()) {
    await resolveAnswerFields(page)
    await waitForMathQuill(page)
    await ensureCalculatorOpen(page, index, { refocus: true })
    await playTokens(page, index, tokenizeAnswerPart(part))
    await syncFieldLatexToStore(page, index)
  }
}

const waitUntilCheckReadyOrLatex = async (
  page: Page,
  parts: string[],
): Promise<boolean> => {
  const checkButton = page.getByRole('button', {
    name: /Проверить|Тексеру/,
  })
  const deadline = Date.now() + 5_000
  while (Date.now() < deadline) {
    if (await checkButton.isEnabled().catch(() => false)) return true
    let allFilled = true
    for (let index = 0; index < parts.length; index += 1) {
      const latex = await readFieldLatex(page, index)
      if (!expectedLatexLooksFilled(latex, parts[index])) {
        allFilled = false
        break
      }
    }
    if (allFilled) {
      for (let index = 0; index < parts.length; index += 1) {
        await syncFieldLatexToStore(page, index)
      }
      if (await checkButton.isEnabled().catch(() => false)) return true
    }
    await page.waitForTimeout(200)
  }
  return checkButton.isEnabled().catch(() => false)
}

const dumpFieldLatex = async (page: Page): Promise<string> => {
  return page.evaluate(() => {
    const fields = [
      ...document.querySelectorAll('[role="dialog"] [data-input]'),
    ]
    if (!window.MathQuill) {
      return fields.map((_, i) => `#${i}: (no MathQuill)`).join(' | ')
    }
    const MQ = window.MathQuill.getInterface(2)
    return fields
      .map((el, i) => {
        try {
          const field = MQ(el as HTMLElement)
          return `#${i}:${JSON.stringify(field?.latex?.() ?? '')}`
        } catch {
          return `#${i}:(error)`
        }
      })
      .join(' | ')
  })
}

export interface FillAnswerOptions {
  /**
   * Default `true`: on a failed first pass, silently clear + refill every
   * field once more (tolerant — keeps the broad fixture catalog from being
   * flaky about incidental MathQuill/React timing).
   *
   * Set `false` for a strict, single honest pass with no self-healing retry —
   * use this to test the class of bug where the UI *looks* filled correctly
   * but a field's value never actually reached MathQuill/the answer state
   * (a retry would silently paper over exactly that).
   */
  allowRetry?: boolean
}

export const fillAnswerViaCalculator = async (
  page: Page,
  answer: string,
  options?: FillAnswerOptions,
): Promise<void> => {
  const allowRetry = options?.allowRetry ?? true
  const parts = answerParts(answer)
  if (parts.length === 0) {
    throw new Error(`Empty answer after parse: ${JSON.stringify(answer)}`)
  }

  let fields: Locator
  try {
    fields = await resolveAnswerFields(page)
  } catch {
    throw new Error(
      `Expected a visible [data-input] answer field for ${JSON.stringify(parts)}`,
    )
  }

  const count = await fields.count()
  expect(
    count,
    `Expected at least ${parts.length} input(s) for ${JSON.stringify(parts)}, found ${count}`,
  ).toBeGreaterThanOrEqual(parts.length)

  await fillPartsOnce(page, parts)

  const checkButton = page.getByRole('button', {
    name: /Проверить|Тексеру/,
  })
  if (await waitUntilCheckReadyOrLatex(page, parts)) return

  if (!allowRetry) {
    const latexDump = await dumpFieldLatex(page)
    throw new Error(
      `Strict fill (allowRetry:false) failed on the first honest pass for ` +
        `${JSON.stringify(answer)}; fields: ${latexDump}`,
    )
  }

  // One full refill if MQ/store lagged behind calculator clicks.
  for (let index = 0; index < parts.length; index += 1) {
    await clearFieldViaCalculator(page, index)
  }
  await fillPartsOnce(page, parts)
  if (await waitUntilCheckReadyOrLatex(page, parts)) return

  for (let index = 0; index < parts.length; index += 1) {
    await syncFieldLatexToStore(page, index)
  }
  await page.waitForTimeout(200)

  if (!(await checkButton.isEnabled())) {
    const latexDump = await dumpFieldLatex(page)
    throw new Error(
      `Check still disabled after calc fill for ${JSON.stringify(answer)}; fields: ${latexDump}`,
    )
  }
}
