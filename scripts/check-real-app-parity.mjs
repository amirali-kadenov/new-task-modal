/**
 * Local pre-push gate: run the real-host trainer e2e smoke and the
 * fixture-vs-live-API audit whenever the developer's own machine can
 * actually reach them. Skips cleanly (exit 0) when it can't, so it never
 * becomes a hard requirement for devs without `reactjs_client`/auth set up.
 *
 * Usage: node scripts/check-real-app-parity.mjs
 *   LAUNCH_BASE=...  real trainer host (default http://localhost:8888)
 *   API_BASE=...     live API for the fixture audit (default https://test.qalan.kz/api)
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const AUTH_FILE = path.join(root, 'e2e/.auth.local.ts')
const LAUNCH_BASE = process.env.LAUNCH_BASE ?? 'http://localhost:8888'
const API_BASE = process.env.API_BASE ?? 'https://test.qalan.kz/api'
const PROBE_TIMEOUT_MS = 2000

async function isReachable(url) {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    })
    return res.status < 500
  } catch {
    return false
  }
}

const SUBPROCESS_TIMEOUT_MS = 5 * 60_000

function run(command, args, env = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, ...env },
    timeout: SUBPROCESS_TIMEOUT_MS,
    killSignal: 'SIGKILL',
  })
  if (result.signal === 'SIGKILL' || result.error?.code === 'ETIMEDOUT') {
    console.error(
      `check:real-app — ${command} timed out after ${SUBPROCESS_TIMEOUT_MS / 1000}s, killed.`,
    )
    return 1
  }
  return result.status ?? 1
}

if (!fs.existsSync(AUTH_FILE)) {
  console.log(
    'check:real-app — skipped (no e2e/.auth.local.ts; copy e2e/.auth.local.example.ts to set up local trainer auth).',
  )
  process.exit(0)
}

let failed = false

if (await isReachable(LAUNCH_BASE)) {
  console.log(
    `check:real-app — trainer host reachable at ${LAUNCH_BASE}, running trainer e2e smoke (STORYBOOK_TEST_SCOPE=allGroups)...`,
  )
  // Call the playwright binary directly (not `pnpm run test:e2e -- <file>`)
  // — args forwarded through an intermediate npm/pnpm script did not reliably
  // scope to a single test file. Scope to trainer.e2e.spec.ts only: the
  // config's testDir is e2e/, so with no file arg it also picks up visual
  // regression + Storybook chat-input specs, which need Storybook rather
  // than the real host and are unrelated to this check.
  const status = run(
    'pnpm',
    [
      'exec',
      'playwright',
      'test',
      '-c',
      'e2e/playwright.config.ts',
      'e2e/trainer.e2e.spec.ts',
    ],
    { STORYBOOK_TEST_SCOPE: 'allGroups' },
  )
  if (status !== 0) failed = true
} else {
  console.log(
    `check:real-app — trainer host not reachable at ${LAUNCH_BASE}, skipping e2e parity check.`,
  )
}

if (await isReachable(API_BASE)) {
  console.log(
    `check:real-app — API reachable at ${API_BASE}, running fixture-vs-API audit (LIMIT=20)...`,
  )
  const status = run('pnpm', ['run', 'test:audit'], { LIMIT: '20' })
  if (status !== 0) failed = true
} else {
  console.log(
    `check:real-app — API not reachable at ${API_BASE}, skipping fixture audit.`,
  )
}

if (failed) {
  console.error(
    '\ncheck:real-app — one or more real-app parity checks failed. Fix the drift, or `git push --no-verify` if this push is intentionally exempt.',
  )
  process.exit(1)
}

console.log('check:real-app — done.')
