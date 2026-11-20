import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Message from '../components/Message';

function friendly(message) {
  if (message.includes('Invalid login credentials')) return 'Wrong email or password.';
  if (message.includes('already registered')) return 'That email already has an account. Try logging in.';
  if (message.includes('Email not confirmed')) return 'Please confirm your email first (check your inbox).';
  return message;
}

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const { user, login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) return setError('Enter a valid email address.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    setBusy(true);
    try {
      if (isLogin) {
        await login(email, password);
        navigate('/dashboard');
      } else {
        const data = await register(email, password);
        // If email confirmation is on, Supabase gives no session until the link is clicked.
        if (data.session) navigate('/dashboard');
        else navigate('/login', { state: { notice: 'Account created! Check your email to confirm it, then log in.' } });
      }
    } catch (err) {
      setError(friendly(err.message));
      setBusy(false);
    }
  }

  async function handleGoogle() {
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="mx-auto mt-16 max-w-sm px-4">
      <h1 className="mb-6 text-center text-2xl font-bold">
        {isLogin ? 'Log in' : 'Create an account'} to <span className="text-accent">CODM Tracker</span>
      </h1>

      <div className="space-y-4 rounded-xl border border-line bg-panel p-6">
        {location.state?.notice && <Message type="success">{location.state.notice}</Message>}
        {error && <Message type="error">{error}</Message>}

        <button onClick={handleGoogle} className="w-full rounded-lg border border-line p-2 font-semibold hover:border-primary">
          Continue with Google
        </button>
        <p className="text-center text-xs text-muted">or</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line bg-night p-2" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line bg-night p-2" />
          </div>
          <button type="submit" disabled={busy} className="w-full rounded-lg bg-primary p-2 font-semibold text-white disabled:opacity-50">
            {busy ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-muted">
        {isLogin ? 'New here? ' : 'Already have an account? '}
        <Link to={isLogin ? '/register' : '/login'} className="text-primary underline">
          {isLogin ? 'Create an account' : 'Log in'}
        </Link>
      </p>
    </main>
  );
}
