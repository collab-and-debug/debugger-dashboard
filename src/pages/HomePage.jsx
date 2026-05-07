// src/pages/HomePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:3000';

// Random hex color for user
const randomColor = () => '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');

function HomePage() {
  const navigate = useNavigate();

  // Create session state
  const [createName, setCreateName] = useState('');

  // Join session state
  const [joinName, setJoinName]       = useState('');
  const [joinSessionId, setJoinSessionId] = useState('');

  const [error, setError] = useState('');

  // ── Create Session ──────────────────────────────────
  const handleCreate = async () => {
    if (!createName.trim()) return setError('Enter your name');
    setError('');

    try {
      const res = await fetch(`${API}/session/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: createName })
      });

      if (!res.ok) {
        throw new Error('Could not create session');
      }

      const data = await res.json();

      localStorage.setItem('userId', createName);
      localStorage.setItem('userColor', randomColor());

      navigate(`/session/${data.sessionId}`);
    } catch (err) {
      setError('Cannot reach the session server on http://localhost:3000');
    }
  };

  // ── Join Session ────────────────────────────────────
  const handleJoin = async () => {
    if (!joinName.trim() || !joinSessionId.trim()) {
      return setError('Enter both name and session ID');
    }
    setError('');

    try {
      const res = await fetch(`${API}/session/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: joinName, sessionId: joinSessionId })
      });

      if (res.status === 404) return setError('Session not found');
      if (!res.ok) throw new Error('Could not join session');

      localStorage.setItem('userId', joinName);
      localStorage.setItem('userColor', randomColor());

      navigate(`/session/${joinSessionId}`);
    } catch (err) {
      setError('Cannot reach the session server on http://localhost:3000');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div className="home-layout" style={{ width: '100%', maxWidth: '920px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px' }}>
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid #1e293b',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 30px 80px rgba(2, 6, 23, 0.45)',
          }}
        >
          <p style={{ margin: '0 0 12px', color: '#60a5fa', letterSpacing: '0.08em', fontSize: '12px', textTransform: 'uppercase' }}>
            Collaborative Debugging
          </p>
          <h1 style={{ margin: '0 0 12px', fontSize: '48px', lineHeight: 1.05 }}>Collab Debugger</h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '16px', lineHeight: 1.6 }}>
            Create a shared debugging room, invite teammates, and watch breakpoints, variables, and live activity update together.
          </p>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.96)',
            border: '1px solid #1e293b',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 24px 60px rgba(2, 6, 23, 0.35)',
          }}
        >
          {error && <p style={{ color: '#fca5a5', marginTop: 0 }}>{error}</p>}

          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '24px' }}>Create Session</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                placeholder="Your name"
                value={createName}
                onChange={e => setCreateName(e.target.value)}
                style={{ flex: 1, minWidth: '220px' }}
              />
              <button onClick={handleCreate}>Create</button>
            </div>
          </div>

          <div>
            <h2 style={{ margin: '0 0 16px', fontSize: '24px' }}>Join Session</h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              <input
                placeholder="Your name"
                value={joinName}
                onChange={e => setJoinName(e.target.value)}
              />
              <input
                placeholder="Session ID"
                value={joinSessionId}
                onChange={e => setJoinSessionId(e.target.value)}
              />
              <button onClick={handleJoin}>Join</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
