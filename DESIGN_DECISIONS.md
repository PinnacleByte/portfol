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

## Mobile Responsive Strategy

The breakpoint that switches between the snap deck and a stacked page is `min-width: 768px` — Tailwind's `md:` prefix. Below it, every section becomes a normal block that flows in document order.

**Section heights — `min-h-[100dvh] md:h-full`**

On desktop, each section is wrapped in a 100dvh panel inside SnapScrollContainer, so `h-full` resolves correctly. On mobile there is no parent height — `<main>` flows naturally — so a bare `h-full` collapses to content height and sections shrink-wrap. Symptoms: the intro splash compresses to a thin strip; adjacent sections overlap. The fix is two-step: `min-h-[100dvh]` guarantees each mobile section is at least one viewport tall, and `md:h-full` preserves the desktop snap behavior. This pattern applies to every section that previously used a bare `h-full`.

**Sections 3 & 4 drop their internal scroller on mobile**

ProcessTimeline and Portfolio are 100dvh internal scrollers on desktop — the snap-scroll system relies on this to detect edge escapes. On mobile, the same pattern would mean users only ever see one timeline step or one portfolio card before having to discover an internal scroll gesture. So the inline `height: 100dvh; overflow-y: auto` was replaced with `md:h-[100dvh] md:overflow-y-auto` — desktop keeps the internal scroller, mobile flows naturally.

**GSAP scroller selection follows the section**

`ProcessTimelineSection` uses GSAP ScrollTrigger to animate timeline cards in. The scroller has to match whatever is actually scrolling: `isDesktop ? sectionRef.current : window`. Without this swap the cards stay at `opacity: 0` on mobile because GSAP is listening to a non-scrolling element.

**Fixed navbar clearance**

The navbar is `position: fixed` at 57px tall. A mobile-only `<div h-[57px]>` spacer at the top of `<main>` pushes the first section below the bar. For elements that anchor to viewport top after the first section — anchor-link targets, sticky headers — use `scroll-mt-16` (or `sticky top-[57px] md:top-0`) so they clear the navbar.

**Responsive marquee card width**

The testimonials marquee uses fixed-pixel card widths because the seamless infinite-loop translation distance is computed from card width + gap. Card width is responsive (`280 / 320 / 384`) and `scrollDistance` is recomputed via state + resize listener, so the loop seam stays clean across breakpoints.

**Tech icon tile background**

Some brand icons (Tailwind cyan, CSS3 blue, Docker blue) have low contrast against the navy background and the `tech-stack-icons` library's `dark`/`grayscale` variants don't help — they're either the same brand color or a flat gray. Solution: wrap every icon in a uniform `bg-neutral-900/50 border` tile. Treats every icon the same and gives dim ones a contrasting backdrop without per-icon styling.

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
