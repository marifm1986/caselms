"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Plan } from "@/lib/types";

export function PricingCards({ plans }: { plans: Plan[] }) {
  const [annual, setAnnual] = useState(true);

  return (
    <div>
      <div className="flex items-center justify-center gap-3">
        <div role="group" aria-label="Billing period" className="inline-flex rounded-full bg-slate-100 p-1">
          {[
            { value: false, label: "Monthly" },
            { value: true, label: "Annual, save up to 20%" },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              aria-pressed={annual === opt.value}
              onClick={() => setAnnual(opt.value)}
              className="relative min-h-11 rounded-full px-5 text-sm font-semibold text-slate-700 aria-pressed:text-ink-900"
            >
              {annual === opt.value && (
                <m.span layoutId="billing-pill" className="absolute inset-0 rounded-full bg-white shadow" />
              )}
              <span className="relative">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = annual ? plan.annualPrice : plan.monthlyPrice;
          const featured = plan.highlighted;
          return (
            <li
              key={plan.id}
              className={`relative flex flex-col rounded-3xl p-8 ${
                featured ? "bg-ink-900 text-slate-300 shadow-2xl shadow-brand-900/30 lg:-my-4 lg:py-12" : "bg-white ring-1 ring-slate-200"
              }`}
            >
              {featured && (
                <p className="absolute -top-3 left-8 rounded-full bg-brass-400 px-3 py-1 text-xs font-semibold text-ink-900">
                  Most popular
                </p>
              )}
              <h3 className={`text-xl font-semibold ${featured ? "text-white" : ""}`}>{plan.name}</h3>
              <p className={`mt-2 text-sm ${featured ? "text-slate-300" : "text-slate-600"}`}>{plan.audience}</p>
              <p className="mt-6 flex items-baseline gap-2" aria-live="polite">
                {price > 0 ? (
                  <>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <m.span
                        key={price}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className={`font-display text-5xl font-semibold ${featured ? "text-white" : "text-ink-900"}`}
                      >
                        £{price}
                      </m.span>
                    </AnimatePresence>
                    <span className={`text-sm ${featured ? "text-slate-300" : "text-slate-600"}`}>{plan.priceNote}</span>
                  </>
                ) : (
                  <span className={`font-display text-4xl font-semibold ${featured ? "text-white" : "text-ink-900"}`}>
                    {plan.priceNote || "Custom"}
                  </span>
                )}
              </p>
              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className={`mt-0.5 size-4 shrink-0 ${featured ? "text-brass-300" : "text-brand-600"}`} aria-hidden="true" />
                    <span className={featured ? "text-white" : "text-slate-700"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/contact?topic=${encodeURIComponent(plan.name.toLowerCase())}`}
                className={`mt-8 w-full ${featured ? "btn-light" : "btn-primary"}`}
              >
                {plan.ctaLabel}
                <span className="sr-only">, {plan.name} plan</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
