import { useRef, useState } from 'react';
import { MAPS, MODES, WEAPONS } from '../data';
import { kd } from '../stats';

const today = () => new Date().toISOString().slice(0, 10);
const EMPTY = { kills: '', deaths: '', assists: '', mode: '', map: '', weapon: '', played_on: today() };

// Returns an object like { kills: 'Kills is required.' }. Empty object = valid.
export function validate(values) {
  const errors = {};
  for (const field of ['kills', 'deaths', 'assists']) {
    const value = values[field];
    const label = field[0].toUpperCase() + field.slice(1);
    if (value === '' && field !== 'assists') errors[field] = `${label} is required.`;
    else if (value !== '' && (!Number.isInteger(Number(value)) || Number(value) < 0))
      errors[field] = `${label} must be a whole number, 0 or more.`;
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
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);

    const firstError = Object.keys(found)[0];
    if (firstError) {
      formRef.current.elements[firstError].focus(); // jump to the first problem
      return;
    }

    setSaving(true);
    await onSubmit({
      ...values,
      kills: Number(values.kills),
      deaths: Number(values.deaths),
      assists: Number(values.assists || 0),
    });
    setSaving(false);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label="Kills" name="kills" type="number" values={values} errors={errors} onChange={handleChange} />
      <Field label="Deaths" name="deaths" type="number" values={values} errors={errors} onChange={handleChange} />
      <Field label="Assists (optional)" name="assists" type="number" values={values} errors={errors} onChange={handleChange} />
      <Field label="Date played" name="played_on" type="date" values={values} errors={errors} onChange={handleChange} />
      <Field label="Mode" name="mode" options={MODES} values={values} errors={errors} onChange={handleChange} />
      <Field label="Map" name="map" options={MAPS} values={values} errors={errors} onChange={handleChange} />
      <Field label="Weapon" name="weapon" options={WEAPONS} values={values} errors={errors} onChange={handleChange} />

      {values.kills !== '' && values.deaths !== '' && (
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

// A labelled input or select with its error message underneath.
function Field({ label, name, type = 'text', options, values, errors, onChange }) {
  const id = `field-${name}`;
  const props = {
    id,
    name,
    value: values[name],
    onChange,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${id}-error` : undefined,
    className: `w-full rounded-lg border bg-night p-2 ${errors[name] ? 'border-danger' : 'border-line'}`,
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm">
        {label}
      </label>
      {options ? (
        <select {...props}>
          <option value="">Select…</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input type={type} min={type === 'number' ? 0 : undefined} {...props} />
      )}
      {errors[name] && (
        <p id={`${id}-error`} className="mt-1 text-xs text-danger">
          {errors[name]}
        </p>
      )}
    </div>
  );
}
