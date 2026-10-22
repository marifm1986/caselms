"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { revalidateContent } from "@/app/actions/revalidate";
import { firebaseAuth, firestore } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/env";

type AuthState = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  /** Refreshes the public site's cached content for the given tags. */
  publish: (tags: string[]) => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(firebaseAuth(), async (next) => {
      setLoading(true);
      setUser(next);
      if (next) {
        try {
          const snap = await getDoc(doc(firestore(), "admins", next.uid));
          setIsAdmin(snap.exists());
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  const logout = useCallback(() => signOut(firebaseAuth()), []);

  const publish = useCallback(
    async (tags: string[]) => {
      if (!user) return;
      const token = await user.getIdToken();
      const result = await revalidateContent(token, tags);
      if (!result.ok) console.warn("[admin] revalidate failed:", result.error);
    },
    [user],
  );

  return <AuthContext.Provider value={{ user, isAdmin, loading, logout, publish }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
