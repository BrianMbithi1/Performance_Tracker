import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlayerLookup from '../components/PlayerLookup';

function mockFetch(status, body) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: status === 200, status, json: async () => body });
}

describe('CODM player lookup', () => {
  it('asks for a name before searching', async () => {
    render(<PlayerLookup />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a CODM nickname');
    expect(screen.getByLabelText('CODM nickname or UID')).toHaveFocus();
  });

  it('shows the player rank and level', async () => {
    const fetch = mockFetch(200, { nickname: 'ShadowHex', level: { current: 4 }, rank: { multiplayerRank: 'Rookie I', image: 'rank.png' } });
    render(<PlayerLookup />);
    await userEvent.type(screen.getByLabelText('CODM nickname or UID'), 'ShadowHex');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(await screen.findByText('ShadowHex')).toBeInTheDocument();
    expect(screen.getByText('Rookie I')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('/codm-api/user/ShadowHex');
  });

  it('explains unknown players and outages', async () => {
    mockFetch(404, { success: false });
    render(<PlayerLookup />);
    await userEvent.type(screen.getByLabelText('CODM nickname or UID'), 'ghost');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No player called "ghost"');

    mockFetch(500, {});
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('not responding');
  });
});
