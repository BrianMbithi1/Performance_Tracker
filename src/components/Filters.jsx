import { MODES, WEAPONS } from '../data';

export const NO_FILTERS = { mode: '', weapon: '', from: '', to: '' };

export default function Filters({ filters, onChange }) {
  function update(e) {
    onChange({ ...filters, [e.target.name]: e.target.value });
  }

  const box = 'w-full rounded-lg border border-line bg-night p-2 text-sm';

  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl border border-line bg-panel p-4 md:grid-cols-5 md:items-end">
      <label className="text-sm">
        Mode
        <select name="mode" value={filters.mode} onChange={update} className={box}>
          <option value="">All modes</option>
          {MODES.map((m) => <option key={m}>{m}</option>)}
        </select>
      </label>
      <label className="text-sm">
        Weapon
        <select name="weapon" value={filters.weapon} onChange={update} className={box}>
          <option value="">All weapons</option>
          {WEAPONS.map((w) => <option key={w}>{w}</option>)}
        </select>
      </label>
      <label className="text-sm">
        From
        <input type="date" name="from" value={filters.from} onChange={update} className={box} />
      </label>
      <label className="text-sm">
        To
        <input type="date" name="to" value={filters.to} onChange={update} className={box} />
      </label>
      <button onClick={() => onChange(NO_FILTERS)} className="col-span-2 rounded-lg border border-line p-2 text-sm md:col-span-1">
        Clear filters
      </button>
    </div>
  );
}
