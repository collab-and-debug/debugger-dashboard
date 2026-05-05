export function BreakpointsPanel({ breakpoints }) {
  if (breakpoints.length === 0) {
    return (
      <div style={containerStyle}>
        <p style={{ color: '#4b5563', fontSize: '13px' }}>No active breakpoints.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {breakpoints.map((bp, i) => (
        <div key={i} style={rowStyle}>

          {/* Color dot — who set it */}
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: bp.userColor || '#888',
            flexShrink: 0,
            marginTop: '3px',
          }} />

          {/* File + line */}
          <div style={{ flex: 1 }}>
            <span style={{ color: '#e2e8f0', fontSize: '13px', fontFamily: 'monospace' }}>
              {bp.file}
            </span>
            <span style={{ color: '#a78bfa', fontSize: '13px', fontFamily: 'monospace', marginLeft: '8px' }}>
              :{bp.line}
            </span>
          </div>

          {/* Set by */}
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            {bp.userName}
          </span>

        </div>
      ))}
    </div>
  );
}

const containerStyle = {
  background: '#0f172a',
  borderRadius: '8px',
  padding: '12px',
  minHeight: '80px',
};

const rowStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '6px 0',
  borderBottom: '1px solid #1e293b',
};