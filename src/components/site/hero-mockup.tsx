"use client";

import * as m from "motion/react-m";
import { CheckCircle2, Clock, FileText, ShieldCheck } from "lucide-react";

const bars = [42, 68, 55, 80, 62, 92, 74];
const tasks = [
  { label: "Client ID verified", done: true },
  { label: "Draft contract from precedent", done: true },
  { label: "Send for e-signature", done: false },
];

/** Illustrative product preview built in HTML so it costs no image bytes. Decorative only. */
export function HeroMockup() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-xl select-none">
      <div className="absolute -inset-6 rounded-[2rem] bg-brand-500/20 blur-3xl" />
      <m.div
        initial={{ y: 16, rotate: -1 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl border border-white/10 bg-white p-4 shadow-2xl shadow-ink-950/40 sm:p-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs text-slate-500">Matter</p>
            <p className="font-semibold text-ink-900">Residential purchase, 14 Elm Row</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">On track</span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">Billable time, last 7 days</p>
            <div className="mt-3 flex h-24 items-end gap-2">
              {bars.map((h, i) => (
                <m.span
                  key={i}
                  className="flex-1 rounded-t-md bg-brand-600 even:bg-brand-300"
                  initial={{ height: "8%" }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.07, ease: "easeOut" }}
                />
              ))}
            </div>
          </div>
          <ul className="space-y-2">
            {tasks.map((t, i) => (
              <m.li
                key={t.label}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                className="flex items-center gap-2 rounded-xl border border-slate-100 p-2.5 text-xs text-slate-700"
              >
                {t.done ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                ) : (
                  <Clock className="size-4 shrink-0 text-brass-500" />
                )}
                {t.label}
              </m.li>
            ))}
          </ul>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {[
            { k: "WIP", v: "£18.4k" },
            { k: "Lock-up", v: "41 days" },
            { k: "Tasks due", v: "6" },
          ].map((s) => (
            <div key={s.k} className="rounded-xl border border-slate-100 p-3">
              <p className="text-[11px] text-slate-500">{s.k}</p>
              <p className="text-sm font-semibold text-ink-900">{s.v}</p>
            </div>
          ))}
        </div>
      </m.div>

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute -bottom-6 -left-2 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-xl sm:-left-10"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <ShieldCheck className="size-5" />
        </span>
        <span className="text-xs">
          <span className="block font-semibold text-ink-900">AML check passed</span>
          <span className="text-slate-500">2 minutes ago</span>
        </span>
      </m.div>
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute -top-5 -right-2 hidden items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-xl sm:flex"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-brass-300/40 text-brass-700">
          <FileText className="size-5" />
        </span>
        <span className="text-xs">
          <span className="block font-semibold text-ink-900">Contract signed</span>
          <span className="text-slate-500">via client portal</span>
        </span>
      </m.div>
    </div>
  );
}
