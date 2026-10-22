# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository. Also read `AGENTS.md`: this project runs **Next.js 16 with Cache Components**, whose APIs differ from older Next.js. Check `node_modules/next/dist/docs/` before using an API you are unsure about.

## Project Overview

Case LMS is the marketing website and content admin for a cloud **legal practice management system** (case management, documents, time and billing, trust accounting, compliance, client portal). The structure and tone are modelled on lawyer-led legal SaaS sites, with original copy and branding.

- **Public site** (`src/app/(site)/`): Home, Features, Pricing, About, Insights (blog) and Contact. Server-rendered and statically prerendered, with content read from Firestore and cached with `"use cache"`.
- **Admin panel** (`src/app/admin/`): client-side app behind Firebase Auth. Full CRUD for features, pricing plans, testimonials, FAQs, stats, team and blog posts; a site settings form (contact details, socials, announcement bar); and an inbox for contact form messages.
- **Contact info is never hard-coded.** It lives in Firestore at `settings/site` and is edited in Admin > Site settings. `src/lib/defaults.ts` holds placeholder fallbacks used only when Firebase is unreachable or not configured.
- **Data flow:** admin writes go straight to Firestore with the client SDK, then call the `revalidateContent` server action (`src/app/actions/revalidate.ts`), which verifies the user's ID token and admin status before calling `updateTag()` for the affected cache tags.

Key files:

| Path | Purpose |
| --- | --- |
| `src/lib/content.ts` | Cached server getters (`getSettings`, `getFeatures`, ...). One cache tag per collection. |
| `src/lib/firestore-rest.ts` | Server-side Firestore reads over REST (keeps the SDK out of public bundles). |
| `src/lib/admin-schema.ts` | Declarative schema for every admin collection. Forms, tables and seeding are generated from it. |
| `src/lib/defaults.ts` | Fallback and seed content. |
| `src/components/site/` | Public UI sections. `src/components/admin/` holds the admin UI. |
| `firestore.rules` | Security rules. The real access control for the whole app. |

## Tech Stack & Commands

- **Next.js 16** App Router, React 19, TypeScript (strict), Turbopack, `cacheComponents` + `partialPrefetching`
- **Tailwind CSS 4** (CSS-first config in `src/app/globals.css`, `@theme` tokens, `@utility` helpers such as `btn-primary`, `container-page`, `field-input`)
- **Firebase**: Firestore (content and messages) and Firebase Auth (email and password for admins)
- **EmailJS** (`@emailjs/browser`) for contact form email notifications
- **Cloudinary** unsigned uploads from the admin, delivered through a Cloudinary `next/image` loader (`src/components/ui/cloud-image.tsx`)
- **Motion** (`motion/react`) via `LazyMotion` + `m` components, with `MotionConfig reducedMotion="user"`
- **lucide-react** icons; brand icons are inline SVG in `src/components/ui/icons.tsx`

```bash
npm install          # install dependencies
cp .env.example .env.local   # then fill in values (never commit .env.local)
npm run dev          # dev server on http://localhost:3000
npm run build        # production build (also type-checks)
npm start            # serve the production build
npm run lint         # ESLint (next/core-web-vitals + typescript)
npx firebase deploy --only firestore:rules   # deploy security rules
```

The site builds and runs without any env vars by falling back to `src/lib/defaults.ts`. The admin panel needs Firebase configured.

## Code Style & Conventions

- **Server Components by default.** Add `"use client"` only for interactivity (state, effects, motion, Firebase SDK). Keep client components small and leaf-level.
- **Data fetching for public pages** goes through `src/lib/content.ts` only. Every getter uses `"use cache"`, `cacheTag(<collection>)` and `cacheLife("hours")`, and falls back to defaults on failure. Never call the Firebase client SDK from public pages, except lazily inside event handlers (see `contact-form.tsx`).
- **New admin-managed content:** add a type in `src/lib/types.ts`, defaults in `defaults.ts`, a getter in `content.ts` and its tag in `CONTENT_TAGS`, a `CollectionDef` in `admin-schema.ts`, and a rule in `firestore.rules`. The admin UI picks it up automatically.
- **Request-time APIs** (`params`, `searchParams`, `cookies`) must sit behind `<Suspense>` or in cached scope, per Cache Components rules. Client code reads query strings with `useSearchParams` inside a `<Suspense>` boundary.
- **Styling:** Tailwind utilities and the shared `@utility` classes. Use theme tokens (`ink-*`, `brand-*`, `brass-*`), not raw hex values. Mobile first; check 320px wide.
- **Motion:** import `* as m from "motion/react-m"`, never `motion.div`. Use `<Reveal>` for scroll reveals, and only below the fold. Never animate the opacity of the LCP element (hero heading or intro).
- **Accessibility:** semantic landmarks and one `h1` per page with no skipped heading levels; every input has a `<label>`; errors use `aria-invalid` and `aria-describedby`; icon-only buttons have an accessible name; decorative icons get `aria-hidden`; touch targets are at least 44px (`min-h-11` / `size-11`); colour contrast is at least WCAG AA.
- **SEO:** every page exports `metadata` or `generateMetadata` with a unique title, description and `alternates.canonical`. Add JSON-LD with `<JsonLd>` where it fits. New public routes must be added to `src/app/sitemap.ts`.
- **Naming:** kebab-case file names, PascalCase components, camelCase functions. Path alias `@/` maps to `src/`.
- **Copy:** British English, sentence case headings, no em dashes.

## Strict Guardrails

- **Never commit secrets.** `.env*` is git-ignored except `.env.example`, which holds empty placeholders only. Only `NEXT_PUBLIC_*` browser-safe values (Firebase web config, EmailJS public key, Cloudinary cloud name and unsigned preset) belong in this app. Never add a Firebase service account, Cloudinary API secret or EmailJS private key.
- **Security lives in `firestore.rules`.** Any new collection or field written from the browser needs a matching rule. Never loosen rules to make something work, and never allow clients to write `admins/*`.
- **Never hard-code contact details**, prices or other admin-managed content in components. Read them from `content.ts`.
- **Render CMS URLs safely.** Pass any admin-entered link through `safeUrl()` (and maps through `isMapEmbed()`) before using it in `href` or `src`. Never use `dangerouslySetInnerHTML` except in `JsonLd`.
- **Keep the Lighthouse targets.** Don't add client-side data fetching, large client libraries, unoptimised images (`<img>` outside the admin), layout-shifting embeds or new web fonts to public pages. Run Lighthouse against `npm run build && npm start` before merging UI changes.
- **Admin stays out of search.** Keep `robots: noindex` in `src/app/admin/layout.tsx` and the `/admin` disallow in `robots.ts`.
- **Don't** disable ESLint rules, TypeScript strictness or tests to get a build green. Fix the cause.
- **Don't** push, merge, deploy or run destructive Firestore operations (bulk deletes, rule changes in production) without the project owner's explicit approval.
