import { Link, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import MatchEditor from './pages/MatchEditor';

// Wraps a page with the login check, the navbar and the page container.
function Private({ children }) {
  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto max-w-5xl p-4">{children}</main>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="/matches" element={<Private><Matches /></Private>} />
      <Route path="/matches/new" element={<Private><MatchEditor /></Private>} />
      <Route path="/matches/:id/edit" element={<Private><MatchEditor /></Private>} />
      <Route
        path="*"
        element={
          <p className="p-8 text-center">
            Page not found. <Link to="/dashboard" className="text-primary underline">Go to the dashboard</Link>
          </p>
        }
      />
    </Routes>
  );
}
