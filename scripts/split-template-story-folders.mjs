/**
 * Split AllGroups / Trainer into folders and add Data stories for every
 * template that already has all-tasks.stories.tsx.
 *
 * Also patches family lib/storybook wrappers to forward `rootTitle` and
 * re-export data helpers from text/lib/storybook.
 *
 * Usage: node scripts/split-template-story-folders.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')
const templatesRoot = path.join(root, 'src/modules/tasks/ui/templates')

const walk = (dir, acc = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, acc)
    else acc.push(full)
  }
  return acc
}

const allTasksFiles = walk(templatesRoot).filter((f) =>
  f.endsWith('/all-tasks.stories.tsx'),
)

const stripExportBlock = (source, exportName) => {
  const re = new RegExp(
    `\\nexport const ${exportName}: Story = \\{[\\s\\S]*?\\n\\}\\n`,
    'g',
  )
  return source.replace(re, '\n')
}

const extractMetaTitle = (source) => {
  const m = source.match(/title:\s*'([^']+)'/)
  return m?.[1] ?? null
}

const extractImportPath = (source) => {
  const m = source.match(/} from '([^']+\/storybook[^']*)'/)
  return m?.[1] ?? null
}

const extractTemplateImport = (source) => {
  const m = source.match(/import \{\s*(\w+)\s+as Template\s*\} from '\.'/)
  return m?.[1] ?? null
}

const extractMetaArgsType = (source) => {
  const m = source.match(/satisfies Meta<([^>]+)>/)
  return m?.[1] ?? 'Record<string, unknown>'
}

const buildAllGroups = ({
  importPath,
  templateName,
  metaArgs,
  rootTitle,
}) => `import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  ALL_GROUPS,
  getGroupControlOptions,
  renderAllGroupsStory,
  type TemplateGroupFixture,
} from '${importPath}'

import groupsJson from './data/groups.json'

import { ${templateName} as Template } from '.'

const groups = groupsJson as unknown as TemplateGroupFixture[]
const { allOptions } = getGroupControlOptions(groups)
const ROOT_TITLE = '${rootTitle}'

const meta = {
  title: '${rootTitle}/All Groups',
  component: Template,
  args: {
    group: ALL_GROUPS,
  },
  argTypes: {
    group: {
      control: 'select',
      options: allOptions,
      description: 'Structural group из data/groups.json (\`all\` — все)',
    },
  },
  parameters: {
    skipRunPlayButton: true,
  },
} satisfies Meta<${metaArgs}>

export default meta
type Story = StoryObj<${metaArgs}>

export const All: Story = {
  render: ({ group }) =>
    renderAllGroupsStory({
      Template,
      groups,
      group: group ?? ALL_GROUPS,
      rootTitle: ROOT_TITLE,
    }),
}
`

const guessTaskType = (dir, mainSource) => {
  // Prefer existing type import from main stories
  const m = mainSource.match(
    /import type \{ (\w+) \} from ['"][^'"]*types\.task['"]/,
  )
  if (m) {
    const rel = mainSource.match(
      /import type \{ \w+ \} from ['"]([^'"]*types\.task)['"]/,
    )?.[1]
    return { name: m[1], importPath: rel }
  }
  // Fallback by family
  if (dir.includes('/text/'))
    return { name: 'TextTask', importPath: '../../lib/types.task' }
  if (dir.includes('/table/'))
    return { name: 'TableTask', importPath: '../../lib/types.task' }
  if (dir.includes('/formula/'))
    return { name: 'FormulaTask', importPath: '../../lib/types.task' }
  if (dir.includes('/equation/'))
    return { name: 'EquationTask', importPath: '../../shared/lib/types.task' }
  if (dir.includes('/test/'))
    return { name: 'TestTask', importPath: '../../lib/types.task' }
  if (dir.includes('/complex/'))
    return { name: 'ComplexTask', importPath: '../../lib/types.task' }
  if (dir.includes('/comparison/'))
    return { name: 'ComparisonTask', importPath: '../../lib/types.task' }
  if (dir.includes('/column-operation/'))
    return { name: 'ColumnOperationTask', importPath: '../../lib/types.task' }
  if (dir.includes('/answer-cell/'))
    return { name: 'AnswerCellTask', importPath: '../../lib/types.task' }
  return { name: 'any', importPath: null }
}

const resolveTaskImport = (templateDir, typeInfo, storybookImport) => {
  if (!typeInfo.importPath || typeInfo.name === 'any')
    return { name: 'any', stmt: '' }
  // Prefer relative from template dir to types.task near storybook
  // storybookImport like '../../lib/storybook' → '../../lib/types.task'
  const typesFromSb = storybookImport.replace(/\/storybook$/, '/types.task')
  // For equation: '../../shared/lib/storybook' → need types near shared
  let importPath = typesFromSb
  if (typeInfo.importPath) {
    // Use depth from templateDir based on storybook path
    importPath = typesFromSb
  }
  // Fix multi depth: ../../../lib/storybook → ../../../lib/types.task
  return {
    name: typeInfo.name,
    stmt: `import type { ${typeInfo.name} as Task } from '${importPath}'\n`,
    cast: 'Task',
  }
}

let updated = 0

for (const allTasksPath of allTasksFiles) {
  const dir = path.dirname(allTasksPath)
  const allTasksSrc = fs.readFileSync(allTasksPath, 'utf8')
  const allTasksTitle = extractMetaTitle(allTasksSrc)
  if (!allTasksTitle?.endsWith('/All Tasks')) {
    console.warn('skip (bad title):', allTasksPath)
    continue
  }
  const rootTitle = allTasksTitle.replace(/\/All Tasks$/, '')
  const importPath = extractImportPath(allTasksSrc)
  const templateName = extractTemplateImport(allTasksSrc)
  const metaArgs = extractMetaArgsType(allTasksSrc)
  if (!importPath || !templateName) {
    console.warn('skip (parse):', allTasksPath)
    continue
  }

  // Find main stories file (not all-tasks/all-groups/trainer/data)
  const stories = fs
    .readdirSync(dir)
    .filter(
      (n) =>
        n.endsWith('.stories.tsx') &&
        ![
          'all-tasks.stories.tsx',
          'all-groups.stories.tsx',
          'trainer.stories.tsx',
          'data.stories.tsx',
        ].includes(n),
    )
  if (stories.length !== 1) {
    console.warn('skip (stories count)', dir, stories)
    continue
  }
  const mainPath = path.join(dir, stories[0])
  let mainSrc = fs.readFileSync(mainPath, 'utf8')
  const hasPlay = mainSrc.includes('makePlayCorrectAnswerInTrainer')

  const typeInfo = guessTaskType(dir, mainSrc)
  const taskImp = resolveTaskImport(dir, typeInfo, importPath)
  const taskCast = taskImp.cast ?? typeInfo.name

  // --- write all-groups ---
  fs.writeFileSync(
    path.join(dir, 'all-groups.stories.tsx'),
    buildAllGroups({ importPath, templateName, metaArgs, rootTitle }),
  )

  // --- write trainer ---
  const trainerBody = `import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  getGroupControlOptions,
  getOpenInTrainerControls,
${hasPlay ? '  makePlayCorrectAnswerInTrainer,\n  makePlayWrongAnswerInTrainer,\n' : ''}  renderInTrainerStory,
  renderOpenInTrainerStory,
  type TemplateGroupFixture,
} from '${importPath}'
${taskImp.stmt || `// task typed as any\n`}
import groupsJson from './data/groups.json'
import fixture from './data/task.json'

import { ${templateName} as Template } from '.'

const task = fixture as unknown as ${taskCast === 'any' ? 'Record<string, unknown>' : taskCast}
const groups = groupsJson as unknown as TemplateGroupFixture[]
const openInTrainer = getOpenInTrainerControls(groups)
const { groupIds, defaultGroup } = getGroupControlOptions(groups)
const ROOT_TITLE = '${rootTitle}'

const meta = {
  title: '${rootTitle}/Trainer',
  component: Template,
  args: {
    group: defaultGroup,
  },
  argTypes: {
    group: {
      control: 'select',
      options: groupIds,
      description: 'Structural group из data/groups.json',
    },
  },
} satisfies Meta<${metaArgs}>

export default meta
type Story = StoryObj<${metaArgs}>

export const InTrainer: Story = {
  render: ({ group }) =>
    renderInTrainerStory({
      Template,
      groups,
      fallbackTask: task as never,
      group,
      rootTitle: ROOT_TITLE,
    }),${
      hasPlay
        ? `
  play: makePlayCorrectAnswerInTrainer({
    groups,
    fallbackTask: task as never,
  }),`
        : ''
    }
}

export const InTrainerWrongAnswer: Story = {
  render: ({ group }) =>
    renderInTrainerStory({
      Template,
      groups,
      fallbackTask: task as never,
      group,
      rootTitle: ROOT_TITLE,
    }),${
      hasPlay
        ? `
  play: makePlayWrongAnswerInTrainer({
    groups,
    fallbackTask: task as never,
  }),`
        : ''
    }
}

export const OpenInTrainer: Story = {
  args: {
    group: openInTrainer.defaultGroup,
    taskId: openInTrainer.defaultTaskId,
  },
  argTypes: {
    group: {
      control: 'select',
      options: openInTrainer.groupIds,
      description: 'Structural group из data/groups.json',
    },
    taskId: {
      control: false,
      description: 'taskId задач выбранной group (4_1_1, …) — select в canvas',
    },
  },
  render: ({ group, taskId }) =>
    renderOpenInTrainerStory({
      groups,
      group,
      taskId,
      rootTitle: ROOT_TITLE,
    }),
}
`
  fs.writeFileSync(path.join(dir, 'trainer.stories.tsx'), trainerBody)

  // --- write data ---
  const dataBody = `import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  getGroupControlOptions,
  getOpenInTrainerControls,
  normalizeAllTasksFile,
  renderDataAllGroupsStory,
  renderDataAllTasksStory,
  renderDataOneTaskStory,
  type AllTasksFile,
  type TemplateGroupFixture,
} from '${importPath}'
${taskImp.stmt || ''}
import allTasksJson from './data/all-tasks.json'
import groupsJson from './data/groups.json'
import fixture from './data/task.json'

import { ${templateName} as Template } from '.'

const task = fixture as unknown as ${taskCast === 'any' ? 'Record<string, unknown>' : taskCast}
const groups = groupsJson as unknown as TemplateGroupFixture[]
const allTasks = normalizeAllTasksFile(
  allTasksJson as unknown as AllTasksFile,
)
const openInTrainer = getOpenInTrainerControls(groups)
const { groupIds, defaultGroup } = getGroupControlOptions(groups)
const ROOT_TITLE = '${rootTitle}'

const meta = {
  title: '${rootTitle}/Data',
  component: Template,
  args: {
    grade: allTasks.defaultGrade,
    group: defaultGroup,
    taskId: openInTrainer.defaultTaskId,
  },
  argTypes: {
    grade: {
      control: 'select',
      options: allTasks.grades,
      description: 'Класс (grade)',
    },
    group: {
      control: 'select',
      options: groupIds,
      description: 'Structural group',
    },
    taskId: {
      control: false,
      description: 'taskId — select в canvas',
    },
  },
} satisfies Meta<${metaArgs}>

export default meta
type Story = StoryObj<${metaArgs}>

export const OneTask: Story = {
  name: 'One Task',
  render: ({ grade, group, taskId }) =>
    renderDataOneTaskStory({
      rootTitle: ROOT_TITLE,
      groups,
      allTasks: allTasksJson as unknown as AllTasksFile,
      fallbackTask: task as never,
      grade: grade ?? allTasks.defaultGrade,
      group,
      taskId,
    }),
}

export const AllGroups: Story = {
  name: 'All Groups',
  render: () =>
    renderDataAllGroupsStory({
      rootTitle: ROOT_TITLE,
      groups,
    }),
}

export const AllTasks: Story = {
  name: 'All Tasks',
  render: ({ grade }) =>
    renderDataAllTasksStory({
      rootTitle: ROOT_TITLE,
      allTasks: allTasksJson as unknown as AllTasksFile,
      grade: grade ?? allTasks.defaultGrade,
    }),
}
`
  fs.writeFileSync(path.join(dir, 'data.stories.tsx'), dataBody)

  // --- update all-tasks ---
  let nextAllTasks = allTasksSrc
  if (!nextAllTasks.includes('ROOT_TITLE')) {
    nextAllTasks = nextAllTasks.replace(
      /const allTasks = normalizeAllTasksFile\(/,
      `const ROOT_TITLE = '${rootTitle}'\n\nconst allTasks = normalizeAllTasksFile(`,
    )
  }
  if (!nextAllTasks.includes('skipRunPlayButton')) {
    nextAllTasks = nextAllTasks.replace(
      /} satisfies Meta/,
      `  parameters: {\n    skipRunPlayButton: true,\n  },\n} satisfies Meta`,
    )
  }
  if (!nextAllTasks.includes('rootTitle:')) {
    nextAllTasks = nextAllTasks.replace(
      /renderAllTasksStory\(\{\n([\s\S]*?)grade: grade \?\? allTasks\.defaultGrade,\n(\s*)\}\)/,
      (match, body, indent) => {
        if (body.includes('rootTitle')) return match
        return `renderAllTasksStory({\n${body}grade: grade ?? allTasks.defaultGrade,\n${indent}rootTitle: ROOT_TITLE,\n${indent}})`
      },
    )
  }
  fs.writeFileSync(allTasksPath, nextAllTasks)

  // --- strip main stories ---
  mainSrc = stripExportBlock(mainSrc, 'AllGroups')
  mainSrc = stripExportBlock(mainSrc, 'InTrainer')
  mainSrc = stripExportBlock(mainSrc, 'InTrainerWrongAnswer')
  mainSrc = stripExportBlock(mainSrc, 'OpenInTrainer')

  // Remove unused imports from main
  const unused = [
    'ALL_GROUPS',
    'makePlayCorrectAnswerInTrainer',
    'makePlayWrongAnswerInTrainer',
    'renderAllGroupsStory',
    'renderInTrainerStory',
    'getOpenInTrainerControls',
    'renderOpenInTrainerStory',
  ]
  for (const name of unused) {
    if (!mainSrc.includes(name + '(') && !mainSrc.includes(name + ',')) {
      // still might be in import list
    }
    if (
      !new RegExp(`\\b${name}\\b`).test(
        mainSrc.replace(/import \{[\s\S]*?\} from/, ''),
      )
    ) {
      mainSrc = mainSrc.replace(new RegExp(`,\\s*${name}\\b`, 'g'), '')
      mainSrc = mainSrc.replace(new RegExp(`${name}\\s*,\\s*`, 'g'), '')
    }
  }

  // Remove openInTrainer / allOptions if unused
  if (!mainSrc.includes('openInTrainer.')) {
    mainSrc = mainSrc.replace(
      /const openInTrainer = getOpenInTrainerControls\(groups\)\n/,
      '',
    )
  }
  if (!mainSrc.includes('allOptions')) {
    mainSrc = mainSrc.replace(
      /const \{ groupIds, defaultGroup, allOptions \} = getGroupControlOptions\(groups\)/,
      'const { groupIds, defaultGroup } = getGroupControlOptions(groups)',
    )
    mainSrc = mainSrc.replace(
      /options: allOptions,\n\s*description: 'Structural group из data\/groups\.json \(`all` — все в AllGroups\)',\n/,
      "options: groupIds,\n      description: 'Structural group из data/groups.json',\n",
    )
  }

  // Add ROOT_TITLE + pass to Default/WithSolution
  if (!mainSrc.includes('const ROOT_TITLE = ')) {
    const titleMatch = mainSrc.match(/title:\s*'([^']+)'/)
    const mainTitle = titleMatch?.[1] ?? rootTitle
    mainSrc = mainSrc.replace(
      /const \{ groupIds, defaultGroup[^}]*\} = getGroupControlOptions\(groups\)\n/,
      (m) => `${m}\nconst ROOT_TITLE = '${mainTitle}'\n`,
    )
  }

  // Inject rootTitle into renderDefaultStory / renderWithSolutionStory calls
  mainSrc = mainSrc.replace(
    /renderDefaultStory\(\{\s*Template,\s*groups,\s*fallbackTask:\s*task,\s*group\s*\}\)/g,
    'renderDefaultStory({ Template, groups, fallbackTask: task, group, rootTitle: ROOT_TITLE })',
  )
  mainSrc = mainSrc.replace(
    /renderWithSolutionStory\(\{\s*Template,\s*groups,\s*fallbackTask:\s*task,\s*group\s*\}\)/g,
    'renderWithSolutionStory({ Template, groups, fallbackTask: task, group, rootTitle: ROOT_TITLE })',
  )
  mainSrc = mainSrc.replace(
    /renderWithSolutionStory\(\{\n\s*Template,\n\s*groups,\n\s*fallbackTask:\s*task,\n\s*group\n\s*\}\)/g,
    `renderWithSolutionStory({
      Template,
      groups,
      fallbackTask: task,
      group,
      rootTitle: ROOT_TITLE,
    })`,
  )

  fs.writeFileSync(mainPath, mainSrc)
  updated += 1
  console.log('ok', path.relative(root, dir))
}

console.log(`Updated ${updated} templates`)
