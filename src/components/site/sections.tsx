import { ArrowRight, ChevronDown, Mail, Phone, Quote, Star } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { CloudImage } from "@/components/ui/cloud-image";
import { FeatureIcon } from "@/components/ui/icons";
import type { Faq, Feature, SiteSettings, Testimonial } from "@/lib/types";
import { telHref } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  id,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  id?: string;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <span className={`brass-divider mt-3 ${align === "center" ? "brass-divider-center" : ""}`} aria-hidden="true" />
      <h2 id={id} className="font-display mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg leading-8 text-slate-600">{intro}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <section className="relative overflow-hidden bg-ink-900 text-slate-300">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -top-40 right-0 size-[32rem] rounded-full bg-brand-600/30 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-page relative py-20 sm:py-24">
        <p className="text-xs font-semibold tracking-[0.18em] text-brass-300 uppercase">{eyebrow}</p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8">{intro}</p>
      </div>
    </section>
  );
}

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f, i) => (
        <Reveal as="li" key={f.id} delay={(i % 4) * 0.08}>
          <article className="card-chambers group h-full p-6">
            <span className="flex size-12 items-center justify-center rounded-xl bg-ink-900 text-brass-300 ring-1 ring-ink-900/10 transition-colors group-hover:bg-brand-700 group-hover:text-brass-200">
              <FeatureIcon name={f.icon} className="size-6" />
            </span>
            <h3 className="font-display mt-5 text-lg font-semibold text-ink-900">{f.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{f.summary}</p>
            <span className="mt-5 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-brass-700 uppercase opacity-0 transition-opacity group-hover:opacity-100">
              Learn more <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}

const practiceAreas = [
  "Conveyancing",
  "Family law",
  "Private client",
  "Wills and probate",
  "Litigation",
  "Employment",
  "Immigration",
  "Commercial property",
  "Personal injury",
  "Corporate",
];

export function PracticeMarquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={hidden || undefined}>
      {practiceAreas.map((area) => (
        <li key={area} className="font-display text-xl whitespace-nowrap text-slate-500">
          {area}
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-labelledby="practice-areas" className="border-y border-slate-200 bg-slate-50 py-10">
      <div className="flex flex-col items-center gap-3">
        <span className="brass-divider" aria-hidden="true" />
        <h2 id="practice-areas" className="text-center text-xs font-semibold tracking-[0.22em] text-ink-800 uppercase">
          Trusted across every area of practice
        </h2>
      </div>
      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="testimonials-title" className="section bg-slate-50">
      <div className="container-page">
        <SectionHeading
          id="testimonials-title"
          eyebrow="Customer stories"
          title="Firms that switched, and never looked back"
        />
        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal as="li" key={t.id} delay={i * 0.1}>
              <figure className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-shadow duration-300 hover:shadow-lg hover:shadow-ink-900/5">
                <span
                  className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-brass-400 to-transparent"
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between">
                  <Quote className="size-8 text-brass-400" aria-hidden="true" />
                  <div className="flex items-center gap-0.5" aria-label="Rated 5 out of 5">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="size-3.5 fill-brass-400 text-brass-400" aria-hidden="true" />
                    ))}
                  </div>
                </div>
                <blockquote className="font-display mt-5 flex-1 text-lg leading-8 text-ink-900">
                  <p>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-6">
                  {t.avatar ? (
                    <CloudImage src={t.avatar} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
                  ) : (
                    <span
                      className="flex size-11 items-center justify-center rounded-full bg-ink-900 text-sm font-semibold text-white"
                      aria-hidden="true"
                    >
                      {t.name.slice(0, 1)}
                    </span>
                  )}
                  <span className="text-sm">
                    <span className="block font-semibold text-ink-900">{t.name}</span>
                    <span className="text-slate-600">
                      {t.role}, {t.firm}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
      {faqs.map((faq) => (
        <details key={faq.id} className="group px-6 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-base font-semibold text-ink-900">
            <h3>{faq.question}</h3>
            <ChevronDown
              className="size-5 shrink-0 text-brand-600 transition-transform duration-300 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="pb-6 text-base leading-7 text-slate-600">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({ settings }: { settings: SiteSettings }) {
  return (
    <section aria-labelledby="cta-title" className="section">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-ink-900 px-6 py-14 text-center ring-1 ring-brass-400/20 sm:px-16 sm:py-20">
            <div className="bg-grid absolute inset-0 opacity-80" aria-hidden="true" />
            <div className="bg-colonnade absolute inset-0" aria-hidden="true" />
            <div
              className="seal-ring absolute -bottom-32 left-1/2 size-96 -translate-x-1/2 rounded-full"
              aria-hidden="true"
            />
            <span
              className="absolute inset-x-16 top-0 h-px bg-linear-to-r from-transparent via-brass-400/60 to-transparent"
              aria-hidden="true"
            />
            <div className="relative">
              <span className="brass-divider brass-divider-center mb-4" aria-hidden="true" />
              <h2 id="cta-title" className="font-display mx-auto max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
                See Case LMS working on your own matters
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
                Book a 30 minute walkthrough tailored to your practice areas, or speak to our team today.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/contact?topic=demo" className="btn-light">
                  Book a demo <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <a href={telHref(settings.phone)} className="btn-ghost-dark">
                  <Phone className="size-4" aria-hidden="true" /> {settings.phone}
                </a>
              </div>
              <p className="mt-6 inline-flex items-center gap-2 text-sm text-slate-300">
                <Mail className="size-4" aria-hidden="true" />
                <a href={`mailto:${settings.salesEmail}`} className="underline underline-offset-4 hover:text-white">
                  {settings.salesEmail}
                </a>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
