import { describe, expect, it } from 'vitest';
import { filterMatches, getSummary, kd, kdBy, kdByDay } from '../stats';
import { sampleMatches } from './helpers';

describe('stats', () => {
  it('works out K/D, using the kills when there are no deaths', () => {
    expect(kd(10, 3)).toBe(3.33);
    expect(kd(7, 0)).toBe(7);
  });

  it('summarises matches', () => {
    expect(getSummary(sampleMatches)).toMatchObject({ count: 3, kills: 65, deaths: 37, kd: 1.76, avgKills: 21.7 });
    expect(getSummary(sampleMatches).best.id).toBe('m3');
    expect(getSummary([])).toMatchObject({ count: 0, kd: 0, avgKills: 0, best: null });
  });

  it('groups K/D by day and by field', () => {
    expect(kdByDay(sampleMatches).map((p) => p.date)).toEqual(['2026-11-10', '2026-11-12', '2026-11-14']);
    expect(kdBy(sampleMatches, 'weapon')).toEqual([
      { name: 'AK-47', kd: 2.27 },
      { name: 'QQ9', kd: 1 },
    ]);
  });

  it('filters by mode, weapon and dates', () => {
    const none = { mode: '', weapon: '', from: '', to: '' };
    expect(filterMatches(sampleMatches, none)).toHaveLength(3);
    expect(filterMatches(sampleMatches, { ...none, mode: 'Domination' })).toHaveLength(1);
    expect(filterMatches(sampleMatches, { ...none, weapon: 'AK-47', from: '2026-11-11' })).toHaveLength(1);
    expect(filterMatches(sampleMatches, { ...none, to: '2026-11-09' })).toHaveLength(0);
  });
});
