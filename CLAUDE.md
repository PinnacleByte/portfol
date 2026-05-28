# Claude.md - Project Reference for Future Conversations

## Project Overview

**PinnacleByte Portfolio** — Premium dark-themed web development studio portfolio using Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion, GSAP, and Sanity v3 CMS. Content managed via Sanity Studio embedded at `/studio`.

## Current Status — May 2026 (updated)

✅ **Intro Splash Section** — NetworkCanvas bg, one-shot typewriter, navbar hidden on section 0  
✅ **Hero Section** — 120-particle NetworkCanvas, rotating typewriter eyebrow, two-column layout  
✅ **Services Section** — Tech icon grid (real brand icons w/ tile background), dot grid background  
✅ **Process Timeline** — GSAP ScrollTrigger, 7 steps, internally scrollable on desktop / natural flow on mobile, sticky dot grid  
✅ **Portfolio Section** — 3-column card grid, internally scrollable on desktop / natural flow on mobile  
✅ **Team Section** — Aurora blobs, data from Sanity (`portfolioTeam`)  
✅ **Testimonials Section** — Marquee with responsive card widths, aurora blobs, data from Sanity (`portfolioTestimonial`)  
✅ **Final CTA Section** — Full-bleed, 60-particle NetworkCanvas, embedded footer  
✅ **Full-Page Snap Scroll** — Desktop-only (`min-width: 768px`), 700ms transition, internal scroll for sections 3 & 4  
✅ **Mobile Responsive Layout** — All sections use `min-h-[100dvh] md:h-full`; sections 3 & 4 drop internal-scroll on mobile and flow naturally  
✅ **Sanity CMS** — All content in Sanity Cloud (project `b3q3iq0h`, dataset `production`); Studio embedded at `/studio`  
✅ **Data Layer** — `lib/sanityFetch.ts` GROQ helpers; `app/page.tsx` async server component; sections receive data as props  

## Sanity CMS Architecture

### Setup
No environment variables required for public reads — the dataset is public.

Content is managed at `http://localhost:3000/studio` (dev) or `https://yoursite.com/studio` (production). Authenticate with your Sanity account (project owner/member).

### Data Flow
```
Sanity Cloud (project b3q3iq0h, dataset production)
  ↓  GROQ queries — lib/sanityFetch.ts
app/page.tsx  [async Server Component]
  ├─ fetchProjects()      → projects: Project[]
  ├─ fetchTestimonials()  → testimonials: Testimonial[]
  └─ fetchTeam()          → team: TeamMember[]
  ↓  props
components/HomePageClient.tsx  ['use client' — hooks, snap scroll]
  ├─ PortfolioSection    (projects prop)
  ├─ TeamSection         (team prop)
  └─ TestimonialsSection (testimonials prop)
```

`/work/[slug]` — `fetchProjectBySlug(slug)` directly in the server component; `generateStaticParams` calls `fetchAllSlugs()` for static pre-rendering.

### lib/sanity.ts
```typescript
createClient({ projectId: 'b3q3iq0h', dataset: 'production', apiVersion: '2024-01-01', useCdn: true })
```

### lib/sanityFetch.ts
Typed async GROQ helpers — replace all former `readX()` calls:
- `fetchProjects()` — all projects ordered by `order` asc, image URL resolved inline
- `fetchTestimonials()` — all testimonials, `_id` mapped to `id`
- `fetchTeam()` — all team members, `_id` mapped to `id`, photo URL resolved inline
- `fetchProjectBySlug(slug)` — single project by slug
- `fetchAllSlugs()` — array of slug strings for `generateStaticParams`

GROQ queries flatten Sanity types to match existing TypeScript interfaces (no transformation needed):
```groq
*[_type == "portfolioProject"] | order(order asc) {
  "slug": slug.current, title, category, ..., "image": image.asset->url
}
```

### sanity.config.ts
Defines three document types for the embedded Studio:
- `portfolioProject` — title, slug, category, summary, description, tech[], featured, image, liveUrl, order
- `portfolioTestimonial` — quote, author
- `portfolioTeam` — name, role, description, photo

### Embedded Studio — `app/studio/[[...tool]]/page.tsx`
`'use client'` — renders `<NextStudio config={config} />` from `next-sanity/studio`. Marked `dynamic = 'force-dynamic'`. Authentication is handled by Sanity — only project members can edit.

## Color Palette — Navy + Electric Blue (Dark Theme)

