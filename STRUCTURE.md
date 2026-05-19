# Project Structure Guide

## Overview

PinnacleByte portfolio — Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Framer Motion, GSAP, dark Navy + Electric Blue theme.

## Directory Breakdown

### `/app` — Pages & Routing

```
app/
  layout.tsx            # Root layout — LenisProvider wrapper, global metadata
  page.tsx              # Homepage — snap scroll (desktop) / stacked sections (mobile)
  contact/page.tsx      # Contact page
  work/
    page.tsx            # All projects gallery
    [slug]/page.tsx     # Case study detail
  admin/
    page.tsx            # Redirects → /admin/projects
    layout.tsx          # Dashboard shell: sidebar nav + sign out
    login/page.tsx      # Password gate (useActionState)
    projects/
      page.tsx          # List + reorder
      new/page.tsx      # Add project form
      [slug]/page.tsx   # Edit project form
    testimonials/
      page.tsx / new/page.tsx / [id]/page.tsx
    team/
      page.tsx / new/page.tsx / [id]/page.tsx
```

### `/components/ui` — Shared Primitives

| File | Purpose |
|------|---------|
| `Navbar.tsx` | Fixed top nav. `visible` prop hides it on intro section. Desktop: `goTo()` buttons. Mobile: `<a href="#id">` anchors. |
| `Footer.tsx` | Mobile-only footer (desktop has embedded footer in FinalCtaSection) |
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
| `ProcessTimelineSection.tsx` | 3 — Timeline | GSAP ScrollTrigger, internally scrollable, sticky dot grid |
| `PortfolioSection.tsx` | 4 — Portfolio | 3-col card grid, internally scrollable, `<Image>` with path validation |
| `TeamSection.tsx` | 5 — Team | Aurora background, data from `data/team.ts` |
| `TestimonialsSection.tsx` | 6 — Testimonials | Marquee, aurora background, data from `data/testimonials.ts` |
| `FinalCtaSection.tsx` | 7 — CTA | 60-particle canvas, embedded footer bar |

### `/components/admin` — Dashboard Forms (all `'use client'`)

| File | Purpose |
|------|---------|
| `ProjectForm.tsx` | `useActionState` form — title, category, summary, description, tech, image URL, liveUrl, order, featured |
| `TestimonialForm.tsx` | Quote + author fields |
| `TeamForm.tsx` | Name, role, description, photo URL |
| `DeleteButton.tsx` | `useTransition` + `confirm()` — must be a Client Component |

### `/actions` — Server Actions (all `'use server'`)

| File | Exports |
|------|---------|
| `auth.ts` | `login`, `logout`, `getSession` |
| `projects.ts` | `createProject`, `updateProject`, `deleteProject`, `reorderProject` |
| `testimonials.ts` | `createTestimonial`, `updateTestimonial`, `deleteTestimonial` |
| `team.ts` | `createTeamMember`, `updateTeamMember`, `deleteTeamMember` |

### `/data` — Content Layer

```
data/
  db/
    projects.json       # Source of truth — written by dashboard server actions
    testimonials.json   # Source of truth
    team.json           # Source of truth
  projects.ts           # Re-exports db/projects.json as typed Project[]
  testimonials.ts       # Re-exports db/testimonials.json as typed Testimonial[]
  team.ts               # Re-exports db/team.json as typed TeamMember[]
```

### `/lib`

| File | Purpose |
|------|---------|
| `db.ts` | Server-only. `readProjects / writeProjects`, `readTestimonials / writeTestimonials`, `readTeam / writeTeam` via `fs/promises` |
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
  images/               # Project images — reference as /images/filename.png in dashboard
```

### Root files

| File | Purpose |
|------|---------|
| `proxy.ts` | Auth guard for all `/admin/*` routes (Next.js 16 convention — replaces `middleware.ts`) |
| `tailwind.config.ts` | Color tokens, glow shadows |
| `next.config.mjs` | `reactStrictMode: true` |
| `tsconfig.json` | `moduleResolution: bundler`, `resolveJsonModule: true`, TypeScript 6 |

## Adding Project Images

1. Place the image in `public/images/` (e.g. `public/images/my-project.png`)
2. In the admin dashboard Image URL field, enter `/images/my-project.png`
3. External hosted images also work — use the full `https://` URL
4. Invalid paths (no leading `/`, bare filename) are silently ignored; a numbered placeholder is shown instead

## Deployment (Vercel)

- Public site ✅ — static assets in `public/` are served correctly
- Admin reads ✅ — JSON files are read at request time
- Admin writes ❌ — `fs.writeFile` doesn't persist on Vercel's read-only filesystem

**Workaround:** edit `data/db/*.json` locally and redeploy.  
**Proper fix:** replace `lib/db.ts` with a database (Vercel Postgres, Supabase, etc.) — the server actions and admin UI need no other changes.

## Key Styling Conventions

- Background: `bg-bg-dark` (`#0F172A`)
- Headings: `text-primary-50` (`#F8FAFC`)
- Body: `text-primary-300` (`#CBD5E1`)
- Accent: `text-accent-400` / `bg-accent-500` (Electric Blue `#3B82F6` / `#60A5FA`)
- Cards: `bg-neutral-900` border `border-neutral-700`
- Section padding: `px-6 lg:px-16`
