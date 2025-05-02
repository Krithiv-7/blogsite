
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
  signOut as firebaseSignOut,
  getIdToken,
} from 'firebase/auth';
import { app } from '@/lib/firebase/client-config'; // Import initialized Firebase app
import type { User } from '@/types'; // Import your User type
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { setSessionCookie, clearSessionCookie } from '@/app/api/auth/session/route'; // Import API helpers

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start loading until auth state is determined
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true); // Set loading true while processing auth change
      if (firebaseUser) {
        // User is signed in
        const currentUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: firebaseUser.displayName,
        };
        setUser(currentUser);

        // Get ID token and set session cookie via API route
        try {
          const idToken = await getIdToken(firebaseUser);
          await setSessionCookie(idToken);
          console.log("Session cookie set successfully via API.");
        } catch (error) {
            console.error("Error setting session cookie:", error);
            // Handle error - maybe sign the user out client-side?
             await logout(); // Force logout if session can't be established
        }

      } else {
        // User is signed out
        setUser(null);
        // Clear session cookie via API route
        await clearSessionCookie();
         console.log("Session cookie cleared via API.");
      }
      setLoading(false); // Auth state determined, stop loading
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]); // Dependency on auth instance

  const logout = async () => {
    try {
      await firebaseSignOut(auth); // This triggers the onAuthStateChanged listener
      // The listener will handle setUser(null) and clearSessionCookie()
      console.log("Client-side sign out initiated.");
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle logout error (e.g., show a toast message)
    }
  };

  const value = { user, loading, logout };

  // Optional: You might want a more prominent loading state, e.g., covering the screen
  if (loading && user === null) { // Only show full loading if user state is initially unknown
     return (
         <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      );
   }


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
