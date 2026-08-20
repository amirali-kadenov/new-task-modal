/**
 * Compare Storybook `groups.json` fixture answers to live `POST /tasks/:id/solution`.
 *
 * Usage (from new-task-modal):
 *   node scripts/audit-api-vs-fixtures.mjs
 *   API_BASE=https://test.qalan.kz/api node scripts/audit-api-vs-fixtures.mjs
 *   LIMIT=20 node scripts/audit-api-vs-fixtures.mjs   # smoke
 *
 * Auth: e2e/.auth.local.ts → Bearer math-educator-token
 *
 * Failures:
 *   - API answer parts (after strip+split) ≠ fixture parts
 *   - API answer leaves raw `\(` / `\)` fragments after the UI pipeline
 *   - HTTP / missing solution.answer
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const modalRoot = path.resolve(__dirname, '..')

const API_BASE = (process.env.API_BASE || 'https://test.qalan.kz/api').replace(
  /\/$/,
  '',
)
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : Infinity
const CONCURRENCY = Number(process.env.CONCURRENCY || 6)
const LANGUAGE = process.env.LANGUAGE || 'russian'
const WIRE_SEP = ';;'

const authMod = await import(
  pathToFileURL(path.join(modalRoot, 'e2e/.auth.local.ts')).href
)
const token = authMod.localTrainerAuth?.token
if (!token) {
  console.error('Missing localTrainerAuth.token in e2e/.auth.local.ts')
  process.exit(1)
}

function stripMathDelimiters(value) {
  const trimmed = String(value ?? '').trim()
  const match = trimmed.match(/^\\\(([\s\S]*)\\\)$/)
  return match ? match[1].trim() : trimmed
}

function splitMultiAnswer(answer) {
  if (!answer) return ['']
  return String(answer).split(WIRE_SEP)
}

function pickAnswerText(answer) {
  if (answer == null) return ''
  if (typeof answer === 'string') return answer
  if (typeof answer === 'object') {
    return (
      answer.rus || answer.kaz || answer.eng || answer.uzb || answer.aze || ''
    )
  }
  return ''
}

function isPlaceholder(value) {
  const t = String(value ?? '').trim()
  return t === '' || t === '()' || t === '\\(\\)'
}

/** Mirror getCorrectAnswerFromSolution: string answer, else MC letter from parts. */
function primaryAnswerRaw(solution) {
  if (!solution || typeof solution !== 'object') return ''
  const text = pickAnswerText(solution.answer)
  if (text && !isPlaceholder(stripMathDelimiters(text))) return text
  if (text && !isPlaceholder(text) && stripMathDelimiters(text) !== '')
    return text

  const parts = Array.isArray(solution.parts) ? solution.parts : []
  const mc = parts.find((p) => p.type === 180 && Array.isArray(p.variants))
  if (mc?.variants) {
    const index = mc.variants.findIndex((v) => v.isCorrect || v.correct)
    if (index >= 0) return String.fromCharCode(65 + index)
  }
  // leftover placeholder / empty
  if (isPlaceholder(stripMathDelimiters(text))) return ''
  return text || ''
}

function normalizeParts(raw) {
  if (!raw || isPlaceholder(raw)) return ['']
  const bare = stripMathDelimiters(raw)
  if (isPlaceholder(bare)) return ['']
  const primary = bare.split('||', 1)[0].trim()
  return splitMultiAnswer(primary).map((p) => p.trim())
}

function hasBrokenDelimiterFragments(parts) {
  return parts.some(
    (p) =>
      p.startsWith('\\(') || p.endsWith('\\)') || p === '\\(' || p === '\\)',
  )
}

function collectLaunches() {
  const templatesRoot = path.join(modalRoot, 'src/modules/tasks/ui/templates')
  const out = []
  for (const domain of fs.readdirSync(templatesRoot)) {
    const uiRoot = path.join(templatesRoot, domain, 'ui')
    if (!fs.existsSync(uiRoot)) continue
    const walk = (dir) => {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name)
        const st = fs.statSync(full)
        if (st.isDirectory()) walk(full)
        else if (name === 'groups.json') {
          const groups = JSON.parse(fs.readFileSync(full, 'utf8'))
          const rel = path.relative(modalRoot, full)
          for (const g of groups) {
            if (!g?.task?.id) continue
            out.push({
              file: rel,
              group: g.group,
              launch: g.launch,
              task: g.task,
              domain,
            })
          }
        }
      }
    }
    walk(uiRoot)
  }
  return out
}

async function fetchSolution(task) {
  const url = `${API_BASE}/tasks/${task.id}/solution`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fields: task.fields || {},
      lockVersion: task.lockVersion ?? null,
      type: task.type,
      language: LANGUAGE,
    }),
  })
  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = { raw: text }
  }
  return { status: res.status, data }
}

function apiAnswer(data) {
  return primaryAnswerRaw(data?.solution)
}

