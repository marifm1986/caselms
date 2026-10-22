"use client";

import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { LoaderCircle, Lock } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/ui/icons";
import { firebaseAuth } from "@/lib/firebase/client";

const friendlyError = (code: string) =>
  ({
    "auth/invalid-credential": "That email and password don't match an account.",
    "auth/too-many-requests": "Too many attempts. Wait a few minutes, then try again.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/network-request-failed": "Network error. Check your connection and try again.",
  })[code] ?? "Sign in failed. Please try again.";

export function LoginForm() {
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await signInWithEmailAndPassword(firebaseAuth(), String(data.get("email")), String(data.get("password")));
    } catch (err) {
      setError(friendlyError((err as { code?: string }).code ?? ""));
    } finally {
      setBusy(false);
    }
  }

  async function onReset(form: HTMLFormElement | null) {
    const email = form ? String(new FormData(form).get("email") ?? "") : "";
    if (!email) {
      setError("Enter your email address first, then choose reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(firebaseAuth(), email);
    } catch {
      // Don't reveal whether the account exists.
    }
    setError("");
    setNotice("If an account exists for that email, a reset link is on its way.");
  }

  return (
    <main id="main" className="flex min-h-dvh items-center justify-center bg-ink-900 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold">Sign in to the admin panel</h1>
        <p className="mt-2 text-sm text-slate-600">Manage site content, contact details and enquiries.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-5" id="login-form">
          <div aria-live="polite">
            {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
            {notice && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
          </div>
          <div>
            <label htmlFor="login-email" className="field-label">
              Email
            </label>
            <input id="login-email" name="email" type="email" autoComplete="username" required className="field-input" />
          </div>
          <div>
            <label htmlFor="login-password" className="field-label">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="field-input"
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <button
            type="button"
            className="w-full text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
            onClick={() => onReset(document.getElementById("login-form") as HTMLFormElement)}
          >
            Forgot your password?
          </button>
        </form>
      </div>
    </main>
  );
}
