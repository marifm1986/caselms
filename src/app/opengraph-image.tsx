import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/components/og/og-card";
import { getSettings } from "@/lib/content";

export const alt = "Case LMS, legal practice management software";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  const settings = await getSettings();
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Built for law firms"
        title="Run your whole firm from one secure workspace"
        subhead={settings.description}
      />
    ),
    size,
  );
}
