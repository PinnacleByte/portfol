'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import DotGridBackground from '@/components/ui/DotGridBackground';

interface ProcessTimelineSectionProps {
  scrollPanelRef?: React.RefObject<HTMLDivElement | null>;
}

const steps = [
  {
    title: 'Discovery Call',
    description:
      'We dig into your vision, goals, and constraints — and walk away with a razor-sharp brief everyone is aligned on.'
  },
  {
    title: 'Research & Strategy',
    description:
      'Competitor teardowns and market signals shape a strategy built to position you to win, not just ship.'
  },
  {
    title: 'Design & Prototyping',
    description:
      'Interactive, pixel-considered prototypes turn the strategy into something you can click, feel, and refine.'
  },
  {
    title: 'Development',
    description:
      'Clean, scalable code built for speed and longevity — no shortcuts that come back to bite you in six months.'
  },
  {
    title: 'Testing & Optimization',
    description:
      'We stress-test across devices and chase every millisecond until it is fast, accessible, and bulletproof.'
  },
  {
    title: 'Handoff & Enablement',
    description:
      'Clear documentation and hands-on training so your team owns the product with total confidence.'
  },
  {
    title: 'Partnership & Growth',
    description:
      'We stay in your corner — monitoring, iterating, and scaling as your product and audience grow.'
  }
];

export default function ProcessTimelineSection({ scrollPanelRef }: ProcessTimelineSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mq = window.matchMedia('(min-width: 768px)');
    let observer: IntersectionObserver | null = null;

    // Rebuild the observer whenever we cross the desktop/mobile breakpoint —
    // desktop scrolls inside the section (root = section), mobile uses the window (root = null).
    const build = () => {
      observer?.disconnect();
      const desktop = mq.matches;
      setIsDesktop(desktop);

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const idx = Number((entry.target as HTMLElement).dataset.stepIndex);
            if (!Number.isNaN(idx)) setActiveStep(idx);
          });
        },
        // A zero-height band at the vertical center: exactly one block crosses it at a time.
        { root: desktop ? section : null, rootMargin: '-50% 0px -50% 0px', threshold: 0 }
      );

      section.querySelectorAll('[data-step-index]').forEach((el) => observer!.observe(el));
    };

    build();
    mq.addEventListener('change', build);

    return () => {
      mq.removeEventListener('change', build);
      observer?.disconnect();
    };
  }, []);

  const goToStep = (i: number) => {
    sectionRef.current
      ?.querySelector(`[data-step-index="${i}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section
      id="process"
      ref={(el) => {
        if (el) {
          sectionRef.current = el as unknown as HTMLDivElement;
          if (scrollPanelRef) {
            scrollPanelRef.current = el as unknown as HTMLDivElement;
          }
        }
      }}
      className="relative bg-bg-dark md:h-[100dvh] md:overflow-y-auto"
    >
      {/* Sticky dot grid — stays in view while the content scrolls */}
      <div
        className="sticky top-0 overflow-hidden pointer-events-none"
        style={{ height: '100dvh', marginBottom: '-100dvh' }}
        aria-hidden="true"
      >
        <DotGridBackground />
      </div>

      <div className="relative mx-auto max-w-none px-6 lg:px-16 2xl:px-24">
        <div className="md:grid md:grid-cols-[18rem_minmax(0,1fr)] lg:grid-cols-[22rem_minmax(0,1fr)] md:gap-20 lg:gap-40 xl:gap-56">
          {/* ───────── Left rail (sticky on desktop) ───────── */}
          <div className="py-16 md:py-0 md:sticky md:top-0 md:h-[100dvh] md:flex md:flex-col md:justify-center">
            <p className="text-xs font-semibold tracking-widest text-accent-400 uppercase mb-3">
              Our process
            </p>
            <h2 className="text-3xl lg:text-4xl font-black text-primary-50 text-balance">
              From first call to lasting partnership.
            </h2>
            <p className="hidden md:block text-base text-primary-400 mt-4 leading-relaxed">
              Seven deliberate phases that keep every project aligned, on time, and unmistakably premium.
            </p>

            {/* Step nav — desktop only (blocks themselves carry the content on mobile) */}
            <nav className="hidden md:block mt-10">
              {steps.map((step, i) => {
                const active = i === activeStep;
                return (
                  <button
                    key={step.title}
                    onClick={() => goToStep(i)}
                    aria-current={active ? 'step' : undefined}
                    className="group flex w-full items-center gap-4 py-2 text-left"
                  >
                    <span
                      className={`text-xs font-mono tabular-nums transition-colors duration-300 ${
                        active ? 'text-accent-400' : 'text-primary-600'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`h-px transition-all duration-300 ${
                        active
                          ? 'w-8 bg-accent-500'
                          : 'w-3 bg-primary-700 group-hover:w-5 group-hover:bg-primary-500'
                      }`}
                    />
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
                        active ? 'text-primary-50' : 'text-primary-500 group-hover:text-primary-300'
                      }`}
                    >
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Progress bar — desktop only */}
            <div className="hidden md:flex items-center gap-4 mt-10">
              <div className="h-1 flex-1 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-400 transition-all duration-500 ease-out"
                  style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono tabular-nums text-primary-400">
                {String(activeStep + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* ───────── Right detail blocks (scroll driver) ───────── */}
          <div className="pb-24 md:pb-0">
            {steps.map((step, i) => {
              const active = i === activeStep;
              return (
                <div
                  key={step.title}
                  data-step-index={i}
                  className="step-trigger flex items-center border-t border-neutral-800/60 first:border-t-0 py-12 md:min-h-[70vh] md:border-t-0 md:py-0"
                  style={{
                    opacity: isDesktop && !active ? 0.35 : 1,
                    transition: 'opacity 0.4s ease'
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    <span className="block text-7xl md:text-8xl lg:text-9xl font-black leading-none text-accent-500/20 mb-6">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-50 mb-6 text-balance">
                      {step.title}
                    </h3>
                    <p className="text-xl md:text-2xl text-primary-300 leading-relaxed max-w-4xl">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
