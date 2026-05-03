// src/pages/SessionPage.jsx
import { useParams } from 'react-router-dom';

function SessionPage() {
  const { id } = useParams();

  const userId    = localStorage.getItem('userId');
  const userColor = localStorage.getItem('userColor');

  const copyId = () => {
    navigator.clipboard.writeText(id);
    alert('Session ID copied!');
  };

  return (
    <div>
      <h1>Debug Session</h1>

      {/* Session ID with copy button */}
      <div>
        <span>Session ID: <strong>{id}</strong></span>
        <button onClick={copyId}>Copy</button>
      </div>

      {/* User info */}
      <div>
        <span
          style={{
            background: userColor,
            padding: '4px 10px',
            borderRadius: '12px',
            color: '#fff'
          }}
        >
          {userId}
        </span>
      </div>
    </div>
  );
}

export default SessionPage;