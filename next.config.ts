import type { NextConfig } from "next";

// Content Security Policy. 'unsafe-inline' is required because Next.js inlines
// small bootstrap scripts and we inline Tailwind CSS below; nonces would need
// per-request HTML, which conflicts with cacheComponents + static prerender.
// Allowlisted origins cover Firebase (auth, Firestore, Storage), EmailJS,
// Cloudinary (images) and Google Maps embeds used via admin-managed mapUrl.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://*.googleapis.com https://*.gstatic.com https://apis.google.com https://*.firebaseio.com https://*.firebaseapp.com https://cdn.emailjs.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.googleusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebaseinstallations.googleapis.com https://api.emailjs.com https://res.cloudinary.com",
  "frame-src 'self' https://www.google.com https://*.firebaseapp.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: csp },
  // Opener/embedder isolation flags Lighthouse checks for.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Serve source maps for first-party JS so DevTools can map prod stacks; also
  // satisfies the Lighthouse "missing source maps" audit.
  productionBrowserSourceMaps: true,
  // Tailwind output is small, so inlining it removes the render-blocking CSS request.
  experimental: { inlineCss: true },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
