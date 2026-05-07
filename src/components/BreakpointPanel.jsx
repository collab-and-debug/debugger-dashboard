export function BreakpointsPanel({ breakpoints, presentUsers }) {
  const getColor = (userName, fallbackColor) => {
    const user = presentUsers.find((u) => u.userName === userName);
    return user?.color || fallbackColor || '#888';
  };

  return (
    <div style={containerStyle}>
      {breakpoints.length === 0 ? (
        <p style={{ color: '#888' }}>No breakpoints set yet. Add one from your editor.</p>
      ) : (
        breakpoints.map((bp, index) => (
          <div key={bp.id || `${bp.file}-${bp.line}-${index}`} style={rowStyle}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: getColor(bp.userName, bp.userColor),
                flexShrink: 0,
                marginTop: '3px',
              }}
            />
            <div style={{ flex: 1 }}>
              <span style={{ color: '#e2e8f0', fontSize: '13px', fontFamily: 'monospace' }}>{bp.file}</span>
              <span
                style={{
                  color: '#a78bfa',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  marginLeft: '8px',
                }}
              >
                :{bp.line}
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{bp.userName}</span>
          </div>
        ))
      )}
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
