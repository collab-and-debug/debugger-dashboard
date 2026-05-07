import { useEffect, useRef } from 'react';

export function LiveFeed({ events, presentUsers }) {
  const feedRef = useRef();

  const getColor = (userName) => {
    const user = presentUsers.find((u) => u.userName === userName);
    return user?.color || '#888';
  };

  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
    if (isAtBottom) el.scrollTop = el.scrollHeight;
  }, [events]);

  return (
    <div ref={feedRef} style={{ overflowY: 'auto', maxHeight: '300px' }}>
      {events.length === 0 ? (
        <p style={{ color: '#888' }}>Waiting for events...</p>
      ) : (
        events.map((event, i) => (
          <div
            key={i}
            style={{
              borderLeft: `3px solid ${getColor(event.userName)}`,
              paddingLeft: '8px',
              marginBottom: '6px',
            }}
          >
            <span style={{ color: getColor(event.userName), fontWeight: 'bold' }}>{event.userName}</span>
            <span> - {event.type} at {event.timestamp}</span>
          </div>
        ))
      )}
    </div>
  );
}
