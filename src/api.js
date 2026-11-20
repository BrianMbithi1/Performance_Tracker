import { supabase } from './supabase';

// Supabase returns { data, error }. This turns an error into a thrown Error.
function check({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

// Row Level Security means these only ever return the signed-in player's matches.
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
