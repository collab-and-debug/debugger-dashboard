// src/pages/SessionPage.jsx
import { useParams } from 'react-router-dom';

function SessionPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Session Page</h1>
      <p>Session ID: {id}</p>
    </div>
  );
}

export default SessionPage;