import type { Metadata } from "next";
import { PricingCards } from "@/components/site/pricing-cards";
import { CtaBand, FaqList, PageHero, SectionHeading } from "@/components/site/sections";
import { getFaqs, getPlans, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple per-user pricing for Case LMS legal practice management software, with plans for sole practitioners, growing firms and enterprise law firms.",
  alternates: { canonical: "/pricing" },
  openGraph: { url: "/pricing" },
};

export default async function PricingPage() {
  const [plans, faqs, settings] = await Promise.all([getPlans(), getFaqs(), getSettings()]);

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Transparent pricing that grows with your firm"
        intro="Every plan includes onboarding, data migration support, secure cloud hosting and regular updates. No hidden fees."
      />
      <section aria-labelledby="plans-title" className="section">
        <div className="container-page">
          <h2 id="plans-title" className="sr-only">
            Plans
          </h2>
          <PricingCards plans={plans} />
          <p className="mt-10 text-center text-sm text-slate-600">Prices exclude VAT. Annual plans are billed yearly.</p>
        </div>
      </section>
      {faqs.length > 0 && (
        <section aria-labelledby="pricing-faq" className="section bg-slate-50">
          <div className="container-page max-w-3xl">
            <SectionHeading id="pricing-faq" eyebrow="FAQ" title="Pricing and onboarding questions" />
            <div className="mt-10">
              <FaqList faqs={faqs} />
            </div>
          </div>
        </section>
      )}
      <CtaBand settings={settings} />
    </>
  );
}
