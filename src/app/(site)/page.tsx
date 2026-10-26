import { ArrowRight, CheckCircle2, CloudUpload, Lock, Rocket, Scale, Search, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { HeroMockup } from "@/components/site/hero-mockup";
import { JsonLd } from "@/components/site/json-ld";
import { ModulesTabs } from "@/components/site/modules-tabs";
import { CtaBand, FaqList, FeatureGrid, PracticeMarquee, SectionHeading, Testimonials } from "@/components/site/sections";
import { StatCounter } from "@/components/site/stat-counter";
import { getFaqs, getFeatures, getPlans, getSettings, getStats, getTestimonials } from "@/lib/content";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const steps = [
  {
    icon: Search,
    title: "Discover",
    text: "We map your practice areas, workflows and reporting needs in a short discovery session.",
  },
  {
    icon: CloudUpload,
    title: "Migrate",
    text: "Our team moves your contacts, matters, documents and balances across, then checks every figure with you.",
  },
  {
    icon: Rocket,
    title: "Go live",
    text: "Your team is trained on real matters, and our support desk is on hand from day one.",
  },
];

export default async function HomePage() {
  const [settings, features, stats, testimonials, faqs, plans] = await Promise.all([
    getSettings(),
    getFeatures(),
    getStats(),
    getTestimonials(),
    getFaqs(),
    getPlans(),
  ]);

  return (
    <>
      {/* Hero: text renders without entrance animation so it paints as the LCP element immediately. */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden bg-ink-900 text-slate-300">
        <div className="bg-grid absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="bg-colonnade absolute inset-0" aria-hidden="true" />
        <div className="absolute -top-48 -left-32 size-[36rem] rounded-full bg-brand-600/25 blur-3xl" aria-hidden="true" />
        <div className="seal-ring absolute -right-24 top-20 size-[28rem] rounded-full" aria-hidden="true" />
        <div className="container-page relative grid items-center gap-16 py-20 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brass-300/30 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-brass-200 uppercase">
              <Scale className="size-3.5 text-brass-300" aria-hidden="true" />
              Built by lawyers, for law firms
            </p>
            <h1
              id="hero-title"
              className="font-display mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.75rem]"
            >
              Run your whole firm from one <span className="italic text-brass-300">secure</span> workspace
            </h1>
            <span className="brass-divider mt-6" aria-hidden="true" />
            <p className="mt-6 max-w-xl text-lg leading-8">{settings.description}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact?topic=demo" className="btn-light">
                Book a demo <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href="/features" className="btn-ghost-dark">
                Explore features
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {["Cloud native", "Audit-ready compliance", "Migration included"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-brass-300" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <dl className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-xs tracking-wide text-slate-400 uppercase">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-brass-400" aria-hidden="true" />
                <dt className="sr-only">Standard</dt>
                <dd>ISO 27001 aligned</dd>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-brass-400" aria-hidden="true" />
                <dt className="sr-only">Hosting</dt>
                <dd>UK data residency</dd>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="size-4 text-brass-400" aria-hidden="true" />
                <dt className="sr-only">Fit</dt>
                <dd>SRA accounts rules ready</dd>
              </div>
            </dl>
          </div>
          <HeroMockup />
        </div>
      </section>

      <PracticeMarquee />

      {features.length > 0 && (
        <section aria-labelledby="modules-title" className="section">
          <div className="container-page">
            <SectionHeading
              id="modules-title"
              eyebrow="The platform"
              title="Everything your firm needs, working together"
              intro="Case LMS replaces disconnected tools with one system for matters, documents, finance and compliance. Pick a module to see what it does."
            />
            <div className="mt-14">
              <ModulesTabs features={features.slice(0, 6)} />
            </div>
          </div>
        </section>
      )}

      {stats.length > 0 && (
        <section aria-label="Case LMS in numbers" className="border-y border-slate-200 bg-slate-50">
          <dl className="container-page grid grid-cols-2 gap-8 py-14 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.id} className="flex flex-col gap-1 text-center">
                <dt className="text-sm text-slate-600">{s.label}</dt>
                <dd className="font-display order-first text-4xl font-semibold text-ink-900 sm:text-5xl">
                  <StatCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {features.length > 0 && (
        <section aria-labelledby="features-title" className="section">
          <div className="container-page">
            <SectionHeading
              id="features-title"
              eyebrow="Features"
              title="Designed around the way fee earners work"
              intro="From first enquiry to final bill, every step is faster, clearer and fully auditable."
            />
            <div className="mt-14">
              <FeatureGrid features={features} />
            </div>
            <p className="mt-12 text-center">
              <Link href="/features" className="btn-secondary">
                See all features <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </p>
          </div>
        </section>
      )}

      <section aria-labelledby="steps-title" className="section bg-ink-900 text-slate-300">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.18em] text-brass-300 uppercase">Switching made simple</p>
            <h2 id="steps-title" className="font-display mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Live in weeks, not months
            </h2>
          </div>
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 0.12}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-8">
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
                      <step.icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="font-display text-4xl text-white/20" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">
                    <span className="sr-only">Step {i + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-7">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {plans.length > 0 && (
        <section aria-labelledby="sizes-title" className="section">
          <div className="container-page">
            <SectionHeading
              id="sizes-title"
              eyebrow="For firms of every size"
              title="From sole practitioners to multi-office firms"
              intro="Start with what you need today and add modules and users as you grow."
            />
            <ul className="mt-14 grid gap-6 md:grid-cols-3">
              {plans.map((plan, i) => (
                <Reveal as="li" key={plan.id} delay={i * 0.1}>
                  <Link
                    href="/pricing"
                    className="group flex h-full flex-col rounded-3xl border border-slate-200 p-8 transition-colors hover:border-brand-600"
                  >
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="mt-2 flex-1 text-slate-600">{plan.audience}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                      View pricing
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Testimonials items={testimonials} />

      {faqs.length > 0 && (
        <section aria-labelledby="faq-title" className="section">
          <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.5fr]">
            <SectionHeading
              id="faq-title"
              align="left"
              eyebrow="FAQ"
              title="Questions firms ask us"
              intro="Can't find what you're looking for? Our team is happy to help."
            />
            <FaqList faqs={faqs} />
          </div>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            }}
          />
        </section>
      )}

      <CtaBand settings={settings} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: settings.siteName,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: siteUrl,
          description: settings.description,
          publisher: { "@id": `${siteUrl}/#organization` },
          ...(plans.some((p) => p.monthlyPrice > 0)
            ? {
                offers: plans
                  .filter((p) => p.monthlyPrice > 0)
                  .map((p) => ({ "@type": "Offer", name: p.name, price: p.annualPrice || p.monthlyPrice, priceCurrency: "GBP" })),
              }
            : {}),
        }}
      />
    </>
  );
}
