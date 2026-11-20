import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addMatch, getMatch, updateMatch } from '../api';
import MatchForm from '../components/MatchForm';
import Message from '../components/Message';

export default function MatchEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      getMatch(id)
        .then(setMatch)
        .catch(() => setError('That match could not be found.'));
    }
  }, [id, isEdit]);

  async function handleSave(values) {
    try {
      if (isEdit) await updateMatch(id, values);
      else await addMatch(values);
      navigate('/matches', { state: { notice: isEdit ? 'Match updated.' : 'Match saved.' } });
    } catch (err) {
      setError(err.message);
    }
  }

  if (isEdit && !match && !error) return <Message type="loading">Loading match…</Message>;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">{isEdit ? 'Edit match' : 'Log a match'}</h1>
      {error && <Message type="error">{error}</Message>}
      {(!isEdit || match) && (
        <div className="rounded-xl border border-line bg-panel p-4">
          <MatchForm initialValues={match ?? undefined} onSubmit={handleSave} submitLabel={isEdit ? 'Save changes' : 'Log match'} />
        </div>
      )}
    </div>
  );
}
