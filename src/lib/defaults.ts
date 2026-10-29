// Fallback content. Used when Firebase is not configured or unreachable, and as
// the payload for "Seed default content" in the admin dashboard.
import type { Faq, Feature, Plan, Post, SiteSettings, Stat, TeamMember, Testimonial } from "./types";

export const defaultSettings: SiteSettings = {
  siteName: "Case LMS",
  tagline: "Legal practice management, built for how lawyers really work.",
  description:
    "Case LMS is a cloud legal practice management system that brings matters, documents, time, billing, trust accounting and compliance into one secure workspace.",
  email: "hello@example.com",
  salesEmail: "sales@example.com",
  phone: "+00 0000 000000",
  address: "Add your office address in the admin panel",
  hours: "Mon to Fri, 9:00 to 17:30",
  mapUrl: "",
  announcement: "",
  socials: { linkedin: "", x: "", facebook: "", youtube: "" },
};

type Seed<T> = Omit<T, "id">;

export const defaultFeatures: Seed<Feature>[] = [
  {
    title: "Matter management",
    summary: "Every matter, deadline and task in one live view.",
    description:
      "Open a matter in seconds from a template, then track key dates, parties, tasks and correspondence on a single timeline your whole team can see.",
    icon: "briefcase",
    category: "Case management",
    bullets: ["Matter templates by practice area", "Key date and limitation reminders", "Conflict checks on intake"],
    order: 1,
    published: true,
  },
  {
    title: "Workflow automation",
    summary: "Turn repeatable steps into guided workflows.",
    description:
      "Build step-by-step workflows that generate documents, assign tasks and send updates automatically, so fee earners spend time on legal work instead of admin.",
    icon: "workflow",
    category: "Case management",
    bullets: ["Drag-and-drop workflow builder", "Automatic task assignment", "Status updates to clients"],
    order: 2,
    published: true,
  },
  {
    title: "Documents and precedents",
    summary: "Draft from smart precedents, file in one place.",
    description:
      "Merge matter data into precedents, collaborate on drafts with version history and file emails straight to the right matter from your inbox.",
    icon: "file",
    category: "Documents",
    bullets: ["Smart precedent library", "Version history and check-in", "Email filing from Outlook and Gmail"],
    order: 3,
    published: true,
  },
  {
    title: "Time, billing and accounts",
    summary: "Capture every minute and bill with confidence.",
    description:
      "Record time from anywhere, raise compliant invoices and keep office and client accounts reconciled with full audit trails.",
    icon: "receipt",
    category: "Finance",
    bullets: ["One-click timers and time entry", "Fixed fee and hourly billing", "Client and office account ledgers"],
    order: 4,
    published: true,
  },
  {
    title: "Compliance and risk",
    summary: "Stay audit-ready without the spreadsheets.",
    description:
      "Built-in identity checks, risk assessments and regulatory reporting help your firm meet its obligations and evidence them on demand.",
    icon: "shield",
    category: "Compliance",
    bullets: ["Client ID and AML checks", "Matter risk assessments", "Audit-ready reports"],
    order: 5,
    published: true,
  },
  {
    title: "Client portal and e-signatures",
    summary: "Give clients a secure window into their matter.",
    description:
      "Share documents, request information and collect legally binding e-signatures through a branded, secure client portal.",
    icon: "users",
    category: "Client experience",
    bullets: ["Branded secure portal", "Built-in e-signatures", "Secure messaging"],
    order: 6,
    published: true,
  },
  {
    title: "Reporting and analytics",
    summary: "See how your firm is performing in real time.",
    description:
      "Dashboards for WIP, utilisation, lock-up and matter progress help partners make decisions on live data, not last month's spreadsheet.",
    icon: "chart",
    category: "Insight",
    bullets: ["Live firm dashboards", "Fee earner utilisation", "Custom report builder"],
    order: 7,
    published: true,
  },
  {
    title: "Integrations and API",
    summary: "Connect the tools your firm already uses.",
    description:
      "Connect email, calendars, accounting packages, search providers and more through ready-made integrations and an open API.",
    icon: "plug",
    category: "Platform",
    bullets: ["Microsoft 365 and Google Workspace", "Open REST API", "Webhooks for custom automations"],
    order: 8,
    published: true,
  },
];

