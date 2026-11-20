import { Link } from 'react-router-dom';
import { kd } from '../stats';

export default function MatchCard({ match, onDelete }) {
  const ratio = kd(match.kills, match.deaths);

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-line bg-panel p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold">
          {match.mode} · {match.map}
        </p>
        <p className="text-xs text-muted">
          {match.played_on} · {match.weapon}
        </p>
      </div>

      <p className="text-sm">
        {match.kills} K / {match.deaths} D / {match.assists} A ·{' '}
        <span className={ratio >= 1 ? 'font-bold text-accent' : 'font-bold'}>K/D {ratio.toFixed(2)}</span>
      </p>

      <div className="flex gap-2">
        <Link to={`/matches/${match.id}/edit`} className="rounded border border-line px-3 py-1 text-sm hover:border-primary">
          Edit
        </Link>
        <button onClick={() => onDelete(match)} className="rounded border border-line px-3 py-1 text-sm hover:border-danger">
          Delete
        </button>
      </div>
    </li>
  );
}
