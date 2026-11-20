import { useRef, useState } from 'react';
import { lookupPlayer } from '../api';

export default function PlayerLookup() {
  const [name, setName] = useState('');
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Enter a CODM nickname or UID.');
      inputRef.current.focus();
      return;
    }
    setLoading(true);
    setError('');
    setPlayer(null);
    try {
      setPlayer(await lookupPlayer(name.trim()));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-line bg-panel p-4">
      <h2 className="mb-3 font-semibold">CODM player lookup</h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="nickname" className="sr-only">CODM nickname or UID</label>
        <input
          id="nickname"
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nickname or UID"
          className="min-w-0 flex-1 rounded-lg border border-line bg-night p-2 text-sm"
        />
        <button className="rounded-lg bg-primary px-4 text-sm font-semibold text-white" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}

      {player && (
        <div className="mt-4 flex items-center gap-3">
          {player.rankImage && <img src={player.rankImage} alt="" className="size-12" />}
          <div>
            <p className="font-bold">{player.nickname}</p>
            <p className="text-sm">
              <span className="text-accent">{player.rank}</span> · Level {player.level}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
