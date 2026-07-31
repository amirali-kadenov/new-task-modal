import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentType, CSSProperties, SVGProps } from 'react'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const iconModules = import.meta.glob<IconComponent>(
  '/src/assets/icons/**/*.svg',
  { eager: true, import: 'default' },
)

const groupIcons = () => {
  const groups = new Map<
    string,
    { name: string; path: string; Icon: IconComponent }[]
  >()

  for (const [path, Icon] of Object.entries(iconModules)) {
    const relative = path.replace(/^\/src\/assets\/icons\//, '')
    const parts = relative.split('/')
    const group = parts.length > 1 ? parts[0] : '(root)'
    const name = parts[parts.length - 1] ?? relative

    const list = groups.get(group) ?? []
    list.push({ name, path: relative, Icon })
    groups.set(group, list)
  }

  for (const list of groups.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name))
  }

  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
}

const pageStyle: CSSProperties = {
  padding: 24,
  fontFamily: 'var(--font-halvar)',
  background: 'var(--bg-canvas)',
  color: 'var(--text-primary)',
  minHeight: '100vh',
}

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: 12,
}

const cellStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  padding: 12,
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-s)',
}

const IconsPreview = () => {
  const groups = groupIcons()

  return (
    <div style={pageStyle}>
      <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700 }}>
        Icons ({Object.keys(iconModules).length})
      </h2>
      {groups.map(([group, icons]) => (
        <div key={group} style={{ marginBottom: 24 }}>
          <h3
            style={{
              margin: '0 0 12px',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-secondary)',
            }}
          >
            {group}
          </h3>
          <div style={gridStyle}>
            {icons.map(({ name, path, Icon }) => (
              <div key={path} style={cellStyle} title={path}>
                <Icon
                  width={24}
                  height={24}
                  style={{ color: 'var(--text-primary)' }}
                />
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                    wordBreak: 'break-all',
                  }}
                >
                  {name}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: 'Design System/Icons',
  component: IconsPreview,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof IconsPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
