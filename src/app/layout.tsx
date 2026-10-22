import type { Metadata, Viewport } from "next";
import { cacheTag } from "next/cache";
import { Fraunces } from "next/font/google";
import { getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/env";
import "./globals.css";

// Body text uses the native system UI stack (zero font bytes); only display
// headings load a web font, with "optional" so it can never delay LCP.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "optional",
  weight: ["600"],
});

export async function generateMetadata(): Promise<Metadata> {
  "use cache";
  cacheTag("settings");
  const settings = await getSettings();
  const title = `${settings.siteName} | Legal Practice Management Software`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${settings.siteName}` },
    description: settings.description,
    applicationName: settings.siteName,
    keywords: [
      "legal practice management software",
      "law firm case management",
      "legal case management system",
      "law firm billing software",
      "trust accounting",
      "legal compliance software",
      "client portal for lawyers",
    ],
    authors: [{ name: settings.siteName }],
    creator: settings.siteName,
    publisher: settings.siteName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: settings.siteName,
      title,
      description: settings.description,
      url: "/",
      locale: "en_GB",
    },
    twitter: { card: "summary_large_image", title, description: settings.description },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    formatDetection: { telephone: false },
    category: "technology",
  };
}

export const viewport: Viewport = {
  themeColor: "#0b1530",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={fraunces.variable}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
