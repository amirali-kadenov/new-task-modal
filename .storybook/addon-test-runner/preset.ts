import { spawn, type ChildProcess } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { parsePlaywrightJson } from '../../src/modules/testing/lib/parse-playwright-json'
import { parseVitestJson } from '../../src/modules/testing/lib/parse-vitest-json'
import {
  appendHistoryRun,
  backfillHistoryFromDirs,
  readHistoryIndex,
  readRunLog,
} from '../../src/modules/testing/lib/run-history'
import { stripAnsi } from '../../src/modules/testing/lib/strip-ansi'
import { withDescriptionRu } from '../../src/modules/testing/lib/suite-case-ru'
import {
  applyVisualRunToQa,
  readTemplateQa,
  setTemplateReviewed,
} from '../../src/modules/testing/lib/template-qa'
import {
  EVENTS,
  type ArtifactItem,
  type ArtifactsPayload,
  type DonePayload,
  type HistoryListResultPayload,
  type HistoryReadPayload,
  type HistoryReadResultPayload,
  type HistoryRunRecord,
  type LogPayload,
  type QaListResultPayload,
  type QaSetReviewedPayload,
  type QaSetReviewedResultPayload,
  type ResultsPayload,
  type RunPayload,
  type StopPayload,
  type TemplatesListResultPayload,
  type TestGrade,
  type TestScope,
  type TestSuite,
} from '../../src/modules/testing/lib/test-runner-events'
import {
  GRADE_ENV,
  SCOPE_ENV,
  TEMPLATE_ENV,
  TASK_ENV,
  vitestFileArgs,
  vitestFilterPattern,
} from '../../src/modules/testing/lib/test-scope'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(dirname, '../..')
const artifactsRoot = path.join(projectRoot, 'test-artifacts')

const running = new Map<TestSuite, ChildProcess>()

const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
}

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp'])
const VIDEO_EXT = new Set(['.webm', '.mp4'])
const TRACE_EXT = new Set(['.zip'])

const MAX_INLINE_BYTES = 2_500_000

/** After Vitest prints the JSON report, wait this long for browser teardown. */
const TEARDOWN_GRACE_MS = 45_000
/** Escalate SIGTERM → SIGKILL if process still alive. */
const KILL_ESCALATE_MS = 10_000

const ensureDir = (dir: string) => {
  fs.mkdirSync(dir, { recursive: true })
}

const copyTree = (src: string, dest: string) => {
  if (!fs.existsSync(src)) return
  ensureDir(dest)
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name)
    const to = path.join(dest, entry.name)
    if (entry.isDirectory()) copyTree(from, to)
    else fs.copyFileSync(from, to)
  }
}

const walkFiles = (dir: string, acc: string[] = []): string[] => {
  if (!fs.existsSync(dir)) return acc
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walkFiles(full, acc)
    else acc.push(full)
  }
  return acc
}

