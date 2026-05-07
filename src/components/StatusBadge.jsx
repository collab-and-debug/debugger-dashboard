const STYLES = {
  connected: { background: '#064e3b', color: '#34d399' },
  connecting: { background: '#1c1917', color: '#fbbf24' },
  disconnected: { background: '#450a0a', color: '#f87171' },
};

export function StatusBadge({ status }) {
  const normalizedStatus = String(status || 'disconnected').toLowerCase();
  const style = STYLES[normalizedStatus] || STYLES.disconnected;

  return (
    <span
      style={{
        ...style,
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 500,
      }}
    >
      {normalizedStatus === 'connecting'
        ? 'Connecting...'
        : normalizedStatus === 'connected'
          ? 'Connected'
          : 'Disconnected'}
    </span>
  );
}
