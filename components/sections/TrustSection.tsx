'use client';

import { motion } from 'framer-motion';
import { Hammer, MessagesSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import AuroraBackground from '@/components/ui/AuroraBackground';

// FinalCtaSection (#contact) position in HomePageClient's section order.
// Keep in sync if the section order changes (mirrors PricingSection).
const CONTACT_INDEX = 8;

interface TrustCard {
  icon: typeof Hammer;
  title: string;
  description: string;
}

const cards: TrustCard[] = [
  {
    icon: Hammer,
    title: 'Craft over credentials',
    description:
      "Every project in our portfolio was built to the same standard we'd hold a paying client's work to. No shortcuts, no filler.",
  },
  {
    icon: MessagesSquare,
    title: 'Direct access, always',
    description:
      'You work with the founders — not a project manager or an account exec. Every decision, every call, straight to us.',
  },
  {
    icon: ShieldCheck,
    title: 'Built to earn your trust',
    description:
      "We're building our reputation one project at a time. That means your project gets our full attention, not divided focus.",
  },
];

interface TrustSectionProps {
  // Provided on desktop (snap-scroll) so the CTA jumps to the contact panel.
  // Undefined on mobile, where the CTA falls back to the #contact anchor.
  goTo?: (index: number) => void;
}

export default function TrustSection({ goTo }: TrustSectionProps) {
  return (
    <section className="relative flex flex-col justify-center bg-bg-dark min-h-[100dvh] md:h-full overflow-hidden px-4 sm:px-6 lg:px-8">
      <AuroraBackground />

      <div className="container relative z-10 py-16 md:py-20">
        {/* Heading */}
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-sm uppercase tracking-[0.36em] text-accent-400">
            New Studio, Honest Foundations
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-primary-50 sm:text-5xl">
            Fresh studio. Proven craft.
          </h2>
          <p className="mt-4 text-lg leading-8 text-primary-300">
            We&rsquo;re new &mdash; and we own it. What we bring instead is sharp technical skill,
            genuine care, and work that speaks louder than any review.
          </p>
        </motion.div>

        {/* Trust cards */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.1 }}
              className="group rounded-2xl border border-neutral-700 bg-neutral-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent-500/50 hover:shadow-teal-glow md:p-8"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
                <card.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-semibold text-primary-50">{card.title}</h3>
              <p className="mt-3 leading-7 text-primary-300">{card.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mx-auto mt-10 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.3 }}
        >
          <p className="text-lg text-primary-200">
            Be one of our first clients &mdash; and get founder-level attention on every detail.
          </p>
          <div className="mt-6 flex justify-center">
            <StartConversationButton goTo={goTo} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StartConversationButton({ goTo }: { goTo?: (index: number) => void }) {
  const classes =
    'inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-7 py-3 text-sm font-semibold text-bg-dark shadow-teal-glow transition hover:bg-accent-600 hover:shadow-teal-glow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark';

  // Desktop: snap to the contact panel. Mobile: plain #contact anchor (no goTo prop).
  if (goTo) {
    return (
      <button type="button" onClick={() => goTo(CONTACT_INDEX)} className={classes}>
        Start a conversation
        <ArrowRight className="h-4 w-4" />
      </button>
    );
  }
  return (
    <a href="#contact" className={classes}>
      Start a conversation
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}
