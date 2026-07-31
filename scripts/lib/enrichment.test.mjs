import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { loadEnrichmentMaps, withEnrichment } from './enrichment.mjs'

const tempDirs = []

function makeSnapshotDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'enrichment-'))
  tempDirs.push(dir)
  return dir
}

afterEach(() => {
  vi.restoreAllMocks()
  while (tempDirs.length) {
    fs.rmSync(tempDirs.pop(), { recursive: true, force: true })
  }
})

const videoDump = {
  chapters: [
    {
      chapterId: 1,
      lessonId: 10,
      tasks: [
        {
          id: 'task-1',
          videoId: 'vid-1',
          videoUrl: 'https://cdn.example/1',
          videoUrlAsTranslation: { kaz: 'https://cdn.example/1k' },
          locatedCountry: 'KZ',
        },
      ],
    },
  ],
}

describe('loadEnrichmentMaps', () => {
  it('loads task_videos.json by id', () => {
    const dir = makeSnapshotDir()
    fs.writeFileSync(
      path.join(dir, 'task_videos.json'),
      JSON.stringify(videoDump),
    )

    const maps = loadEnrichmentMaps(dir)
    expect(maps.videosPath).toBe(path.join(dir, 'task_videos.json'))
    expect(maps.videosById.get('task-1')?.videoUrl).toBe(
      'https://cdn.example/1',
    )
  })

  it('falls back to task_videos_grade_4.json alias', () => {
    const dir = makeSnapshotDir()
    fs.writeFileSync(
      path.join(dir, 'task_videos_grade_4.json'),
      JSON.stringify(videoDump),
    )

    const maps = loadEnrichmentMaps(dir)
    expect(maps.videosPath).toBe(path.join(dir, 'task_videos_grade_4.json'))
    expect(maps.videosById.get('task-1')?.videoId).toBe('vid-1')
  })

  it('warns and returns empty map when videos file missing', () => {
    const dir = makeSnapshotDir()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const maps = loadEnrichmentMaps(dir)
    expect(maps.videosById.size).toBe(0)
    expect(maps.videosPath).toBeNull()
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('no task_videos.json'),
    )
  })

  it('ignores task_hints.json if present', () => {
    const dir = makeSnapshotDir()
    fs.writeFileSync(
      path.join(dir, 'task_videos.json'),
      JSON.stringify(videoDump),
    )
    fs.writeFileSync(
      path.join(dir, 'task_hints.json'),
      JSON.stringify({
        chapters: [
          {
            tasks: [{ id: 'task-1', hint1: 'secret', hint2: 'more' }],
          },
        ],
      }),
    )

    const maps = loadEnrichmentMaps(dir)
    const enriched = withEnrichment({ id: 'task-1', type: 'Elixir.Task_x' }, maps)
    expect(enriched.videoUrl).toBe('https://cdn.example/1')
    expect(enriched.hint1).toBeNull()
    expect(enriched.hint2).toBeNull()
  })
})

describe('withEnrichment', () => {
  it('merges video fields onto matching task', () => {
    const enrichment = {
      videosById: new Map([
        [
          'task-1',
          {
            videoId: 'vid-1',
            videoUrl: 'https://cdn.example/1',
            videoUrlAsTranslation: { kaz: 'k' },
            locatedCountry: 'KZ',
          },
        ],
      ]),
    }

    const next = withEnrichment({ id: 'task-1', foo: 1 }, enrichment)
    expect(next).toEqual({
      id: 'task-1',
      foo: 1,
      hint1: null,
      hint2: null,
      videoId: 'vid-1',
      videoUrl: 'https://cdn.example/1',
      videoUrlAsTranslation: { kaz: 'k' },
      locatedCountry: 'KZ',
    })
  })

  it('sets null hints even when no video match', () => {
    const task = { id: 'missing', type: 'Elixir.Task_x' }
    const enrichment = { videosById: new Map() }
    const next = withEnrichment(task, enrichment)
    expect(next).not.toBe(task)
    expect(next).toEqual({
      id: 'missing',
      type: 'Elixir.Task_x',
      hint1: null,
      hint2: null,
    })
  })
})
