"use client";

import { Inbox, LayoutDashboard, LoaderCircle, LogOut, Menu, Settings, UserCog, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthProvider, useAuth } from "@/components/admin/auth-provider";
import { LoginForm } from "@/components/admin/login-form";
import { ToastProvider } from "@/components/admin/ui";
import { FeatureIcon, Logo } from "@/components/ui/icons";
import { collections } from "@/lib/admin-schema";
import { isFirebaseConfigured } from "@/lib/env";
import { ADMIN_ROLE_LABELS, type AdminScope } from "@/lib/types";

const collectionIcons: Record<string, string> = {
  features: "sparkles",
  plans: "receipt",
  testimonials: "users",
  faqs: "file",
  stats: "chart",
  team: "briefcase",
  posts: "globe",
};

type NavItem = { href: string; label: string; icon: React.ReactNode; scope?: AdminScope };

const nav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="size-5" aria-hidden="true" /> },
  { href: "/admin/settings", label: "Site settings", icon: <Settings className="size-5" aria-hidden="true" />, scope: "settings" },
  { href: "/admin/messages", label: "Messages", icon: <Inbox className="size-5" aria-hidden="true" />, scope: "messages" },
  { href: "/admin/users", label: "Users", icon: <UserCog className="size-5" aria-hidden="true" />, scope: "users" },
  ...collections.map<NavItem>((c) => ({
    href: `/admin/content?type=${c.key}`,
    label: c.label,
    icon: <FeatureIcon name={collectionIcons[c.key]} className="size-5" />,
    scope: "content",
  })),
];

function SetupNotice() {
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center bg-slate-50 p-6">
      <div className="max-w-lg rounded-3xl bg-white p-8 shadow ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold">Connect Firebase to use the admin panel</h1>
        <p className="mt-3 text-slate-600">
          Copy <code className="rounded bg-slate-100 px-1">.env.example</code> to{" "}
          <code className="rounded bg-slate-100 px-1">.env.local</code>, fill in the{" "}
          <code className="rounded bg-slate-100 px-1">NEXT_PUBLIC_FIREBASE_*</code> values and restart the dev server. The
          README explains how to create your first admin user.
        </p>
      </div>
    </main>
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, role, can, loading, logout } = useAuth();
  const pathname = usePathname();
  const type = useSearchParams().get("type");
  const [menuOpen, setMenuOpen] = useState(false);
  const location = `${pathname}?${type ?? ""}`;
  const [lastPath, setLastPath] = useState(location);
  if (location !== lastPath) {
    setLastPath(location);
    setMenuOpen(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center" role="status">
        <LoaderCircle className="size-8 animate-spin text-brand-600" aria-hidden="true" />
        <span className="sr-only">Loading admin panel</span>
      </div>
    );
  }
  if (!user) return <LoginForm />;
  if (!isAdmin) {
    return (
      <main id="main" className="flex min-h-dvh items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow ring-1 ring-slate-200">
          <h1 className="text-2xl font-semibold">You don&rsquo;t have admin access</h1>
          <p className="mt-3 text-slate-600">
            Signed in as {user.email}. Ask an existing admin to add your user ID to the admins collection.
          </p>
          <p className="mt-3 rounded-xl bg-slate-100 p-3 font-mono text-xs break-all text-ink-900">{user.uid}</p>
          <button type="button" onClick={logout} className="btn-secondary mt-6">
            Sign out
          </button>
        </div>
      </main>
    );
  }

  const isActive = (href: string) => {
    const [path, search] = href.split("?");
    if (search) return pathname === path && `type=${type}` === search;
    return path === "/admin" ? pathname === path : pathname.startsWith(path);
  };

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col">
      <Link href="/admin" className="px-3 py-2" aria-label="Admin dashboard">
        <Logo light />
      </Link>
      <ul className="mt-8 flex-1 space-y-1 overflow-y-auto">
        {nav
          .filter((item) => !item.scope || can(item.scope))
          .slice()
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white aria-[current=page]:bg-brand-600 aria-[current=page]:text-white"
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
      </ul>
      <div className="mt-6 border-t border-white/10 pt-4">
        <p className="truncate px-3 text-xs text-slate-400">{user.email}</p>
        {role && (
          <p className="px-3 text-[11px] font-semibold tracking-wider text-brass-300 uppercase">
            {ADMIN_ROLE_LABELS[role]}
          </p>
        )}
        <button
          type="button"
          onClick={logout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="size-5" aria-hidden="true" /> Sign out
        </button>
        <Link href="/" className="mt-1 block rounded-xl px-3 py-2 text-xs text-slate-400 hover:text-white">
          View public site
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="min-h-dvh bg-slate-50 lg:grid lg:grid-cols-[16rem_1fr]">
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-ink-900 px-4 py-2 text-sm text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to main content
      </a>
      <aside className="sticky top-0 hidden h-dvh bg-ink-900 p-4 lg:block">{sidebar}</aside>

      <div className="flex items-center justify-between bg-ink-900 px-4 py-3 lg:hidden">
        <Logo light />
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full text-white hover:bg-white/10"
          aria-expanded={menuOpen}
          aria-controls="admin-mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>
      </div>
      {menuOpen && (
        <div id="admin-mobile-nav" className="bg-ink-900 p-4 lg:hidden">
          {sidebar}
        </div>
      )}

      <main id="main" tabIndex={-1} className="min-w-0 p-4 focus:outline-none sm:p-8">
        {children}
      </main>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  if (!isFirebaseConfigured) return <SetupNotice />;
  return (
    <AuthProvider>
      <ToastProvider>
        <Gate>{children}</Gate>
      </ToastProvider>
    </AuthProvider>
  );
}
