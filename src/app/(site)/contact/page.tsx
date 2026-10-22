import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/site/contact-form";
import { PageHero } from "@/components/site/sections";
import { getSettings } from "@/lib/content";
import { isMapEmbed, telHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Book a Case LMS demo, ask about pricing or get support. Talk to the team behind the legal practice management platform.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();

  const details = [
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: Mail, label: "Sales", value: settings.salesEmail, href: `mailto:${settings.salesEmail}` },
    { icon: Phone, label: "Phone", value: settings.phone, href: telHref(settings.phone) },
    { icon: MapPin, label: "Office", value: settings.address },
    { icon: Clock, label: "Opening hours", value: settings.hours },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your firm"
        intro="Book a tailored demo, ask about migration or pricing, or get help from our support team. We reply within one working day."
      />
      <section aria-label="Contact details and form" className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold">Contact details</h2>
            <address className="mt-6 space-y-4 not-italic">
              {details.map((d) => (
                <div key={d.label} className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <d.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm text-slate-600">{d.label}</p>
                    {d.href ? (
                      <a href={d.href} className="font-semibold break-all text-ink-900 hover:text-brand-700">
                        {d.value}
                      </a>
                    ) : (
                      <p className="font-semibold whitespace-pre-line text-ink-900">{d.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </address>
            {isMapEmbed(settings.mapUrl) && (
              <iframe
                title={`Map showing the ${settings.siteName} office`}
                src={settings.mapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="mt-6 h-64 w-full rounded-2xl border-0"
              />
            )}
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 sm:p-10">
            <h2 className="font-display text-2xl font-semibold">Send us a message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