export const defaultPlans: Seed<Plan>[] = [
  {
    name: "Starter",
    audience: "Sole practitioners and small firms, 1 to 20 users",
    monthlyPrice: 49,
    annualPrice: 39,
    priceNote: "per user / month",
    features: ["Matter and contact management", "Time recording and billing", "Document templates", "Email support"],
    highlighted: false,
    ctaLabel: "Start free trial",
    order: 1,
    published: true,
  },
  {
    name: "Practice",
    audience: "Growing firms, 21 to 80 users",
    monthlyPrice: 79,
    annualPrice: 65,
    priceNote: "per user / month",
    features: [
      "Everything in Starter",
      "Workflow automation",
      "Client and office accounts",
      "Client portal and e-signatures",
      "Priority support",
    ],
    highlighted: true,
    ctaLabel: "Book a demo",
    order: 2,
    published: true,
  },
  {
    name: "Enterprise",
    audience: "Larger and multi-office firms, 80+ users",
    monthlyPrice: 0,
    annualPrice: 0,
    priceNote: "Tailored pricing",
    features: [
      "Everything in Practice",
      "Advanced compliance reporting",
      "Open API and custom integrations",
      "Dedicated success manager",
      "Data migration service",
    ],
    highlighted: false,
    ctaLabel: "Talk to sales",
    order: 3,
    published: true,
  },
];

export const defaultTestimonials: Seed<Testimonial>[] = [
  {
    quote:
      "We moved three offices onto Case LMS in a weekend. Our fee earners finally have one place for every matter, and month-end takes hours instead of days.",
    name: "Sample Client",
    role: "Managing Partner",
    firm: "Example Law LLP",
    avatar: "",
    order: 1,
    published: true,
  },
  {
    quote:
      "The workflows are the big win. New conveyancing matters practically run themselves, and our clients love the portal updates.",
    name: "Sample Client",
    role: "Head of Residential Property",
    firm: "Example Solicitors",
    avatar: "",
    order: 2,
    published: true,
  },
  {
    quote:
      "Compliance used to live in spreadsheets. Now our risk assessments and ID checks are part of intake, and audits are painless.",
    name: "Sample Client",
    role: "Compliance Officer",
    firm: "Example & Co",
    avatar: "",
    order: 3,
    published: true,
  },
];

export const defaultFaqs: Seed<Faq>[] = [
  {
    question: "How long does it take to move to Case LMS?",
    answer:
      "Most small firms are live within two to four weeks. Larger firms usually take six to twelve weeks, including data migration, training and a parallel run.",
    order: 1,
    published: true,
  },
  {
    question: "Can you migrate data from our current system?",
    answer:
      "Yes. Our migration team moves contacts, matters, documents, time and ledger balances from most common practice management systems.",
    order: 2,
    published: true,
  },
  {
    question: "Where is our data stored and how is it protected?",
    answer:
      "Data is hosted in secure cloud data centres in your region, encrypted in transit and at rest, with role-based access, audit logs and regular independent testing.",
    order: 3,
    published: true,
  },
  {
    question: "Do you offer training and support?",
    answer:
      "Every plan includes onboarding, live training sessions and a searchable help centre. Practice and Enterprise plans add priority and dedicated support.",
    order: 4,
    published: true,
  },
  {
    question: "Is there a minimum contract term?",
    answer:
      "Monthly plans can be cancelled with 30 days' notice. Annual plans are billed yearly at a lower per-user price.",
    order: 5,
    published: true,
  },
];

export const defaultStats: Seed<Stat>[] = [
  { label: "Law firms onboarded", value: 350, prefix: "", suffix: "+", order: 1 },
  { label: "Matters managed", value: 1.2, prefix: "", suffix: "M", order: 2 },
  { label: "Average admin time saved", value: 32, prefix: "", suffix: "%", order: 3 },
  { label: "Platform uptime", value: 99.9, prefix: "", suffix: "%", order: 4 },
];

