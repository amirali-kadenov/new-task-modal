import { clsx } from 'clsx'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import StatsPanel from '@matheducator/StatsPanel'

import s from './stats-panel-embed.module.scss'

const STATS_SERVER = 'http://localhost:3847'
const STATIC_STATS_BASE = '/stats-static'
const TOKEN_KEY = 'storybook.stats.token'
const API_BASE_KEY = 'storybook.stats.apiBase'
const DEFAULT_API_BASE = 'https://preprod.qalan.kz/api'

const isStatsStatic =
  import.meta.env.VITE_STATS_STATIC === '1' ||
  import.meta.env.VITE_STATS_STATIC === 'true'

type Health = 'pending' | 'ok' | 'error'

type StaticMeta = {
  mode?: string
  snapshotName?: string
  snapshotCreatedAt?: string
  createdAt?: string
  grades?: number[]
}

function readSession(key: string, fallback: string) {
  try {
    return sessionStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

function writeSession(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

function formatStaticMeta(meta: StaticMeta | null) {
  if (!meta) return null
  const when = (meta.snapshotCreatedAt || meta.createdAt || '').slice(0, 19).replace('T', ' ')
  const name = meta.snapshotName || ''
  const grades =
    meta.grades && meta.grades.length ? `кл. ${meta.grades.join(',')}` : ''
  return [name, when, grades].filter(Boolean).join(' · ')
}

export function StatsPanelEmbed() {
  const [health, setHealth] = useState<Health>(
    isStatsStatic ? 'ok' : 'pending',
  )
  const [staticMeta, setStaticMeta] = useState<StaticMeta | null>(null)
  const [token, setToken] = useState(() =>
    readSession(
      TOKEN_KEY,
      typeof import.meta.env.VITE_MATH_EDUCATOR_TOKEN === 'string'
        ? import.meta.env.VITE_MATH_EDUCATOR_TOKEN
        : '',
    ),
  )
  const [apiBase, setApiBase] = useState(() =>
    readSession(API_BASE_KEY, DEFAULT_API_BASE),
  )

  useEffect(() => {
    let cancelled = false

    if (isStatsStatic) {
      fetch(`${STATIC_STATS_BASE}/meta.json`)
        .then((r) => {
          if (!r.ok) throw new Error(r.statusText)
          return r.json()
        })
        .then((meta: StaticMeta) => {
          if (!cancelled) {
            setStaticMeta(meta)
            setHealth('ok')
          }
        })
        .catch(() => {
          if (!cancelled) {
            setStaticMeta(null)
            setHealth('error')
          }
        })
      return () => {
        cancelled = true
      }
    }

    const probe = () => {
      fetch(`${STATS_SERVER}/api/health`)
        .then((r) => {
          if (!r.ok) throw new Error(r.statusText)
          if (!cancelled) setHealth('ok')
        })
        .catch(() => {
          if (!cancelled) setHealth('error')
        })
    }
    probe()
    const id = window.setInterval(probe, 5000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [])

  const staticLabel = formatStaticMeta(staticMeta)

  return (
    <div className={s.root}>
      <div
        className={clsx(
          s.banner,
          isStatsStatic && health === 'ok' && s.bannerStatic,
          !isStatsStatic && health === 'ok' && s.bannerOk,
          health === 'error' && s.bannerError,
          health === 'pending' && s.bannerPending,
        )}
      >
        {isStatsStatic ? (
          health === 'error' ? (
            <>
              Offline-снимок не найден в <code>/stats-static</code>. Перед
              сборкой выполните <code>pnpm export-stats-static</code> (нужен
              локальный snapshot в <code>stats/snapshots/</code>).
            </>
          ) : (
            <>
              Offline-снимок Storybook (не live)
              {staticLabel ? <>: {staticLabel}</> : null}. Генерация и stats
              server недоступны — данные заморожены на момент{' '}
              <code>build-storybook:test</code> / <code>:prod</code>.
            </>
          )
        ) : (
          <>
            {health === 'pending' && 'Проверка stats server на :3847…'}
            {health === 'ok' &&
              'Stats server доступен — ниже живая панель Statistic (те же API, что в matheducator).'}
            {health === 'error' && (
              <>
                Stats server не отвечает на{' '}
                <code>http://localhost:3847</code>. Запустите{' '}
                <code>npm run stats:server</code> или{' '}
                <code>npm run start:with-stats</code> в{' '}
                <code>matheducator/reactjs_client</code>.
              </>
            )}
          </>
        )}
      </div>

      {!isStatsStatic && (
        <div className={s.controls}>
          <label className={s.field}>
            <span className={s.label}>API token (для Генерации)</span>
            <input
              className={s.input}
              type="password"
              autoComplete="off"
              value={token}
              placeholder="Bearer / cookie token из preprod"
              onChange={(e) => {
                const next = e.target.value
                setToken(next)
                writeSession(TOKEN_KEY, next)
              }}
            />
          </label>
          <label className={s.field}>
            <span className={s.label}>API base</span>
            <input
              className={s.input}
              type="url"
              value={apiBase}
              onChange={(e) => {
                const next = e.target.value
                setApiBase(next)
                writeSession(API_BASE_KEY, next)
              }}
            />
          </label>
        </div>
      )}

      <div className={s.panelWrap}>
        <StatsPanel
          embedded
          staticMode={isStatsStatic}
          statsServer={isStatsStatic ? STATIC_STATS_BASE : undefined}
          token={isStatsStatic ? undefined : token || undefined}
          apiBase={isStatsStatic ? undefined : apiBase || DEFAULT_API_BASE}
        />
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        newestOnTop
        closeOnClick
        draggable={false}
      />
    </div>
  )
}
