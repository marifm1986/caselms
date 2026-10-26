import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo, SocialIcons } from "@/components/ui/icons";
import type { SiteSettings } from "@/lib/types";
import { safeUrl, telHref } from "@/lib/utils";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/contact?topic=demo", label: "Book a demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/blog", label: "Insights" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

const socialLabels = { linkedin: "LinkedIn", x: "X (Twitter)", facebook: "Facebook", youtube: "YouTube" } as const;

export function Footer({ settings, year }: { settings: SiteSettings; year: number }) {
  const socials = (Object.keys(socialLabels) as (keyof typeof socialLabels)[]).filter((k) => safeUrl(settings.socials[k]));

  return (
    <footer className="bg-ink-950 text-slate-300">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <Link href="/" aria-label="Case LMS home" className="inline-block rounded-lg">
            <Logo className="w-45" light />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">{settings.tagline}</p>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-3" aria-label="Social media">
              {socials.map((key) => {
                const Icon = SocialIcons[key];
                return (
                  <li key={key}>
                    <a
                      href={safeUrl(settings.socials[key])}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex size-11 items-center justify-center rounded-full bg-white/5 text-slate-300 transition-colors hover:bg-brand-600 hover:text-white"
                    >
                      <Icon className="size-4.5" />
                      <span className="sr-only">{socialLabels[key]} (opens in a new tab)</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-semibold text-white">{col.title}</h2>
            <ul className="mt-4 space-y-1">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block py-1.5 text-sm text-slate-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="text-sm font-semibold text-white">Get in touch</h2>
          <address className="mt-4 space-y-3 text-sm not-italic">
            <a href={`mailto:${settings.email}`} className="flex items-start gap-3 py-1 text-slate-400 hover:text-white">
              <Mail className="mt-0.5 size-4 shrink-0 text-brass-400" aria-hidden="true" />
              {settings.email}
            </a>
            <a href={telHref(settings.phone)} className="flex items-start gap-3 py-1 text-slate-400 hover:text-white">
              <Phone className="mt-0.5 size-4 shrink-0 text-brass-400" aria-hidden="true" />
              {settings.phone}
            </a>
            <p className="flex items-start gap-3 text-slate-400">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brass-400" aria-hidden="true" />
              <span className="whitespace-pre-line">{settings.address}</span>
            </p>
            <p className="flex items-start gap-3 text-slate-400">
              <Clock className="mt-0.5 size-4 shrink-0 text-brass-400" aria-hidden="true" />
              {settings.hours}
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {settings.siteName}. All rights reserved.
          </p>
          <p>Built for law firms that want to spend more time on law.</p>
        </div>
      </div>
    </footer>
  );
}
