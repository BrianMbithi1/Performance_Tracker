import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { validate } from '../components/MatchForm';
import { mockQuery, renderApp, sampleMatches, setUser, testUser } from './helpers';

beforeEach(() => setUser(testUser));

describe('match form validation', () => {
  const good = { kills: '10', deaths: '5', assists: '', mode: 'Domination', map: 'Crash', weapon: 'M4', played_on: '2026-01-01' };

  it('accepts a valid match', () => expect(validate(good)).toEqual({}));

  it('rejects missing, negative and future values', () => {
    expect(Object.keys(validate({ ...good, kills: '', mode: '', map: '', weapon: '', played_on: '' })).sort()).toEqual(['kills', 'map', 'mode', 'played_on', 'weapon']);
    expect(validate({ ...good, deaths: '-2' }).deaths).toMatch(/whole number/);
    expect(validate({ ...good, assists: '1.5' }).assists).toMatch(/whole number/);
    expect(validate({ ...good, played_on: '2999-01-01' }).played_on).toMatch(/future/);
  });
});

describe('match history', () => {
  it('lists the matches', async () => {
    mockQuery({ data: sampleMatches, error: null });
    renderApp('/matches');
    expect(await screen.findByText('Team Deathmatch · Nuketown')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('deletes a match only after confirming', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    mockQuery({ data: sampleMatches, error: null });
    renderApp('/matches');
    const buttons = await screen.findAllByRole('button', { name: 'Delete' });

    await userEvent.click(buttons[0]);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);

    await userEvent.click(buttons[0]);
    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(2));
    expect(confirm).toHaveBeenCalledTimes(2);
  });

});

describe('log a match', () => {
  it('validates, then saves a new match', async () => {
    const [insert] = mockQuery({ data: null, error: null }, { data: [], error: null });
    renderApp('/matches/new');

    await userEvent.click(await screen.findByRole('button', { name: 'Log match' }));
    expect(screen.getByText('Kills is required.')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Kills'), '18');
    await userEvent.type(screen.getByLabelText('Deaths'), '6');
    expect(screen.getByText('3.00')).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText('Mode'), 'Domination');
    await userEvent.selectOptions(screen.getByLabelText('Map'), 'Crash');
    await userEvent.selectOptions(screen.getByLabelText('Weapon'), 'QQ9');
    await userEvent.click(screen.getByRole('button', { name: 'Log match' }));

    expect(await screen.findByText('Match saved.')).toBeInTheDocument();
    expect(insert.insert).toHaveBeenCalledWith(expect.objectContaining({ kills: 18, deaths: 6, assists: 0, weapon: 'QQ9' }));
  });

});
