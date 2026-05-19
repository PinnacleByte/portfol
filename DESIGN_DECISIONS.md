# Design Decisions

This repository is built for PinnacleByte with a premium studio feel.

## Color Palette

The palette is Electric Blue on deep navy — chosen to feel technical, premium, and modern without being flashy.

- Deep navy `#0F172A` (`bg-bg-dark`) as the base — darker than typical charcoal, gives a space-like depth
- `primary` scale (slate) for text: `#F8FAFC` headings, `#CBD5E1` body, `#94A3B8` muted labels
- Electric Blue `#3B82F6` (`accent-500`) for CTAs, highlights, glow effects, and interactive states. Light variant `#60A5FA` (`accent-400`) for eyebrows and inline accents
- `neutral-700/800/900` for borders and card surfaces — subtle, never harsh
- Ambient glow blobs (`bg-accent-500/8` with `blur-[130px]`) add depth without adding visual noise

## Typography

Inter (sans-serif) for all UI — clean, highly legible, and widely used in modern SaaS and studio sites. Strong hierarchical contrast through weight (`font-semibold` / `font-bold`) and size jumps rather than mixing typefaces. Tracking (`tracking-[0.32em]`) on eyebrow labels creates premium spacing.

## Motion Philosophy

All animations use Framer Motion. The guiding principle: **reveal, don't just appear**.

- **Word-by-word blur reveals**: headlines split into individual `motion.span` elements, each animating `opacity`, `y`, and `filter: blur()` with a stagger. Creates a sense that text is materialising rather than jumping in.
- **Blur dissolve** (`blur(10px) → blur(0px)` paired with `opacity 0→1`): used on all major text entrances; feels high-end and intentional.
- **Spring physics on icons**: `type: 'spring', stiffness: 220, damping: 18` gives tech icons a natural, bouncy settle — subtle but tactile.
- **Cubic-bezier `[0.25, 0.4, 0.55, 1]`** on text reveals: accelerates quickly then eases gently, giving a snappy but not jarring feel.
- **Load vs scroll animations**: HeroSection uses `animate` (fires on mount). All other sections use `whileInView` with `once: true` (fires once when the section slides into the snap viewport).
- **GSAP ScrollTrigger** is reserved for ProcessTimelineSection only — it needs scroll-position-synchronised card reveals that Framer Motion `whileInView` cannot handle precisely.

## Navbar Architecture

The navbar is `position: fixed` (not sticky). This is intentional:

- `sticky` places the element in document flow and reduces available height for the snap-scroll container. With a `57px` navbar, sections would be clipped by `57px` at the bottom.
- `fixed` takes the navbar out of flow — the snap container starts at `y=0` and each panel fills a clean `100dvh`.
- A `h-[57px]` spacer div is added in the mobile layout path only, since the mobile page scrolls normally and needs the space reserved.

## Hero Section Layout

Two-column grid (`lg:grid-cols-2`) on desktop: text content left, illustration right. The hero image (`components/image/hero.png`) is a transparent-background PNG and must float directly on the dark section — **do not wrap it in a bordered or rounded container**, or the transparent areas will show a box outline.

## Full-Page Snap Scroll

Desktop-only. All sections live in the DOM simultaneously (no mount/unmount). Framer Motion translates the inner stack by `-currentIndex * 100dvh`. Benefits:

- GSAP ScrollTrigger in ProcessTimelineSection can register once and persist (no re-registration on nav)
- Carousel state is preserved when navigating away and back
- Section animations using `whileInView` fire naturally when the panel translates into the viewport

The trade-off: all section JS runs immediately. This is acceptable for a portfolio with 7 sections.

## Why next/image for Static Assets

Local PNG/JPG imports via `next/image` give automatic width/height (no layout shift), WebP/AVIF conversion at build time, and lazy loading by default. Hero image uses `priority` to skip lazy loading since it's above the fold.

## Architecture Choices

- App Router is the Next.js standard for new projects.
- `components/ui/` — reusable primitives (Button, Navbar, Footer)
- `components/sections/` — page-specific layout sections
- `components/image/` — static assets imported directly (e.g. `hero.png`)
- `public/images/` — project images referenced by URL in the admin dashboard (must start with `/`)
- `hooks/` — custom hooks (`useSnapScroll`)
- `lib/` — reserved for shared motion variants and scroll helpers
- `data/` — reserved for content-driven items (projects, testimonials)
