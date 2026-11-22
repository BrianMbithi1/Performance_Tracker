import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { supabase } from '../supabase';
import { mockQuery, renderApp, setUser, testUser } from './helpers';

beforeEach(() => {
  setUser(null);
  mockQuery();
});

async function fillIn(email, password) {
  await userEvent.type(await screen.findByLabelText('Email'), email);
  await userEvent.type(screen.getByLabelText('Password'), password);
}

describe('protected routes', () => {
  it('sends visitors who are not logged in to the login page', async () => {
    renderApp('/dashboard');
    expect(await screen.findByRole('heading', { name: /log in/i })).toBeInTheDocument();
  });

});

describe('login', () => {
  it('checks the email and password before sending them', async () => {
    renderApp('/login');
    await fillIn('not-an-email', 'secret1');
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address.');

    await userEvent.clear(screen.getByLabelText('Email'));
    await userEvent.type(screen.getByLabelText('Email'), 'player@example.com');
    await userEvent.clear(screen.getByLabelText('Password'));
    await userEvent.type(screen.getByLabelText('Password'), '123');
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(screen.getByRole('alert')).toHaveTextContent('at least 6 characters');
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it('shows a friendly message for a wrong password', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({ error: { message: 'Invalid login credentials' } });
    renderApp('/login');
    await fillIn('player@example.com', 'wrongpass');
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Wrong email or password.');
  });

  it('logs the player in', async () => {
    renderApp('/login');
    await fillIn('player@example.com', 'secret1');
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(await screen.findByRole('button', { name: 'Log out' })).toBeInTheDocument();
  });

  it('starts Google sign-in and shows its errors', async () => {
    supabase.auth.signInWithOAuth.mockResolvedValueOnce({ error: { message: 'Google is not enabled' } });
    renderApp('/login');
    await userEvent.click(await screen.findByRole('button', { name: /google/i }));
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith(expect.objectContaining({ provider: 'google' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Google is not enabled');
  });
});

describe('register', () => {
  it('asks the player to confirm their email', async () => {
    supabase.auth.signUp.mockResolvedValueOnce({ data: { session: null }, error: null });
    renderApp('/register');
    await fillIn('new@example.com', 'secret1');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
    expect(await screen.findByText(/account created/i)).toBeInTheDocument();
  });

});

describe('navbar', () => {
  it('opens the mobile menu and logs out', async () => {
    setUser(testUser);
    renderApp('/dashboard');
    const menu = await screen.findByRole('button', { name: 'Menu' });
    await userEvent.click(menu);
    expect(menu).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(screen.getByRole('button', { name: 'Log out' }));
    expect(await screen.findByText('You have been logged out.')).toBeInTheDocument();
  });
});
