import { createContext, useContext, useEffect, useState } from 'react';
import UseFetch from './hooks/UseFetch';
import { getCurrentUser } from './db/apiAuth';
import supabase from './db/supabase';

const UrlContext = createContext();

const UrlProvider = ({ children }) => {
  // Use the fetch hook only for retrieving the current user
  const { data: fetchedUser, loading, fn: fetchUser } = UseFetch(getCurrentUser);

  // Keep our own user state so we can update it immediately on logout/login
  const [user, setUser] = useState(null);

  // Sync local user state whenever a new fetchedUser arrives
  useEffect(() => {
    setUser(fetchedUser);
  }, [fetchedUser]);

  const isAuthenticated = user?.role === 'authenticated';

  // Initial fetch on app load
  useEffect(() => {
    fetchUser();
  }, []);

  // Subscribe to Supabase auth state changes and refresh the user
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });
    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <UrlContext.Provider value={{ user, setUser, fetchUser, loading, isAuthenticated }}>
      {children}
    </UrlContext.Provider>
  );
};

export const UrlState = () => {
  return useContext(UrlContext);
};

export default UrlProvider;