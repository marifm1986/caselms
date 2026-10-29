"use client";

import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { Pencil, Plus, Search, Sprout, Trash } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/admin/auth-provider";
import { cleanValues, RecordForm } from "@/components/admin/record-form";
import { ConfirmDialog, Modal, PageTitle, useToast } from "@/components/admin/ui";
import { emptyRecord, getCollection } from "@/lib/admin-schema";
import { firestore } from "@/lib/firebase/client";

type Row = Record<string, unknown> & { id: string };

function Cell({ value }: { value: unknown }) {
  if (typeof value === "boolean") {
    return (
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
          value ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-700"
        }`}
      >
        {value ? "Yes" : "No"}
      </span>
    );
  }
  return <span className="line-clamp-2">{String(value ?? "")}</span>;
}

async function fetchRows(key: string) {
  const snap = await getDocs(collection(firestore(), key));
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Row);
  return list.sort(
    (a, b) =>
      Number(a.order ?? 0) - Number(b.order ?? 0) || String(b.publishedAt ?? "").localeCompare(String(a.publishedAt ?? "")),
  );
}

export function CrudManager({ collectionKey }: { collectionKey: string }) {
  const def = getCollection(collectionKey)!;
  const { publish } = useAuth();
  const notify = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    () =>
      fetchRows(def.key)
        .then(setRows)
        .catch((err) => {
          console.error(err);
          notify(`Could not load ${def.label.toLowerCase()}.`, "error");
        })
        .finally(() => setLoading(false)),
    [def.key, def.label, notify],
  );

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => def.columns.some((c) => String(r[c] ?? "").toLowerCase().includes(q)));
  }, [rows, query, def.columns]);

  async function save(values: Record<string, unknown>) {
    const data = cleanValues(def.fields, values);
    try {
      if (data.slug) {
        const clash = rows.find((r) => r.slug === data.slug && (editing === "new" || r.id !== editing?.id));
        if (clash) {
          notify("Another item already uses that URL slug.", "error");
          return;
        }
      }
      if (editing === "new") {
        await addDoc(collection(firestore(), def.key), data);
        notify(`${def.singular[0].toUpperCase()}${def.singular.slice(1)} created.`);
      } else if (editing) {
        await setDoc(doc(firestore(), def.key, editing.id), data);
        notify("Changes saved.");
      }
      setEditing(null);
      await Promise.all([load(), publish([def.tag])]);
    } catch (err) {
      console.error(err);
      notify("Save failed. Check your connection and permissions.", "error");
    }
  }

  const missingSeeds = useMemo(() => {
    const key = def.titleField === "slug" || def.fields.some((f) => f.name === "slug") ? "slug" : def.titleField;
    const existing = new Set(rows.map((r) => String(r[key] ?? "").toLowerCase()).filter(Boolean));
    return def.seed.filter((item) => {
      const value = String((item as Record<string, unknown>)[key] ?? "").toLowerCase();
      return value && !existing.has(value);
    });
  }, [def, rows]);

  async function addMissingSeeds() {
    if (missingSeeds.length === 0) return;
    setBusy(true);
    try {
      const db = firestore();
      const batch = writeBatch(db);
      missingSeeds.forEach((item) => batch.set(doc(collection(db, def.key)), item));
      await batch.commit();
      await Promise.all([load(), publish([def.tag])]);
      notify(`Added ${missingSeeds.length} new ${missingSeeds.length === 1 ? def.singular : def.label.toLowerCase()}.`);
    } catch (err) {
      console.error(err);
      notify("Could not add defaults. Check your permissions.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await deleteDoc(doc(firestore(), def.key, deleting.id));
      notify("Deleted.");
      setDeleting(null);
      await Promise.all([load(), publish([def.tag])]);
    } catch (err) {
      console.error(err);
      notify("Delete failed.", "error");
    } finally {
      setBusy(false);
    }
  }

  const fieldLabel = (name: string) => def.fields.find((f) => f.name === name)?.label ?? name;

  return (
    <>
      <PageTitle
        title={def.label}
        description={def.description}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {missingSeeds.length > 0 && (
              <button
                type="button"
                className="btn-secondary"
                onClick={addMissingSeeds}
                disabled={busy}
                title={`${missingSeeds.length} default ${missingSeeds.length === 1 ? def.singular : def.label.toLowerCase()} not yet added`}
              >
                <Sprout className="size-4" aria-hidden="true" />
                {busy ? "Adding…" : `Add ${missingSeeds.length} default ${missingSeeds.length === 1 ? def.singular : def.label.toLowerCase()}`}
              </button>
            )}
            <button type="button" className="btn-primary" onClick={() => setEditing("new")}>
              <Plus className="size-4" aria-hidden="true" /> New {def.singular}
            </button>
          </div>
        }
      />

      <div className="rounded-3xl bg-white ring-1 ring-slate-200">
        <div className="border-b border-slate-200 p-4">
          <label htmlFor="crud-search" className="sr-only">
            Search {def.label.toLowerCase()}
          </label>
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              id="crud-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="field-input pl-9"
            />
          </div>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-600" role="status">
            Loading…
          </p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-slate-600">
            {rows.length ? "Nothing matches your search." : `No ${def.label.toLowerCase()} yet. Create one, or seed defaults from the dashboard.`}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">{def.label}</caption>
              <thead className="bg-slate-50 text-xs text-slate-600 uppercase">
                <tr>
                  {def.columns.map((c) => (
                    <th key={c} scope="col" className="px-4 py-3 font-semibold">
                      {fieldLabel(c)}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    {def.columns.map((c, i) =>
                      i === 0 ? (
                        <th key={c} scope="row" className="max-w-md px-4 py-3 font-medium text-ink-900">
                          <Cell value={row[c]} />
                        </th>
                      ) : (
                        <td key={c} className="max-w-xs px-4 py-3 text-slate-700">
                          <Cell value={row[c]} />
                        </td>
                      ),
                    )}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditing(row)}
                          className="inline-flex size-10 items-center justify-center rounded-full text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                          <span className="sr-only">Edit {String(row[def.titleField] ?? "")}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(row)}
                          className="inline-flex size-10 items-center justify-center rounded-full text-slate-700 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash className="size-4" aria-hidden="true" />
                          <span className="sr-only">Delete {String(row[def.titleField] ?? "")}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? `New ${def.singular}` : `Edit ${def.singular}`}
      >
        {editing !== null && (
          <RecordForm
            key={editing === "new" ? "new" : editing.id}
            fields={def.fields}
            initial={editing === "new" ? emptyRecord(def) : { ...emptyRecord(def), ...editing }}
            submitLabel={editing === "new" ? "Create" : "Save changes"}
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title={`Delete ${def.singular}?`}
        message={`"${String(deleting?.[def.titleField] ?? "")}" will be removed from the site. This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
        busy={busy}
      />
    </>
  );
}
