import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { filterMatches, getSummary, kdBy, kdByDay } from '../stats';
import Filters, { NO_FILTERS } from '../components/Filters';
import StatCard from '../components/StatCard';
import { BreakdownChart, KdChart } from '../components/Charts';
import Message from '../components/Message';
import PlayerLookup from '../components/PlayerLookup';

export default function Dashboard() {
  const { matches, loading, error } = useMatches();
  const [filters, setFilters] = useState(NO_FILTERS);
  const [groupBy, setGroupBy] = useState('mode');

  const shown = useMemo(() => filterMatches(matches, filters), [matches, filters]);
  const summary = getSummary(shown);

  if (loading) return <Message type="loading">Loading your matches…</Message>;
  if (error) return <Message type="error">Could not load matches: {error}</Message>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/matches/new" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-night">
          + Log a match
        </Link>
      </div>

      {matches.length === 0 ? (
        <Message>No matches yet. Log your first match to see your stats.</Message>
      ) : (
        <>
          <Filters filters={filters} onChange={setFilters} />

          {shown.length === 0 ? (
            <Message>No matches fit these filters.</Message>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard label="K/D ratio" value={summary.kd.toFixed(2)} detail={`${summary.kills} kills · ${summary.deaths} deaths`} highlight />
                <StatCard label="Avg kills" value={summary.avgKills} detail="per match" />
                <StatCard label="Best match" value={`${summary.best.kills} kills`} detail={summary.best.weapon} />
                <StatCard label="Matches" value={summary.count} />
              </div>

              <section className="rounded-xl border border-line bg-panel p-4">
                <h2 className="mb-3 font-semibold">K/D over time</h2>
                <KdChart data={kdByDay(shown)} />
              </section>

              <section className="rounded-xl border border-line bg-panel p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-semibold">K/D by {groupBy}</h2>
                  <label className="text-sm">
                    <span className="sr-only">Group by</span>
                    <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="rounded border border-line bg-night p-1">
                      <option value="mode">Mode</option>
                      <option value="map">Map</option>
                      <option value="weapon">Weapon</option>
                    </select>
                  </label>
                </div>
                <BreakdownChart data={kdBy(shown, groupBy)} />
              </section>
            </>
          )}
        </>
      )}

      <PlayerLookup />
    </div>
  );
}
