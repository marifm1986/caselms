"use client";

import { useEffect, useRef } from "react";

const format = (n: number, decimals: number, prefix: string, suffix: string) =>
  `${prefix}${n.toFixed(decimals)}${suffix}`;

/**
 * Counts up to `value` when scrolled into view. The final value is server
 * rendered so crawlers and no-JS users always see the real number, and the
 * animation only runs for counters that start below the fold.
 */
export function StatCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const decimals = Number.isInteger(value) ? 0 : (String(value).split(".")[1]?.length ?? 1);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.textContent = format(0, decimals, prefix, suffix);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / 1400);
          el.textContent = format(value * (1 - Math.pow(1 - progress, 3)), decimals, prefix, suffix);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = format(value, decimals, prefix, suffix);
    };
  }, [value, decimals, prefix, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(value, decimals, prefix, suffix)}
    </span>
  );
}
