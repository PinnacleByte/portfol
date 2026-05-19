# PinnacleByte Portfolio

Premium dark-themed web development studio portfolio with energetic animations and a built-in content dashboard.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS** — Dark Navy + Electric Blue theme
- **Framer Motion** — entrance animations, aurora backgrounds, full-page snap scroll
- **GSAP + ScrollTrigger** — ProcessTimeline scroll-synchronised animations
- **Canvas** — NetworkCanvas particle system with animated connectors

## Quick Start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
```

## Admin Dashboard

The dashboard lives at `/admin`. It requires a password stored in `.env.local`:

```bash
# .env.local
ADMIN_PASSWORD=your-password-here
```

Navigate to `http://localhost:3000/admin` → login page → full CRUD for Projects, Testimonials, and Team members.

**How data flows:**
- All content is stored in `data/db/*.json` (source of truth)
- `data/projects.ts`, `data/testimonials.ts`, `data/team.ts` re-export from JSON — used by public-facing components
- Dashboard server actions (`actions/`) read/write the JSON files directly via `lib/db.ts`
- On Vercel: commit the updated JSON files and redeploy to publish changes

> **Vercel limitation:** The dashboard's write operations (`fs.writeFile`) do not persist on Vercel — the serverless filesystem is read-only. Edits made through the dashboard will work locally but won't survive a redeploy. For persistent production editing, swap `lib/db.ts` for a database (e.g. Vercel Postgres, Supabase).

**Project images:**
- Place image files in the `public/images/` folder (e.g. `public/images/my-project.png`)
- Set the Image URL field in the dashboard to `/images/my-project.png` (must start with `/`)
- External images also work — use the full `https://` URL
- Any other format (relative path without `/`, bare filename) will be silently ignored and the numbered placeholder shown instead

## Project Structure

```
app/
  page.tsx                          # Homepage — snap scroll (desktop) / stacked (mobile)
  admin/
    login/page.tsx                  # Password gate
    layout.tsx                      # Shared sidebar (Projects / Testimonials / Team / Sign out)
    page.tsx                        # Redirects to /admin/projects
    projects/
      page.tsx                      # Project list + reorder
      new/page.tsx                  # Add project form
      [slug]/page.tsx               # Edit project form
    testimonials/
      page.tsx                      # Testimonials list
      new/page.tsx                  # Add testimonial form
      [id]/page.tsx                 # Edit testimonial form
    team/
      page.tsx                      # Team list
      new/page.tsx                  # Add team member form
      [id]/page.tsx                 # Edit team member form
  work/
    page.tsx                        # All projects gallery
    [slug]/page.tsx                 # Case study detail page
actions/
  auth.ts                           # login / logout server actions
  projects.ts                       # create / update / delete / reorder
  testimonials.ts                   # create / update / delete
  team.ts                           # create / update / delete
components/
  admin/
    ProjectForm.tsx                 # Client form (useActionState)
    TestimonialForm.tsx             # Client form
    TeamForm.tsx                    # Client form
    DeleteButton.tsx                # Client confirm + delete
  image/
    hero.png                        # Hero illustration (transparent PNG)
  sections/
    IntroSplashSection.tsx          # Cinematic intro — NetworkCanvas bg + single-phrase typewriter
    HeroSection.tsx                 # Two-column hero with word-by-word animations
    ServicesSection.tsx             # Tech stack icon grid + dot grid background
    ProcessTimelineSection.tsx      # GSAP scroll-driven timeline (7 steps) + dot grid background
    PortfolioSection.tsx            # 3-col card grid, internally scrollable (same pattern as ProcessTimeline)
    TeamSection.tsx                 # Aurora blob background, data from data/team.ts
    TestimonialsSection.tsx         # Marquee + aurora blob background, data from data/testimonials.ts
    FinalCtaSection.tsx             # Full-bleed CTA + network graph background + embedded footer
  ui/
    Navbar.tsx                      # Fixed navbar, hidden on intro, snap-nav on desktop
    Button.tsx
    Footer.tsx                      # Mobile only
    DotGridBackground.tsx           # 18×11 pulsing dot grid (CSS animation, shared)
    AuroraBackground.tsx            # 3 drifting blur blobs (Framer Motion, shared)
    NetworkCanvas.tsx               # Particle system with connectors (configurable, shared)
  SnapScrollContainer.tsx           # Desktop full-page snap wrapper
data/
  db/
    projects.json                   # Source of truth — written by dashboard
    testimonials.json               # Source of truth — written by dashboard
    team.json                       # Source of truth — written by dashboard
  projects.ts                       # Re-exports from db/projects.json
  testimonials.ts                   # Re-exports from db/testimonials.json
  team.ts                           # Re-exports from db/team.json
hooks/
  useSnapScroll.ts                  # Snap-scroll state + wheel/keyboard handlers
  useTypewriter.ts                  # Rotating typewriter effect (state machine)
lib/
  db.ts                             # Server-side readX / writeX helpers (fs/promises)
proxy.ts                            # Protects all /admin/* routes (Next.js 16 convention)
styles/
  globals.css                       # Dark root styles, dotPulse + cursorBlink keyframes
tailwind.config.ts                  # Color tokens, glow shadows
types/
  index.ts                          # Project, Testimonial, TeamMember, Service interfaces
```

