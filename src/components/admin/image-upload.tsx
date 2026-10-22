"use client";

import { ImageUp, LoaderCircle, Trash } from "lucide-react";
import { useId, useRef, useState } from "react";
import { cloudinaryConfig, isCloudinaryConfigured } from "@/lib/env";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

/** Uploads straight from the browser to Cloudinary using an unsigned preset. */
async function uploadToCloudinary(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", cloudinaryConfig.uploadPreset);
  body.append("folder", "case-lms");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  const json = (await res.json()) as { secure_url: string };
  return json.secure_url;
}

export function ImageUpload({
  id,
  value,
  onChange,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (url: string) => void;
  describedBy?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const errorId = useId();

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    if (!ACCEPTED.includes(file.type)) return setError("Choose a JPG, PNG, WebP, AVIF or GIF image.");
    if (file.size > MAX_BYTES) return setError("Images must be 5 MB or smaller.");
    setBusy(true);
    try {
      onChange(await uploadToCloudinary(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      {value && (
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-only preview of an arbitrary URL */}
          <img src={value} alt="Current image" className="size-20 rounded-xl object-cover ring-1 ring-slate-200" />
          <button type="button" className="btn-secondary" onClick={() => onChange("")}>
            <Trash className="size-4" aria-hidden="true" /> Remove
          </button>
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={id}
          type="url"
          inputMode="url"
          placeholder="https://res.cloudinary.com/…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={[describedBy, error ? errorId : ""].filter(Boolean).join(" ") || undefined}
          className="field-input"
        />
        {isCloudinaryConfigured && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED.join(",")}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <button
              type="button"
              className="btn-secondary shrink-0"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <ImageUp className="size-4" aria-hidden="true" />}
              {busy ? "Uploading…" : "Upload image"}
            </button>
          </>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
