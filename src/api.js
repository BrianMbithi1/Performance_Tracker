import { supabase } from './supabase';

function check({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

export async function getMatches() {
  return check(await supabase.from('matches').select('*').order('played_on', { ascending: false }));
}

export async function getMatch(id) {
  return check(await supabase.from('matches').select('*').eq('id', id).single());
}

export async function addMatch(match) {
  return check(await supabase.from('matches').insert(match));
}

export async function updateMatch(id, match) {
  return check(await supabase.from('matches').update(match).eq('id', id));
}

export async function deleteMatch(id) {
  return check(await supabase.from('matches').delete().eq('id', id));
}

export async function lookupPlayer(name) {
  const response = await fetch(`/codm-api/user/${encodeURIComponent(name)}`);
  if (response.status === 404) throw new Error(`No player called "${name}" was found.`);
  if (!response.ok) throw new Error('The CODM API is not responding. Try again later.');

  const data = await response.json();
  return {
    nickname: data.nickname,
    level: data.level?.current,
    rank: data.rank?.multiplayerRank,
    rankImage: data.rank?.image,
  };
}
