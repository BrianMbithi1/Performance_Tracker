import { describe, expect, it } from 'vitest';
import { kd } from '../stats';

describe('stats', () => {
  it('works out K/D, using the kills when there are no deaths', () => {
    expect(kd(10, 3)).toBe(3.33);
    expect(kd(7, 0)).toBe(7);
  });
});
