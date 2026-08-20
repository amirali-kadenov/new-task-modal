import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  ALL_GROUPS,
  getGroupControlOptions,
  makePlayAllGroupsSmoke,
  makePlayMathRegressions,
  renderAllGroupsStory,
  type TemplateGroupFixture,
  type TextTemplateStoryMetaArgs,
} from '../../lib/storybook'

import groupsJson from './data/groups.json'

import { TextAfter as Template } from '.'

const groups = groupsJson as unknown as TemplateGroupFixture[]
const { allOptions } = getGroupControlOptions(groups)
const ROOT_TITLE = 'Templates/Text/after'

const meta = {
  title: 'Templates/Text/after/Groups',
  tags: ['!autodocs'],
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
} satisfies Meta<TextTemplateStoryMetaArgs>

export default meta
type Story = StoryObj<TextTemplateStoryMetaArgs>

export const All: Story = {
  play: async (ctx) => {
    await makePlayAllGroupsSmoke()(ctx)
    await makePlayMathRegressions({ uprightUnits: ['см', 'мм'] })(ctx)
  },
  render: ({ group }) =>
    renderAllGroupsStory({
      Template,
      groups,
      group: group ?? ALL_GROUPS,
      rootTitle: ROOT_TITLE,
    }),
}
