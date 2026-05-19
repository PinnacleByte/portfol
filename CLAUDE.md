# Claude.md - Project Reference for Future Conversations

## Project Overview

**PinnacleByte Portfolio** — Premium dark-themed web development studio portfolio using Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion, and GSAP. Includes a built-in password-protected admin dashboard for managing projects, testimonials, and team members.

## Current Status — May 2026 (updated)

✅ **Intro Splash Section** — NetworkCanvas bg, one-shot typewriter, navbar hidden on section 0  
✅ **Hero Section** — 120-particle NetworkCanvas, rotating typewriter eyebrow, two-column layout  
✅ **Services Section** — Tech icon grid (real brand icons), dot grid background  
✅ **Process Timeline** — GSAP ScrollTrigger, 7 steps, internally scrollable, sticky dot grid  
✅ **Portfolio Section** — 3-column card grid, internally scrollable (replaced carousel)  
✅ **Team Section** — Aurora blobs, data from `data/team.ts` → `data/db/team.json`  
✅ **Testimonials Section** — Marquee, aurora blobs, data from `data/testimonials.ts` → `data/db/testimonials.json`  
✅ **Final CTA Section** — Full-bleed, 60-particle NetworkCanvas, embedded footer  
✅ **Full-Page Snap Scroll** — Desktop-only, 700ms transition, internal scroll for sections 3 & 4  
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
- **Same pattern as ProcessTimelineSection**: `<section id="work" ref={scrollPanelRef} style={{ height: '100dvh', overflowY: 'auto' }}>`
- Sticky header: `sticky top-0 z-10 bg-bg-dark/90 backdrop-blur-sm`
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, sorted by `project.order`
- Card: image area (`aspect-video`, placeholder shows 01/02/03 if no image), category badge, title, summary (`line-clamp-2`), tech pills, "View case study →"
- Animations: `whileInView once:true`, stagger `(index % 3) * 0.12`
- Data: `import { projects } from '@/data/projects'`

### ProcessTimelineSection.tsx ⭐⭐
- Uses GSAP ScrollTrigger with `scroller = sectionRef.current`
- `scrollPanelRef` prop — section element IS the scroller (`height: 100dvh, overflow-y: auto`)
- `paddingBottom: '50vh'` on inner container so last step scrolls into view
- Sticky dot grid: `sticky top-0 h-[100dvh]` + `marginBottom: -100dvh`
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
- 15 technologies across 3 groups with flanking `1px` horizontal rules

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

**Mobile Fallback**: Normal vertical scroll, Lenis smooth scrolling, `Footer.tsx` visible, all snap hooks disabled.

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
- Variants: `light` (default), `dark` (Next.js, Express), `grayscale`
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

**Last Updated**: May 2026 (proxy.ts migration, image URL validation, Vercel write caveat)  
**Dark Theme (Navy + Electric Blue)**: ✅  
**Animated Backgrounds**: ✅ (dot grid, aurora blobs, network canvas)  
**Full-Page Snap Scroll**: ✅ (sections 3 & 4 internally scrollable via `internalScrollSections[]`)  
**Portfolio Section**: ✅ (3-col card grid, replaced carousel)  
**Admin Dashboard**: ✅ (password gate, CRUD for projects / testimonials / team, JSON data layer)  
**Next Task**: Add real project images and flesh out case study pages
