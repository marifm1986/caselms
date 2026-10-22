import { Check } from "lucide-react";
import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand, PageHero } from "@/components/site/sections";
import { FeatureIcon } from "@/components/ui/icons";
import { getFeatures, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore Case LMS features: matter management, workflow automation, documents, time and billing, trust accounting, compliance, client portal and reporting.",
  alternates: { canonical: "/features" },
  openGraph: { url: "/features" },
};

export default async function FeaturesPage() {
  const [features, settings] = await Promise.all([getFeatures(), getSettings()]);

  return (
    <>
      <PageHero
        eyebrow="Features"
        title="One platform for every part of legal practice"
        intro="Case LMS brings case management, finance, documents and compliance together, so your firm works from a single source of truth."
      />

      <section aria-label="All features" className="section">
        <div className="container-page space-y-8">
          {features.map((f, i) => (
            <Reveal key={f.id}>
              <article
                id={f.id}
                className="grid scroll-mt-28 gap-8 rounded-3xl border border-slate-200 p-8 sm:p-10 lg:grid-cols-[1fr_1fr] lg:gap-16"
              >
                <div className={i % 2 ? "lg:order-2" : undefined}>
                  <p className="eyebrow">{f.category}</p>
                  <h2 className="font-display mt-3 flex items-center gap-3 text-2xl font-semibold sm:text-3xl">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                      <FeatureIcon name={f.icon} className="size-6" />
                    </span>
                    {f.title}
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-slate-600">{f.description}</p>
                </div>
                <ul className="grid content-center gap-3">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-ink-900">
                      <Check className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand settings={settings} />
    </>
  );
}
