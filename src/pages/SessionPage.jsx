import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { LiveFeed } from '../components/LiveFeed';
import { StatusBadge } from '../components/StatusBadge';
import { BreakpointsPanel } from '../components/BreakpointsPanel';
import { VariablesPanel } from '../components/VariablesPanel';

export default function SessionPage() {
  const { id } = useParams();
  const userId   = localStorage.getItem('userId');
  const userColor = localStorage.getItem('userColor');

  const { messages, sendMessage, connectionStatus } = useWebSocket(id);

  const [copied, setCopied]         = useState(false);
  const [breakpoints, setBreakpoints] = useState([]);
  const [variables, setVariables]   = useState({});

  // ── Process incoming WebSocket messages ──────────────────────
  useEffect(() => {
    const latest = messages[messages.length - 1];
    if (!latest) return;

    if (latest.type === 'BREAKPOINT_HIT') {
      const newBp = {
        file:      latest.payload.file,
        line:      latest.payload.line,
        userName:  latest.userName,
        userColor: latest.userColor,
      };
      setBreakpoints(prev => {
        const exists = prev.some(b => b.file === newBp.file && b.line === newBp.line);
        return exists ? prev : [...prev, newBp];
      });
    }

    if (latest.type === 'BREAKPOINT_REMOVED') {
      setBreakpoints(prev =>
        prev.filter(b => !(b.file === latest.payload.file && b.line === latest.payload.line))
      );
    }

    if (latest.type === 'VARIABLE_UPDATE') {
      setVariables(latest.payload.scopes);
    }

    if (latest.type === 'SESSION_SNAPSHOT') {
      const { breakpoints: snapBps, variables: snapVars } = latest.payload;
      if (snapBps) setBreakpoints(snapBps);
      if (snapVars) setVariables(snapVars);
    }

  }, [messages]);

  // ── Copy session ID ──────────────────────────────────────────
  function copyId() {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Filtered message counts for stats ───────────────────────
  const presenceEvents = messages.filter(
    m => m.type === 'USER_JOINED' || m.type === 'USER_LEFT'
  );

  return (
    <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto' }}>

      {/* ── Header ────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '28px',
        flexWrap: 'wrap',
      }}>
        <h2 style={{ margin: 0, color: '#e2e8f0' }}>Collab Debugger</h2>

        {/* Session ID + copy */}
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

        {/* Current user */}
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

      {/* ── Stats row ─────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <StatCard label="Breakpoints"     count={breakpoints.length}    color="#a78bfa" />
        <StatCard label="Variable Scopes" count={Object.keys(variables).length} color="#34d399" />
        <StatCard label="Presence Events" count={presenceEvents.length} color="#60a5fa" />
      </div>

      {/* ── Breakpoints + Variables panels ────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div>
          <h3 style={sectionHeading}>BREAKPOINTS ({breakpoints.length})</h3>
          <BreakpointsPanel breakpoints={breakpoints} />
        </div>
        <div>
          <h3 style={sectionHeading}>VARIABLES</h3>
          <VariablesPanel variables={variables} />
        </div>
      </div>

      {/* ── Live Feed ─────────────────────────────────────────── */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={sectionHeading}>LIVE EVENTS ({messages.length})</h3>
        <LiveFeed messages={messages} />
      </div>

      {/* ── Dev tools (development only) ──────────────────────── */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '16px',
          marginTop: '8px',
        }}>
          <h3 style={sectionHeading}>DEV TOOLS</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>

            <button onClick={() => sendMessage({
              type: 'BREAKPOINT_HIT',
              userName: userId,
              userColor,
              payload: { file: 'index.js', line: 42 },
              timestamp: new Date().toISOString(),
            })}>
              + Breakpoint
            </button>

            <button onClick={() => sendMessage({
              type: 'BREAKPOINT_REMOVED',
              userName: userId,
              userColor,
              payload: { file: 'index.js', line: 42 },
              timestamp: new Date().toISOString(),
            })}>
              - Breakpoint
            </button>

            <button onClick={() => sendMessage({
              type: 'VARIABLE_UPDATE',
              userName: userId,
              userColor,
              payload: {
                scopes: {
                  local:  { x: 42, name: 'Aishwarya', isActive: true },
                  global: { count: 7, config: null },
                }
              },
              timestamp: new Date().toISOString(),
            })}>
              Send Variables
            </button>

            <button onClick={() => sendMessage({
              type: 'USER_JOINED',
              userName: userId,
              userColor,
              payload: {},
              timestamp: new Date().toISOString(),
            })}>
              Send Join
            </button>

            <button onClick={() => sendMessage({
              type: 'SESSION_SNAPSHOT',
              userName: 'server',
              userColor: null,
              payload: {
                breakpoints: [
                  { file: 'index.js', line: 10, userName: 'Raj',   userColor: '#f87171' },
                  { file: 'utils.js', line: 34, userName: 'Priya', userColor: '#60a5fa' },
                ],
                variables: {
                  local:  { count: 3, flag: false },
                  global: { appName: 'collab-debug' },
                }
              },
              timestamp: new Date().toISOString(),
            })}>
              Send Snapshot
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

// ── Shared styles ────────────────────────────────────────────────
const sectionHeading = {
  fontSize: '13px',
  color: '#94a3b8',
  marginBottom: '8px',
  letterSpacing: '0.05em',
  fontWeight: 500,
};

// ── StatCard ─────────────────────────────────────────────────────
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