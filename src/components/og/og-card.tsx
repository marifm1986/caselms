// Shared OpenGraph card renderer. Returns JSX for use with `new ImageResponse(...)`
// from `next/og`. Keep this file free of Firebase client SDK imports since OG
// routes run on the edge/node runtime.

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

const INK_950 = "#040814";
const INK_900 = "#0a1226";
const INK_700 = "#192756";
const BRAND_600 = "#1f3a7a";
const BRASS_300 = "#f3d791";
const BRASS_400 = "#ebbf62";
const BRASS_500 = "#c99a3b";
const SLATE_200 = "#e2e8f0";
const SLATE_400 = "#94a3b8";

type OgCardProps = {
  /** Short label in brass caps, e.g. "The platform", "Insight", "Case LMS" */
  eyebrow: string;
  /** Main headline, usually the page or post title. */
  title: string;
  /** Supporting line below the headline. */
  subhead?: string;
  /** Right-aligned footer meta, e.g. author + date for articles. */
  meta?: string;
  /** Overrides the default "casel.ms" footer label on the left. */
  domain?: string;
};

export function OgCard({ eyebrow, title, subhead, meta, domain = "caselms.app" }: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: "white",
        fontFamily: "sans-serif",
        background: `linear-gradient(135deg, ${INK_950} 0%, ${INK_900} 55%, ${BRAND_600} 100%)`,
        position: "relative",
      }}
    >
      {/* Colonnade pin-stripes evoking columns, same as the site hero */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 96px)`,
        }}
      />
      {/* Soft brass glow in the top-right corner */}
      <div
        style={{
          position: "absolute",
          top: -220,
          right: -220,
          width: 560,
          height: 560,
          borderRadius: 9999,
          background: `radial-gradient(circle at center, ${BRASS_400}26 0%, transparent 65%)`,
        }}
      />

      {/* Top bar: brand lockup */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
        <svg width="72" height="72" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="9" fill={BRASS_400} />
          <path
            d="M21.5 10.5a7.5 7.5 0 1 0 0 11"
            fill="none"
            stroke={INK_900}
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <circle cx="22" cy="16" r="2.4" fill={INK_900} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.5 }}>Case LMS</span>
          <span
            style={{
              marginTop: 6,
              fontSize: 14,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: SLATE_400,
            }}
          >
            Legal practice management
          </span>
        </div>
      </div>

      {/* Headline block */}
      <div style={{ display: "flex", flexDirection: "column", position: "relative", maxWidth: 1000 }}>
        <span
          style={{
            fontSize: 20,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: BRASS_300,
            fontWeight: 600,
          }}
        >
          {eyebrow}
        </span>
        <div
          style={{
            width: 72,
            height: 3,
            background: `linear-gradient(90deg, ${BRASS_500}, ${BRASS_300} 60%, transparent)`,
            marginTop: 18,
            marginBottom: 24,
            borderRadius: 2,
          }}
        />
        <span
          style={{
            fontSize: title.length > 60 ? 60 : 72,
            lineHeight: 1.06,
            fontWeight: 700,
            letterSpacing: -1.2,
          }}
        >
          {title}
        </span>
        {subhead && (
          <span
            style={{
              marginTop: 22,
              fontSize: 26,
              lineHeight: 1.35,
              color: SLATE_200,
              maxWidth: 920,
            }}
          >
            {subhead}
          </span>
        )}
      </div>

      {/* Footer meta row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          borderTop: `1px solid ${INK_700}`,
          paddingTop: 20,
          color: SLATE_400,
          fontSize: 20,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: BRASS_400,
            }}
          />
          {domain}
        </span>
        {meta && <span style={{ color: SLATE_200 }}>{meta}</span>}
      </div>
    </div>
  );
}
