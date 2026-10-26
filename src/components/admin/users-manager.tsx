"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { Mail, Shield, Trash, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/admin/auth-provider";
import { ConfirmDialog, Modal, PageTitle, useToast } from "@/components/admin/ui";
import { firestore } from "@/lib/firebase/client";
import {
  ADMIN_ROLE_LABELS,
  ADMIN_SCOPE_LABELS,
  ADMIN_SCOPES,
  type AdminRole,
  type AdminScope,
} from "@/lib/types";

type AdminRow = {
  id: string;
  email: string;
  role: AdminRole;
  scopes: AdminScope[];
  createdAt: string;
};

type InviteRow = {
  id: string;
  email: string;
  role: Exclude<AdminRole, "owner">;
  scopes: AdminScope[];
  createdAt: string;
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const toDate = (v: unknown) =>
  v instanceof Timestamp
    ? v.toDate().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })
    : typeof v === "string"
      ? v
      : "";

export function UsersManager() {
  const { user, role, can } = useAuth();
  const notify = useToast();
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [revoking, setRevoking] = useState<AdminRow | null>(null);
  const [cancellingInvite, setCancellingInvite] = useState<InviteRow | null>(null);
  const [busy, setBusy] = useState(false);

  const allowed = can("users");

  useEffect(() => {
    if (!allowed) {
      setLoading(false);
      return;
    }
    let unsubAdmins: (() => void) | undefined;
    let unsubInvites: (() => void) | undefined;
    (async () => {
      try {
        // Admins are listed via a one-shot read first for stable initial order,
        // then kept fresh with a snapshot listener.
        const adminsRef = collection(firestore(), "admins");
        const initial = await getDocs(adminsRef);
        setAdmins(
          initial.docs.map((d) => {
            const data = d.data() as Partial<AdminRow>;
            return {
              id: d.id,
              email: data.email ?? "",
              role: data.role ?? "owner",
              scopes: data.scopes ?? [],
              createdAt: toDate(data.createdAt),
            };
          }),
        );
        unsubAdmins = onSnapshot(adminsRef, (snap) => {
          setAdmins(
            snap.docs.map((d) => {
              const data = d.data() as Partial<AdminRow>;
              return {
                id: d.id,
                email: data.email ?? "",
                role: data.role ?? "owner",
                scopes: data.scopes ?? [],
                createdAt: toDate(data.createdAt),
              };
            }),
          );
        });
        unsubInvites = onSnapshot(
          query(collection(firestore(), "adminInvites"), orderBy("createdAt", "desc")),
          (snap) => {
            setInvites(
              snap.docs.map((d) => {
                const data = d.data() as Partial<InviteRow>;
                return {
                  id: d.id,
                  email: data.email ?? d.id,
                  role: (data.role ?? "editor") as InviteRow["role"],
                  scopes: data.scopes ?? [],
                  createdAt: toDate(data.createdAt),
                };
              }),
            );
            setLoading(false);
          },
          () => setLoading(false),
        );
      } catch (err) {
        console.error(err);
        notify("Could not load users.", "error");
        setLoading(false);
      }
    })();
    return () => {
      unsubAdmins?.();
      unsubInvites?.();
    };
  }, [allowed, notify]);

  if (!allowed) {
    return (
      <>
        <PageTitle title="Users" description="Manage who can access the admin panel." />
        <div className="rounded-3xl bg-white p-8 ring-1 ring-slate-200">
          <p className="text-slate-700">
            You don&rsquo;t have permission to manage users. Ask an owner to grant you the
            <span className="font-semibold"> User management</span> scope.
          </p>
        </div>
      </>
    );
  }

  async function sendInvite(email: string, inviteRole: InviteRow["role"], scopes: AdminScope[]) {
    if (!user) return;
    const key = email.trim().toLowerCase();
    if (!EMAIL_RE.test(key)) {
      notify("Enter a valid email address.", "error");
      return;
    }
    if (admins.some((a) => a.email.toLowerCase() === key)) {
      notify("That person is already an admin.", "error");
      return;
    }
    setBusy(true);
    try {
      await setDoc(doc(firestore(), "adminInvites", key), {
        email: key,
        role: inviteRole,
        scopes,
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
      });
      notify("Invite sent. They will be granted access on their next sign-in.");
      setInviteOpen(false);
    } catch (err) {
      console.error(err);
      notify("Could not send invite.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function revoke() {
    if (!revoking) return;
    setBusy(true);
    try {
      await deleteDoc(doc(firestore(), "admins", revoking.id));
      notify(`${revoking.email} is no longer an admin.`);
    } catch (err) {
      console.error(err);
      notify("Revoke failed.", "error");
    } finally {
      setBusy(false);
      setRevoking(null);
    }
  }

  async function cancelInvite() {
    if (!cancellingInvite) return;
    setBusy(true);
    try {
      await deleteDoc(doc(firestore(), "adminInvites", cancellingInvite.id));
      notify("Invite cancelled.");
    } catch (err) {
      console.error(err);
      notify("Could not cancel invite.", "error");
    } finally {
      setBusy(false);
      setCancellingInvite(null);
    }
  }

  const canRevoke = (row: AdminRow) =>
    row.role !== "owner" && row.id !== user?.uid && (role === "owner" || row.role !== "admin");

  return (
    <>
      <PageTitle
        title="Users"
        description="Invite colleagues, assign roles, and limit what each admin can edit."
        action={
          <button type="button" onClick={() => setInviteOpen(true)} className="btn-primary">
            <UserPlus className="size-4" aria-hidden="true" /> Invite user
          </button>
        }
      />

      <section aria-labelledby="admins-heading" className="rounded-3xl bg-white ring-1 ring-slate-200">
        <h2 id="admins-heading" className="border-b border-slate-200 px-6 py-4 text-sm font-semibold text-ink-900">
          Active admins
        </h2>
        {loading ? (
          <p className="p-6 text-sm text-slate-500">Loading…</p>
        ) : admins.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No admins yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {admins.map((a) => (
              <li key={a.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {a.email || <span className="text-slate-500">(no email)</span>}
                    {a.id === user?.uid && (
                      <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-brand-700 uppercase">
                        You
                      </span>
                    )}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-ink-900/5 px-2 py-0.5 font-semibold text-ink-900">
                      <Shield className="size-3" aria-hidden="true" /> {ADMIN_ROLE_LABELS[a.role]}
                    </span>
                    {a.role === "owner" ? (
                      <span className="text-slate-500">Full access</span>
                    ) : a.scopes.length === 0 ? (
                      <span className="text-slate-500">No scopes</span>
                    ) : (
                      a.scopes.map((s) => (
                        <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5">
                          {ADMIN_SCOPE_LABELS[s]}
                        </span>
                      ))
                    )}
                  </p>
                </div>
                {canRevoke(a) ? (
                  <button
                    type="button"
                    onClick={() => setRevoking(a)}
                    className="inline-flex items-center gap-1.5 self-start rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:border-red-200 hover:bg-red-50"
                  >
                    <Trash className="size-3.5" aria-hidden="true" /> Revoke
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="invites-heading" className="mt-8 rounded-3xl bg-white ring-1 ring-slate-200">
        <h2 id="invites-heading" className="border-b border-slate-200 px-6 py-4 text-sm font-semibold text-ink-900">
          Pending invites
        </h2>
        {invites.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No pending invites.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {invites.map((inv) => (
              <li key={inv.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 truncate text-sm font-semibold text-ink-900">
                    <Mail className="size-4 text-brass-500" aria-hidden="true" />
                    {inv.email}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-ink-900/5 px-2 py-0.5 font-semibold text-ink-900">
                      {ADMIN_ROLE_LABELS[inv.role]}
                    </span>
                    {inv.scopes.map((s) => (
                      <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5">
                        {ADMIN_SCOPE_LABELS[s]}
                      </span>
                    ))}
                    {inv.createdAt && <span className="text-slate-400">Invited {inv.createdAt}</span>}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCancellingInvite(inv)}
                  className="inline-flex items-center gap-1.5 self-start rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                >
                  <Trash className="size-3.5" aria-hidden="true" /> Cancel
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <InviteDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSubmit={sendInvite}
        busy={busy}
      />

      <ConfirmDialog
        open={!!revoking}
        title="Revoke admin access?"
        message={`${revoking?.email ?? "This user"} will immediately lose access to the admin panel. They will stay signed in to Firebase until their session expires.`}
        confirmLabel="Revoke"
        onConfirm={revoke}
        onCancel={() => setRevoking(null)}
        busy={busy}
      />
      <ConfirmDialog
        open={!!cancellingInvite}
        title="Cancel invite?"
        message={`The pending invite for ${cancellingInvite?.email ?? ""} will be removed.`}
        confirmLabel="Cancel invite"
        onConfirm={cancelInvite}
        onCancel={() => setCancellingInvite(null)}
        busy={busy}
      />
    </>
  );
}

function InviteDialog({
  open,
  onClose,
  onSubmit,
  busy,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string, role: Exclude<AdminRole, "owner">, scopes: AdminScope[]) => void;
  busy: boolean;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Exclude<AdminRole, "owner">>("editor");
  const [scopes, setScopes] = useState<Set<AdminScope>>(new Set(["content"]));

  useEffect(() => {
    if (open) {
      setEmail("");
      setRole("editor");
      setScopes(new Set(["content"]));
    }
  }, [open]);

  const effectiveScopes: AdminScope[] = useMemo(
    () => (role === "admin" ? [...ADMIN_SCOPES] : (ADMIN_SCOPES.filter((s) => scopes.has(s)) as AdminScope[])),
    [role, scopes],
  );

  function toggle(scope: AdminScope) {
    setScopes((prev) => {
      const next = new Set(prev);
      if (next.has(scope)) next.delete(scope);
      else next.add(scope);
      return next;
    });
  }

  return (
    <Modal open={open} onClose={onClose} title="Invite a new admin">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(email, role, effectiveScopes);
        }}
        className="space-y-5"
      >
        <div>
          <label className="field-label" htmlFor="invite-email">
            Email address
          </label>
          <input
            id="invite-email"
            type="email"
            required
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field-input"
            placeholder="person@firm.co.uk"
          />
          <p className="mt-1 text-xs text-slate-500">
            They will gain access on their next sign-in with this email. Case doesn&rsquo;t matter.
          </p>
        </div>

        <fieldset>
          <legend className="field-label">Role</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {(["admin", "editor"] as const).map((r) => (
              <label
                key={r}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${
                  role === r ? "border-brand-600 bg-brand-50" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={role === r}
                  onChange={() => setRole(r)}
                  className="mt-1"
                />
                <span>
                  <span className="block font-semibold text-ink-900">{ADMIN_ROLE_LABELS[r]}</span>
                  <span className="text-xs text-slate-600">
                    {r === "admin"
                      ? "Full access to all content, messages, settings, and users."
                      : "Access only to the areas you choose below."}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset disabled={role === "admin"} className="disabled:opacity-60">
          <legend className="field-label">Areas they can manage</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {ADMIN_SCOPES.map((s) => (
              <label
                key={s}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50"
              >
                <input
                  type="checkbox"
                  checked={role === "admin" || scopes.has(s)}
                  onChange={() => toggle(s)}
                />
                <span className="font-medium text-ink-900">{ADMIN_SCOPE_LABELS[s]}</span>
              </label>
            ))}
          </div>
          {role === "admin" && (
            <p className="mt-2 text-xs text-slate-500">Admins always have every area.</p>
          )}
        </fieldset>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !email || effectiveScopes.length === 0}
            className="btn-primary"
          >
            {busy ? "Sending…" : "Send invite"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
