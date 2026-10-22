import { Suspense } from "react";
import { ContentRoute } from "@/components/admin/content-route";

export const metadata = { title: "Content" };

// Collections are selected with ?type=<key> so the admin stays a set of
// static routes (see src/lib/admin-schema.ts for the list of keys).
export default function AdminContentPage() {
  return (
    <Suspense>
      <ContentRoute />
    </Suspense>
  );
}
