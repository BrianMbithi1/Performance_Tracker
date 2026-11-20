import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { supabase } from '../supabase';
import { AuthProvider } from '../context/AuthContext';
import App from '../App';

export const testUser = { id: 'user-1', email: 'player@example.com' };

// Pretend a player is logged in (or not). Login and logout also update the fake session.
export function setUser(user) {
  let listener = () => {};
  supabase.auth.getSession.mockResolvedValue({ data: { session: user ? { user } : null } });
  supabase.auth.onAuthStateChange.mockImplementation((callback) => {
    listener = callback;
    return { data: { subscription: { unsubscribe: vi.fn() } } };
  });
  supabase.auth.signInWithPassword.mockImplementation(async ({ email }) => {
    listener('SIGNED_IN', { user: { id: 'user-1', email } });
    return { error: null };
  });
  supabase.auth.signOut.mockImplementation(async () => listener('SIGNED_OUT', null));
}

export function mockQuery(...results) {
  if (results.length === 0) results = [{ data: [], error: null }];
  return results.map((result, i) => {
    const query = {};
    for (const method of ['select', 'insert', 'update', 'delete', 'eq', 'order', 'single']) {
      query[method] = vi.fn(() => query);
    }
    query.then = (resolve) => resolve(result);
    if (i < results.length - 1) supabase.from.mockReturnValueOnce(query);
    else supabase.from.mockReturnValue(query);
    return query;
  });
}

export function renderApp(url = '/') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
}

export const sampleMatches = [
  { id: 'm1', played_on: '2026-11-10', mode: 'Team Deathmatch', map: 'Nuketown', weapon: 'AK-47', kills: 20, deaths: 10, assists: 4 },
  { id: 'm2', played_on: '2026-11-12', mode: 'Domination', map: 'Crash', weapon: 'QQ9', kills: 15, deaths: 15, assists: 6 },
  { id: 'm3', played_on: '2026-11-14', mode: 'Team Deathmatch', map: 'Raid', weapon: 'AK-47', kills: 30, deaths: 12, assists: 2 },
];
