import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { mockQuery, renderApp, setUser, testUser } from './helpers';

beforeEach(() => setUser(testUser));

describe('dashboard', () => {
  it('shows the empty state for a new player', async () => {
    mockQuery({ data: [], error: null });
    renderApp('/dashboard');
    expect(await screen.findByText(/no matches yet/i)).toBeInTheDocument();
  });

});
