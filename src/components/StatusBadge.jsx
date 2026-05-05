const STYLES = {
  Connected:    { background: '#064e3b', color: '#34d399' },
  Connecting:   { background: '#1c1917', color: '#fbbf24' },
  Disconnected: { background: '#450a0a', color: '#f87171' },
};

export function StatusBadge({ status }) {
  const style = STYLES[status] || STYLES.Disconnected;
  return (
    <span style={{
      ...style,
      padding: '3px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 500,
    }}>
      {status === 'Connecting' ? '⏳ Connecting...' : status === 'Connected' ? '● Connected' : '○ Disconnected'}
    </span>
  );
}