const STYLES = {
  connected: { background: '#dcfce7', color: '#166534' },
  connecting: { background: '#ffedd5', color: '#c2410c' },
  disconnected: { background: '#fee2e2', color: '#b91c1c' },
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