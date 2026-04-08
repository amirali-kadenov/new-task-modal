export const ProgressBar = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {Array.from({ length: 15 }, (_, i) => (
        <div
          key={i}
          style={{
            width: 17,
            height: 6,
            borderRadius: 4,
            backgroundColor: 'var(--bg-subtle)',
          }}
        ></div>
      ))}
    </div>
  )
}
