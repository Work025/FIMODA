import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../Firebase/Firebase';

const AuthContext = createContext(null);

// ID generatsiya: ID33, ID34, ... (localStorage da saqlanadi)
function generateUserId(uid) {
  const stored = localStorage.getItem(`fimoda_uid_${uid}`);
  if (stored) return stored;

  const allIds = Object.keys(localStorage)
    .filter((k) => k.startsWith('fimoda_uid_'))
    .map((k) => {
      const val = localStorage.getItem(k);
      return parseInt(val?.replace('ID', '') || '32', 10);
    });

  const nextNum = allIds.length > 0 ? Math.max(...allIds) + 1 : 33;
  const newId = `ID${nextNum}`;
  localStorage.setItem(`fimoda_uid_${uid}`, newId);
  return newId;
}

// Backend API dan profil olish/saqlash
const API_BASE = process.env.REACT_APP_API_URL || 'https://api.fimoda.uz';

async function fetchProfile(uid, token) {
  try {
    const res = await fetch(`${API_BASE}/users/${uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function saveProfile(uid, token, data) {
  try {
    const res = await fetch(`${API_BASE}/users/${uid}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);        // Firebase user
  const [profile, setProfile] = useState(null);  // Backend profil
  const [userId, setUserId] = useState(null);    // ID33, ID34...
  const [loading, setLoading] = useState(true);

  // Firebase auth holati kuzatish
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        const id = generateUserId(firebaseUser.uid);
        const backendProfile = await fetchProfile(firebaseUser.uid, token);

        setUser(firebaseUser);
        setUserId(id);
        setProfile(backendProfile || {
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          orders: [],
        });
      } else {
        setUser(null);
        setUserId(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // Google bilan kirish
  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Email/parol bilan kirish
  const loginWithEmail = useCallback(async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Ro'yxatdan o'tish
  const registerWithEmail = useCallback(async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Profilni yangilash (backend + local state)
  const updateProfile = useCallback(async (data) => {
    if (!user) return;
    const token = await user.getIdToken();
    const updated = await saveProfile(user.uid, token, data);
    if (updated) {
      setProfile((prev) => ({ ...prev, ...data }));
    }
    return updated;
  }, [user]);

  // Chiqish
  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        userId,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        updateProfile,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
