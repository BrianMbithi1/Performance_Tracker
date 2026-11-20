import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { deleteMatch } from '../api';
import MatchCard from '../components/MatchCard';
import Message from '../components/Message';

export default function Matches() {
  const { matches, setMatches, loading, error } = useMatches();
  const location = useLocation();
  const [deleteError, setDeleteError] = useState('');

  async function handleDelete(match) {
    if (!window.confirm(`Delete the ${match.mode} match on ${match.played_on}?`)) return;
    try {
      await deleteMatch(match.id);
      setMatches(matches.filter((m) => m.id !== match.id));
    } catch (err) {
      setDeleteError(err.message);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Match history</h1>

      {location.state?.notice && <Message type="success">{location.state.notice}</Message>}
      {deleteError && <Message type="error">{deleteError}</Message>}

      {loading && <Message type="loading">Loading your matches…</Message>}
      {error && <Message type="error">Could not load matches: {error}</Message>}
      {!loading && !error && matches.length === 0 && <Message>No matches logged yet.</Message>}

      <ul className="space-y-3">
        {matches.map((m) => (
          <MatchCard key={m.id} match={m} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}
