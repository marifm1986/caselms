"use client";

import { collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import { Mail, MailOpen, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmDialog, Modal, PageTitle, useToast } from "@/components/admin/ui";
import { firestore } from "@/lib/firebase/client";
import type { ContactMessage } from "@/lib/types";

const toDate = (value: unknown) =>
  value instanceof Timestamp ? value.toDate().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "";

async function fetchMessages(): Promise<ContactMessage[]> {
  const snap = await getDocs(query(collection(firestore(), "messages"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ ...(d.data() as ContactMessage), id: d.id, createdAt: toDate(d.data().createdAt) }));
}

export function MessagesInbox() {
  const notify = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [open, setOpen] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages()
      .then(setMessages)
      .catch((err) => {
        console.error(err);
        notify("Could not load messages.", "error");
      })
      .finally(() => setLoading(false));
  }, [notify]);

  async function setRead(m: ContactMessage, read: boolean) {
    await updateDoc(doc(firestore(), "messages", m.id), { read });
    setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, read } : x)));
  }

  async function view(m: ContactMessage) {
    setOpen(m);
    if (!m.read) await setRead(m, true).catch(() => undefined);
  }

  async function remove() {
    if (!deleting) return;
    try {
      await deleteDoc(doc(firestore(), "messages", deleting.id));
      setMessages((list) => list.filter((x) => x.id !== deleting.id));
      notify("Message deleted.");
    } catch {
      notify("Delete failed.", "error");
    }
    setDeleting(null);
    setOpen(null);
  }

  const shown = filter === "unread" ? messages.filter((m) => !m.read) : messages;
  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <PageTitle title="Messages" description={`Enquiries from the contact form. ${unread} unread.`} />
      <div className="mb-4 inline-flex rounded-full bg-white p-1 ring-1 ring-slate-200" role="group" aria-label="Filter messages">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className="min-h-10 rounded-full px-4 text-sm font-medium capitalize aria-pressed:bg-ink-900 aria-pressed:text-white"
          >
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-white ring-1 ring-slate-200">
        {loading ? (
          <p role="status" className="p-8 text-center text-slate-600">
            Loading…
          </p>
        ) : shown.length === 0 ? (
          <p className="p-8 text-center text-slate-600">No messages.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {shown.map((m) => (
              <li key={m.id} className="flex items-start gap-4 p-4 hover:bg-slate-50">
                {m.read ? (
                  <MailOpen className="mt-1 size-5 shrink-0 text-slate-400" aria-hidden="true" />
                ) : (
                  <Mail className="mt-1 size-5 shrink-0 text-brand-600" aria-hidden="true" />
                )}
                <button type="button" onClick={() => view(m)} className="min-w-0 flex-1 text-left">
                  <span className={`block truncate ${m.read ? "text-slate-700" : "font-semibold text-ink-900"}`}>
                    {m.name}
                    {m.firm && <span className="font-normal text-slate-600"> · {m.firm}</span>}
                    {!m.read && <span className="sr-only"> (unread)</span>}
                  </span>
                  <span className="block truncate text-sm text-slate-600">{m.message}</span>
                </button>
                <span className="hidden shrink-0 text-xs text-slate-600 sm:block">{m.createdAt}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={open !== null} onClose={() => setOpen(null)} title={open ? `Message from ${open.name}` : "Message"}>
        {open && (
          <div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {[
                ["Email", <a key="e" href={`mailto:${open.email}`} className="text-brand-700 underline">{open.email}</a>],
                ["Phone", open.phone || "Not given"],
                ["Firm", open.firm || "Not given"],
                ["Topic", open.topic],
                ["Received", open.createdAt],
              ].map(([k, v]) => (
                <div key={String(k)}>
                  <dt className="text-slate-600">{k}</dt>
                  <dd className="font-medium text-ink-900">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 rounded-2xl bg-slate-50 p-4 whitespace-pre-wrap text-ink-900">{open.message}</p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                className="btn-secondary"
                onClick={async () => {
                  await setRead(open, false);
                  setOpen(null);
                }}
              >
                Mark as unread
              </button>
              <a href={`mailto:${open.email}?subject=${encodeURIComponent("Re: your Case LMS enquiry")}`} className="btn-primary">
                Reply by email
              </a>
              <button type="button" className="btn bg-red-700 text-white hover:bg-red-800" onClick={() => setDeleting(open)}>
                <Trash className="size-4" aria-hidden="true" /> Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete message?"
        message="This message will be permanently deleted."
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