export const defaultTeam: Seed<TeamMember>[] = [
  { name: "Team Member", role: "Co-founder and CEO", bio: "Former practising solicitor focused on making legal technology simpler.", photo: "", order: 1, published: true },
  { name: "Team Member", role: "Co-founder and CTO", bio: "Leads the engineering team building the Case LMS platform.", photo: "", order: 2, published: true },
  { name: "Team Member", role: "Head of Customer Success", bio: "Helps firms move to Case LMS and get the most from it.", photo: "", order: 3, published: true },
];

export const defaultPosts: Seed<Post>[] = [
  {
    title: "Five signs your firm has outgrown its practice management system",
    slug: "signs-your-firm-has-outgrown-its-practice-management-system",
    excerpt:
      "Double keying, month-end panic and spreadsheets for compliance are all symptoms of a system that no longer fits. Here is what to look for.",
    content:
      "Every firm reaches a point where the tools that got it started begin to slow it down. Here are five signs it is time to look again.\n\n## 1. Your team keys the same data twice\n\nIf client details are typed into intake forms, then into accounts, then into documents, every repeat is a chance for error.\n\n## 2. Month-end is a project\n\nReconciliation should be routine. If closing the month takes days, your accounts and matters are not talking to each other.\n\n## 3. Compliance lives in spreadsheets\n\nRisk assessments, ID checks and file reviews belong inside the matter, where they are captured as work happens.\n\n## 4. Partners wait for reports\n\nLive dashboards for WIP, lock-up and utilisation turn reporting from a monthly chore into a daily habit.\n\n## 5. Remote work feels like a workaround\n\nA true cloud system works the same in the office, at home or in court, without VPNs or remote desktops.",
    coverImage: "",
    author: "Case LMS Team",
    tags: ["Practice management", "Strategy"],
    publishedAt: "2026-10-01",
    published: true,
  },
  {
    title: "A practical guide to automating conveyancing workflows",
    slug: "practical-guide-to-automating-conveyancing-workflows",
    excerpt:
      "Conveyancing is full of repeatable steps. Here is how to map them into workflows that save hours on every file.",
    content:
      "Conveyancing is one of the most process-driven areas of law, which makes it ideal for automation.\n\n## Start with the steps you repeat\n\nList every step from instruction to completion. Mark the ones that are the same on every file.\n\n## Automate documents first\n\nClient care letters, searches and completion statements can all be generated from matter data.\n\n## Keep clients informed automatically\n\nStatus updates at each milestone cut down on calls and emails and improve client satisfaction.",
    coverImage: "",
    author: "Case LMS Team",
    tags: ["Automation", "Conveyancing"],
    publishedAt: "2026-09-15",
    published: true,
  },
  {
    title: "The hidden cost of partial automation in law firms",
    slug: "hidden-cost-of-partial-automation",
    excerpt:
      "Automating one step and leaving the next to a spreadsheet often costs more than doing nothing. Here is how to spot a half-finished workflow.",
    content:
      "Half-automated workflows are the quiet drain on fee earner time. The task feels fast until the handover, then everything stalls.\n\n## Where handovers hurt\n\nA document is generated in seconds, then a fee earner copies the matter reference into a billing form. A client care letter goes out automatically, then someone updates the compliance register by hand. Each small bridge costs minutes, and those minutes compound across a hundred open matters.\n\n## Measure the gaps, not the wins\n\nMap one matter end to end and mark every point where a human moves information from one tool to another. The best automation targets are not the loudest problems; they are the quietest copy and paste steps.\n\n## Join the ends, not the middle\n\nA workflow pays back only when the first step connects to the last. Before investing in a new tool, check that it writes back to the systems you already rely on for billing, compliance and reporting.",
    coverImage: "",
    author: "Case LMS Team",
    tags: ["Automation", "Operations"],
    publishedAt: "2026-10-18",
    published: true,
  },
  {
    title: "What UK law firms should know about client portals in 2026",
    slug: "client-portals-for-uk-law-firms-2026",
    excerpt:
      "Clients expect secure, mobile-first communication. A good portal is now the baseline, not a differentiator. Here is what to look for.",
    content:
      "The firms winning repeat work in 2026 are the ones that make it effortless for a client to see what is happening on their matter.\n\n## From email threads to shared records\n\nA portal is not an inbox. Correspondence, documents, invoices and e-signatures should sit against the matter so a client sees a single ordered record, not a scattered thread.\n\n## Mobile first, by default\n\nMost clients will open the portal on a phone. If an ID upload, a signature or a payment is not a two-tap flow, it will not get done.\n\n## Security the client can see\n\nTwo-factor sign-in, a visible session list and clear data-residency statements turn security from a worry into a trust signal. Make them easy to find.\n\n## Metrics that matter\n\nTrack activation rate, median time to first login, and the share of matters where the portal replaces email entirely. These numbers tell you whether the portal is actually serving clients, or just sitting unused.",
    coverImage: "",
    author: "Case LMS Team",
    tags: ["Client experience", "Technology"],
    publishedAt: "2026-10-10",
    published: true,
  },
  {
    title: "A short guide to the SRA accounts rules for growing practices",
    slug: "sra-accounts-rules-guide-growing-practices",
    excerpt:
      "The rules are short, but the day-to-day habits that keep you compliant are not. A plain-English summary for firms adding fee earners.",
    content:
      "The SRA accounts rules fit on a few pages, which can give the false impression that compliance is simple. In practice, it is the daily habits around trust money that trip firms up.\n\n## Separate client money from your own\n\nClient money sits in a client account, held separately from office money. Prompt banking and a clear naming convention for ledgers prevent the most common mix-ups.\n\n## Reconcile at least every five weeks\n\nThree-way reconciliations between the bank, the client ledger and the matter balances must be documented and signed off. A ten-minute weekly habit is cheaper than a quarterly reconstruction.\n\n## Return residual balances promptly\n\nSmall unclaimed balances add up. Build a monthly review into the routine and keep the paper trail for anything paid to charity.\n\n## Train everyone who touches a ledger\n\nFee earners, cashiers and partners should all understand what a client account is and is not. A quarterly refresher is a small investment against a significant risk.",
    coverImage: "",
    author: "Case LMS Team",
    tags: ["Compliance", "Trust accounting"],
    publishedAt: "2026-09-28",
    published: true,
  },
  {
    title: "Preparing your firm for the next wave of AI in legal work",
    slug: "preparing-your-firm-for-ai-in-legal-work",
    excerpt:
      "AI is moving from novelty to utility. A short, honest plan for partners who need to decide what to adopt, what to pilot and what to leave alone.",
    content:
      "The useful question is no longer whether AI belongs in the practice, but which parts of the practice benefit first.\n\n## Start where mistakes are cheap\n\nResearch summaries, first-draft correspondence and clause comparison are good first pilots. Mistakes are caught by the fee earner, and the time saving is real.\n\n## Keep humans accountable, visibly\n\nEvery output needs a named reviewer. Record who checked what, when, so the audit trail protects both the client and the firm.\n\n## Watch the data path\n\nBefore a tool goes near a client file, ask three questions: where does the data sit, who can see it, and how long is it kept. The answer must be in writing.\n\n## Measure before you expand\n\nPick two matter types, run the pilot for a quarter, and compare average fee earner hours and realisation. If the numbers do not move, change the pilot before changing the policy.",
    coverImage: "",
    author: "Case LMS Team",
    tags: ["AI", "Strategy"],
    publishedAt: "2026-09-20",
    published: true,
  },
  {
    title: "WIP, lock-up and the levers that free cash in a mid-sized firm",
    slug: "wip-lock-up-levers-free-cash-mid-sized-firm",
    excerpt:
      "Lock-up is the single biggest cash problem for growing firms. Four levers that partners can pull in the next quarter, with the data to prove the impact.",
    content:
      "Cash flow does not improve by trying harder. It improves by moving a handful of specific numbers.\n\n## Bill more frequently, bill smaller\n\nA monthly bill of £3,000 lands better than a quarterly bill of £9,000, and lock-up drops immediately. Interim billing policies are the fastest lever a managing partner can pull.\n\n## Capture time in the day it happens\n\nTime captured within 24 hours is both more accurate and more defensible. A phone-first time entry habit shortens the cycle from work done to work billed.\n\n## Investigate aged WIP, do not ignore it\n\nAnything over 90 days should be reviewed matter by matter. Decide to bill, write down or close, but decide.\n\n## Make the number visible\n\nA weekly WIP and lock-up dashboard, shared with heads of department, changes behaviour faster than any policy memo. Transparency is the lever.",
    coverImage: "",
    author: "Case LMS Team",
    tags: ["Finance", "Operations"],
    publishedAt: "2026-09-05",
    published: true,
  },
  {
    title: "Running a secure document review when half the team is remote",
    slug: "secure-document-review-hybrid-team",
    excerpt:
      "Hybrid working is here to stay. A short playbook for keeping document review fast, auditable and compliant when reviewers are not in the same room.",
    content:
      "Document review used to assume a shared office and a shared drive. Neither is a safe assumption now, and the rules of the review need to catch up.\n\n## One source, versioned\n\nReviewers should see the same current version from any device, with every change tracked. Local copies and emailed attachments are where review quality quietly degrades.\n\n## Permissions scoped to the matter\n\nAccess should sit on the matter, not on a folder in a shared drive. When a reviewer leaves the matter, their access leaves with them, automatically.\n\n## Audit trails that read like a story\n\nA good trail answers who opened the document, who edited it, who approved it and when, in that order. Export it with the matter close, every time.\n\n## Plan for the lost laptop\n\nFull-disk encryption, short session timeouts and a documented remote-wipe procedure turn a stolen device from an incident into a non-event.",
    coverImage: "",
    author: "Case LMS Team",
    tags: ["Security", "Documents"],
    publishedAt: "2026-08-22",
    published: true,
  },
  {
    title: "Choosing a legal practice management system: a buyer's checklist",
    slug: "legal-practice-management-buyers-checklist",
    excerpt:
      "A one-page checklist for firms shortlisting a new system. Twenty questions that separate marketing claims from working software.",
    content:
      "Every vendor demo looks good. The useful questions are the ones that reveal how the software behaves on a difficult Tuesday.\n\n## Data and ownership\n\nWhere is the data hosted. Who holds the keys. How quickly can you leave with a full, usable export. If the answers are vague, treat it as a product gap.\n\n## Compliance baked in\n\nAre risk assessments, ID checks and conflict checks part of matter intake, or bolted on. Can file reviews be assigned and tracked without a separate tool.\n\n## Billing and trust accounting\n\nCan the system run a three-way reconciliation. Does it support interim billing, agreed-fee matters and complex disbursements, in one invoice.\n\n## Reporting out of the box\n\nAsk to see WIP, lock-up, realisation and utilisation reports with real data, not a dashboard screenshot. If the vendor needs a developer to build them, so will you.\n\n## Migration and support\n\nWho runs the migration, how long does it take and what is checked at sign off. What does support look like at 9pm on a Friday.\n\nTreat the demo as an interview. The best vendors will welcome the detail.",
    coverImage: "",
    author: "Case LMS Team",
    tags: ["Buying guide", "Practice management"],
    publishedAt: "2026-08-10",
    published: true,
  },
];

const withIds = <T,>(items: Seed<T>[], prefix: string) =>
  items.map((item, i) => ({ ...item, id: `${prefix}-${i + 1}` }) as T);

export const fallbackContent = {
  features: withIds<Feature>(defaultFeatures, "feature"),
  plans: withIds<Plan>(defaultPlans, "plan"),
  testimonials: withIds<Testimonial>(defaultTestimonials, "testimonial"),
  faqs: withIds<Faq>(defaultFaqs, "faq"),
  stats: withIds<Stat>(defaultStats, "stat"),
  team: withIds<TeamMember>(defaultTeam, "team"),
  posts: defaultPosts.map((p) => ({ ...p, id: p.slug }) as Post),
};
