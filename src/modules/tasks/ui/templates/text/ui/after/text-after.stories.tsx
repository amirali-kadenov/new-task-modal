import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  HIDDEN_TASK_ARGTYPES,
  STORY_DOCS,
  storyDocs,
  templateDocs,
} from '../../../shared/storybook/story-docs'
import {
  AFTER_MATH_REGRESSION_GROUPS,
  ALL_GROUPS,
  getGroupControlOptions,
  makePlayMathRegressions,
  renderAllGroupsStory,
  renderDefaultStory,
  renderWithSolutionStory,
  type TemplateGroupFixture,
  type TextTemplateStoryMetaArgs,
} from '../../lib/storybook'
import type { TextTask } from '../../lib/types.task'

import groupsJson from './data/groups.json'
import fixture from './data/task.json'
import readme from './README.md?raw'

import { TextAfter as Template } from '.'

const task = fixture as unknown as TextTask
const groups = groupsJson as unknown as TemplateGroupFixture[]
const { groupIds, defaultGroup } = getGroupControlOptions(groups)

const ROOT_TITLE = 'Templates/Text/after'

const mathRegressionGroups = groups.filter((g) =>
  (AFTER_MATH_REGRESSION_GROUPS as readonly string[]).includes(g.group),
)

const meta = {
  title: 'Templates/Text/after',
  component: Template,
  args: {
    group: defaultGroup,
  },
  argTypes: {
    ...HIDDEN_TASK_ARGTYPES,
    group: {
      control: 'select',
      options: groupIds,
      description:
        'Structural group из data/groups.json (`all` — все в AllGroups)',
    },
  },
  parameters: templateDocs(readme),
} satisfies Meta<TextTemplateStoryMetaArgs>

export default meta
type Story = StoryObj<TextTemplateStoryMetaArgs>

export const Default: Story = {
  parameters: storyDocs(STORY_DOCS.default),
  argTypes: {
    group: { options: groupIds },
  },
  render: ({ group }) =>
    renderDefaultStory({
      Template,
      groups,
      fallbackTask: task,
      group,
      rootTitle: ROOT_TITLE,
    }),
}

export const WithSolution: Story = {
  parameters: storyDocs(STORY_DOCS.withSolution),
  argTypes: {
    group: { options: groupIds },
  },
  render: ({ group }) =>
    renderWithSolutionStory({
      Template,
      groups,
      fallbackTask: task,
      group,
    }),
}

/**
 * text_6: bare `см^2` / `мм^2` become math islands, so their cyrillic must keep
 * the prose font instead of MathJax's serif fallback.
 * `play` runs under `pnpm test:interactions` with real MathJax (not unit mocks).
 */
export const MathRegressions: Story = {
  parameters: {
    skipRunPlayButton: true,
  },
  play: makePlayMathRegressions({ uprightUnits: ['см', 'мм'] }),
  render: () =>
    renderAllGroupsStory({
      Template,
      groups: mathRegressionGroups,
      group: ALL_GROUPS,
      rootTitle: ROOT_TITLE,
    }),
}
