export default function StatCard({ label, value, detail, highlight = false }) {
  return (
    <div className="rounded-xl border border-line bg-panel p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${highlight ? 'text-accent' : ''}`}>{value}</p>
      {detail && <p className="mt-1 text-xs text-muted">{detail}</p>}
    </div>
  );
}