| Element | Hex | Tailwind Token |
|---------|-----|----------------|
| Background | #0F172A | `bg-bg-dark` |
| Card Surface | #1E293B | `bg-neutral-900` |
| Primary Text | #F8FAFC | `text-primary-50` |
| Body Text | #CBD5E1 | `text-primary-300` |
| Muted Text | #94A3B8 | `text-primary-400` |
| Accent (Blue) | #3B82F6 | `bg-accent-500`, `text-accent-500` |
| Accent Light | #60A5FA | `text-accent-400` |
| Accent Dark | #2563EB | `bg-accent-600` |
| Card Border | #334155 | `border-neutral-700` |

**Token flip strategy**: class names in all components unchanged — only token values in `tailwind.config.ts` were set to dark values.

## Key Components

### HeroSection.tsx ⭐
- Two-column grid (`lg:grid-cols-2`) — text left, `hero.png` right
- NetworkCanvas: 120 particles, 180px radius, 2.5px size, 0.45 alpha, 0.35 line alpha, 0.55 speed
- Eyebrow: `useTypewriter` hook, 3 rotating phrases, 600ms start delay
- H1: word-by-word blur-reveal, 90ms stagger, `blur(10px)→0` + `y: 36→0`
- Hero image: slides from right `x: 48→0` + blur dissolve, delay 0.4s

### IntroSplashSection.tsx ⭐ (section 0)
- NetworkCanvas: 100 particles, 180px radius, 0.3 line alpha
- One-shot typewriter via inline `useEffect` (NOT `useTypewriter`) — `LINE_ONE` white + `LINE_TWO` accent blue
- `isComplete` state drives scroll hint with bouncing `↓` arrow
- Navbar hidden while on this section (`visible={currentIndex > 0}` from page.tsx)

### PortfolioSection.tsx ⭐ (section 4)
- **Same pattern as ProcessTimelineSection**: `<section id="work" ref={scrollPanelRef} className="bg-bg-dark relative md:h-[100dvh] md:overflow-y-auto">`
- Internal scroll is **desktop-only** (`md:` prefix) — mobile grows naturally with content
- Sticky header: `sticky top-[57px] md:top-0 z-10 bg-bg-dark/90 backdrop-blur-sm` — `top-[57px]` clears the fixed navbar on mobile
- H2: `text-2xl sm:text-3xl lg:text-4xl text-balance` so mobile doesn't orphan "of"
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, sorted by `project.order`
- Card: image area (`aspect-video`, placeholder shows 01/02/03 if no image), category badge, title, summary (`line-clamp-2`), tech pills, "View case study →"
- Animations: `whileInView once:true`, stagger `(index % 3) * 0.12`
- Data: receives `projects: Project[]` prop from `HomePageClient` (fetched from Sanity in `app/page.tsx`)

### ProcessTimelineSection.tsx ⭐⭐
- Uses GSAP ScrollTrigger; **scroller is breakpoint-aware**:
  ```typescript
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  const scroller = isDesktop ? sectionRef.current : window;
  ```
  On desktop the section is the internal scroller; on mobile the section flows naturally and GSAP listens to window scroll.
- Section className: `md:h-[100dvh] md:overflow-y-auto` (inline style removed) — internal scroll is desktop-only
- `scrollPanelRef` prop — passed through so `useSnapScroll`'s edge-detection still sees the section as the scroll target on desktop
- `paddingBottom: '50vh'` on inner container so last step scrolls into view (creates ~400px dead space on mobile — known minor issue)
- Sticky dot grid: `sticky top-0 h-[100dvh]` + `marginBottom: -100dvh` (works on both window scroll and section scroll)
- **Critical cleanup**: `ScrollTrigger.getAll().forEach(t => t.kill())` + `ScrollTrigger.defaults({ scroller: undefined })` in `useEffect` return

### SnapScrollContainer.tsx ⭐⭐
- `INTERNAL_SCROLL_INDICES = [3, 4]` — panels at these indices get `overflow: auto`; all others `overflow: hidden`
- Framer Motion translates inner div by `-currentIndex * 100dvh`
- 700ms transition with cubic-bezier `[0.76, 0, 0.24, 1]`
- Returns children unwrapped on mobile

### useSnapScroll.ts ⭐⭐⭐
**Props**:
```typescript
interface UseSnapScrollProps {
  totalSections: number;
  internalScrollSections: { index: number; panelRef: React.RefObject<HTMLDivElement | null> }[];
}
```
**Wheel handler logic**: finds the matching `internalScrollSections` entry for `currentIndex`; if found, checks `scrollTop` at top/bottom before allowing snap navigation. No `#work` early-return (was removed when carousel was replaced).

**Returns**: `{ currentIndex, goTo, isDesktop, isTransitioning }`

