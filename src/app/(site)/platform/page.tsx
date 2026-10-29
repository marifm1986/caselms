import {
  Blocks,
  Briefcase,
  Check,
  Cloud,
  Cpu,
  Database,
  FileCheck2,
  Receipt,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
  UsersRound,
  Workflow,
} from "lucide-react";
import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand, PageHero, SectionHeading } from "@/components/site/sections";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "A detailed look at the Case LMS platform across matter management, trust accounting, documents, workflows, compliance, security and integrations.",
  alternates: { canonical: "/platform" },
  openGraph: { url: "/platform" },
};

type Capability = {
  id: string;
  icon: typeof Briefcase;
  category: string;
  title: string;
  intro: string;
  items: string[];
};

const capabilities: Capability[] = [
  {
    id: "matters",
    icon: Briefcase,
    category: "01",
    title: "Matter management",
    intro: "Open, run and close matters with every detail where fee earners expect to find it.",
    items: [
      "Matter templates for every practice area, with pre-set fee earners, tasks and documents",
      "Conflict checks and client identity verification at intake",
      "Key date and limitation reminders surfaced on dashboards",
      "Full matter timeline across correspondence, documents, time and tasks",
      "Linked matters for groups, portfolios and recurring clients",
    ],
  },
  {
    id: "billing",
    icon: Receipt,
    category: "02",
    title: "Accounts and billing",
    intro: "Time recording, invoicing and trust accounting that stand up to SRA scrutiny.",
    items: [
      "Phone-first time capture with offline entry and bulk approval",
      "Fixed-fee, hourly, retainer and blended billing on a single invoice",
      "SRA-compliant trust account with three-way reconciliation",
      "Agreed-fee tracking, write-off audit trail and VAT handling",
      "Xero, Sage and QuickBooks sync with ledger-level mapping",
    ],
  },
  {
    id: "documents",
    icon: Database,
    category: "03",
    title: "Documents and data",
    intro: "A single secure store for everything that touches a matter.",
    items: [
      "Document generation from matter data, with versioning and templates",
      "Full-text search across the matter file, including PDF OCR",
      "E-signature with placement, routing and signed-PDF archive",
      "Microsoft 365 and Google Workspace integration for live editing",
      "Granular retention policies with automatic archive",
    ],
  },
  {
    id: "compliance",
    icon: ShieldCheck,
    category: "04",
    title: "Compliance and risk",
    intro: "Compliance baked into the matter, not a separate spreadsheet.",
    items: [
      "AML risk assessments on intake, with periodic review workflows",
      "File reviews, task sampling and supervision dashboards",
      "Immutable audit trail against every action, visible to the COLP",
      "GDPR subject-access workflows with export and redaction",
      "ISO 27001 aligned controls with evidence packs for insurers",
    ],
  },
  {
    id: "workflows",
    icon: Workflow,
    category: "05",
    title: "Workflows and automation",
    intro: "A no-code builder for the step-by-step work that repeats on every file.",
    items: [
      "Drag-and-drop workflow builder with branching logic",
      "Automated document generation, email, SMS and task creation",
      "Trigger-based reminders for deadlines, missing data and risks",
      "Workflow analytics: average time per step, bottlenecks, drop-offs",
      "Share and import workflow packs across practice areas",
    ],
  },
  {
    id: "configuration",
    icon: SlidersHorizontal,
    category: "06",
    title: "Configuration",
    intro: "Case LMS adapts to your firm, not the other way around.",
    items: [
      "Customisable dashboards per role, department and matter type",
      "Configurable intake forms, matter fields and task templates",
      "Role-based permissions down to the field and action level",
      "Custom reports with saved views and scheduled email delivery",
      "White-label domain, branding and email templates",
    ],
  },
  {
    id: "experience",
    icon: UsersRound,
    category: "07",
    title: "Client experience",
    intro: "A professional, mobile-first portal that clients actually use.",
    items: [
      "Secure client portal with matter timeline, documents and invoices",
      "Two-tap uploads for ID, proof of funds and signed documents",
      "Open Banking payments and card payments on invoices",
      "In-portal messaging that writes back to the matter file",
      "Branded notifications across email, SMS and push",
    ],
  },
  {
    id: "technology",
    icon: Cpu,
    category: "08",
    title: "Technology",
    intro: "A cloud-native platform you can trust with your busiest Monday.",
    items: [
      "Multi-tenant cloud with UK data residency by default",
      "99.95% availability SLA, measured on real user requests",
      "REST and webhook APIs with versioning and rate limits",
      "Daily encrypted backups with point-in-time restore",
      "Full-fidelity sandbox for training, testing and migration",
    ],
  },
  {
    id: "users",
    icon: UserCog,
    category: "09",
    title: "User management",
    intro: "Scale from a single office to a multi-site firm without rework.",
    items: [
      "Single sign-on via Microsoft Entra, Google and Okta",
      "Role, department and office-level permissions",
      "Fine-grained matter-level access with time-boxed sharing",
      "Full joiner, mover and leaver automation",
      "Session logging and anomaly alerts for the COLP",
    ],
  },
];

const specs = [
  { icon: Cloud, label: "Hosting", value: "UK (London), AWS eu-west-2" },
  { icon: ShieldCheck, label: "Encryption", value: "AES-256 at rest, TLS 1.3 in transit" },
  { icon: FileCheck2, label: "Standards", value: "ISO 27001 aligned, Cyber Essentials Plus" },
  { icon: Blocks, label: "APIs", value: "REST, webhooks, exports in CSV and JSON" },
];

