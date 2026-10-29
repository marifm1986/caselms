import { Check, Clock, Compass, Gavel, LifeBuoy, Minus, Rocket, Scale, ShieldCheck, Sparkles, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand, PageHero, SectionHeading, Testimonials } from "@/components/site/sections";
import { StatCounter } from "@/components/site/stat-counter";
import { getSettings, getStats, getTestimonials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Why Case LMS",
  description:
    "Why UK law firms choose Case LMS over legacy practice management systems and generic business tools. Lawyer-led, compliance-ready and genuinely cloud native.",
  alternates: { canonical: "/why" },
  openGraph: { url: "/why" },
};

const pillars = [
  {
    icon: Gavel,
    title: "Lawyer-led, not vendor-led",
    text: "Our product team is led by qualified lawyers. Every workflow starts with a real matter, not a wireframe.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance baked in",
    text: "AML, conflict checks, file reviews and SRA accounts rules sit inside the matter, not in a separate spreadsheet.",
  },
  {
    icon: Sparkles,
    title: "Truly cloud native",
    text: "No remote desktops, no VPN. The same experience in the office, at home or in court, from any device.",
  },
  {
    icon: Scale,
    title: "Transparent pricing",
    text: "One price per user, every module included. No per-matter fees, no surprise invoices at renewal.",
  },
];

type Row = { label: string; caseLms: boolean | "partial"; legacy: boolean | "partial"; generic: boolean | "partial" };

const rows: Row[] = [
  { label: "Built specifically for UK law firms", caseLms: true, legacy: true, generic: false },
  { label: "Trust accounting and SRA reconciliations", caseLms: true, legacy: true, generic: false },
  { label: "Modern cloud, works on any device", caseLms: true, legacy: "partial", generic: true },
  { label: "Document generation from matter data", caseLms: true, legacy: "partial", generic: false },
  { label: "Client portal with e-signature", caseLms: true, legacy: "partial", generic: "partial" },
  { label: "Live WIP, lock-up and realisation dashboards", caseLms: true, legacy: "partial", generic: false },
  { label: "Flat per-user pricing, every module included", caseLms: true, legacy: false, generic: "partial" },
  { label: "Guided migration included", caseLms: true, legacy: false, generic: false },
  { label: "UK-based support", caseLms: true, legacy: "partial", generic: false },
];

const Cell = ({ v }: { v: Row["caseLms"] }) => {
  if (v === true) return <Check className="mx-auto size-5 text-emerald-600" aria-label="Yes" />;
  if (v === "partial") return <Minus className="mx-auto size-5 text-amber-500" aria-label="Partial" />;
  return <X className="mx-auto size-5 text-slate-300" aria-label="No" />;
};

const steps = [
  { icon: Compass, title: "Scoping", text: "A half-day workshop maps your practice areas, workflows and reporting needs." },
  { icon: Clock, title: "Migration", text: "We move your contacts, matters, documents and ledgers across, then reconcile every figure with you." },
  { icon: Rocket, title: "Go live", text: "Your team is trained on real matters, with named support from day one." },
  { icon: LifeBuoy, title: "Partnership", text: "A dedicated success manager, quarterly reviews and a roadmap you can influence." },
];

