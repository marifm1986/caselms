"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { revalidateContent } from "@/app/actions/revalidate";
import { firebaseAuth, firestore } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/env";
import { ADMIN_SCOPES, type AdminRole, type AdminScope } from "@/lib/types";

type AuthState = {
  user: User | null;
  isAdmin: boolean;
  role: AdminRole | null;
  scopes: AdminScope[];
  can: (scope: AdminScope) => boolean;
  loading: boolean;
  logout: () => Promise<void>;
  /** Refreshes the public site's cached content for the given tags. */
  publish: (tags: string[]) => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

const ALL_SCOPES: AdminScope[] = [...ADMIN_SCOPES];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [scopes, setScopes] = useState<AdminScope[]>([]);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(firebaseAuth(), async (next) => {
      setLoading(true);
      setUser(next);
      if (!next) {
        setRole(null);
        setScopes([]);
        setLoading(false);
        return;
      }
      try {
        const adminRef = doc(firestore(), "admins", next.uid);
        let snap = await getDoc(adminRef);

        // First login after being invited: claim the pending invite.
        if (!snap.exists() && next.email) {
          const email = next.email.toLowerCase();
          const inviteRef = doc(firestore(), "adminInvites", email);
          const inviteSnap = await getDoc(inviteRef);
          if (inviteSnap.exists()) {
            const invite = inviteSnap.data() as {
              role: AdminRole;
              scopes: AdminScope[];
              createdBy?: string | null;
            };
            await setDoc(adminRef, {
              email,
              role: invite.role,
              scopes: invite.scopes,
              createdAt: new Date().toISOString(),
              createdBy: invite.createdBy ?? null,
            });
            await deleteDoc(inviteRef).catch(() => undefined);
            snap = await getDoc(adminRef);
          }
        }

        if (snap.exists()) {
          const data = snap.data() as { role?: AdminRole; scopes?: AdminScope[] };
          setRole(data.role ?? "owner");
          setScopes(data.scopes ?? ALL_SCOPES);
        } else {
          setRole(null);
          setScopes([]);
        }
      } catch {
        setRole(null);
        setScopes([]);
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

  const isAdmin = role !== null;
  const can = useCallback(
    (scope: AdminScope) => role === "owner" || scopes.includes(scope),
    [role, scopes],
  );

  return (
    <AuthContext.Provider value={{ user, isAdmin, role, scopes, can, loading, logout, publish }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
