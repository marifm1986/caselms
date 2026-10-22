"use client";

import { useState, type FormEvent } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import type { FieldDef } from "@/lib/admin-schema";
import { slugify } from "@/lib/utils";

type Values = Record<string, unknown>;

function validate(fields: FieldDef[], values: Values) {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const v = values[f.name];
    if (f.required && (v === "" || v === undefined || v === null || (Array.isArray(v) && !v.length))) {
      errors[f.name] = `${f.label} is required.`;
    }
    if (f.type === "slug" && typeof v === "string" && v && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) {
      errors[f.name] = "Use lowercase letters, numbers and single hyphens only.";
    }
    if (f.type === "number" && typeof v === "number" && Number.isNaN(v)) errors[f.name] = "Enter a number.";
  }
  return errors;
}

export function RecordForm({
  fields,
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  fields: FieldDef[];
  initial: Values;
  submitLabel: string;
  onSubmit: (values: Values) => Promise<void>;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));

  const set = (name: string, value: unknown) =>
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      // Keep slugs in sync with their source field until edited by hand.
      for (const f of fields) {
        if (f.type === "slug" && f.from === name && !slugTouched) next[f.name] = slugify(String(value));
      }
      return next;
    });

  async function submit(e: FormEvent) {
    e.preventDefault();
    const found = validate(fields, values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`field-${first}`)?.focus();
      return;
    }
    setBusy(true);
    try {
      await onSubmit(values);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {fields.map((f) => {
        const id = `field-${f.name}`;
        const helpId = f.help ? `${id}-help` : undefined;
        const errorId = errors[f.name] ? `${id}-error` : undefined;
        const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;
        const common = {
          id,
          name: f.name,
          "aria-invalid": errors[f.name] ? true : undefined,
          "aria-describedby": describedBy,
          "aria-required": f.required || undefined,
        };
        const value = values[f.name];

        if (f.type === "boolean") {
          return (
            <div key={f.name}>
              <div className="flex items-center gap-3">
                <input
                  {...common}
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(e) => set(f.name, e.target.checked)}
                  className="size-5 accent-brand-600"
                />
                <label htmlFor={id} className="text-sm font-medium text-ink-900">
                  {f.label}
                </label>
              </div>
              {f.help && (
                <p id={helpId} className="mt-1 ml-8 text-xs text-slate-600">
                  {f.help}
                </p>
              )}
            </div>
          );
        }

        let control: React.ReactNode;
        switch (f.type) {
          case "textarea":
            control = (
              <textarea
                {...common}
                rows={f.rows ?? 4}
                value={String(value ?? "")}
                onChange={(e) => set(f.name, e.target.value)}
                className="field-input resize-y"
              />
            );
            break;
          case "list":
            control = (
              <textarea
                {...common}
                rows={4}
                value={Array.isArray(value) ? value.join("\n") : ""}
                onChange={(e) => set(f.name, e.target.value.split("\n"))}
                className="field-input resize-y"
              />
            );
            break;
          case "number":
            control = (
              <input
                {...common}
                type="number"
                step="any"
                value={Number.isNaN(value) ? "" : String(value ?? 0)}
                onChange={(e) => set(f.name, e.target.value === "" ? 0 : Number(e.target.value))}
                className="field-input"
              />
            );
            break;
          case "select":
            control = (
              <select {...common} value={String(value ?? "")} onChange={(e) => set(f.name, e.target.value)} className="field-input">
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            );
            break;
          case "date":
            control = (
              <input {...common} type="date" value={String(value ?? "")} onChange={(e) => set(f.name, e.target.value)} className="field-input" />
            );
            break;
          case "image":
            control = <ImageUpload id={id} value={String(value ?? "")} onChange={(url) => set(f.name, url)} describedBy={describedBy} />;
            break;
          case "slug":
            control = (
              <input
                {...common}
                type="text"
                value={String(value ?? "")}
                onChange={(e) => {
                  setSlugTouched(true);
                  set(f.name, e.target.value);
                }}
                className="field-input font-mono"
              />
            );
            break;
          default:
            control = (
              <input {...common} type="text" value={String(value ?? "")} onChange={(e) => set(f.name, e.target.value)} className="field-input" />
            );
        }

        return (
          <div key={f.name}>
            <label htmlFor={id} className="field-label">
              {f.label}
              {f.required && (
                <>
                  {" "}
                  <span aria-hidden="true" className="text-red-700">
                    *
                  </span>
                </>
              )}
            </label>
            {control}
            {f.help && (
              <p id={helpId} className="mt-1 text-xs text-slate-600">
                {f.help}
              </p>
            )}
            {errors[f.name] && (
              <p id={errorId} className="mt-1 text-sm text-red-700">
                {errors[f.name]}
              </p>
            )}
          </div>
        );
      })}
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

/** Normalises form values before writing to Firestore (trims list items, drops blanks). */
export function cleanValues(fields: FieldDef[], values: Values): Values {
  return Object.fromEntries(
    fields.map((f) => {
      const v = values[f.name];
      if (f.type === "list") return [f.name, (Array.isArray(v) ? v : []).map((s) => String(s).trim()).filter(Boolean)];
      if (f.type === "number") return [f.name, Number(v) || 0];
      if (f.type === "boolean") return [f.name, Boolean(v)];
      return [f.name, typeof v === "string" ? v.trim() : (v ?? "")];
    }),
  );
}
