import { useState } from 'react';
import { MAPS, MODES, WEAPONS } from '../data';
import { kd } from '../stats';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function isWholeNumber(value) {
  return Number.isInteger(Number(value)) && Number(value) >= 0;
}

// Checks the form. Returns an object of error messages, e.g. { kills: 'Kills is required.' }.
// An empty object means the form is valid.
export function validate(values) {
  const errors = {};

  if (values.kills === '') errors.kills = 'Kills is required.';
  else if (!isWholeNumber(values.kills)) errors.kills = 'Kills must be a whole number, 0 or more.';

  if (values.deaths === '') errors.deaths = 'Deaths is required.';
  else if (!isWholeNumber(values.deaths)) errors.deaths = 'Deaths must be a whole number, 0 or more.';

  if (values.assists !== '' && !isWholeNumber(values.assists)) {
    errors.assists = 'Assists must be a whole number, 0 or more.';
  }

  if (!values.mode) errors.mode = 'Choose a mode.';
  if (!values.map) errors.map = 'Choose a map.';
  if (!values.weapon) errors.weapon = 'Choose a weapon.';

  if (!values.played_on) errors.played_on = 'Pick a date.';
  else if (values.played_on > today()) errors.played_on = 'The date cannot be in the future.';

  return errors;
}

// Used for both "Log match" and "Edit match". The page decides what onSubmit does.
export default function MatchForm({ initialValues, onSubmit, submitLabel = 'Save match' }) {
  const emptyForm = { kills: '', deaths: '', assists: '', mode: '', map: '', weapon: '', played_on: today() };
  const [values, setValues] = useState({ ...emptyForm, ...initialValues });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // stop if there are errors

    setSaving(true);
    await onSubmit({
      ...values,
      kills: Number(values.kills),
      deaths: Number(values.deaths),
      assists: Number(values.assists || 0),
    });
    setSaving(false);
  }

  const showKd = values.kills !== '' && values.deaths !== '';

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <NumberField label="Kills" name="kills" values={values} errors={errors} onChange={handleChange} />
      <NumberField label="Deaths" name="deaths" values={values} errors={errors} onChange={handleChange} />
      <NumberField label="Assists (optional)" name="assists" values={values} errors={errors} onChange={handleChange} />

      <div>
        <label htmlFor="played_on" className="mb-1 block text-sm">Date played</label>
        <input id="played_on" name="played_on" type="date" value={values.played_on} onChange={handleChange}
          className="w-full rounded-lg border border-line bg-night p-2" />
        <ErrorText message={errors.played_on} />
      </div>

      <SelectField label="Mode" name="mode" options={MODES} values={values} errors={errors} onChange={handleChange} />
      <SelectField label="Map" name="map" options={MAPS} values={values} errors={errors} onChange={handleChange} />
      <SelectField label="Weapon" name="weapon" options={WEAPONS} values={values} errors={errors} onChange={handleChange} />

      {showKd && (
        <p className="self-end text-sm text-muted">
          Match K/D: <strong className="text-accent">{kd(Number(values.kills), Number(values.deaths)).toFixed(2)}</strong>
        </p>
      )}

      <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2 font-semibold text-white disabled:opacity-50 sm:col-span-2">
        {saving ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}

function NumberField({ label, name, values, errors, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm">{label}</label>
      <input id={name} name={name} type="number" min="0" value={values[name]} onChange={onChange}
        className="w-full rounded-lg border border-line bg-night p-2" />
      <ErrorText message={errors[name]} />
    </div>
  );
}

function SelectField({ label, name, options, values, errors, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm">{label}</label>
      <select id={name} name={name} value={values[name]} onChange={onChange}
        className="w-full rounded-lg border border-line bg-night p-2">
        <option value="">Select…</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ErrorText message={errors[name]} />
    </div>
  );
}

function ErrorText({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-danger">{message}</p>;
}