### app/page.tsx ⭐⭐ (async Server Component)
```typescript
export default async function HomePage() {
  const [projects, testimonials, team] = await Promise.all([
    fetchProjects(), fetchTestimonials(), fetchTeam(),
  ]);
  return <HomePageClient projects={projects} testimonials={testimonials} team={team} />;
}
```
Fetches all Sanity data in parallel, passes to `HomePageClient`.

### components/HomePageClient.tsx ⭐⭐ (`'use client'`)
Contains all interactive homepage logic extracted from the former `app/page.tsx`:
```typescript
const processTimelinePanelRef = useRef<HTMLDivElement | null>(null);
const workPanelRef = useRef<HTMLDivElement | null>(null);
const { currentIndex, goTo, isDesktop } = useSnapScroll({ ... });
const sections = [/* single array used for both mobile and desktop */];
```
- Mobile: `<Navbar />` + `<div h-[57px]>` spacer + `{sections}` + `<Footer />`
- Desktop: `<Navbar goTo={goTo} visible={currentIndex > 0} />` + `<SnapScrollContainer>`
- Receives `projects`, `testimonials`, `team` props and passes them down to sections

### ServicesSection.tsx
- Tech items defined in `groups` array inside the file (not from `data/db`)
- `TechIcon` wrapper handles both StackIcon (npm) and custom SVGs
- Icons wrapped in a uniform tile: `bg-neutral-900/50 border border-neutral-800/70 rounded-2xl p-3` — gives dim brand icons (Tailwind cyan, CSS3 blue, Docker blue) a contrasting backdrop on the navy bg
- 15 technologies across 3 groups with flanking `1px` horizontal rules
- Section uses `scroll-mt-16 py-20 md:py-0` so anchor scrolls clear the fixed navbar and content has breathing room on mobile
- H2: `text-4xl sm:text-5xl md:text-6xl` — smaller on narrow screens so "Technologies & Tools." fits without ugly wrap

### TestimonialsSection.tsx
- Card width is **responsive** via `useEffect` + resize listener: 280px (<640), 320px (640–767), 384px (≥768)
- `scrollDistance` recomputed from current `cardWidth` so the infinite-loop seam stays clean across breakpoints: `-(testimonials.length * (cardWidth + 24))`
- Card padding: `p-6 md:p-8` (narrower on mobile to give the smaller cards proportional spacing)
- Marquee wrapper has `overflow-hidden`; aurora blob background

### NetworkCanvas.tsx ⭐ (reusable)
Configurable props: `particleCount` (60), `connectionRadius` (155), `particleSize` (1.5), `particleAlpha` (0.3), `lineAlpha` (0.18), `speed` (0.45)

| Section | particleCount | connectionRadius | lineAlpha |
|---------|--------------|-----------------|-----------|
| IntroSplash | 100 | 180 | 0.30 |
| Hero | 120 | 180 | 0.35 |
| FinalCta | 60 (default) | 155 (default) | 0.18 (default) |

### Navbar.tsx
- `fixed top-0 left-0 right-0 z-50`
- `visible` prop (default `true`): `animate={{ opacity, y }}` + `style={{ pointerEvents }}`
- Nav indices: Logo→1, About→2, Process→3, Work→4, Team→5, Contact→7
- "Start a Project" → `goTo(7)`
- Mobile: `<a href="#id">` anchors. Desktop: `<button>` calling `goTo(index)`

## Data Types (`types/index.ts`)

```typescript
interface Project {
  slug: string;
  title: string;
  category: 'Custom Apps' | 'Shopify' | 'WordPress';
  summary: string;
  description: string;
  tech: string[];
  featured: boolean;
  image?: string;    // URL or /public path
  liveUrl?: string;
  order?: number;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;  // "Name, Role at Company"
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  photo?: string;
}
```

## Critical Files

