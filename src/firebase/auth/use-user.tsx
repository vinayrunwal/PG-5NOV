'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/supabase/client';

export interface UseUserResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsLoading] = useState<boolean>(true);
  const [userError, setError] = useState<Error | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Initial check
    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setIsLoading(false);
    };
    checkUser();


    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, isUserLoading, userError };
}
