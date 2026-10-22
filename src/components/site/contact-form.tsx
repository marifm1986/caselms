"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { emailjsConfig, isEmailjsConfigured, isFirebaseConfigured } from "@/lib/env";

const topics = [
  { value: "general", label: "General enquiry" },
  { value: "demo", label: "Book a demo" },
  { value: "starter", label: "Starter plan" },
  { value: "practice", label: "Practice plan" },
  { value: "enterprise", label: "Enterprise plan" },
  { value: "support", label: "Customer support" },
];

type Values = { name: string; email: string; firm: string; phone: string; topic: string; message: string };
type Errors = Partial<Record<keyof Values | "consent", string>>;

function validate(v: Values, consent: boolean): Errors {
  const errors: Errors = {};
  if (v.name.trim().length < 2) errors.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = "Enter a valid email address, like name@firm.com.";
  if (v.phone && !/^[\d\s()+-]{7,20}$/.test(v.phone)) errors.phone = "Enter a valid phone number.";
  if (v.message.trim().length < 10) errors.message = "Tell us a little more, at least 10 characters.";
  if (v.message.length > 3000) errors.message = "Keep your message under 3000 characters.";
  if (!consent) errors.consent = "Please agree so we can reply to you.";
  return errors;
}

async function saveToFirestore(v: Values) {
  const [{ addDoc, collection, serverTimestamp }, { firestore }] = await Promise.all([
    import("firebase/firestore"),
    import("@/lib/firebase/client"),
  ]);
  await addDoc(collection(firestore(), "messages"), { ...v, read: false, createdAt: serverTimestamp() });
}

async function sendEmail(v: Values) {
  const emailjs = (await import("@emailjs/browser")).default;
  await emailjs.send(
    emailjsConfig.serviceId,
    emailjsConfig.templateId,
    { from_name: v.name, reply_to: v.email, firm: v.firm, phone: v.phone, topic: v.topic, message: v.message },
    { publicKey: emailjsConfig.publicKey },
  );
}

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const topicRef = useRef<HTMLSelectElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Preselect the topic from ?topic=, e.g. links from "Book a demo" buttons.
  useEffect(() => {
    const topic = new URLSearchParams(window.location.search).get("topic");
    if (topic && topicRef.current && topics.some((t) => t.value === topic)) topicRef.current.value = topic;
  }, []);

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return; // honeypot: bots fill hidden fields

    const values: Values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      firm: String(data.get("firm") ?? ""),
      phone: String(data.get("phone") ?? ""),
      topic: String(data.get("topic") ?? "general"),
      message: String(data.get("message") ?? ""),
    };
    const found = validate(values, data.get("consent") === "on");
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus("sending");
    const jobs: Promise<void>[] = [];
    if (isFirebaseConfigured) jobs.push(saveToFirestore(values));
    if (isEmailjsConfigured) jobs.push(sendEmail(values));
    const results = await Promise.allSettled(jobs);
    const ok = results.some((r) => r.status === "fulfilled");
    results.forEach((r) => r.status === "rejected" && console.error("[contact]", r.reason));
    setStatus(ok ? "sent" : "error");
    if (ok) form.reset();
  }

  const fieldProps = (name: keyof Values | "consent") => ({
    id: `contact-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });

  const errorText = (name: keyof Errors) =>
    errors[name] && (
      <p id={`contact-${name}-error`} className="mt-1.5 text-sm text-red-700">
        {errors[name]}
      </p>
    );

  const errorCount = Object.keys(errors).length;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "sent" ? (
        <m.div
          key="sent"
          ref={successRef}
          tabIndex={-1}
          role="status"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center rounded-3xl bg-emerald-50 p-10 text-center"
        >
          <CheckCircle2 className="size-12 text-emerald-600" aria-hidden="true" />
          <h2 className="mt-4 text-2xl font-semibold">Thanks, your message is on its way</h2>
          <p className="mt-2 text-slate-700">A member of our team will reply within one working day.</p>
          <button type="button" className="btn-secondary mt-6" onClick={() => setStatus("idle")}>
            Send another message
          </button>
        </m.div>
      ) : (
        <m.form key="form" onSubmit={onSubmit} noValidate className="space-y-5" exit={{ opacity: 0 }}>
          <div ref={summaryRef} tabIndex={-1} aria-live="assertive" className="focus:outline-none">
            {errorCount > 0 && (
              <p className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
                Please fix {errorCount} {errorCount === 1 ? "field" : "fields"} below before sending.
              </p>
            )}
            {status === "error" && (
              <p className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
                Sorry, we could not send your message. Please try again or email us directly.
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="field-label">
                Full name <span aria-hidden="true">*</span>
              </label>
              <input {...fieldProps("name")} type="text" autoComplete="name" required className="field-input" />
              {errorText("name")}
            </div>
            <div>
              <label htmlFor="contact-email" className="field-label">
                Work email <span aria-hidden="true">*</span>
              </label>
              <input {...fieldProps("email")} type="email" autoComplete="email" required className="field-input" />
              {errorText("email")}
            </div>
            <div>
              <label htmlFor="contact-firm" className="field-label">
                Firm name
              </label>
              <input {...fieldProps("firm")} type="text" autoComplete="organization" className="field-input" />
            </div>
            <div>
              <label htmlFor="contact-phone" className="field-label">
                Phone
              </label>
              <input {...fieldProps("phone")} type="tel" autoComplete="tel" className="field-input" />
              {errorText("phone")}
            </div>
          </div>

          <div>
            <label htmlFor="contact-topic" className="field-label">
              How can we help?
            </label>
            <select {...fieldProps("topic")} ref={topicRef} defaultValue="general" className="field-input">
              {topics.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contact-message" className="field-label">
              Message <span aria-hidden="true">*</span>
            </label>
            <textarea {...fieldProps("message")} rows={5} required className="field-input resize-y" />
            {errorText("message")}
          </div>

          <div className="hidden" aria-hidden="true">
            <label htmlFor="contact-website">Leave this field empty</label>
            <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div>
            <div className="flex items-start gap-3">
              <input
                {...fieldProps("consent")}
                type="checkbox"
                className="mt-1 size-5 shrink-0 rounded border-slate-400 accent-brand-600"
              />
              <label htmlFor="contact-consent" className="text-sm text-slate-700">
                I agree that Case LMS may store these details and contact me about my enquiry.
              </label>
            </div>
            {errorText("consent")}
          </div>

          <p className="text-xs text-slate-600">
            Fields marked <span aria-hidden="true">*</span>
            <span className="sr-only">with an asterisk</span> are required.
          </p>

          <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === "sending"}>
            {status === "sending" ? (
              <>
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Sending…
              </>
            ) : (
              <>
                Send message <Send className="size-4" aria-hidden="true" />
              </>
            )}
          </button>
        </m.form>
      )}
    </AnimatePresence>
  );
}