async function mapPool(items, concurrency, fn) {
  const results = new Array(items.length)
  let i = 0
  async function worker() {
    while (i < items.length) {
      const idx = i++
      results[idx] = await fn(items[idx], idx)
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  )
  return results
}

const all = collectLaunches()
const launches = all.slice(0, LIMIT)
console.log(
  `Auditing ${launches.length}/${all.length} launches against ${API_BASE} (concurrency=${CONCURRENCY})`,
)

const failures = []
const contentMismatches = []
const warnings = []
let ok = 0
let skipped = 0
let multiWrapped = 0
let multiBareApi = 0

await mapPool(launches, CONCURRENCY, async (item) => {
  const fixtureRaw = primaryAnswerRaw(item.task.solution)

  let status
  let data
  try {
    ;({ status, data } = await fetchSolution(item.task))
  } catch (e) {
    failures.push({
      ...item,
      reason: `network: ${e.message}`,
      fixtureRaw,
    })
    return
  }

  if (status !== 200) {
    failures.push({
      ...item,
      reason: `HTTP ${status}`,
      fixtureRaw,
      body: JSON.stringify(data)?.slice(0, 200),
    })
    return
  }

  // Prefer wire answer for wrap stats (before MC fallback)
  const wireAnswer = pickAnswerText(data?.solution?.answer)
  const apiRaw = apiAnswer(data)
  if (!apiRaw) {
    if (!fixtureRaw) {
      skipped++
      return
    }
    warnings.push({
      file: item.file,
      group: item.group,
      type: item.task.type,
      reason: 'API primary answer empty, fixture has answer',
      fixtureRaw,
    })
    skipped++
    return
  }

  const apiParts = normalizeParts(apiRaw)
  const wireMulti =
    wireAnswer && stripMathDelimiters(wireAnswer).includes(WIRE_SEP)
  if (wireMulti) {
    if (/^\\\([\s\S]*\\\)$/.test(String(wireAnswer).trim())) multiWrapped++
    else multiBareApi++
  }

  // Broken fragments only matter for the strip+split pipeline on wire multi
  if (wireMulti) {
    const wireParts = normalizeParts(wireAnswer)
    if (hasBrokenDelimiterFragments(wireParts)) {
      failures.push({
        ...item,
        reason: 'pipeline leaves \\( or \\) fragments in parts',
        fixtureRaw,
        apiRaw: wireAnswer,
        apiParts: wireParts,
      })
      return
    }
  }

  const fixtureNorm = normalizeParts(fixtureRaw)
  const same =
    apiParts.length === fixtureNorm.length &&
    apiParts.every((p, i) => p === fixtureNorm[i])

  if (!same) {
    if (!fixtureRaw) {
      warnings.push({
        file: item.file,
        group: item.group,
        type: item.task.type,
        reason: 'fixture answer empty, API has answer',
        apiRaw,
      })
      ok++
      return
    }
    contentMismatches.push({
      ...item,
      reason: 'parts mismatch (fixture vs API after strip+split)',
      fixtureRaw,
      apiRaw,
      fixtureParts: fixtureNorm,
      apiParts,
    })
    return
  }

  ok++
})

console.log(
  JSON.stringify(
    {
      ok,
      skipped,
      wrapOrHttpFailures: failures.length,
      contentMismatches: contentMismatches.length,
      warnings: warnings.length,
      multiWrappedApi: multiWrapped,
      multiBareApi,
    },
    null,
    2,
  ),
)

if (warnings.length) {
  console.log('\nWarnings (first 15):')
  for (const w of warnings.slice(0, 15)) {
    console.log(`- ${w.file} ${w.group || ''} ${w.type}: ${w.reason}`)
  }
}

if (contentMismatches.length) {
  console.log('\nContent mismatches (fixture ≠ API; not wrap bugs):')
  for (const f of contentMismatches) {
    console.log(`- ${f.file} ${f.group || ''} ${f.task?.type}: ${f.reason}`)
    if (f.fixtureRaw != null)
      console.log(`  fixture: ${JSON.stringify(f.fixtureRaw)}`)
    if (f.apiRaw != null) console.log(`  api:     ${JSON.stringify(f.apiRaw)}`)
    if (f.fixtureParts)
      console.log(`  fixtureParts: ${JSON.stringify(f.fixtureParts)}`)
    if (f.apiParts) console.log(`  apiParts: ${JSON.stringify(f.apiParts)}`)
  }
}

if (failures.length) {
  console.log('\nWrap / HTTP failures:')
  for (const f of failures) {
    console.log(`- ${f.file} ${f.group || ''} ${f.task?.type}: ${f.reason}`)
    if (f.fixtureRaw != null)
      console.log(`  fixture: ${JSON.stringify(f.fixtureRaw)}`)
    if (f.apiRaw != null) console.log(`  api:     ${JSON.stringify(f.apiRaw)}`)
    if (f.apiParts) console.log(`  apiParts: ${JSON.stringify(f.apiParts)}`)
  }
  process.exit(1)
}

if (multiBareApi > 0) {
  console.log(
    `\nUnexpected: ${multiBareApi} multi answers from API without outer \\(...\\)`,
  )
  process.exit(1)
}

console.log(
  `\nWrap pipeline OK. ${multiWrapped} multi answers all outer-wrapped. Content mismatches: ${contentMismatches.length}.`,
)
