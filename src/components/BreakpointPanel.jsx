export function BreakpointsPanel({ breakpoints, presentUsers }) {
  const getColor = (userName, fallbackColor) => {
    const user = presentUsers.find((u) => u.userName === userName);
    return user?.color || fallbackColor || '#888';
  };

  return (
    <div style={containerStyle}>
      {breakpoints.length === 0 ? (
        <p style={{ color: '#8a6a43' }}>No breakpoints set yet. Add one from your editor.</p>
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
              <span style={{ color: '#3f2f1e', fontSize: '13px', fontFamily: 'monospace' }}>{bp.file}</span>
              <span
                style={{
                  color: '#ea580c',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  marginLeft: '8px',
                }}
              >
                :{bp.line}
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#8a6a43' }}>{bp.userName}</span>
          </div>
        ))
      )}
    </div>
  );
}

const containerStyle = {
  background: '#fffaf3',
  borderRadius: '8px',
  padding: '12px',
  minHeight: '80px',
  border: '1px solid #f5c48b',
};

const rowStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '6px 0',
  borderBottom: '1px solid #f3dfc2',
};
