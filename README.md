# Case LMS

Marketing website and content admin for Case LMS, a cloud legal practice management system. Built with Next.js 16, Tailwind CSS 4, Firebase (Firestore and Auth), EmailJS, Cloudinary and Motion.

- Public pages: Home, Features, Pricing, About, Insights (blog) and Contact
- Admin panel at `/admin`: full CRUD for all site content, site settings (contact details, socials, announcement bar) and a contact message inbox
- SEO: per-page metadata, canonical URLs, Open Graph image, sitemap, robots.txt, web manifest and JSON-LD (Organization, WebSite, SoftwareApplication, FAQPage, BlogPosting)
- Accessible (WCAG 2.1 AA patterns, keyboard support, reduced-motion support) and fully responsive

See [CLAUDE.md](./CLAUDE.md) for architecture, conventions and guardrails.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without any env values the public site runs on built-in placeholder content. Fill in `.env.local` to connect the real services.

## Setting up the services

### 1. Firebase

1. Create a Firebase project and add a **Web app**. Copy its config into the `NEXT_PUBLIC_FIREBASE_*` values.
2. Enable **Firestore** (production mode) and **Authentication > Email/Password**.
3. Deploy the security rules: `npx firebase deploy --only firestore:rules` (or paste `firestore.rules` into the console).
4. Create your admin user in **Authentication > Users > Add user**. Copy the user's **UID**.
5. In Firestore, create a document at `admins/<that UID>` (any field, for example `email: "you@firm.com"`). Only users listed in `admins` can use the admin panel.
6. Sign in at `/admin` and press **Seed default content** on the dashboard, then edit everything, starting with **Site settings** for your contact details.

### 2. EmailJS (contact form email)

1. Add an email service and an email template. The template receives `from_name`, `reply_to`, `firm`, `phone`, `topic` and `message`.
2. Put the service ID, template ID and public key in `NEXT_PUBLIC_EMAILJS_*`.

Every enquiry is also saved to Firestore (`messages`) and appears in the admin inbox, so nothing is lost if email fails.

### 3. Cloudinary (images)

1. In **Settings > Upload**, create an **unsigned** upload preset (consider restricting it to images, a max file size and the `case-lms` folder).
2. Put the cloud name and preset in `NEXT_PUBLIC_CLOUDINARY_*`. The admin image fields then show an **Upload image** button.

### 4. Site URL

Set `NEXT_PUBLIC_SITE_URL` to the production domain so canonical URLs, the sitemap and structured data are correct.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build and type check |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Lighthouse

Measured locally against `npm run build && npm start` with Lighthouse 12:

- Desktop: 100 for performance, accessibility, best practices and SEO
- Mobile (simulated slow 4G): 100 for accessibility, best practices and SEO; 96 to 100 for performance depending on page and run

Production hosting with a CDN, HTTP/2 and Brotli (for example Vercel) usually scores the same or better. The admin panel is deliberately `noindex`, so it is excluded from SEO scoring.

## Deploying

The app deploys to Vercel or any Node host that supports Next.js 16. Add the same env values to the host's environment settings.
