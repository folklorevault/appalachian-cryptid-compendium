import type { NextConfig } from "next";

// Content Security Policy directives
const cspDirectives = [
  "default-src 'self'",
  // Next.js requires 'unsafe-inline' for hydration scripts; 'unsafe-eval' needed in dev only
  `script-src 'self' 'unsafe-inline' https://rybbit.folklorevault.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.mapbox.com",
  "font-src 'self'",
  [
    "connect-src 'self'",
    "https://8thljucm.api.sanity.io",
    "https://8thljucm.apicdn.sanity.io",
    "https://cdn.sanity.io",
    "https://*.mapbox.com",
    "https://rybbit.folklorevault.com",
  ].join(" "),
  "worker-src 'self' blob:",
  "child-src blob:",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "upgrade-insecure-requests",
];

const csp = cspDirectives.join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
