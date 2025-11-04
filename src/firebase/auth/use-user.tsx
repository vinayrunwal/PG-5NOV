'use client';
    
import { useState, useEffect } from 'react';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '@/firebase'; // Assuming useAuth is in this path

/**
 * Interface for the return value of the useUser hook.
 */
export interface UseUserResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

/**
 * React hook to get the current authenticated user from Firebase.
 *
 * @returns {UseUserResult} Object with user, isLoading, and error.
 */
export function useUser(): UseUserResult {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsLoading] = useState<boolean>(true);
  const [userError, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      // Optional: Set an error if auth service is not available
      // setError(new Error("Firebase Auth service is not available."));
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsLoading(false);
      },
      (error) => {
        console.error("useUser: onAuthStateChanged error:", error);
        setError(error);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]); // Re-run effect if auth instance changes

  return { user, isUserLoading, userError };
}