const collectArtifacts = (
  dirs: string[],
  persistRel: string,
  limit = 12,
): ArtifactItem[] => {
  const files: string[] = []
  for (const dir of dirs) walkFiles(dir, files)

  const ranked = files
    .map((file) => ({ file, mtime: fs.statSync(file).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)

  const out: ArtifactItem[] = []
  for (const { file } of ranked) {
    if (out.length >= limit) break
    const ext = path.extname(file).toLowerCase()
    const mime = MIME_BY_EXT[ext]
    const name = path.basename(file)
    const relFromPersist = path.relative(
      path.join(projectRoot, persistRel),
      file,
    )
    const relativePath = path
      .join(persistRel, relFromPersist)
      .split(path.sep)
      .join('/')
    const publicUrl = `/${relativePath}`

    if (IMAGE_EXT.has(ext) && mime) {
      const buf = fs.readFileSync(file)
      const item: ArtifactItem = {
        name,
        kind: 'image',
        relativePath,
        publicUrl,
      }
      if (buf.length <= MAX_INLINE_BYTES) {
        item.dataUrl = `data:${mime};base64,${buf.toString('base64')}`
      }
      out.push(item)
      continue
    }

    if (VIDEO_EXT.has(ext) && mime) {
      const buf = fs.readFileSync(file)
      const item: ArtifactItem = {
        name,
        kind: 'video',
        relativePath,
        publicUrl,
      }
      if (buf.length <= MAX_INLINE_BYTES) {
        item.dataUrl = `data:${mime};base64,${buf.toString('base64')}`
      }
      out.push(item)
      continue
    }

    if (TRACE_EXT.has(ext) || name.includes('trace')) {
      out.push({
        name,
        kind: 'file',
        relativePath,
        publicUrl,
      })
    }
  }
  return out
}

const normalizeScope = (scope: TestScope | undefined): TestScope =>
  scope ?? 'all'

const normalizeGrade = (grade: TestGrade | undefined): string => {
  if (grade == null) return 'all'
  return String(grade)
}

const normalizeTemplate = (template: string | undefined): string =>
  template?.trim() ?? ''

const normalizeTask = (task: string | undefined): string => task?.trim() ?? ''

const buildSpawn = (
  suite: TestSuite,
  headed: boolean,
  jsonPath: string,
  artifactDir: string,
  scope: TestScope,
  grade: string,
  template: string,
  task: string,
  e2eFast: boolean,
  updateSnapshots = false,
): { command: string; args: string[]; env: NodeJS.ProcessEnv } => {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    [SCOPE_ENV]: scope,
    [GRADE_ENV]: grade,
    [TEMPLATE_ENV]: template,
    [TASK_ENV]: task,
    // Plain logs for Storybook UI (avoid [2m]/[22m dim codes in «Общий лог»).
    NO_COLOR: '1',
    FORCE_COLOR: '0',
  }

  if (suite === 'unit' || suite === 'interactions') {
    const project = suite === 'unit' ? 'unit' : 'storybook'
    const args = [
      'vitest',
      'run',
      `--project=${project}`,
      '--reporter=default',
      '--reporter=json',
      `--outputFile=${jsonPath}`,
    ]
    const files = vitestFileArgs(suite, scope, template || undefined).filter(
      (rel) => fs.existsSync(path.join(projectRoot, rel)),
    )
    // Narrow collect before -t so section-panel runs skip the full project.
    args.push(...files)

    // Unit catalog names need -t; storybook file-scoped runs must not use the
    // unit-oriented pattern (story names like `All` never match → 0 executed).
    const useNameFilter = suite === 'unit' || files.length === 0
    if (useNameFilter) {
      const pattern = vitestFilterPattern(scope, template || undefined)
      if (pattern) args.push('-t', pattern)
    }
    return { command: 'npx', args, env }
  }

  env.STORYBOOK_TEST_JSON = jsonPath
  env.STORYBOOK_TEST_OUTPUT = artifactDir
  env.E2E_FAST = e2eFast ? '1' : '0'
  if (!e2eFast) env.STORYBOOK_TEST_SCREENSHOT = '1'
  if (headed) env.HEADED = '1'

  if (suite === 'visual') {
    const args = ['playwright', 'test', '-c', 'e2e/visual/playwright.config.ts']
    if (updateSnapshots) args.push('--update-snapshots')
    if (headed) args.push('--headed')
    if (scope === 'allGroups') {
      args.push('--grep', String.raw`\[allGroups\]`)
    } else if (scope === 'allTasks') {
      args.push('--grep', String.raw`\[allTasks\]`)
    }
    if (template) {
      const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      args.push('--grep', escaped)
    }
    return { command: 'npx', args, env }
  }

  const args = ['playwright', 'test', '-c', 'e2e/playwright.config.ts']
  if (headed) args.push('--headed')
  if (scope === 'allGroups') {
    args.push('--grep', String.raw`\[allGroups\]`)
  } else if (scope === 'allTasks') {
    args.push('--grep', String.raw`\[allTasks\]`)
  }
  if (template) {
    // Fixture keys are `text/ui/plain` or `text/ui/plain#4_1_1`
    const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    args.push('--grep', escaped)
  }

  return { command: 'npx', args, env }
}

/**
 * No manager panel — suites are Storybook stories under Testing/*.
 * Keep this preset only for experimental_serverChannel (npm spawn).
 */
export const managerEntries: string[] = []

type ChannelEmit =
  | LogPayload
  | DonePayload
  | ResultsPayload
  | ArtifactsPayload
  | TemplatesListResultPayload
  | HistoryListResultPayload
  | HistoryReadResultPayload
  | QaListResultPayload
  | QaSetReviewedResultPayload

type Channel = {
  on: (event: string, cb: (payload: never) => void) => void
  emit: (event: string, payload: ChannelEmit) => void
}

/**
 * Storybook 9 still applies this preset hook: channel is the Node-side
 * websocket shared with the preview. Attach listeners and return it.
 */
export const experimental_serverChannel = async (channel: Channel) => {
  // Template select options come from Vite import.meta.glob in the preview
  // (template-options.ts), not this channel — avoid importing catalog-fixtures
  // here: its @/ aliases fail under Storybook’s Node/CJS loader.

  channel.on(EVENTS.HISTORY_LIST, () => {
    ensureDir(artifactsRoot)
    let runs = readHistoryIndex(artifactsRoot)
    if (runs.length === 0) {
      runs = backfillHistoryFromDirs(artifactsRoot)
    }
    channel.emit(EVENTS.HISTORY_LIST_RESULT, { runs })
  })

  channel.on(EVENTS.HISTORY_READ, (payload: HistoryReadPayload) => {
    const persistDir = payload?.persistDir ?? ''
    const log = readRunLog(projectRoot, persistDir)
    const runs = readHistoryIndex(artifactsRoot)
    const record = runs.find((r) => r.persistDir === persistDir)
    const result: HistoryReadResultPayload = {
      persistDir,
      log: log || '(лог не найден)',
      record,
      error: log ? undefined : 'Файл лога не найден',
    }
    channel.emit(EVENTS.HISTORY_READ_RESULT, result)
  })

  channel.on(EVENTS.QA_LIST, () => {
    ensureDir(artifactsRoot)
    channel.emit(EVENTS.QA_LIST_RESULT, {
      entries: readTemplateQa(artifactsRoot),
    })
  })

  channel.on(EVENTS.QA_SET_REVIEWED, (payload: QaSetReviewedPayload) => {
    ensureDir(artifactsRoot)
    const template = payload?.template?.trim() ?? ''
    if (!template) {
      channel.emit(EVENTS.QA_SET_REVIEWED_RESULT, {
        entries: readTemplateQa(artifactsRoot),
        error: 'Выберите шаблон',
      })
      return
    }
    const entries = setTemplateReviewed(
      artifactsRoot,
      template,
      Boolean(payload.reviewed),
      { note: payload.note, runId: payload.runId },
    )
    channel.emit(EVENTS.QA_SET_REVIEWED_RESULT, { entries })
  })

  channel.on(EVENTS.STOP, (payload: StopPayload) => {
    const target = payload?.suite
    const entries = target
      ? ([[target, running.get(target)]] as const).filter(
          (entry): entry is readonly [TestSuite, ChildProcess] =>
            Boolean(entry[1]),
        )
      : [...running.entries()]

    for (const [suite, child] of entries) {
      channel.emit(EVENTS.LOG, {
        suite,
        stream: 'stderr',
        chunk: `[test-runner] остановка ${suite}…\n`,
      })
      try {
        child.kill('SIGTERM')
      } catch (err) {
        channel.emit(EVENTS.LOG, {
          suite,
          stream: 'stderr',
          chunk: `[test-runner] kill failed: ${String(err)}\n`,
        })
      }
    }
  })

  channel.on(EVENTS.RUN, (payload: RunPayload) => {
    const suite = payload?.suite
    if (!suite || !['unit', 'interactions', 'e2e', 'visual'].includes(suite))
      return
    if (running.has(suite)) {
      channel.emit(EVENTS.LOG, {
        suite,
        stream: 'stderr',
        chunk: `[test-runner] ${suite} уже выполняется\n`,
      })
      return
    }

    const scope = normalizeScope(payload.scope)
    const grade = normalizeGrade(payload.grade)
    const template = normalizeTemplate(payload.template)
    const task = normalizeTask(payload.task)
    const e2eFast = payload.e2eFast !== false
    const startedAt = Date.now()
    const stamp = `${suite}-${scope}-g${grade}-${startedAt}`
    const jsonPath = path.join(os.tmpdir(), `sb-test-${stamp}.json`)
    const artifactDir = path.join(os.tmpdir(), `sb-test-out-${stamp}`)
    const persistRel = path.join('test-artifacts', stamp)
    const persistAbs = path.join(projectRoot, persistRel)
    fs.mkdirSync(artifactDir, { recursive: true })
    ensureDir(persistAbs)

    const headed =
      (suite === 'e2e' || suite === 'visual') && Boolean(payload.headed)
    const updateSnapshots =
      suite === 'visual' && Boolean(payload.updateSnapshots)
    const { command, args, env } = buildSpawn(
      suite,
      headed,
      jsonPath,
      artifactDir,
      scope,
      grade,
      template,
      task,
      e2eFast,
      updateSnapshots,
    )

    channel.emit(EVENTS.LOG, {
      suite,
      stream: 'stdout',
      chunk: `[test-runner] ${command} ${args.join(' ')}\n[test-runner] scope=${scope} grade=${grade} template=${template || 'all'} task=${task || 'all'} e2eFast=${suite === 'e2e' || suite === 'visual' ? e2eFast : 'n/a'} updateSnapshots=${updateSnapshots}\n[test-runner] artifacts → ${persistRel}\n`,
    })

    const child = spawn(command, args, {
      cwd: projectRoot,
      env,
      shell: false,
    })
    running.set(suite, child)

    let logAccum = ''
    let finished = false
    let killedByWatchdog = false
    let teardownTimer: ReturnType<typeof setTimeout> | null = null
    let killEscalateTimer: ReturnType<typeof setTimeout> | null = null

    const clearWatchdogs = () => {
      if (teardownTimer) {
        clearTimeout(teardownTimer)
        teardownTimer = null
      }
      if (killEscalateTimer) {
        clearTimeout(killEscalateTimer)
        killEscalateTimer = null
      }
    }

    const exitCodeFromJson = (): number | null => {
      try {
        if (!fs.existsSync(jsonPath)) return null
        const raw = fs.readFileSync(jsonPath, 'utf8')
        const cases =
          suite === 'e2e' || suite === 'visual'
            ? parsePlaywrightJson(raw)
            : parseVitestJson(raw)
        return cases.some((c) => c.status === 'fail') ? 1 : 0
      } catch {
        return null
      }
    }

    const forceKillAfterReport = () => {
      if (finished || !running.has(suite)) return
      killedByWatchdog = true
      channel.emit(EVENTS.LOG, {
        suite,
        stream: 'stderr',
        chunk: `[test-runner] процесс не завершился после JSON report — принудительная остановка ${suite}…\n`,
      })
      try {
        child.kill('SIGTERM')
      } catch {
        /* ignore */
      }
      killEscalateTimer = setTimeout(() => {
        if (finished) return
        try {
          child.kill('SIGKILL')
        } catch {
          /* ignore */
        }
      }, KILL_ESCALATE_MS)
    }

    const scheduleTeardownWatchdog = () => {
      if (teardownTimer || finished) return
      teardownTimer = setTimeout(forceKillAfterReport, TEARDOWN_GRACE_MS)
    }

    const emitChunk = (stream: 'stdout' | 'stderr', buf: Buffer) => {
      const chunk = stripAnsi(buf.toString())
      logAccum += chunk
      channel.emit(EVENTS.LOG, { suite, stream, chunk })
      if (chunk.includes('JSON report written')) {
        scheduleTeardownWatchdog()
      }
    }

    child.stdout?.on('data', (buf: Buffer) => emitChunk('stdout', buf))
    child.stderr?.on('data', (buf: Buffer) => emitChunk('stderr', buf))

    const finish = (exitCode: number | null) => {
      if (finished) return
      finished = true
      clearWatchdogs()
      running.delete(suite)

      let resolvedCode = exitCode
      if (killedByWatchdog && (resolvedCode === null || resolvedCode !== 0)) {
        const fromJson = exitCodeFromJson()
        if (fromJson !== null) resolvedCode = fromJson
      }

      let cases: ReturnType<typeof withDescriptionRu> = []

      try {
        if (fs.existsSync(jsonPath)) {
          const raw = fs.readFileSync(jsonPath, 'utf8')
          fs.writeFileSync(path.join(persistAbs, 'results.json'), raw)
          cases = withDescriptionRu(
            suite === 'e2e' || suite === 'visual'
              ? parsePlaywrightJson(raw)
              : parseVitestJson(raw),
          )
          if (cases.length > 0) {
            channel.emit(EVENTS.RESULTS, { suite, cases })
          }
        }
      } catch (err) {
        channel.emit(EVENTS.LOG, {
          suite,
          stream: 'stderr',
          chunk: `[test-runner] failed to parse JSON results: ${String(err)}\n`,
        })
      }

      try {
        fs.writeFileSync(
          path.join(persistAbs, 'log.txt'),
          logAccum || '(empty)',
        )
      } catch {
        /* ignore */
      }

      if (suite === 'e2e' || suite === 'visual') {
        try {
          copyTree(artifactDir, path.join(persistAbs, 'playwright'))
          const artifacts = collectArtifacts(
            [path.join(persistAbs, 'playwright')],
            persistRel,
          )
          channel.emit(EVENTS.ARTIFACTS, {
            suite,
            artifacts,
            persistDir: persistRel,
          })
        } catch (err) {
          channel.emit(EVENTS.LOG, {
            suite,
            stream: 'stderr',
            chunk: `[test-runner] failed to collect artifacts: ${String(err)}\n`,
          })
        }
      } else {
        channel.emit(EVENTS.ARTIFACTS, {
          suite,
          artifacts: [],
          persistDir: persistRel,
        })
      }

      const pass = cases.filter((c) => c.status === 'pass').length
      const fail = cases.filter((c) => c.status === 'fail').length
      const failedCaseLabels = cases
        .filter((c) => c.status === 'fail')
        .map((c) => c.label)

      const record: HistoryRunRecord = {
        id: stamp,
        suite,
        scope,
        grade,
        template,
        startedAt,
        finishedAt: Date.now(),
        exitCode: resolvedCode,
        persistDir: persistRel,
        failedCaseLabels:
          failedCaseLabels.length > 0 ? failedCaseLabels : undefined,
        summary: {
          pass,
          fail: fail || (resolvedCode === 0 ? 0 : Math.max(fail, 1)),
          total: cases.length || (resolvedCode === 0 ? 0 : 1),
        },
      }

      try {
        appendHistoryRun(artifactsRoot, record)
        if (suite === 'visual' && template) {
          applyVisualRunToQa(artifactsRoot, record)
          channel.emit(EVENTS.QA_LIST_RESULT, {
            entries: readTemplateQa(artifactsRoot),
          })
        }
      } catch (err) {
        channel.emit(EVENTS.LOG, {
          suite,
          stream: 'stderr',
          chunk: `[test-runner] history index failed: ${String(err)}\n`,
        })
      }

      channel.emit(EVENTS.DONE, {
        suite,
        exitCode: resolvedCode,
        persistDir: persistRel,
      })

      try {
        if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath)
      } catch {
        /* ignore */
      }

      ensureDir(artifactsRoot)
    }

    child.on('close', (exitCode) => finish(exitCode))

    child.on('error', (err) => {
      if (finished) return
      finished = true
      clearWatchdogs()
      running.delete(suite)
      channel.emit(EVENTS.LOG, {
        suite,
        stream: 'stderr',
        chunk: `[test-runner] failed to start: ${err.message}\n`,
      })
      try {
        fs.writeFileSync(
          path.join(persistAbs, 'log.txt'),
          logAccum + `\n[test-runner] failed to start: ${err.message}\n`,
        )
      } catch {
        /* ignore */
      }
      try {
        appendHistoryRun(artifactsRoot, {
          id: stamp,
          suite,
          scope,
          grade,
          template,
          startedAt,
          finishedAt: Date.now(),
          exitCode: 1,
          persistDir: persistRel,
          summary: { pass: 0, fail: 1, total: 1 },
        })
      } catch {
        /* ignore */
      }
      channel.emit(EVENTS.DONE, {
        suite,
        exitCode: 1,
        persistDir: persistRel,
      })
    })
  })

  return channel
}
