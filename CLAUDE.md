# Claude.md - Project Reference for Future Conversations

## Project Overview

**PinnacleByte Portfolio** — Premium dark-themed web development studio portfolio using Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion, and GSAP. Includes a built-in password-protected admin dashboard for managing projects, testimonials, and team members.

## Current Status — May 2026 (updated)

✅ **Intro Splash Section** — NetworkCanvas bg, one-shot typewriter, navbar hidden on section 0  
✅ **Hero Section** — 120-particle NetworkCanvas, rotating typewriter eyebrow, two-column layout  
✅ **Services Section** — Tech icon grid (real brand icons w/ tile background), dot grid background  
✅ **Process Timeline** — GSAP ScrollTrigger, 7 steps, internally scrollable on desktop / natural flow on mobile, sticky dot grid  
✅ **Portfolio Section** — 3-column card grid, internally scrollable on desktop / natural flow on mobile  
✅ **Team Section** — Aurora blobs, data from `data/team.ts` → `data/db/team.json`  
✅ **Testimonials Section** — Marquee with responsive card widths, aurora blobs, data from `data/testimonials.ts` → `data/db/testimonials.json`  
✅ **Final CTA Section** — Full-bleed, 60-particle NetworkCanvas, embedded footer  
✅ **Full-Page Snap Scroll** — Desktop-only (`min-width: 768px`), 700ms transition, internal scroll for sections 3 & 4  
✅ **Mobile Responsive Layout** — All sections use `min-h-[100dvh] md:h-full`; sections 3 & 4 drop internal-scroll on mobile and flow naturally  
✅ **Admin Dashboard** — `/admin`, password gate, full CRUD for projects / testimonials / team  
✅ **Data Layer** — All content in `data/db/*.json`, server actions write via `lib/db.ts`  

## Admin Dashboard Architecture

### Setup
Add to `.env.local`:
```
ADMIN_PASSWORD=your-password-here
```
Access at `http://localhost:3000/admin`. `proxy.ts` (Next.js 16 convention, replaces `middleware.ts`) protects all `/admin/*` routes.

### Data Flow
```
data/db/projects.json        ← written by dashboard server actions
data/db/testimonials.json    ← written by dashboard server actions
data/db/team.json            ← written by dashboard server actions
       ↓ (JSON import at bundle time, resolveJsonModule: true)
data/projects.ts             ← used by public site, /work, /work/[slug]
data/testimonials.ts         ← used by TestimonialsSection
data/team.ts                 ← used by TeamSection
```
On Vercel: commit the JSON files and redeploy to publish changes (filesystem resets on deploy).

### Auth
- `actions/auth.ts` — `login()` checks `process.env.ADMIN_PASSWORD`, sets httpOnly cookie `admin_session` (7-day TTL)
- `middleware.ts` — redirects unauthenticated `/admin/*` to `/admin/login`; redirects authenticated users away from `/admin/login`
- `logout()` deletes the cookie and redirects to `/admin/login`

### Server Actions (`actions/`)
All `'use server'`:
- `actions/projects.ts` — `createProject`, `updateProject(slug)`, `deleteProject(slug)`, `reorderProject(slug, direction)`
- `actions/testimonials.ts` — `createTestimonial`, `updateTestimonial(id)`, `deleteTestimonial(id)`
- `actions/team.ts` — `createTeamMember`, `updateTeamMember(id)`, `deleteTeamMember(id)`

All write actions call `revalidatePath('/')` then `redirect('/admin/<entity>')` on success.

### lib/db.ts
Server-only module using `fs/promises`. Exports:
```typescript
readProjects() / writeProjects(data)
readTestimonials() / writeTestimonials(data)
readTeam() / writeTeam(data)
```
JSON files located at `path.join(process.cwd(), 'data', 'db', '<entity>.json')`.

### Admin Pages
```
app/admin/
  login/page.tsx            # 'use client', useActionState(login)
  layout.tsx                # Sidebar nav, server component, logout form action
  page.tsx                  # redirect('/admin/projects')
  projects/
    page.tsx                # Server: readProjects(), list with reorder buttons
    new/page.tsx            # Server: <ProjectForm action={createProject} />
    [slug]/page.tsx         # Server: reads project, <ProjectForm action={updateProject.bind(null, slug)} />
  testimonials/             # Same pattern
  team/                     # Same pattern
```

