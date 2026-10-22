import { ImageResponse } from "next/og";

export const alt = "Case LMS, legal practice management software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #0b1530 0%, #14214a 60%, #2536b0 100%)",
          color: "white",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="9" fill="#ffffff" />
            <path d="M21.5 10.5a7.5 7.5 0 1 0 0 11" fill="none" stroke="#2f45d8" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="22" cy="16" r="2.2" fill="#0b1530" />
          </svg>
          Case LMS
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, lineHeight: 1.1, maxWidth: 900 }}>Run your whole firm from one secure workspace</div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#f6d58c" }}>Legal practice management software</div>
        </div>
      </div>
    ),
    size,
  );
}
