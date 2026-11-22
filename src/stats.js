// K/D ratio rounded to 2 decimals. With 0 deaths, the K/D is just the kills.
export function kd(kills, deaths) {
  if (deaths === 0) {
    return kills;
  }
  return Math.round((kills / deaths) * 100) / 100;
}

// Totals for the stat cards.
export function getSummary(matches) {
  let kills = 0;
  let deaths = 0;
  let best = null;

  for (const match of matches) {
    kills = kills + match.kills;
    deaths = deaths + match.deaths;
    if (best === null || match.kills > best.kills) {
      best = match;
    }
  }

  let avgKills = 0;
  if (matches.length > 0) {
    avgKills = Math.round((kills / matches.length) * 10) / 10;
  }

  return { count: matches.length, kills, deaths, kd: kd(kills, deaths), avgKills, best };
}

// Adds up kills and deaths for each value of a field, e.g. each date or each mode.
function totalsBy(matches, field) {
  const totals = {};
  for (const match of matches) {
    const key = match[field];
    if (!totals[key]) {
      totals[key] = { kills: 0, deaths: 0 };
    }
    totals[key].kills = totals[key].kills + match.kills;
    totals[key].deaths = totals[key].deaths + match.deaths;
  }
  return totals;
}

// One point per day, oldest first, for the line chart.
export function kdByDay(matches) {
  const totals = totalsBy(matches, 'played_on');
  const dates = Object.keys(totals).sort();
  return dates.map((date) => ({ date: date, kd: kd(totals[date].kills, totals[date].deaths) }));
}

// K/D for each mode, map or weapon, for the bar chart.
export function kdBy(matches, field) {
  const totals = totalsBy(matches, field);
  const names = Object.keys(totals);
  return names.map((name) => ({ name: name, kd: kd(totals[name].kills, totals[name].deaths) }));
}

// Keeps only the matches that fit the chosen filters. Empty filters are ignored.
export function filterMatches(matches, filters) {
  return matches.filter((match) => {
    if (filters.mode && match.mode !== filters.mode) return false;
    if (filters.weapon && match.weapon !== filters.weapon) return false;
    if (filters.from && match.played_on < filters.from) return false;
    if (filters.to && match.played_on > filters.to) return false;
    return true;
  });
}