```
sanity.config.ts                                     # Sanity Studio schema (3 document types)
lib/sanity.ts                                        # Sanity client config (useCdn: true, public reads)
lib/sanityFetch.ts                                   # Typed GROQ helpers: fetchProjects, fetchTestimonials, fetchTeam, fetchProjectBySlug, fetchAllSlugs
app/page.tsx                                         # Async Server Component — fetches Sanity data, renders HomePageClient
app/studio/[[...tool]]/page.tsx                      # Embedded Sanity Studio route
components/HomePageClient.tsx                        # 'use client' — snap scroll hooks, sections array, passes data props
types/index.ts                                       # Project, Testimonial, TeamMember, Service
styles/globals.css                                   # Dark root styles, dotPulse + cursorBlink keyframes
tailwind.config.ts                                   # Color tokens, glow shadows
next.config.mjs                                      # cdn.sanity.io remotePattern, reactStrictMode
components/SnapScrollContainer.tsx                   # INTERNAL_SCROLL_INDICES = [3, 4]
hooks/useSnapScroll.ts                               # internalScrollSections[] generalization
hooks/useTypewriter.ts                               # Rotating typewriter (4-phase state machine)
components/ui/Navbar.tsx                             # visible prop, goTo(), nav indices
components/ui/NetworkCanvas.tsx                      # Configurable canvas particle system
components/ui/DotGridBackground.tsx                  # CSS dot grid pulse
components/ui/AuroraBackground.tsx                   # Framer Motion aurora blobs
components/sections/IntroSplashSection.tsx           # Section 0 — one-shot typewriter
components/sections/HeroSection.tsx                  # Section 1 — energetic 120-particle canvas
components/sections/ServicesSection.tsx              # Section 2 — tech icon grid
components/sections/ProcessTimelineSection.tsx       # Section 3 — GSAP, internally scrollable
components/sections/PortfolioSection.tsx             # Section 4 — 3-col card grid, internally scrollable, projects prop
components/sections/TeamSection.tsx                  # Section 5 — team prop
components/sections/TestimonialsSection.tsx          # Section 6 — testimonials prop
components/sections/FinalCtaSection.tsx              # Section 7 — CTA + embedded footer
public/icons/shopify.svg                             # Custom Shopify icon
```

## Snap-Scroll Desktop Architecture

**Section Panel Order (0-indexed)**:

| Index | Section | Overflow | Notes |
|-------|---------|----------|-------|
| 0 | IntroSplashSection | hidden | Navbar hidden (`visible={currentIndex > 0}`) |
| 1 | HeroSection | hidden | |
| 2 | ServicesSection | hidden | |
| 3 | ProcessTimelineSection | **auto** | GSAP scroller = section element |
| 4 | PortfolioSection | **auto** | scrollPanelRef, same escape pattern |
| 5 | TeamSection | hidden | |
| 6 | TestimonialsSection | hidden | |
| 7 | FinalCtaSection | hidden | Embedded footer bar |

**Mobile Fallback** (`< 768px`): Normal vertical scroll, Lenis smooth scrolling, `Footer.tsx` visible, all snap hooks disabled. Section sizing & internal-scroll quirks:

