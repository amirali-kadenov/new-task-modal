/**
 * Builds Storybook with Open / Open old links pointed at test or prod trainer host.
 * For --test (and --prod), also exports a static StatsPanel snapshot and enables
 * VITE_STATS_STATIC so Statistic works without localhost:3847.
 *
 * Usage (from new-task-modal):
 *   node scripts/build-storybook-deploy.mjs --test
 *   node scripts/build-storybook-deploy.mjs --prod
 *   pnpm build-storybook:deploy -- --test
 *   pnpm build-storybook:deploy -- --prod
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HOSTS = {
  test: 'https://test.qalan.kz',
  prod: 'https://qalan.kz',
}

const args = process.argv.slice(2)
const flag = args.find((a) => a === '--test' || a === '--prod')
const hostArg = args.find((a) => a.startsWith('--host='))

let launchBase
if (flag === '--test') launchBase = HOSTS.test
else if (flag === '--prod') launchBase = HOSTS.prod
else if (hostArg) launchBase = hostArg.slice('--host='.length).replace(/\/$/, '')

if (!launchBase) {
  console.error(
    'Usage: node scripts/build-storybook-deploy.mjs --test | --prod | --host=<url>',
  )
  process.exit(1)
}

const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const useStaticStats = flag === '--test' || flag === '--prod'

if (useStaticStats) {
  console.log('Exporting static StatsPanel snapshot…')
  const exportResult = spawnSync('node', ['scripts/export-stats-static.mjs'], {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if ((exportResult.status ?? 1) !== 0) {
    process.exit(exportResult.status ?? 1)
  }
}

console.log(
  `Building Storybook with VITE_LAUNCH_BASE=${launchBase}` +
    (useStaticStats ? ' VITE_STATS_STATIC=1' : ''),
)

const result = spawnSync('pnpm', ['exec', 'storybook', 'build'], {
  cwd,
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_LAUNCH_BASE: launchBase,
    ...(useStaticStats ? { VITE_STATS_STATIC: '1' } : {}),
  },
  shell: process.platform === 'win32',
})

process.exit(result.status ?? 1)
