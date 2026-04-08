import { lazy, type LazyExoticComponent } from 'react'

import { type TemplateType } from '@/modules/tasks/model/template-map'
import type { Task } from '@/types/api/task'

import {
  generateModuleTemplateMap,
  type ModuleTemplateMap,
} from './generate-module-template-map'

type TemplateCache = Map<string, LazyExoticComponent<TemplateType>>

const cache: TemplateCache = new Map()

let map: ModuleTemplateMap | null = null

void (async () => {
  map = await generateModuleTemplateMap()
})()

export const getTaskComponent = (activeTask: Task | null) => {
  if (!activeTask || !map) return null

  const match = activeTask.type.match(/Elixir\.Task_(\d+)_(\d+)_(\d+)/)

  if (!match) return null

  const [, grade, chapter, task] = match
  const key = `${grade}_${chapter}_${task}`

  if (cache.has(key)) {
    return cache.get(key)!
  }

  const loader = map.get(key)

  if (!loader) {
    throw new Error(`Type not found for task ${task} in chapter ${chapter}`)
  }

  const component = lazy(loader)

  cache.set(key, component)

  return component
}
