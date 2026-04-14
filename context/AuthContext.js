"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      alert(
        `Error de Configuración:\n\n` +
        `Para que el inicio de sesión funcione en Vercel, debes:\n` +
        `1. Crear un proyecto en console.firebase.google.com\n` +
        `2. Ir a Authentication > Authorized Domains y añadir "zafhira-v2.vercel.app".\n` +
        `3. Configurar las variables de entorno (API Keys) en el panel de Vercel.\n\n` +
        `Detalle técnico: ${error.code}`
      );
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, loading }}>
      {!loading ? children : <div style={{ height: '100vh', backgroundColor: 'var(--bg-base)' }}></div>}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
