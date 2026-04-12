import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AdminContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (data.session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('id, email, full_name, role')
            .eq('id', data.session.user.id)
            .maybeSingle();

          if (userData?.role === 'admin') {
            setAdmin(userData);
          } else {
            await supabase.auth.signOut();
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('id, email, full_name, role')
            .eq('id', session.user.id)
            .maybeSingle();

          if (userData?.role === 'admin') {
            setAdmin(userData);
            setError(null);
          } else {
            await supabase.auth.signOut();
            setError('Unauthorized: Admin access required');
          }
        } else if (event === 'SIGNED_OUT') {
          setAdmin(null);
        }
      })();
    });

    return () => data?.subscription?.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('id, email, full_name, role')
          .eq('id', data.user.id)
          .maybeSingle();

        if (userData?.role !== 'admin') {
          await supabase.auth.signOut();
          throw new Error('Unauthorized: Admin access required');
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setAdmin(null);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
