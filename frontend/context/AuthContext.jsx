'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import api from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);  // Firebase user
  const [dbUser,  setDbUser]  = useState(null);  // MongoDB user
  const [loading, setLoading] = useState(true);

  const syncUser = async (firebaseUser) => {
    if (!firebaseUser) { setUser(null); setDbUser(null); setLoading(false); return; }
    try {
      setUser(firebaseUser);
      const { data } = await api.post('/auth/me');
      setDbUser(data.data);
    } catch (err) {
      console.error('Sync user error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, syncUser);
    return unsub;
  }, []);

  const register = async (name, email, password, extra = {}) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await api.post('/auth/register', { firebaseUid: cred.user.uid, name, email, ...extra });
    await syncUser(cred.user);
    return cred.user;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const { displayName, email, uid } = cred.user;
    await api.post('/auth/register', { firebaseUid: uid, name: displayName, email });
    await syncUser(cred.user);
    return cred.user;
  };

  const logout = () => signOut(auth);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    const { data } = await api.post('/auth/me');
    setDbUser(data.data);
  };

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, register, login, loginWithGoogle, logout, resetPassword, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
