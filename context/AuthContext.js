"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Provide a safe default so `useContext(AuthContext)` never returns null.
// This prevents components from crashing when rendered outside the provider
// (for example during SSR or before the provider mounts).
const AuthContext = createContext({ user: null });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  // Return a safe object so callers can destructure `{ user }` without throwing.
  return useContext(AuthContext) ?? { user: null };
}
