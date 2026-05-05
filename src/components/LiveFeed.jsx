import { useEffect, useRef } from 'react';

const TYPE_COLORS = {
  BREAKPOINT_HIT:  '#a78bfa',
  VARIABLE_UPDATE: '#34d399',
  USER_JOINED:     '#60a5fa',
  USER_LEFT:       '#f87171',
  DEFAULT:         '#9ca3af',
};

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function LiveFeed({ messages }) {
  const bottomRef = useRef(null);

  // auto-scroll to latest event
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      height: '300px',
      overflowY: 'auto',
      background: '#0f172a',
      borderRadius: '8px',
      padding: '12px',
      fontFamily: 'monospace',
      fontSize: '13px',
    }}>
      {messages.length === 0 && (
        <p style={{ color: '#4b5563' }}>Waiting for events...</p>
      )}

      {messages.map((msg, i) => (
        <div key={i} style={{ marginBottom: '8px', display: 'flex', gap: '10px' }}>
          <span style={{ color: '#4b5563', flexShrink: 0 }}>
            {formatTime(msg.timestamp)}
          </span>
          <span style={{
            color: TYPE_COLORS[msg.type] || TYPE_COLORS.DEFAULT,
            flexShrink: 0,
          }}>
            {msg.type}
          </span>
          <span style={{ color: '#e2e8f0' }}>
            {msg.userName}
          </span>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}