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

  // When editing, load the match first so the form can be filled in.
  useEffect(() => {
    async function load() {
      try {
        const data = await getMatch(id);
        setMatch(data);
      } catch {
        setError('That match could not be found.');
      }
    }
    if (isEdit) load();
  }, [id, isEdit]);

  async function handleSave(values) {
    try {
      if (isEdit) {
        await updateMatch(id, values);
        navigate('/matches', { state: { notice: 'Match updated.' } });
      } else {
        await addMatch(values);
        navigate('/matches', { state: { notice: 'Match saved.' } });
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const stillLoading = isEdit && !match && !error;
  if (stillLoading) return <Message type="loading">Loading match…</Message>;

  const showForm = !isEdit || match;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">{isEdit ? 'Edit match' : 'Log a match'}</h1>
      {error && <Message type="error">{error}</Message>}
      {showForm && (
        <div className="rounded-xl border border-line bg-panel p-4">
          <MatchForm initialValues={match} onSubmit={handleSave} submitLabel={isEdit ? 'Save changes' : 'Log match'} />
        </div>
      )}
    </div>
  );
}
