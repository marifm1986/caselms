"use client";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/admin/auth-provider";
import { RecordForm } from "@/components/admin/record-form";
import { PageTitle, useToast } from "@/components/admin/ui";
import type { FieldDef } from "@/lib/admin-schema";
import { defaultSettings } from "@/lib/defaults";
import { firestore } from "@/lib/firebase/client";
import type { SiteSettings } from "@/lib/types";
import { safeUrl } from "@/lib/utils";

const fields: FieldDef[] = [
  { name: "siteName", label: "Site name", type: "text", required: true },
  { name: "tagline", label: "Tagline", type: "text", required: true, help: "Shown in the footer." },
  { name: "description", label: "Site description", type: "textarea", rows: 3, required: true, help: "Used on the home page hero and as the default search description." },
  { name: "email", label: "Contact email", type: "text", required: true },
  { name: "salesEmail", label: "Sales email", type: "text", required: true },
  { name: "phone", label: "Phone number", type: "text", required: true },
  { name: "address", label: "Office address", type: "textarea", rows: 3, required: true },
  { name: "hours", label: "Opening hours", type: "text" },
  { name: "mapUrl", label: "Google Maps embed URL", type: "text", help: "Optional. Must start with https://www.google.com/maps/embed" },
  { name: "announcement", label: "Announcement bar", type: "text", help: "Optional. Shown above the header on every page." },
  { name: "linkedin", label: "LinkedIn URL", type: "text" },
  { name: "x", label: "X (Twitter) URL", type: "text" },
  { name: "facebook", label: "Facebook URL", type: "text" },
  { name: "youtube", label: "YouTube URL", type: "text" },
];

const socialKeys = ["linkedin", "x", "facebook", "youtube"] as const;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SettingsForm() {
  const { publish } = useAuth();
  const notify = useToast();
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    getDoc(doc(firestore(), "settings", "site"))
      .then((snap) => {
        const data = { ...defaultSettings, ...(snap.data() as Partial<SiteSettings> | undefined) };
        setInitial({ ...data, ...data.socials });
      })
      .catch(() => {
        notify("Could not load settings.", "error");
        setInitial({ ...defaultSettings, ...defaultSettings.socials });
      });
  }, [notify]);

  async function save(values: Record<string, unknown>) {
    const v = Object.fromEntries(Object.entries(values).map(([k, val]) => [k, typeof val === "string" ? val.trim() : val]));
    if (!emailPattern.test(String(v.email)) || !emailPattern.test(String(v.salesEmail))) {
      notify("Enter valid email addresses.", "error");
      return;
    }
    const socials = Object.fromEntries(socialKeys.map((k) => [k, safeUrl(String(v[k] ?? ""))]));
    const data: SiteSettings = {
      siteName: String(v.siteName),
      tagline: String(v.tagline),
      description: String(v.description),
      email: String(v.email),
      salesEmail: String(v.salesEmail),
      phone: String(v.phone),
      address: String(v.address),
      hours: String(v.hours ?? ""),
      mapUrl: safeUrl(String(v.mapUrl ?? "")),
      announcement: String(v.announcement ?? ""),
      socials,
    };
    try {
      await setDoc(doc(firestore(), "settings", "site"), data);
      await publish(["settings"]);
      notify("Settings saved. The site is updating now.");
    } catch (err) {
      console.error(err);
      notify("Save failed. Check your permissions.", "error");
    }
  }

  return (
    <>
      <PageTitle title="Site settings" description="Contact details, social links and site-wide text." />
      <div className="max-w-3xl rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-8">
        {initial ? (
          <RecordForm fields={fields} initial={initial} submitLabel="Save settings" onSubmit={save} />
        ) : (
          <p role="status" className="text-slate-600">
            Loading…
          </p>
        )}
      </div>
    </>
  );
}
