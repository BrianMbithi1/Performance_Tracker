import { useEffect, useState } from 'react';
import { getMatches } from '../api';

// Loads the player's matches once, and tracks loading and error messages.
export function useMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getMatches();
        setMatches(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    load();
  }, []);

  return { matches, setMatches, loading, error };
}
