/** @type {import('next').NextConfig} */

// Content-Security-Policy is shipped in *Report-Only* mode first: it logs
// violations to the console (and a report endpoint, if configured) without
// blocking anything, so we can confirm the embedded Sanity Studio at /studio
// keeps working before switching to an enforced policy.
// 'unsafe-inline' / 'unsafe-eval' are required by Sanity Studio, Framer Motion
// inline styles, and Next's inline bootstrap script.
const cspReportOnly = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io",
  "worker-src 'self' blob:",
].join('; ');

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Vercel serves the site over HTTPS — opt browsers into HTTPS-only for 2 years.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Content-Security-Policy-Report-Only', value: cspReportOnly },
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        // The Studio UI is for project members only — keep it out of search indexes.
        source: '/studio/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;
