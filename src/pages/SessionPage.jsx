import { useParams } from 'react-router-dom';
import { useState } from 'react';
import  useWebsocket from '../Hooks/useWebSocket';
import  LiveFeed  from '../components/LiveFeed';
import  StatusBadge  from '../components/StatusBadge'

export default function SessionPage() {
  const { id } = useParams();
  const userId = localStorage.getItem('userId');
  const userColor = localStorage.getItem('userColor');

  const { messages, sendMessage, connectionStatus } = useWebSocket(id);
  const [copied, setCopied] = useState(false);

  function copyId() {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const breakpoints = messages.filter(m => m.type === 'BREAKPOINT_HIT');
  const variables   = messages.filter(m => m.type === 'VARIABLE_UPDATE');
  const presence    = messages.filter(m => m.type === 'USER_JOINED' || m.type === 'USER_LEFT');

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
      }}>
        <h2 style={{ margin: 0 }}>Collab Debugger</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>Session:</span>
          <code style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '13px',
          }}>
            {id}
          </code>
          <button onClick={copyId} style={{ fontSize: '12px' }}>
            {copied ? 'Copied!' : 'Copy ID'}
          </button>
        </div>

        <StatusBadge status={connectionStatus} />

        {/* Current user pill */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: userColor || '#888',
          }} />
          <span style={{ fontSize: '13px', color: '#e2e8f0' }}>{userId}</span>
        </div>
      </div>

      {/* ── Live Feed ── */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>
          LIVE EVENTS
        </h3>
        <LiveFeed messages={messages} />
      </div>

      {/* ── Stats row — placeholder for future panels ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <StatCard label="Breakpoints" count={breakpoints.length} color="#a78bfa" />
        <StatCard label="Variable Updates" count={variables.length} color="#34d399" />
        <StatCard label="Presence Events" count={presence.length} color="#60a5fa" />
      </div>

      {/* ── Send test event (dev only) ── */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>
            DEV TOOLS
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => sendMessage({
              type: 'BREAKPOINT_HIT',
              userName: userId,
              payload: { line: 42, file: 'index.js' },
              timestamp: new Date().toISOString(),
            })}>
              Send Breakpoint
            </button>
            <button onClick={() => sendMessage({
              type: 'VARIABLE_UPDATE',
              userName: userId,
              payload: { name: 'count', value: 7 },
              timestamp: new Date().toISOString(),
            })}>
              Send Variable
            </button>
            <button onClick={() => sendMessage({
              type: 'USER_JOINED',
              userName: userId,
              payload: {},
              timestamp: new Date().toISOString(),
            })}>
              Send Join
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// ── Small stat card component (local, no separate file needed) ──
function StatCard({ label, count, color }) {
  return (
    <div style={{
      background: '#1e293b',
      borderRadius: '8px',
      padding: '12px 16px',
      borderLeft: `3px solid ${color}`,
    }}>
      <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: '24px', fontWeight: 600, color, margin: 0 }}>{count}</p>
    </div>
  );
}