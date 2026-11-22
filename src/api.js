import { supabase } from './supabase';

// Supabase gives back { data, error }. If there is an error, stop and show it.
function check(result) {
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result.data;
}

export async function getMatches() {
  const result = await supabase.from('matches').select('*').order('played_on', { ascending: false });
  return check(result);
}

export async function getMatch(id) {
  const result = await supabase.from('matches').select('*').eq('id', id).single();
  return check(result);
}

export async function addMatch(match) {
  const result = await supabase.from('matches').insert(match);
  return check(result);
}

export async function updateMatch(id, match) {
  const result = await supabase.from('matches').update(match).eq('id', id);
  return check(result);
}

export async function deleteMatch(id) {
  const result = await supabase.from('matches').delete().eq('id', id);
  return check(result);
}

// Looks up a player on the community CODM API (through the /codm-api proxy).
export async function lookupPlayer(name) {
  const response = await fetch('/codm-api/user/' + encodeURIComponent(name));

  if (response.status === 404) {
    throw new Error(`No player called "${name}" was found.`);
  }
  if (!response.ok) {
    throw new Error('The CODM API is not responding. Try again later.');
  }

  const data = await response.json();
  return {
    nickname: data.nickname,
    level: data.level.current,
    rank: data.rank.multiplayerRank,
    rankImage: data.rank.image,
  };
}
