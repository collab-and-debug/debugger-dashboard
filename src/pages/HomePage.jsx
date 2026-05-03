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

    const res = await fetch(`${API}/session/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: createName })
    });

    const data = await res.json();

    // Store user info in localStorage
    localStorage.setItem('userId', createName);
    localStorage.setItem('userColor', randomColor());

    navigate(`/session/${data.sessionId}`);
  };

  // ── Join Session ────────────────────────────────────
  const handleJoin = async () => {
    if (!joinName.trim() || !joinSessionId.trim()) {
      return setError('Enter both name and session ID');
    }

    const res = await fetch(`${API}/session/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: joinName, sessionId: joinSessionId })
    });

    if (res.status === 404) return setError('Session not found');

    localStorage.setItem('userId', joinName);
    localStorage.setItem('userColor', randomColor());

    navigate(`/session/${joinSessionId}`);
  };

  return (
    <div>
      <h1>Collab Debugger</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Create */}
      <div>
        <h2>Create Session</h2>
        <input
          placeholder="Your name"
          value={createName}
          onChange={e => setCreateName(e.target.value)}
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      {/* Join */}
      <div>
        <h2>Join Session</h2>
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
  );
}

export default HomePage;