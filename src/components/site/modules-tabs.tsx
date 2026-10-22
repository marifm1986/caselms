"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Check } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { FeatureIcon } from "@/components/ui/icons";
import type { Feature } from "@/lib/types";

/** WAI-ARIA tabs pattern with arrow, Home and End key support. */
export function ModulesTabs({ features }: { features: Feature[] }) {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const current = features[active];

  if (!current) return null;

  const focusTab = (index: number) => {
    const next = (index + features.length) % features.length;
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => focusTab(active + 1),
      ArrowRight: () => focusTab(active + 1),
      ArrowUp: () => focusTab(active - 1),
      ArrowLeft: () => focusTab(active - 1),
      Home: () => focusTab(0),
      End: () => focusTab(features.length - 1),
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-12">
      <div
        role="tablist"
        aria-label="Platform modules"
        aria-orientation="vertical"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
      >
        {features.map((f, i) => (
          <button
            key={f.id}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            id={`${baseId}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKeyDown}
            className="relative flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:text-ink-900 aria-selected:text-ink-900"
          >
            {i === active && (
              <m.span
                layoutId={`${baseId}-pill`}
                className="absolute inset-0 rounded-2xl bg-white shadow-md ring-1 ring-slate-200"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <FeatureIcon name={f.icon} className="relative size-5 shrink-0 text-brand-600" />
            <span className="relative whitespace-nowrap">{f.title}</span>
          </button>
        ))}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        tabIndex={0}
        className="relative min-h-80 overflow-hidden rounded-3xl bg-ink-900 p-8 text-slate-300 sm:p-10"
      >
        <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-brass-300 uppercase">{current.category}</p>
            <h3 className="font-display mt-3 text-3xl font-semibold text-white">{current.title}</h3>
            <p className="mt-4 max-w-2xl text-base leading-7">{current.description}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {current.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 rounded-xl bg-white/5 p-3 text-sm text-white">
                  <Check className="mt-0.5 size-4 shrink-0 text-brass-300" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
