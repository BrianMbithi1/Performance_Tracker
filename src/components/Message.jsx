const STYLES = {
  loading: 'text-muted',
  empty: 'border border-dashed border-line text-muted',
  error: 'border border-danger/50 bg-danger/10 text-red-200',
  success: 'border border-success/50 bg-success/10 text-green-200',
};

export default function Message({ type = 'empty', children }) {
  return (
    <p role={type === 'error' ? 'alert' : 'status'} className={`rounded-lg p-4 text-center text-sm ${STYLES[type]}`}>
      {children}
    </p>
  );
}
