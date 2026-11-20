// K/D ratio rounded to 2 decimals. With 0 deaths, K/D equals the kills.
export function kd(kills, deaths) {
  if (deaths === 0) return kills;
  return Math.round((kills / deaths) * 100) / 100;
}

export function getSummary(matches) {
  let kills = 0;
  let deaths = 0;
  let best = null;
  for (const m of matches) {
    kills += m.kills;
    deaths += m.deaths;
    if (!best || m.kills > best.kills) best = m;
  }
  return {
    count: matches.length,
    kills,
    deaths,
    kd: kd(kills, deaths),
    avgKills: matches.length ? Math.round((kills / matches.length) * 10) / 10 : 0,
    best,
  };
}

// One point per day (oldest first) for the K/D line chart.
export function kdByDay(matches) {
  const days = {};
  for (const m of matches) {
    days[m.played_on] ??= { kills: 0, deaths: 0 };
    days[m.played_on].kills += m.kills;
    days[m.played_on].deaths += m.deaths;
  }
  return Object.keys(days)
    .sort()
    .map((date) => ({ date, kd: kd(days[date].kills, days[date].deaths) }));
}

// K/D for each mode, map or weapon, for the bar chart.
export function kdBy(matches, field) {
  const groups = {};
  for (const m of matches) {
    groups[m[field]] ??= { kills: 0, deaths: 0 };
    groups[m[field]].kills += m.kills;
    groups[m[field]].deaths += m.deaths;
  }
  return Object.entries(groups).map(([name, g]) => ({ name, kd: kd(g.kills, g.deaths) }));
}

export function filterMatches(matches, { mode, weapon, from, to }) {
  return matches.filter(
    (m) =>
      (!mode || m.mode === mode) &&
      (!weapon || m.weapon === weapon) &&
      (!from || m.played_on >= from) &&
      (!to || m.played_on <= to),
  );
}
