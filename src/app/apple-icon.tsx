import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1530",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path d="M21.5 10.5a7.5 7.5 0 1 0 0 11" fill="none" stroke="#f0c060" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="22" cy="16" r="2.2" fill="#fff" />
        </svg>
      </div>
    ),
    size,
  );
}