const integrations = [
  { name: "Microsoft 365", group: "Documents" },
  { name: "Google Workspace", group: "Documents" },
  { name: "DocuSign", group: "e-signature" },
  { name: "Xero", group: "Accounts" },
  { name: "Sage", group: "Accounts" },
  { name: "QuickBooks", group: "Accounts" },
  { name: "HM Land Registry", group: "Conveyancing" },
  { name: "SmartSearch", group: "AML" },
  { name: "Open Banking", group: "Payments" },
  { name: "Stripe", group: "Payments" },
  { name: "Microsoft Entra", group: "Identity" },
  { name: "Okta", group: "Identity" },
];

export default async function PlatformPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="The platform"
        title="Features and technical specifications in detail"
        intro="A plain-English reference to what Case LMS does, how it is built and what it connects to. Written for the people who have to sign the contract and the people who have to make it work."
      />

      {/* Sticky anchor navigator */}
      <nav
        aria-label="Platform sections on this page"
        className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 shadow-[0_1px_0_0_rgba(10,18,38,0.04),0_12px_24px_-18px_rgba(10,18,38,0.25)] backdrop-blur-md"
      >
        <div className="container-page flex items-stretch gap-6 py-4">
          <div className="hidden shrink-0 flex-col justify-center border-r border-slate-200 pr-6 lg:flex">
            <span className="text-[10px] font-semibold tracking-[0.22em] text-brass-700 uppercase">
              On this page
            </span>
            <span className="brass-divider mt-1.5" aria-hidden="true" />
            <span className="mt-1 text-xs text-slate-500">{capabilities.length} sections</span>
          </div>
          <div className="-mx-4 min-w-0 flex-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <ol className="grid min-w-max auto-cols-max grid-flow-col items-stretch gap-2 lg:min-w-0 lg:auto-cols-fr lg:grid-flow-row lg:grid-cols-5 xl:grid-cols-9">
              {capabilities.map((c) => (
                <li key={c.id} className="flex">
                  <a
                    href={`#${c.id}`}
                    className="group flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition-all hover:border-ink-900 hover:bg-ink-900 focus-visible:border-ink-900 focus-visible:bg-ink-900"
                    title={c.title}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-ink-900 text-[10px] font-semibold tracking-wider text-brass-300 transition-colors group-hover:bg-brass-500 group-hover:text-ink-900 group-focus-visible:bg-brass-500 group-focus-visible:text-ink-900">
                      {c.category}
                    </span>
                    <span className="flex min-w-0 flex-col leading-tight">
                      <span className="truncate text-[11px] font-semibold text-ink-900 transition-colors group-hover:text-white group-focus-visible:text-white">
                        {c.title}
                      </span>
                    
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </nav>

      {/* Capability stack */}
      <section aria-label="Platform modules" className="section">
        <div className="container-page space-y-10">
          {capabilities.map((c, i) => (
            <Reveal key={c.id}>
              <article
                id={c.id}
                className="scroll-mt-32 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"
              >
                <div className="grid gap-8 p-8 lg:grid-cols-[20rem_1fr] lg:p-10">
                  <header className="relative flex flex-col">
                    <span
                      className="font-display text-sm tracking-[0.3em] text-brass-500 uppercase"
                      aria-hidden="true"
                    >
                      {c.category}
                    </span>
                    <span className="brass-divider mt-3" aria-hidden="true" />
                    <h2 className="font-display mt-4 text-2xl font-semibold text-ink-900 sm:text-3xl">
                      {c.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{c.intro}</p>
                    <span className="mt-6 flex size-14 items-center justify-center rounded-xl bg-ink-900 text-brass-300 ring-1 ring-ink-900/10">
                      <c.icon className="size-7" aria-hidden="true" />
                    </span>
                  </header>

                  <ul
                    className="grid gap-3 sm:grid-cols-2"
                    aria-label={`${c.title} features`}
                  >
                    {c.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-ink-900"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-brand-700"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {i < capabilities.length - 1 && (
                  <span
                    className="block h-px bg-linear-to-r from-transparent via-brass-400/40 to-transparent"
                    aria-hidden="true"
                  />
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Technical specs strip */}
      <section aria-labelledby="specs-title" className="section bg-ink-900 text-slate-300">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow !text-brass-300">Technical specifications</p>
            <span className="brass-divider brass-divider-center mt-3" aria-hidden="true" />
            <h2
              id="specs-title"
              className="font-display mt-4 text-3xl font-semibold text-white sm:text-4xl"
            >
              Built on infrastructure your IT team can sign off
            </h2>
          </div>
          <dl className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {specs.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand-700 text-brass-200">
                    <s.icon className="size-5" aria-hidden="true" />
                  </span>
                  <dt className="mt-4 text-xs font-semibold tracking-[0.18em] text-brass-300 uppercase">
                    {s.label}
                  </dt>
                  <dd className="mt-2 text-base leading-6 text-white">{s.value}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Integrations */}
      <section aria-labelledby="integrations-title" className="section bg-slate-50">
        <div className="container-page">
          <SectionHeading
            id="integrations-title"
            eyebrow="Integrations"
            title="It fits with the tools your firm already uses"
            intro="Case LMS speaks to the systems around it so your data stays in one place and your team stays in flow."
          />
          <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((int, i) => (
              <Reveal as="li" key={int.name} delay={(i % 6) * 0.05}>
                <div className="flex h-full items-center justify-between gap-4 rounded-xl bg-white p-5 ring-1 ring-slate-200 transition-colors hover:ring-brass-400">
                  <span className="font-display text-base font-semibold text-ink-900">
                    {int.name}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-slate-700 uppercase">
                    {int.group}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-slate-600">
            Need a tool that is not on this list? Our open REST API and webhooks make most integrations a short job.
          </p>
        </div>
      </section>

      <CtaBand settings={settings} />
    </>
  );
}
