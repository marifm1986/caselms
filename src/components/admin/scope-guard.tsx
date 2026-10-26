"use client";

import { useAuth } from "@/components/admin/auth-provider";
import { ADMIN_SCOPE_LABELS, type AdminScope } from "@/lib/types";

export function ScopeGuard({ scope, children }: { scope: AdminScope; children: React.ReactNode }) {
  const { can, loading } = useAuth();
  if (loading) return null;
  if (!can(scope)) {
    return (
      <div className="rounded-3xl bg-white p-8 ring-1 ring-slate-200">
        <h1 className="text-xl font-semibold text-ink-900">You don&rsquo;t have access to this area</h1>
        <p className="mt-2 text-slate-600">
          Ask an owner to grant you the <span className="font-semibold">{ADMIN_SCOPE_LABELS[scope]}</span> scope.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
