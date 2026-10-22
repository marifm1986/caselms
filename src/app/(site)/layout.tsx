import { cacheLife } from "next/cache";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { JsonLd } from "@/components/site/json-ld";
import { getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/env";
import { safeUrl } from "@/lib/utils";

async function getYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [settings, year] = await Promise.all([getSettings(), getYear()]);
  const sameAs = Object.values(settings.socials).map(safeUrl).filter(Boolean);

  return (
    <MotionProvider>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to main content
      </a>
      {settings.announcement && (
        <p className="bg-ink-900 px-4 py-2 text-center text-sm text-white">{settings.announcement}</p>
      )}
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer settings={settings} year={year} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${siteUrl}/#organization`,
              name: settings.siteName,
              url: siteUrl,
              logo: `${siteUrl}/icon.svg`,
              email: settings.email,
              telephone: settings.phone,
              address: settings.address,
              ...(sameAs.length ? { sameAs } : {}),
            },
            {
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              url: siteUrl,
              name: settings.siteName,
              publisher: { "@id": `${siteUrl}/#organization` },
            },
          ],
        }}
      />
    </MotionProvider>
  );
}
