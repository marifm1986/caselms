import "server-only";
import { firebaseConfig, isFirebaseConfigured } from "./env";

// Server-side Firestore reads over the REST API. Keeps the Firebase SDK out of
// public page bundles and lets Next.js cache the results with `use cache`.

type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  timestampValue?: string;
  nullValue?: null;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
};

type FirestoreDocument = { name: string; fields?: Record<string, FirestoreValue> };

export class FirestoreUnavailableError extends Error {}

const base = () =>
  `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

function decodeValue(value: FirestoreValue): unknown {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("arrayValue" in value) return (value.arrayValue?.values ?? []).map(decodeValue);
  if ("mapValue" in value) return decodeFields(value.mapValue?.fields);
  return null;
}

function decodeFields(fields: Record<string, FirestoreValue> = {}) {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decodeValue(v)]));
}

function decodeDocument<T>(doc: FirestoreDocument): T {
  const id = doc.name.split("/").pop() ?? "";
  return { id, ...decodeFields(doc.fields) } as T;
}

export async function getDocument<T>(path: string): Promise<T | null> {
  if (!isFirebaseConfigured) throw new FirestoreUnavailableError("Firebase is not configured");
  const res = await fetch(`${base()}/${path}?key=${firebaseConfig.apiKey}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new FirestoreUnavailableError(`Firestore ${res.status} for ${path}`);
  return decodeDocument<T>(await res.json());
}

export async function queryCollection<T>(
  collectionId: string,
  { publishedOnly = true }: { publishedOnly?: boolean } = {},
): Promise<T[]> {
  if (!isFirebaseConfigured) throw new FirestoreUnavailableError("Firebase is not configured");
  const structuredQuery: Record<string, unknown> = { from: [{ collectionId }], limit: 500 };
  if (publishedOnly) {
    structuredQuery.where = {
      fieldFilter: { field: { fieldPath: "published" }, op: "EQUAL", value: { booleanValue: true } },
    };
  }
  const res = await fetch(`${base()}:runQuery?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ structuredQuery }),
  });
  if (!res.ok) throw new FirestoreUnavailableError(`Firestore ${res.status} for ${collectionId}`);
  const rows: { document?: FirestoreDocument }[] = await res.json();
  return rows.filter((r) => r.document).map((r) => decodeDocument<T>(r.document!));
}