export default async function WhyPage() {
  const [settings, stats, testimonials] = await Promise.all([getSettings(), getStats(), getTestimonials()]);

  return (
    <>
      <PageHero
        eyebrow="Why Case LMS"
        title="Everything a modern law firm needs, nothing it doesn't"
        intro="Legacy practice systems and generic business tools both leave fee earners carrying the admin. Case LMS was built to join matters, finance and compliance into one place, so your team can focus on legal work."
      />

      {/* Pillars */}
      <section aria-labelledby="pillars-title" className="section">
        <div className="container-page">
          <SectionHeading
            id="pillars-title"
            eyebrow="Our difference"
            title="Four principles behind every release"
          />
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.08}>
                <article className="card-chambers group h-full p-6">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-ink-900 text-brass-300 ring-1 ring-ink-900/10 transition-colors group-hover:bg-brand-700">
                    <p.icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-display mt-5 text-lg font-semibold text-ink-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{p.text}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Comparison */}
      <section aria-labelledby="compare-title" className="section bg-slate-50">
        <div className="container-page">
          <SectionHeading
            id="compare-title"
            eyebrow="How we compare"
            title="Case LMS vs legacy systems vs generic tools"
            intro="A quick, honest look at what you get out of the box with each kind of system."
          />
          <div className="mt-14 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">Feature comparison of Case LMS, legacy practice management systems and generic business tools.</caption>
                <thead>
                  <tr className="bg-ink-900 text-white">
                    <th scope="col" className="px-6 py-4 text-left font-semibold">
                      Capability
                    </th>
                    <th scope="col" className="px-6 py-4 text-center font-semibold text-brass-300">
                      Case LMS
                    </th>
                    <th scope="col" className="px-6 py-4 text-center font-semibold">
                      Legacy systems
                    </th>
                    <th scope="col" className="px-6 py-4 text-center font-semibold">
                      Generic tools
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((r) => (
                    <tr key={r.label} className="hover:bg-slate-50">
                      <th scope="row" className="px-6 py-4 text-left font-medium text-ink-900">
                        {r.label}
                      </th>
                      <td className="bg-brand-50/40 px-6 py-4 text-center">
                        <Cell v={r.caseLms} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Cell v={r.legacy} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Cell v={r.generic} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-slate-100 px-6 py-3 text-xs text-slate-500">
              <Check className="mr-1 inline size-3.5 text-emerald-600" aria-hidden="true" />
              Included.
              <Minus className="mx-2 inline size-3.5 text-amber-500" aria-hidden="true" />
              Available with add-ons or configuration.
              <X className="mx-2 inline size-3.5 text-slate-400" aria-hidden="true" />
              Not available.
            </p>
          </div>
        </div>
      </section>

      {/* Numbers */}
      {stats.length > 0 && (
        <section aria-label="Case LMS in numbers" className="border-y border-slate-200 bg-white">
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

      {/* Switching journey */}
      <section aria-labelledby="switch-title" className="section bg-ink-900 text-slate-300">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow !text-brass-300">The switch</p>
            <span className="brass-divider brass-divider-center mt-3" aria-hidden="true" />
            <h2 id="switch-title" className="font-display mt-4 text-3xl font-semibold text-white sm:text-4xl">
              A move that pays back inside the first quarter
            </h2>
            <p className="mt-4 text-lg leading-8">
              Most firms are live within six to eight weeks, and bill more within three months of go-live. Here is how we make sure of it.
            </p>
          </div>
          <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 0.1}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-8">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-brand-700 text-brass-200">
                      <step.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-3xl text-white/20" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-white">
                    <span className="sr-only">Step {i + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Objection handling */}
      <section aria-labelledby="honest-title" className="section">
        <div className="container-page">
          <SectionHeading
            id="honest-title"
            eyebrow="Honest answers"
            title="Where we're a great fit, and where we're not"
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <article className="rounded-2xl bg-emerald-50 p-8 ring-1 ring-emerald-100">
                <h3 className="font-display text-xl font-semibold text-emerald-900">A great fit if…</h3>
                <ul className="mt-5 space-y-3 text-emerald-950">
                  {[
                    "You are a UK law firm from 2 to 250 fee earners",
                    "You handle client money and need SRA-compliant accounts",
                    "You want one system instead of five that nearly talk to each other",
                    "You care about the time your team loses to admin",
                    "You want a partner who will migrate you properly, not drop a login",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="mt-1 size-4 shrink-0 text-emerald-700" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
            <Reveal delay={0.1}>
              <article className="rounded-2xl bg-slate-100 p-8 ring-1 ring-slate-200">
                <h3 className="font-display text-xl font-semibold text-ink-900">Probably not the right fit if…</h3>
                <ul className="mt-5 space-y-3 text-slate-700">
                  {[
                    "You are a sole practitioner looking for a free tool",
                    "Your firm operates outside the UK and does not need SRA accounts",
                    "You prefer heavily bespoke, developer-managed software",
                    "You want the cheapest option on the market above all else",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Minus className="mt-1 size-4 shrink-0 text-slate-500" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-slate-600">
                  We will tell you honestly if we are not the right fit, and point you toward someone who is.{" "}
                  <Link href="/contact" className="font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800">
                    Have a quick chat
                  </Link>
                  .
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <Testimonials items={testimonials} />

      <CtaBand settings={settings} />
    </>
  );
}
