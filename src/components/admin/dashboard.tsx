"use client";

import { collection, doc, getCountFromServer, getDoc, query, where, writeBatch } from "firebase/firestore";
import { ArrowRight, Database, Inbox, Settings } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/admin/auth-provider";
import { PageTitle, useToast } from "@/components/admin/ui";
import { collections } from "@/lib/admin-schema";
import { defaultSettings } from "@/lib/defaults";
import { firestore } from "@/lib/firebase/client";

async function fetchCounts() {
  const db = firestore();
  const entries = await Promise.all(
    collections.map(async (c) => [c.key, (await getCountFromServer(collection(db, c.key))).data().count] as const),
  );
  const unreadSnap = await getCountFromServer(query(collection(db, "messages"), where("read", "==", false)));
  return { counts: Object.fromEntries(entries) as Record<string, number>, unread: unreadSnap.data().count };
}

export function Dashboard() {
  const { publish, user } = useAuth();
  const notify = useToast();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [unread, setUnread] = useState(0);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(
    () =>
      fetchCounts()
        .then(({ counts, unread }) => {
          setCounts(counts);
          setUnread(unread);
        })
        .catch(() => notify("Could not load dashboard counts.", "error")),
    [notify],
  );

  useEffect(() => {
    load();
  }, [load]);

  async function seed() {
    setSeeding(true);
    try {
      const db = firestore();
      const batch = writeBatch(db);
      const seeded: string[] = [];
      for (const c of collections) {
        if (counts[c.key]) continue; // never overwrite real content
        c.seed.forEach((item) => batch.set(doc(collection(db, c.key)), item));
        seeded.push(c.tag);
      }
      const settings = await getDoc(doc(db, "settings", "site"));
      if (!settings.exists()) {
        batch.set(doc(db, "settings", "site"), defaultSettings);
        seeded.push("settings");
      }
      if (!seeded.length) {
        notify("Every collection already has content, so nothing was seeded.");
        return;
      }
      await batch.commit();
      await publish(seeded);
      await load();
      notify("Default content added.");
    } catch (err) {
      console.error(err);
      notify("Seeding failed. Check your Firestore rules.", "error");
    } finally {
      setSeeding(false);
    }
  }

  const empty = collections.some((c) => counts[c.key] === 0);

  return (
    <>
      <PageTitle title="Dashboard" description={`Welcome back${user?.email ? `, ${user.email}` : ""}.`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link href="/admin/messages" className="group rounded-3xl bg-ink-900 p-6 text-white">
          <Inbox className="size-6 text-brass-300" aria-hidden="true" />
          <p className="mt-4 text-3xl font-semibold">{unread}</p>
          <p className="text-sm text-slate-300">Unread messages</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brass-300">
            Open inbox <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </Link>
        <Link href="/admin/settings" className="group rounded-3xl bg-white p-6 ring-1 ring-slate-200 hover:ring-brand-600">
          <Settings className="size-6 text-brand-600" aria-hidden="true" />
          <p className="mt-4 text-lg font-semibold text-ink-900">Site settings</p>
          <p className="text-sm text-slate-600">Contact details, social links and announcement bar.</p>
        </Link>
        {collections.map((c) => (
          <Link
            key={c.key}
            href={`/admin/content?type=${c.key}`}
            className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 hover:ring-brand-600"
          >
            <p className="text-3xl font-semibold text-ink-900">{counts[c.key] ?? "…"}</p>
            <p className="text-sm font-medium text-ink-900">{c.label}</p>
            <p className="mt-1 text-sm text-slate-600">{c.description}</p>
          </Link>
        ))}
      </div>

      {empty && (
        <section aria-labelledby="seed-title" className="mt-8 rounded-3xl border border-dashed border-brand-300 bg-brand-50 p-6">
          <h2 id="seed-title" className="flex items-center gap-2 text-lg font-semibold">
            <Database className="size-5 text-brand-700" aria-hidden="true" /> Start with sample content
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-700">
            Some collections are empty. Add the default Case LMS content to empty collections, then edit it to suit
            your firm. Collections that already have content are left alone.
          </p>
          <button type="button" className="btn-primary mt-4" onClick={seed} disabled={seeding}>
            {seeding ? "Adding content…" : "Seed default content"}
          </button>
        </section>
      )}
    </>
  );
}
