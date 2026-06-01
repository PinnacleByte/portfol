# Project Structure Guide

## Overview

PinnacleByte portfolio — Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Framer Motion, dark Navy + Electric Blue theme. Content managed via Sanity v3 (Studio embedded at `/studio`).

## Directory Breakdown

### `/app` — Pages & Routing

```
app/
  layout.tsx                    # Root layout — LenisProvider wrapper, global metadata
  page.tsx                      # Server Component — fetches Sanity data in parallel, renders HomePageClient
  contact/page.tsx              # Contact page
  work/
    page.tsx                    # All projects gallery (async server component, Sanity fetch)
    [slug]/page.tsx             # Case study detail (SSG via generateStaticParams from Sanity)
  studio/
    [[...tool]]/page.tsx        # Embedded Sanity Studio (dynamic, Sanity auth)
```

### `/components/HomePageClient.tsx`

`'use client'` — contains all interactive homepage logic: `useRef`, `useSnapScroll`, the snap container layout, the sections array. Receives `projects`, `testimonials`, `team` as props from the server component `app/page.tsx`.

### `/components/ui` — Shared Primitives

| File | Purpose |
|------|---------|
| `Navbar.tsx` | Fixed top nav. `visible` prop hides it on intro section. Desktop: `goTo()` buttons. Mobile: `<a href="#id">` anchors. |
| `Footer.tsx` | Mobile-only footer |
| `Button.tsx` | Configurable button variants |
| `NetworkCanvas.tsx` | Canvas particle system. Props: `particleCount`, `connectionRadius`, `particleAlpha`, `lineAlpha`, `speed` |
| `DotGridBackground.tsx` | 18×11 CSS dot grid with outward ripple pulse animation |
| `AuroraBackground.tsx` | 3 large blurred Framer Motion blobs drifting in blue/sky/violet |

### `/components/sections` — Page Sections

| File | Section | Notes |
|------|---------|-------|
| `IntroSplashSection.tsx` | 0 — Intro Splash | One-shot typewriter, NetworkCanvas, navbar hidden |
| `HeroSection.tsx` | 1 — Hero | 120-particle canvas, rotating typewriter eyebrow, word-by-word blur reveal |
| `ServicesSection.tsx` | 2 — Services | Tech icon grid (tech-stack-icons npm), dot grid background |
| `ProcessTimelineSection.tsx` | 3 — Process | Sticky split scrollytelling (IntersectionObserver), internally scrollable, sticky dot grid |
| `PortfolioSection.tsx` | 4 — Portfolio | 3-col card grid w/ hover lift/glow + "Visit this site" button, internally scrollable. Receives `projects: Project[]` prop. |
| `TeamSection.tsx` | 5 — Team | Aurora background. Receives `team: TeamMember[]` prop. |
| `TestimonialsSection.tsx` | 6 — Testimonials | Marquee, aurora background. Receives `testimonials: Testimonial[]` prop. |
| `FinalCtaSection.tsx` | 7 — CTA | 60-particle canvas, embedded footer bar |

### `/lib`

| File | Purpose |
|------|---------|
| `sanity.ts` | Sanity client (`createClient`) — `projectId: b3q3iq0h`, `dataset: production`, `useCdn: false` (direct API, no CDN cache) |
| `sanityFetch.ts` | Typed GROQ fetch helpers: `fetchProjects`, `fetchTestimonials`, `fetchTeam`, `fetchProjectBySlug`, `fetchAllSlugs` |
| `lenis.ts` | Lenis smooth scroll factory (mobile only) |

### `/hooks`

| File | Purpose |
|------|---------|
| `useSnapScroll.ts` | Snap-scroll state machine. Wheel/keyboard handler. Checks internal scroll position before advancing sections 3 & 4. |
| `useTypewriter.ts` | 4-phase rotating typewriter state machine |

### `/public`

```
public/
  icons/
    shopify.svg         # Custom Shopify brand icon (Simple Icons format)
  images/               # Optional local project images (reference as /images/filename.png)
```

### Root files

| File | Purpose |
|------|---------|
| `sanity.config.ts` | Sanity Studio schema — defines `portfolioProject`, `portfolioTestimonial`, `portfolioTeam` document types |
| `tailwind.config.ts` | Color tokens, glow shadows |
| `next.config.mjs` | `cdn.sanity.io` remotePattern, `reactStrictMode: true`, security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) |
| `tsconfig.json` | `moduleResolution: bundler`, TypeScript 6 |

## Sanity Data Flow

```
Sanity Cloud
  ↓  GROQ  (lib/sanityFetch.ts)
app/page.tsx  [Server Component — async]
  ├─ fetchProjects()
  ├─ fetchTestimonials()
  └─ fetchTeam()
  ↓  props
components/HomePageClient.tsx  ['use client']
  ├─ PortfolioSection   (projects prop)
  ├─ TeamSection        (team prop)
  └─ TestimonialsSection (testimonials prop)
```

`app/work/[slug]/page.tsx` calls `fetchProjectBySlug(slug)` directly (server component).  
`generateStaticParams` calls `fetchAllSlugs()` at build time to pre-render case study pages.

## Deployment (Vercel)

- No environment variables required for public reads (Sanity dataset is public).
- Deploy and visit `/studio` — sign in with your Sanity account to manage all content.
- Content changes appear on the live site within ~60 seconds of publishing (ISR revalidation via `next: { revalidate: 60 }` on all fetch calls).
- For local Studio access, add `http://localhost:3000` to CORS Origins in [sanity.io/manage](https://sanity.io/manage) → API tab.

## Key Styling Conventions

- Background: `bg-bg-dark` (`#0F172A`)
- Headings: `text-primary-50` (`#F8FAFC`)
- Body: `text-primary-300` (`#CBD5E1`)
- Accent: `text-accent-400` / `bg-accent-500` (Electric Blue)
- Cards: `bg-neutral-900` border `border-neutral-700`
- Section padding: `px-6 lg:px-16`