### Admin Components (`components/admin/`)
All `'use client'`:
- `ProjectForm.tsx` — `useActionState`, fields: title, category, summary, description, tech (CSV), image URL, liveUrl, order, featured
- `TestimonialForm.tsx` — quote + author fields
- `TeamForm.tsx` — name, role, description, photo URL
- `DeleteButton.tsx` — `useTransition` + `confirm()` dialog; calls bound server action. Must be a Client Component — event handlers cannot be passed from Server Component props.

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
- Data: `import { projects } from '@/data/projects'`

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

### page.tsx ⭐⭐
```typescript
const processTimelinePanelRef = useRef<HTMLDivElement | null>(null);
const workPanelRef = useRef<HTMLDivElement | null>(null);

const { currentIndex, goTo, isDesktop } = useSnapScroll({
  totalSections: 8,
  internalScrollSections: [
    { index: 3, panelRef: processTimelinePanelRef },
    { index: 4, panelRef: workPanelRef },
  ],
});

const sections = [/* single array used for both mobile and desktop */];
```
- Mobile: `<Navbar />` + `<div h-[57px]>` spacer + `{sections}` + `<Footer />`
- Desktop: `<Navbar goTo={goTo} visible={currentIndex > 0} />` + `<SnapScrollContainer>`

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
proxy.ts                                             # Auth guard for /admin/* (Next.js 16: proxy.ts replaces middleware.ts)
app/page.tsx                                         # Homepage, unified sections[], snap scroll wiring
app/admin/layout.tsx                                 # Dashboard sidebar + nav
actions/auth.ts                                      # login / logout server actions
actions/projects.ts                                  # Project CRUD + reorder
actions/testimonials.ts                              # Testimonial CRUD
actions/team.ts                                      # Team CRUD
lib/db.ts                                            # Server-side fs read/write helpers
data/db/projects.json                                # Projects source of truth
data/db/testimonials.json                            # Testimonials source of truth
data/db/team.json                                    # Team source of truth
data/projects.ts                                     # Re-exports JSON as typed Project[]
data/testimonials.ts                                 # Re-exports JSON as typed Testimonial[]
data/team.ts                                         # Re-exports JSON as typed TeamMember[]
types/index.ts                                       # Project, Testimonial, TeamMember, Service
styles/globals.css                                   # Dark root styles, dotPulse + cursorBlink keyframes
tailwind.config.ts                                   # Color tokens, glow shadows
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
components/sections/PortfolioSection.tsx             # Section 4 — 3-col card grid, internally scrollable
components/sections/TeamSection.tsx                  # Section 5 — imports from data/team
components/sections/TestimonialsSection.tsx          # Section 6 — imports from data/testimonials
components/sections/FinalCtaSection.tsx              # Section 7 — CTA + embedded footer
components/admin/ProjectForm.tsx                     # Dashboard project form (client)
components/admin/TestimonialForm.tsx                 # Dashboard testimonial form (client)
components/admin/TeamForm.tsx                        # Dashboard team form (client)
components/admin/DeleteButton.tsx                    # Confirm + delete (client, useTransition)
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
| "Event handlers cannot be passed to Client Component" | Delete buttons must live in a `'use client'` component — use `DeleteButton.tsx` |
| `#work` wheel early-return broke Portfolio escape | Removed — was only needed for old carousel. `internalScrollSections` handles everything |
| Hydration mismatch | No `Math.random()` in render/module scope; canvas/random OK in `useEffect` only |
| Timeline not animating | Register ScrollTrigger; `ScrollTrigger.defaults({ scroller })`; cleanup in `useEffect` return |
| Timeline wheel scroll not working | Check scroll position BEFORE `preventDefault()` to allow internal scroll |
| Dot grid scrolls away in ProcessTimeline | Sticky wrapper: `sticky top-0 h-[100dvh]` + `marginBottom: -100dvh` |
| Sections clipped at bottom | Navbar is `fixed` (not `sticky`) so sections get full `100dvh` |
| Content hidden under fixed navbar (mobile) | `<div className="h-[57px]" />` spacer after `<Navbar />` in mobile path |
| Hero image shows box outline | Transparent PNG — don't wrap in `ring-*` or `rounded overflow-hidden` |
| Admin sub-routes (new/edit) returning 404 | Next.js 16 + stale `.next` cache. Fix: rename `middleware.ts` → `proxy.ts` (export default function proxy), delete `.next`, restart dev server |
| `<Image>` crash on invalid src | `PortfolioSection` guards src: only renders `<Image>` if path starts with `/` or `https://`. Bad paths fall back to numbered placeholder |
| Project image not showing | File must be in `public/images/`. Dashboard Image URL must start with `/` (e.g. `/images/burger.png`) or be a full `https://` URL |
| Admin writes don't persist on Vercel | Vercel filesystem is read-only. `fs.writeFile` works locally but not in production. Fix: edit JSON files + redeploy, or migrate to a database |
| Splash compressed to top on mobile / sections overlap | Sections used bare `h-full` but mobile `<main>` had no defined height → `h-full` resolved to `auto` and sections shrink-wrapped. Fix: `min-h-[100dvh] md:h-full` on Intro/Services/Team/Testimonials/CTA |
| Only one Process step / one Portfolio card visible on mobile | Sections had inline `style={{ height: '100dvh', overflowY: 'auto' }}` creating a viewport-sized internal scroller. Fix: replace inline style with `md:h-[100dvh] md:overflow-y-auto` class so mobile uses natural flow |
| Process timeline GSAP cards never appear on mobile | GSAP `scroller` was hardcoded to `sectionRef.current`, but on mobile the section is no longer a scroller. Fix: `scroller = isDesktop ? section : window` |
| Testimonial cards wider than viewport on mobile (cut off) | Hardcoded `w-96` (384px) > 360/412 viewport. Fix: responsive card width via state, `scrollDistance` recomputed from current width |
| Sticky section headers covered by fixed navbar on mobile | PortfolioSection's sticky header stuck to `top: 0` which is the navbar's territory on mobile. Fix: `sticky top-[57px] md:top-0` |
| Tech icon brand colors blend into dark bg | Brand colors (Tailwind cyan, CSS3 blue, Docker blue) have low contrast on navy and the lib's `dark`/`grayscale` variants don't help. Fix: wrap each icon in a `bg-neutral-900/50 border` tile so all icons have uniform tile backdrop |
| Services H2 "Technologies & Tools." overflows narrow viewports | `text-5xl` (48px) too big at 360/412. Fix: `text-4xl sm:text-5xl md:text-6xl` |
| Portfolio H2 orphan "of" wrap at 360 | "Projects we're proud of" wraps as "Projects we're proud / of". Fix: `text-2xl sm:text-3xl lg:text-4xl text-balance` |
| Two footers stacked on mobile | FinalCtaSection's embedded "minimal footer bar" rendered on mobile in addition to the dedicated `<Footer />` from `app/page.tsx`. Fix: `hidden md:block` on the embedded bar — desktop snap panel keeps it, mobile shows only the proper Footer.tsx |

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
npm install        # Includes gsap, tech-stack-icons
npm run dev        # Dev server on :3000
npm run build
npm run start
```

```env
# .env.local — required for admin
ADMIN_PASSWORD=your-password-here
```

## Future Enhancements

- Real project images (add via dashboard image URL field → appears in PortfolioSection cards)
- Flesh out `/app/work/[slug]/` with project-specific content (add fields to `Project` type and JSON)
- Contact form with server action + email (Resend / Nodemailer)
- ProcessTimeline SVG redesign: branching connector lines, animated `strokeDashoffset`
- CMS migration: replace JSON files with Sanity or Contentful for hosted editing without redeploy

---

**Last Updated**: May 2026 (mobile responsive pass — section heights, GSAP mobile scroller, responsive testimonial marquee, sticky-header navbar clearance, services title overflow, icon tile backgrounds, portfolio H2 text-balance)  
**Dark Theme (Navy + Electric Blue)**: ✅  
**Animated Backgrounds**: ✅ (dot grid, aurora blobs, network canvas)  
**Full-Page Snap Scroll**: ✅ (sections 3 & 4 internally scrollable via `internalScrollSections[]`)  
**Portfolio Section**: ✅ (3-col card grid, replaced carousel)  
**Admin Dashboard**: ✅ (password gate, CRUD for projects / testimonials / team, JSON data layer)  
**Next Task**: Add real project images and flesh out case study pages
