import { Gavel, HeartHandshake, Lightbulb, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand, PageHero, SectionHeading } from "@/components/site/sections";
import { CloudImage } from "@/components/ui/cloud-image";
import { getSettings, getTeam } from "@/lib/content";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Case LMS was founded by lawyers who wanted practice management software that works the way law firms really work. Meet the team and our values.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

const values = [
  { icon: Gavel, title: "Lawyer-led", text: "Our product decisions are shaped by people who have run matters and managed firms." },
  { icon: ShieldCheck, title: "Secure by design", text: "Client confidentiality is non-negotiable, so security is built into every layer." },
  { icon: Lightbulb, title: "Always improving", text: "We release improvements every few weeks, guided by feedback from our firms." },
  { icon: HeartHandshake, title: "Partners, not vendors", text: "From migration to go-live and beyond, our team works alongside yours." },
];

export default async function AboutPage() {
  const [team, settings] = await Promise.all([getTeam(), getSettings()]);

  return (
    <>
      <PageHero
        eyebrow="About Case LMS"
        title="We built the system we wished we'd had in practice"
        intro="Case LMS started with a simple idea: legal software should remove admin, not create it. Today we help firms of every size run matters, finances and compliance from one place."
      />

      <section aria-labelledby="values-title" className="section">
        <div className="container-page">
          <SectionHeading id="values-title" eyebrow="Our values" title="What guides everything we build" />
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl bg-slate-50 p-8">
                  <v.icon className="size-8 text-brand-600" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {team.length > 0 && (
        <section aria-labelledby="team-title" className="section bg-slate-50">
          <div className="container-page">
            <SectionHeading id="team-title" eyebrow="Our team" title="The people behind Case LMS" />
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member, i) => (
                <Reveal as="li" key={member.id} delay={i * 0.08}>
                  <article className="h-full rounded-3xl bg-white p-8 ring-1 ring-slate-200">
                    {member.photo ? (
                      <CloudImage
                        src={member.photo}
                        alt={`Portrait of ${member.name}`}
                        width={96}
                        height={96}
                        className="size-24 rounded-2xl object-cover"
                      />
                    ) : (
                      <span
                        className="font-display flex size-24 items-center justify-center rounded-2xl bg-ink-900 text-3xl text-white"
                        aria-hidden="true"
                      >
                        {member.name.slice(0, 1)}
                      </span>
                    )}
                    <h3 className="mt-6 text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm font-medium text-brand-700">{member.role}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{member.bio}</p>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand settings={settings} />
    </>
  );
}
