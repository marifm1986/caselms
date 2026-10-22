import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 flex-col items-center justify-center bg-ink-900 px-4 py-32 text-center">
      <p className="text-sm font-semibold tracking-[0.18em] text-brass-300 uppercase">Error 404</p>
      <h1 className="font-display mt-4 text-4xl font-semibold text-white sm:text-5xl">We couldn&rsquo;t find that page</h1>
      <p className="mt-4 max-w-md text-slate-300">The page may have moved, or the link may be out of date.</p>
      <Link href="/" className="btn-light mt-10">
        Back to home
      </Link>
    </main>
  );
}
