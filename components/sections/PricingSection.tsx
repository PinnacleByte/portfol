'use client';

import { motion } from 'framer-motion';
import AuroraBackground from '@/components/ui/AuroraBackground';

// FinalCtaSection (#contact) position in HomePageClient's section order.
// Keep in sync if the section order changes.
const CONTACT_INDEX = 8;

interface PricingTier {
  name: string;
  price: string;
  cadence?: string;
  tagline: string;
  features: string[];
  featured?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$599',
    tagline: 'A sharp, fast site to get you online.',
    features: [
      '5-page website (Next.js or WordPress)',
      'Mobile responsive design',
      'Basic SEO setup',
      'Contact form integration',
      '1 round of revisions',
      'Delivery in 2 weeks',
    ],
  },
  {
    name: 'Growth',
    price: '$1,299',
    tagline: 'Custom design and motion that converts.',
    featured: true,
    features: [
      'Up to 10 pages with custom Figma design',
      'Animations & interactions (Framer Motion)',
      'SEO optimized structure',
      'CMS integration (edit your own content)',
      '2 rounds of revisions',
      'Delivery in 3–4 weeks',
    ],
  },
  {
    name: 'Premium',
    price: '$2,499',
    tagline: 'Full custom apps, stores, and dashboards.',
    features: [
      'Full custom Next.js or MERN application',
      'Complex features (auth, dashboards, ecommerce)',
      'Shopify store builds included',
      'Performance & Core Web Vitals optimization',
      '3 rounds of revisions + priority support',
      'Delivery in 5–6 weeks',
    ],
  },
];

const carePlan = {
  name: 'Care Plan',
  price: '$199',
  cadence: '/month',
  tagline: 'Keep your site fast, secure, and fresh — add to any package.',
  features: [
    'Monthly maintenance retainer',
    'Hosting & security management',
    'Monthly content updates',
    'Performance monitoring',
    'Priority response time',
  ],
};

// CTA styles mirror components/ui/Button.tsx variants so the section stays on-brand.
const CTA_BASE =
  'mt-5 inline-flex w-full items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark';
const CTA_PRIMARY =
  'bg-accent-500 text-bg-dark hover:bg-accent-600 shadow-teal-glow hover:shadow-teal-glow-lg';
const CTA_GHOST =
  'border border-accent-500/30 bg-transparent text-accent-400 hover:border-accent-500 hover:bg-accent-500/10';

interface PricingSectionProps {
  // Provided on desktop (snap-scroll) so the CTA jumps to the contact panel.
  // Undefined on mobile, where the CTA falls back to the #contact anchor.
  goTo?: (index: number) => void;
}

export default function PricingSection({ goTo }: PricingSectionProps) {
  return (
    <section
      id="pricing"
      className="relative flex flex-col justify-center bg-bg-dark min-h-[100dvh] md:h-full overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <AuroraBackground />

      <div className="container relative z-10 py-10 md:py-6">
        {/* Compact heading — kept tight so all tiers + add-on fit one 100dvh panel */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.36em] text-accent-400">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-primary-50 sm:text-4xl">
            Our Packages
          </h2>
          <p className="mt-3 text-base text-primary-300">
            Simple, transparent pricing for every stage of growth.
          </p>
        </div>

        {/* Three main tiers */}
        <div className="mx-auto mt-7 grid w-full max-w-6xl gap-5 md:grid-cols-3 md:gap-6">
          {tiers.map((tier, index) => (
            <TierCard key={tier.name} tier={tier} index={index} goTo={goTo} />
          ))}
        </div>

        {/* Add-on — full-width, dashed border to read as an extra */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.3 }}
          className="mx-auto mt-4 flex w-full max-w-6xl flex-col gap-5 rounded-2xl border border-dashed border-accent-500/40 bg-neutral-900/40 p-5 backdrop-blur-sm md:flex-row md:items-center md:gap-8"
        >
          <div className="md:w-1/4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-accent-400">
              {carePlan.name}
            </h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-black text-primary-50">{carePlan.price}</span>
              <span className="text-sm text-primary-400">{carePlan.cadence}</span>
            </div>
            <p className="mt-2 text-sm text-primary-400">{carePlan.tagline}</p>
          </div>

          <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 md:flex-1">
            {carePlan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-primary-300">
                <CheckIcon />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="md:shrink-0">
            <GetStartedButton goTo={goTo} label="Add Care Plan" className="md:w-auto md:px-6" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TierCard({
  tier,
  index,
  goTo,
}: {
  tier: PricingTier;
  index: number;
  goTo?: (index: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.1 }}
      className={`relative flex flex-col rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 ${
        tier.featured
          ? 'border-accent-500 bg-neutral-900/80 shadow-teal-glow-lg md:-translate-y-2'
          : 'border-neutral-700 bg-neutral-900/50 hover:border-accent-500/50 hover:shadow-teal-glow'
      }`}
    >
      {tier.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-bg-dark shadow-teal-glow">
          Most Popular
        </span>
      )}

      <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-accent-400">
        {tier.name}
      </h3>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-black text-primary-50">{tier.price}</span>
        {tier.cadence && <span className="text-sm text-primary-400">{tier.cadence}</span>}
      </div>
      <p className="mt-2 text-sm text-primary-400">{tier.tagline}</p>

      <ul className="mt-4 flex-1 space-y-2">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-primary-300">
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <GetStartedButton featured={tier.featured} goTo={goTo} />
    </motion.div>
  );
}

function GetStartedButton({
  featured,
  goTo,
  label = 'Get Started',
  className = '',
}: {
  featured?: boolean;
  goTo?: (index: number) => void;
  label?: string;
  className?: string;
}) {
  const classes = `${CTA_BASE} ${featured ? CTA_PRIMARY : CTA_GHOST} ${className}`;

  // Desktop: snap to the contact panel. Mobile: plain anchor (no goTo prop).
  if (goTo) {
    return (
      <button type="button" onClick={() => goTo(CONTACT_INDEX)} className={classes}>
        {label}
      </button>
    );
  }
  return (
    <a href="#contact" className={classes}>
      {label}
    </a>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0 text-accent-400"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
