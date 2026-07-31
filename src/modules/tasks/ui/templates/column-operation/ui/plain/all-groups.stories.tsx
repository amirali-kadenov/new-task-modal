import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  ALL_GROUPS,
  getGroupControlOptions,
  renderAllGroupsStory,
  type TemplateGroupFixture,
  type ColumnOperationStoryMetaArgs,
  makePlayAllGroupsSmoke,
} from '../../lib/storybook'

import groupsJson from './data/groups.json'

import { ColumnOperationPlain as Template } from '.'

const groups = groupsJson as unknown as TemplateGroupFixture[]
const { allOptions } = getGroupControlOptions(groups)
const ROOT_TITLE = 'Templates/ColumnOperation/plain'

const meta = {
  title: 'Templates/ColumnOperation/plain/Groups',
  component: Template,
  args: {
    group: ALL_GROUPS,
  },
  argTypes: {
    group: {
      control: 'select',
      options: allOptions,
      description: 'Structural group из data/groups.json (`all` — все)',
    },
  },
  parameters: {
    skipRunPlayButton: true,
  },
} satisfies Meta<ColumnOperationStoryMetaArgs>

export default meta
type Story = StoryObj<ColumnOperationStoryMetaArgs>

export const All: Story = {
  play: makePlayAllGroupsSmoke(),
  render: ({ group }) =>
    renderAllGroupsStory({
      Template,
      groups,
      group: group ?? ALL_GROUPS,
      rootTitle: ROOT_TITLE,
    }),
}
