# PinnacleByte Portfolio

Premium dark-themed web development studio portfolio with energetic animations and Sanity-powered content management.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS** — Dark Navy + Electric Blue theme
- **Framer Motion** — entrance animations, aurora backgrounds, full-page snap scroll
- **GSAP + ScrollTrigger** — ProcessTimeline scroll-synchronised animations
- **Canvas** — NetworkCanvas particle system with animated connectors
- **Sanity v3** — hosted CMS, Studio embedded at `/studio`

## Quick Start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
```

## Content Management (Sanity Studio)

All content (projects, testimonials, team members) is managed through Sanity Studio, embedded at `/studio`.

- Visit `http://localhost:3000/studio` in dev, or `https://yoursite.com/studio` after deploying to Vercel.
- Sign in with your Sanity account (the one that owns project `b3q3iq0h`).
- Changes publish immediately — no local file edits or GitHub pushes needed.

**Sanity project details:**

| Setting | Value |
|---------|-------|
| Project ID | `b3q3iq0h` |
| Dataset | `production` |
| API version | `2024-01-01` |

**Document types managed in Studio:**
- `portfolioProject` — title, slug, category, summary, description, tech stack, featured flag, image, live URL, order
- `portfolioTestimonial` — quote, author
- `portfolioTeam` — name, role, description, photo

**Adding project images:**
- Upload images directly in Sanity Studio using the image field — no file system access needed.
- Images are served from `cdn.sanity.io` and rendered with Next.js `<Image>` (domain is whitelisted in `next.config.mjs`).

## Data Flow

```
Sanity Cloud (hosted CMS)
  ↓ GROQ queries (lib/sanityFetch.ts)
app/page.tsx (Server Component)
  ↓ props
components/HomePageClient.tsx (Client Component — snap scroll, hooks)
  ↓ props
PortfolioSection / TeamSection / TestimonialsSection
```

Public reads use CDN caching (`useCdn: true`). `/work/[slug]` routes are pre-rendered at build time via `generateStaticParams` from Sanity slugs.

## Project Structure

```
app/
  page.tsx                          # Server Component — fetches Sanity data, renders HomePageClient
  studio/[[...tool]]/page.tsx       # Embedded Sanity Studio (dynamic, auth via Sanity account)
  work/
    page.tsx                        # All projects gallery — fetches from Sanity
    [slug]/page.tsx                 # Case study detail — static params from Sanity slugs
  contact/page.tsx                  # Contact page
components/
  HomePageClient.tsx                # 'use client' — snap scroll hooks, passes data to sections
  sections/
    IntroSplashSection.tsx          # Section 0 — NetworkCanvas + one-shot typewriter
    HeroSection.tsx                 # Section 1 — 120-particle canvas, blur-reveal headline
    ServicesSection.tsx             # Section 2 — Tech icon grid, dot grid background
    ProcessTimelineSection.tsx      # Section 3 — GSAP ScrollTrigger, internally scrollable
    PortfolioSection.tsx            # Section 4 — 3-col card grid, internally scrollable, projects prop
    TeamSection.tsx                 # Section 5 — Aurora background, team prop
    TestimonialsSection.tsx         # Section 6 — Marquee, aurora background, testimonials prop
    FinalCtaSection.tsx             # Section 7 — CTA + embedded footer
  ui/
    Navbar.tsx                      # Fixed navbar, hidden on intro, snap-nav on desktop
    Footer.tsx                      # Mobile only
    NetworkCanvas.tsx               # Particle system (configurable)
    DotGridBackground.tsx           # 18×11 pulsing dot grid
    AuroraBackground.tsx            # 3 drifting blur blobs
  SnapScrollContainer.tsx           # Desktop full-page snap wrapper
lib/
  sanity.ts                         # Sanity client config (useCdn: true, public reads)
  sanityFetch.ts                    # Typed GROQ fetch helpers: fetchProjects, fetchTeam, fetchTestimonials, etc.
  lenis.ts                          # Lenis smooth scroll factory (mobile only)
hooks/
  useSnapScroll.ts                  # Snap-scroll state + wheel/keyboard handlers
  useTypewriter.ts                  # Rotating typewriter state machine
sanity.config.ts                    # Sanity Studio schema (3 document types)
styles/
  globals.css                       # Dark root styles, keyframes
tailwind.config.ts                  # Color tokens, glow shadows
next.config.mjs                     # cdn.sanity.io remotePattern, reactStrictMode
types/
  index.ts                          # Project, Testimonial, TeamMember, Service interfaces
```

## Sections (desktop snap order)

| Index | Section | Background | Notes |
|-------|---------|------------|-------|
| 0 | IntroSplashSection | Network Graph | Cinematic intro, navbar hidden |
| 1 | HeroSection | Network Graph (enhanced) | 120 particles, rotating typewriter eyebrow |
| 2 | ServicesSection | Dot Grid Pulse | Tech icon grid |
| 3 | ProcessTimelineSection | Dot Grid Pulse (sticky) | GSAP, internally scrollable |
| 4 | PortfolioSection | — | 3-col card grid, internally scrollable, Sanity data |
| 5 | TeamSection | Aurora Blobs | Sanity data |
| 6 | TestimonialsSection | Aurora Blobs | Marquee, Sanity data |
| 7 | FinalCtaSection | Network Graph | CTA + embedded footer |

## Snap Scroll Architecture

Sections 3 and 4 scroll internally before the snap advances. `useSnapScroll` handles this via `internalScrollSections`:

```typescript
useSnapScroll({
  totalSections: 8,
  internalScrollSections: [
    { index: 3, panelRef: processTimelinePanelRef },
    { index: 4, panelRef: workPanelRef },
  ],
});
```

## Mobile vs Desktop Layout

The breakpoint is `min-width: 768px`.

| Concern | Desktop (≥ 768px) | Mobile (< 768px) |
|---------|-------------------|-------------------|
| Layout | SnapScrollContainer — 100dvh panels | Plain stacked sections |
| Section height | `h-full` resolves to 100dvh | `min-h-[100dvh]` |
| Process & Portfolio scroll | Internal scroller (`md:h-[100dvh] md:overflow-y-auto`) | Natural flow |
| GSAP scroller | Section element | `window` |

## Deployment (Vercel)

Deploy the repo to Vercel with no extra environment variables — public Sanity reads need no token. After deploying:

- `/studio` gives you a live content editing UI (log in with your Sanity account)
- Content changes in Sanity Studio are visible on the live site immediately (CDN-cached, no redeploy needed)
- `/work/[slug]` pages are statically generated at build time from Sanity data — add a new project in Studio and redeploy (or enable ISR) to generate its page

## Colour Tokens (Dark Theme)

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-bg-dark` | `#0F172A` | Page background |
| `text-primary-50` | `#F8FAFC` | Headings |
| `text-primary-300` | `#CBD5E1` | Body text |
| `text-accent-400` | `#60A5FA` | Highlights, eyebrows |
| `bg-accent-500` | `#3B82F6` | CTA buttons, glow |
| `border-neutral-700` | `#334155` | Card borders |
| `bg-neutral-900` | `#1E293B` | Card surfaces |
