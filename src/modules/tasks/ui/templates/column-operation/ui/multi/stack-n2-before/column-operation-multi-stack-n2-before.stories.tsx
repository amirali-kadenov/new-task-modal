import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  HIDDEN_TASK_ARGTYPES,
  STORY_DOCS,
  storyDocs,
  templateDocs,
} from '../../../../shared/storybook/story-docs'
import {
  getGroupControlOptions,
  pickOperationFixture,
  renderAllOperationsStory,
  renderDefaultStory,
  renderOperationStory,
  renderWithSolutionStory,
  type ColumnOperationStoryMetaArgs,
  type OperationFixture,
  type TemplateGroupFixture,
} from '../../../lib/storybook'
import type { ColumnOperationTask } from '../../../lib/types.task'

import groupsJson from './data/groups.json'
import operationsJson from './data/operations.json'
import fixture from './data/task.json'
import readme from './README.md?raw'

import { ColumnOperationMultiStackN2Before as Template } from '.'

const task = fixture as unknown as ColumnOperationTask
const groups = groupsJson as unknown as TemplateGroupFixture[]
const operations = operationsJson as unknown as OperationFixture[]
const { groupIds, defaultGroup } = getGroupControlOptions(groups)

const ROOT_TITLE = 'Templates/ColumnOperation/multi/stack-n2-before'

const meta = {
  title: 'Templates/ColumnOperation/multi/stack-n2-before',
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
        'Операция из data/groups.json: plus / minus / times / div (`all` — все в AllGroups)',
    },
  },
  parameters: templateDocs(readme),
} satisfies Meta<ColumnOperationStoryMetaArgs>

export default meta
type Story = StoryObj<ColumnOperationStoryMetaArgs>

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

/** Multi covers only division (частное / остаток). */
export const Division: Story = {
  render: () =>
    renderOperationStory({
      Template,
      fixture: pickOperationFixture(operations, 'div'),
    }),
}

export const AllOperations: Story = {
  render: () => renderAllOperationsStory({ Template, fixtures: operations }),
}
