import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `block rounded px-3 py-2 text-sm ${isActive ? 'bg-primary/20 text-primary' : 'text-muted hover:text-text'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login', { state: { notice: 'You have been logged out.' } });
  }

  return (
    <header className="border-b border-line">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 p-4" aria-label="Main">
        <span className="font-bold">
          CODM <span className="text-accent">Tracker</span>
        </span>

        <button
          className="rounded border border-line px-3 py-1 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>

        <div id="menu" className={`${open ? 'flex' : 'hidden'} w-full flex-col gap-1 md:flex md:w-auto md:flex-row md:items-center`}>
          <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>
          <NavLink to="/matches" end className={linkClass} onClick={() => setOpen(false)}>Matches</NavLink>
          <NavLink to="/matches/new" className={linkClass} onClick={() => setOpen(false)}>Log match</NavLink>
          <span className="px-3 text-xs text-muted">{user ? user.email : ''}</span>
          <button onClick={handleLogout} className="rounded border border-line px-3 py-1 text-sm hover:border-danger">
            Log out
          </button>
        </div>
      </nav>
    </header>
  );
}
