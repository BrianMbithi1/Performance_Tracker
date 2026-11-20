import { Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      <Route path="/dashboard" element={<p className="p-8">Dashboard coming soon</p>} />
    </Routes>
  );
}
