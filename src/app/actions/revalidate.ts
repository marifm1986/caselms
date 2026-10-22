"use server";

import { updateTag } from "next/cache";
import { CONTENT_TAGS, type ContentTag } from "@/lib/content";
import { firebaseConfig, isFirebaseConfigured } from "@/lib/env";

/**
 * Refreshes cached public content after an admin edit.
 * The caller's Firebase ID token is verified with Google and the user must
 * have an `admins/{uid}` document, the same check firestore.rules uses.
 */
export async function revalidateContent(idToken: string, tags: string[]) {
  if (!isFirebaseConfigured || !idToken) return { ok: false, error: "Not configured" };

  const lookup = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }) },
  );
  if (!lookup.ok) return { ok: false, error: "Invalid session" };
  const { users } = (await lookup.json()) as { users?: { localId: string }[] };
  const uid = users?.[0]?.localId;
  if (!uid) return { ok: false, error: "Invalid session" };

  const adminDoc = await fetch(
    `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/admins/${uid}`,
    { headers: { Authorization: `Bearer ${idToken}` } },
  );
  if (!adminDoc.ok) return { ok: false, error: "Not an admin" };

  const valid = tags.filter((t): t is ContentTag => (CONTENT_TAGS as readonly string[]).includes(t));
  valid.forEach((tag) => updateTag(tag));
  return { ok: true, revalidated: valid };
}
