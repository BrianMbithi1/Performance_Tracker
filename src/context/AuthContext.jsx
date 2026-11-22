import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if someone is already logged in (e.g. after a page refresh).
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session ? data.session.user : null);
      setLoading(false);
    }
    checkSession();

    // 2. Keep listening for log ins and log outs.
    const listener = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session ? session.user : null);
    });

    // 3. Stop listening when the app closes.
    return () => listener.data.subscription.unsubscribe();
  }, []);

  async function register(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
