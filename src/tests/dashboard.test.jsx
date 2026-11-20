import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockQuery, renderApp, sampleMatches, setUser, testUser } from './helpers';

beforeEach(() => setUser(testUser));

describe('dashboard', () => {
  it('shows the stat cards and charts', async () => {
    mockQuery({ data: sampleMatches, error: null });
    renderApp('/dashboard');
    expect(await screen.findByText('1.76')).toBeInTheDocument(); // K/D
    expect(screen.getByText('21.7')).toBeInTheDocument(); // average kills
    expect(screen.getByText('30 kills')).toBeInTheDocument(); // best match
    expect(screen.getByRole('img', { name: /over time/i })).toBeInTheDocument();
  });

  it('updates the stats when filtering', async () => {
    mockQuery({ data: sampleMatches, error: null });
    renderApp('/dashboard');
    await userEvent.selectOptions(await screen.findByLabelText('Weapon'), 'QQ9');
    expect(screen.getByText('1.00')).toBeInTheDocument();
    expect(screen.getByText(/two different days/)).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText('Mode'), 'Hardpoint');
    expect(screen.getByText('No matches fit these filters.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByText('1.76')).toBeInTheDocument();
  });

  it('switches the breakdown chart between mode, map and weapon', async () => {
    mockQuery({ data: sampleMatches, error: null });
    renderApp('/dashboard');
    await userEvent.selectOptions(await screen.findByLabelText('Group by'), 'weapon');
    expect(screen.getByRole('heading', { name: 'K/D by weapon' })).toBeInTheDocument();
  });

  it('shows the empty state for a new player', async () => {
    mockQuery({ data: [], error: null });
    renderApp('/dashboard');
    expect(await screen.findByText(/no matches yet/i)).toBeInTheDocument();
  });

  it('shows an error if matches cannot load', async () => {
    mockQuery({ data: null, error: { message: 'offline' } });
    renderApp('/dashboard');
    expect(await screen.findByText('Could not load matches: offline')).toBeInTheDocument();
  });
});
