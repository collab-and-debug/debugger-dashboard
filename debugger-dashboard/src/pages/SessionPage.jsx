import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebsockets';
import { LiveFeed } from '../components/LiveFeed';
import { StatusBadge } from '../components/StatusBadge';
import { BreakpointsPanel } from '../components/BreakpointPanel';
import { VariablesPanel } from '../components/variablesPanel';
import UserPresenceBar from '../components/UserPresenceBar';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../session-layout.css';

export default function SessionPage() {
  const [presentUsers, setPresentUsers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [breakpoints, setBreakpoints] = useState([]);
  const [variables, setVariables] = useState({});
  const [events, setEvents] = useState([]);

  const { id } = useParams();
  const userId = localStorage.getItem('userId');
  const userColor = localStorage.getItem('userColor');

  const { messages, sendMessage, connectionStatus } = useWebSocket(id);

  useEffect(() => {
    const latest = messages[messages.length - 1];
    if (!latest) return;

    setEvents(messages);

    if (latest.type === 'BREAKPOINT_HIT') {
      const newBp = {
        file: latest.payload.file,
        line: latest.payload.line,
        userName: latest.userName,
        userColor: latest.userColor,
      };
      setBreakpoints((prev) => {
        const exists = prev.some((b) => b.file === newBp.file && b.line === newBp.line);
        return exists ? prev : [...prev, newBp];
      });
    }

    if (latest.type === 'BREAKPOINT_REMOVED') {
      setBreakpoints((prev) =>
        prev.filter((b) => !(b.file === latest.payload.file && b.line === latest.payload.line))
      );
    }

    if (latest.type === 'VARIABLE_UPDATE') {
      setVariables(latest.payload.scopes);
    }

    if (latest.type === 'SESSION_SNAPSHOT') {
      const { breakpoints: snapBps, variables: snapVars, presentUsers: snapUsers, events: snapEvents } = latest.payload;
      if (snapBps) setBreakpoints(snapBps);
      if (snapVars) setVariables(snapVars);
      if (snapUsers) setPresentUsers(snapUsers);
      if (snapEvents) setEvents(snapEvents);
    }

    if (latest.type === 'user-joined' || latest.type === 'USER_JOINED') {
      setPresentUsers((prev) => {
        const exists = prev.some((user) => user.userName === latest.userName);
        return exists ? prev : [...prev, { userName: latest.userName, color: latest.color || latest.userColor }];
      });
    }

    if (latest.type === 'user-left' || latest.type === 'USER_LEFT') {
      setPresentUsers((prev) => prev.filter((u) => u.userName !== latest.userName));
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      setPresentUsers([]);
      setBreakpoints([]);
      setVariables([]);
      setEvents([]);
    };
  }, []);

  function copyId() {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const presenceEvents = messages.filter(
    (m) =>
      m.type === 'USER_JOINED' ||
      m.type === 'USER_LEFT' ||
      m.type === 'user-joined' ||
      m.type === 'user-left'
  );

  return (
    <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto' }}>
      <UserPresenceBar users={presentUsers} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '28px',
          flexWrap: 'wrap',
        }}
      >
        <h2 style={{ margin: 0, color: '#7c2d12', fontSize: '30px' }}>Collab Debugger</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#7c5a3d' }}>Session:</span>
          <code
            style={{
              background: '#fff8ef',
              color: '#7c2d12',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '13px',
              border: '1px solid #f5c48b',
            }}
          >
            {id}
          </code>
          <button onClick={copyId} style={{ fontSize: '12px' }}>
            {copied ? 'Copied!' : 'Copy ID'}
          </button>
        </div>

        <StatusBadge status={connectionStatus} />

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: userColor || '#888',
            }}
          />
          <span style={{ fontSize: '13px', color: '#3f2f1e' }}>{userId}</span>
        </div>
      </div>

      {connectionStatus === 'connecting' && <p style={{ color: '#9a3412' }}>Waiting for extension to connect...</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <StatCard label="Breakpoints" count={breakpoints.length} color="#ea580c" />
        <StatCard label="Variable Scopes" count={Object.keys(variables).length} color="#16a34a" />
        <StatCard label="Presence Events" count={presenceEvents.length} color="#f59e0b" />
      </div>

      <div className="session-layout" style={{ marginBottom: '24px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={sectionHeading}>BREAKPOINTS ({breakpoints.length})</h3>
          {connectionStatus === 'connecting' ? (
            <Skeleton count={4} height={30} style={{ marginBottom: '8px' }} />
          ) : (
            <BreakpointsPanel breakpoints={breakpoints} presentUsers={presentUsers} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={sectionHeading}>VARIABLES</h3>
          {connectionStatus === 'connecting' ? (
            <Skeleton count={4} height={30} style={{ marginBottom: '8px' }} />
          ) : (
            <VariablesPanel variables={variables} />
          )}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={sectionHeading}>LIVE EVENTS ({events.length})</h3>
        {connectionStatus === 'connecting' ? (
          <Skeleton count={4} height={30} style={{ marginBottom: '8px' }} />
        ) : (
          <LiveFeed events={events} presentUsers={presentUsers} />
        )}
      </div>

      {import.meta.env.DEV && (
        <div
          style={{
            borderTop: '1px solid #f5c48b',
            paddingTop: '16px',
            marginTop: '8px',
          }}
        >
          <h3 style={sectionHeading}>DEV TOOLS</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() =>
                sendMessage({
                  type: 'BREAKPOINT_HIT',
                  userName: userId,
                  userColor,
                  payload: { file: 'index.js', line: 42 },
                  timestamp: new Date().toISOString(),
                })
              }
            >
              + Breakpoint
            </button>

            <button
              onClick={() =>
                sendMessage({
                  type: 'BREAKPOINT_REMOVED',
                  userName: userId,
                  userColor,
                  payload: { file: 'index.js', line: 42 },
                  timestamp: new Date().toISOString(),
                })
              }
            >
              - Breakpoint
            </button>

            <button
              onClick={() =>
                sendMessage({
                  type: 'VARIABLE_UPDATE',
                  userName: userId,
                  userColor,
                  payload: {
                    scopes: {
                      local: { x: 42, name: 'Aishwarya', isActive: true },
                      global: { count: 7, config: null },
                    },
                  },
                  timestamp: new Date().toISOString(),
                })
              }
            >
              Send Variables
            </button>

            <button
              onClick={() =>
                sendMessage({
                  type: 'USER_JOINED',
                  userName: userId,
                  userColor,
                  payload: {},
                  timestamp: new Date().toISOString(),
                })
              }
            >
              Send Join
            </button>

            <button
              onClick={() =>
                sendMessage({
                  type: 'SESSION_SNAPSHOT',
                  userName: 'server',
                  userColor: null,
                  payload: {
                    breakpoints: [
                      { file: 'index.js', line: 10, userName: 'Raj', userColor: '#f87171' },
                      { file: 'utils.js', line: 34, userName: 'Priya', userColor: '#60a5fa' },
                    ],
                    variables: {
                      local: { count: 3, flag: false },
                      global: { appName: 'collab-debug' },
                    },
                  },
                  timestamp: new Date().toISOString(),
                })
              }
            >
              Send Snapshot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const sectionHeading = {
  fontSize: '13px',
  color: '#8a6a43',
  marginBottom: '8px',
  letterSpacing: '0.05em',
  fontWeight: 500,
};

function StatCard({ label, count, color }) {
  return (
    <div
      style={{
        background: '#fffaf3',
        borderRadius: '10px',
        padding: '12px 16px',
        borderLeft: `3px solid ${color}`,
        border: '1px solid #f5c48b',
      }}
    >
      <p style={{ fontSize: '12px', color: '#8a6a43', margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: '24px', fontWeight: 600, color, margin: 0 }}>{count}</p>
    </div>
  );
}