- **All sections use `min-h-[100dvh] md:h-full`** — on desktop they live inside SnapScrollContainer's `100dvh` panels (so `h-full` resolves to 100dvh). On mobile they have no defined parent height, so `min-h-[100dvh]` ensures each section is at least one viewport tall and can grow with content.
- **Sections 3 & 4 drop internal-scroll on mobile**: their `100dvh + overflow-y: auto` is gated behind `md:` so on mobile they flow naturally (otherwise users would only see one timeline step or one portfolio card with no indication to scroll inside).
- **ProcessTimelineSection GSAP** picks scroller by breakpoint: `isDesktop ? section : window`. Desktop = section is the scroller; mobile = window scrolls naturally and GSAP listens to it.
- **Sticky headers** that should sit below the fixed navbar on mobile use `sticky top-[57px] md:top-0` (PortfolioSection's "Our Work" header).

## Known Issues & Fixes

| Issue | Fix |
|-------|-----|
| Hydration mismatch | No `Math.random()` in render/module scope; canvas/random OK in `useEffect` only |
| Timeline not animating | Register ScrollTrigger; `ScrollTrigger.defaults({ scroller })`; cleanup in `useEffect` return |
| Timeline wheel scroll not working | Check scroll position BEFORE `preventDefault()` to allow internal scroll |
| Dot grid scrolls away in ProcessTimeline | Sticky wrapper: `sticky top-0 h-[100dvh]` + `marginBottom: -100dvh` |
| Sections clipped at bottom | Navbar is `fixed` (not `sticky`) so sections get full `100dvh` |
| Content hidden under fixed navbar (mobile) | `<div className="h-[57px]" />` spacer after `<Navbar />` in mobile path |
| Hero image shows box outline | Transparent PNG — don't wrap in `ring-*` or `rounded overflow-hidden` |
| Stale `.next` type errors after deleting routes | Delete `.next/` and rebuild — auto-generated route types reference deleted pages |
| `<Image>` crash on invalid src | `PortfolioSection` guards src: only renders `<Image>` if path starts with `/` or `https://`. Bad paths fall back to numbered placeholder |
| Sanity image not showing | Upload via Studio image field. URL is served from `cdn.sanity.io` — whitelisted in `next.config.mjs`. GROQ query uses `image.asset->url` projection |
| Splash compressed to top on mobile / sections overlap | Fix: `min-h-[100dvh] md:h-full` on sections |
| Only one Process step / one Portfolio card visible on mobile | Fix: `md:h-[100dvh] md:overflow-y-auto` — drops internal scroller on mobile |
| Process timeline GSAP cards never appear on mobile | Fix: `scroller = isDesktop ? section : window` |
| Testimonial cards wider than viewport on mobile (cut off) | Fix: responsive card width via state, `scrollDistance` recomputed from current width |
| Sticky section headers covered by fixed navbar on mobile | Fix: `sticky top-[57px] md:top-0` |
| Tech icon brand colors blend into dark bg | Fix: wrap each icon in `bg-neutral-900/50 border` tile |
| Services H2 overflows narrow viewports | Fix: `text-4xl sm:text-5xl md:text-6xl` |
| Portfolio H2 orphan "of" wrap at 360 | Fix: `text-2xl sm:text-3xl lg:text-4xl text-balance` |
| Two footers stacked on mobile | Fix: `hidden md:block` on FinalCtaSection's embedded footer bar |
| `/work/[slug]` not regenerated after new Sanity content | Static pages built from `generateStaticParams` — redeploy or add `next: { revalidate: 60 }` in `fetchProjectBySlug` for ISR |

## Animation Guidelines

- **Load animations** (HeroSection): `animate` — fires on mount
- **Snap-scroll sections**: `whileInView` + `viewport={{ once: true }}` — fires when panel slides into snap viewport
- **Internal-scroll sections** (ProcessTimeline, Portfolio): `whileInView once:true` — fires as user scrolls within the panel
- **Background animations**: always-on `animate` loops (not viewport-gated)
- **Word-by-word text reveals**: map to `motion.span` with `inline-block mr-[0.22em]`, stagger `delay`
- **Blur dissolve**: `initial={{ filter: 'blur(10px)' }} animate={{ filter: 'blur(0px)' }}` + `opacity` + `y`
- **Spring icons**: `transition={{ type: 'spring', stiffness: 220, damping: 18 }}`
- **Durations**: 0.55s–0.8s; easing `easeOut`

## Tech Icons Implementation

**Real brand icons** from [tech-stack-icons](https://www.tech-stack-icons.com/) npm package (MIT, v3.7.1).
- `TechIcon` wrapper handles both StackIcon and custom SVGs
- Variants: `light` (default), `dark` (Next.js, Express), `grayscale` — note: the lib's `dark` variant is monochrome only for some logos; for colored brand icons (Tailwind, CSS3, Docker) all variants are still brand colors
- **Tile background on icon wrapper**: every icon is wrapped in `bg-neutral-900/50 border border-neutral-800/70 rounded-2xl p-3` so low-contrast brand icons (cyan Tailwind, blue CSS3, blue Docker) read clearly against navy
- Custom: Shopify from `/public/icons/shopify.svg` (Simple Icons format)

## Installation & Quick Start

```bash
npm install        # Includes gsap, tech-stack-icons, @sanity/client, next-sanity
npm run dev        # Dev server on :3000
npm run build
npm run start
```

No `.env.local` required for public reads — Sanity dataset is public.

## Future Enhancements

- Flesh out `/app/work/[slug]/` with project-specific content (use Sanity `description` and additional fields)
- Contact form with server action + email (Resend / Nodemailer)
- ProcessTimeline SVG redesign: branching connector lines, animated `strokeDashoffset`
- ISR for `/work/[slug]` — add `next: { revalidate: 60 }` to `fetchProjectBySlug` so new projects appear without redeploying
- Sanity webhook → Vercel Deploy Hook for automatic redeploys on content publish

---

**Last Updated**: May 2026 (Sanity v3 CMS migration — replaced JSON data layer and custom admin with Sanity Cloud + embedded Studio at `/studio`)  
**Dark Theme (Navy + Electric Blue)**: ✅  
**Animated Backgrounds**: ✅ (dot grid, aurora blobs, network canvas)  
**Full-Page Snap Scroll**: ✅ (sections 3 & 4 internally scrollable via `internalScrollSections[]`)  
**Portfolio Section**: ✅ (3-col card grid, Sanity data)  
**Content Management**: ✅ (Sanity Studio at `/studio`, no local edits or GitHub pushes needed)  
**Next Task**: Flesh out case study pages with full Sanity content; consider ISR or deploy hooks for instant content updates
