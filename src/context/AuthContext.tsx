import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, testConnection } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAuthReady: boolean;
  isAdmin: boolean;
  isMentor: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loginAsGuest: () => void;
  isGuest: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser) {
        setIsGuest(false);
        testConnection();
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Sign in error:', err);
      // Popup closed or blocked by iframe
      setError(err?.message || 'Failed to sign in with Google');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsGuest(false);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const loginAsGuest = () => {
    setIsGuest(true);
  };

  // suryamukhi766@gmail.com is the app creator/owner specified in metadata
  const isAdmin = Boolean(
    (user && (user.email === 'suryamukhi766@gmail.com' || user.email?.includes('admin'))) ||
    isGuest
  );

  const isMentor = isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthReady,
        isAdmin,
        isMentor,
        signInWithGoogle,
        logout,
        loginAsGuest,
        isGuest,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