## Sections (desktop snap order)

| Index | Section | Background | Notes |
|-------|---------|------------|-------|
| 0 | IntroSplashSection | Network Graph | Cinematic intro, single-phrase typewriter, navbar hidden |
| 1 | HeroSection | Network Graph (enhanced) | 120 particles, prominent connections, rotating typewriter eyebrow |
| 2 | ServicesSection | Dot Grid Pulse | Tech icon grid, whileInView animations |
| 3 | ProcessTimelineSection | Dot Grid Pulse (sticky) | GSAP, internally scrollable, 7 steps |
| 4 | PortfolioSection | — | 3-col card grid, internally scrollable, data-driven from projects.json |
| 5 | TeamSection | Aurora Blobs | Data from data/team.ts |
| 6 | TestimonialsSection | Aurora Blobs | Marquee, data from data/testimonials.ts |
| 7 | FinalCtaSection | Network Graph | 60 particles, CTA + embedded footer |

## Snap Scroll Architecture

Sections 3 and 4 (ProcessTimeline, Portfolio) scroll internally before the snap advances. `useSnapScroll` handles this via `internalScrollSections`:

```typescript
useSnapScroll({
  totalSections: 8,
  internalScrollSections: [
    { index: 3, panelRef: processTimelinePanelRef },
    { index: 4, panelRef: workPanelRef },
  ],
});
```

`SnapScrollContainer` sets `overflow: auto` on panels at indices `[3, 4]` and `overflow: hidden` on all others.

## Animated Backgrounds

**Dot Grid Pulse** (`DotGridBackground.tsx`)
18×11 grid of dots. CSS `dotPulse` keyframe with delay computed from distance to centre — outward ripple. Zero JS runtime cost. Used with `sticky top-0` + `marginBottom: -100dvh` in ProcessTimeline so the grid stays visible while content scrolls.

**Aurora Blobs** (`AuroraBackground.tsx`)
Three large blurred Framer Motion divs (`blur-[110–140px]`) in blue, sky, and violet tints. Independent drift loops (16/22/19s).

**Network Graph** (`NetworkCanvas.tsx`)
Configurable canvas component: `particleCount`, `connectionRadius`, `particleSize`, `particleAlpha`, `lineAlpha`, `speed`.

| Section | Particles | Radius | Feel |
|---------|-----------|--------|------|
| IntroSplash | 100 | 180px | Dramatic |
| Hero | 120 | 180px | Most energetic |
| FinalCta | 60 | 155px | Subtle |

## Key Behaviours

**Full-page snap scroll (desktop only)**
Each wheel tick or arrow key advances one section. 700ms cubic-bezier `[0.76, 0, 0.24, 1]` transition. Sections 3 and 4 scroll internally before advancing. 750ms throttle prevents rapid jumps.

**Navbar**
`position: fixed` — out of document flow so every section panel fills `100dvh`. On mobile a `57px` spacer div fills the gap below the bar. On desktop, hidden (`opacity: 0, pointerEvents: none`) while on intro (index 0), fades in from index 1 via `visible` prop.

**Animations**
- HeroSection: `animate` (fires on load). Headline words blur-reveal with 90ms stagger.
- Other sections: `whileInView` + `once: true` (fires when panel snaps into view).
- Tech icons: spring physics (`stiffness: 220, damping: 18`).
- Background blobs: always-on `animate` loops.

## Tech Stack Icons

From [tech-stack-icons](https://www.tech-stack-icons.com/) npm package (v3.7.1, MIT):
- **Frontend** (7): React, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind
- **Backend & Platforms** (6): Node.js, Express, MongoDB, Docker, PostgreSQL, Shopify
- **Design & Tools** (2): Figma, Git

Next.js and Express use `dark` variant. Shopify uses a custom SVG (`/public/icons/shopify.svg`).

## Colour Tokens (Dark Theme)

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-bg-dark` | `#0F172A` | Page background (dark navy) |
| `text-primary-50` | `#F8FAFC` | Headings & text |
| `text-primary-300` | `#CBD5E1` | Body / nav links |
| `text-accent-400` | `#60A5FA` | Highlights, eyebrows |
| `bg-accent-500` | `#3B82F6` | CTA buttons, glow |
| `bg-accent-600` | `#2563EB` | Button hover, focus |
| `border-neutral-700` | `#334155` | Card borders |
| `bg-neutral-900` | `#1E293B` | Card surfaces |
