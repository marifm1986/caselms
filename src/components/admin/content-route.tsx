"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CrudManager } from "@/components/admin/crud-manager";
import { getCollection } from "@/lib/admin-schema";

export function ContentRoute() {
  const type = useSearchParams().get("type") ?? "";
  if (!getCollection(type)) {
    return (
      <p className="text-slate-700">
        Unknown content type.{" "}
        <Link href="/admin" className="font-semibold text-brand-700 underline">
          Back to dashboard
        </Link>
      </p>
    );
  }
  // key resets list state when switching between collections
  return <CrudManager key={type} collectionKey={type} />;
}
