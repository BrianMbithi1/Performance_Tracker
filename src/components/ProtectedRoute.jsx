import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Message from './Message';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Message type="loading">Checking your session…</Message>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

