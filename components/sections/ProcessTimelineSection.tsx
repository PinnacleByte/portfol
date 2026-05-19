'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from '@/components/ui/SectionHeading';
import DotGridBackground from '@/components/ui/DotGridBackground';

gsap.registerPlugin(ScrollTrigger);

interface ProcessTimelineSectionProps {
  scrollPanelRef?: React.RefObject<HTMLDivElement | null>;
}

const steps = [
  {
    title: 'Discovery Call',
    description: 'We understand your vision, goals, and technical requirements. This is where clarity begins.'
  },
  {
    title: 'Research & Strategy',
    description: 'Deep competitive analysis and strategic planning to position your product for success.'
  },
  {
    title: 'Design & Prototyping',
    description: 'Crafting beautiful, intuitive designs that translate your vision into interactive experiences.'
  },
  {
    title: 'Development',
    description: 'Building robust, scalable code with performance and maintainability as core principles.'
  },
  {
    title: 'Testing & Optimization',
    description: 'Rigorous testing and optimization to ensure every pixel and millisecond performs.'
  },
  {
    title: 'Handoff & Enablement',
    description: 'Smooth transition with comprehensive documentation and team training.'
  },
  {
    title: 'Partnership & Growth',
    description: 'Ongoing support and optimization as your digital product scales.'
  }
];

export default function ProcessTimelineSection({ scrollPanelRef }: ProcessTimelineSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const timeline = timelineRef.current;
    if (!section || !timeline) return;

    const cards = timeline.querySelectorAll('.timeline-card');
    const progressLine = timeline.querySelector('.progress-line') as HTMLElement;

    // Use the section as scroller for snap-scroll mode, or window for regular scroll
    const scroller = section;

    // Set GSAP defaults for this scroller
    ScrollTrigger.defaults({ scroller });

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            scroller,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 0.5,
            markers: false
          }
        }
      );

      gsap.to(card, {
        borderColor: 'rgba(59, 130, 246, 0.6)',
        duration: 0.4,
        scrollTrigger: {
          trigger: card,
          scroller,
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: true,
          markers: false
        }
      });
    });

    gsap.to(progressLine, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: timeline,
        scroller,
        start: 'top 30%',
        end: 'bottom 30%',
        scrub: 1,
        markers: false
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ScrollTrigger.defaults({ scroller: undefined });
    };
  }, []);

  return (
    <section
      id="process"
      ref={(el) => {
        if (el) {
          sectionRef.current = el;
          if (scrollPanelRef) {
            scrollPanelRef.current = el;
          }
        }
      }}
      style={{ overflowY: 'auto', height: '100dvh' }}
      className="relative bg-bg-dark"
    >
      {/* Sticky dot grid — stays in view while timeline content scrolls */}
      <div
        className="sticky top-0 overflow-hidden pointer-events-none"
        style={{ height: '100dvh', marginBottom: '-100dvh' }}
        aria-hidden="true"
      >
        <DotGridBackground />
      </div>

      <div className="container space-y-16 py-20 md:py-32" style={{ paddingBottom: '50vh' }}>
        <SectionHeading
          eyebrow="Our process"
          title="A thoughtful, premium process that keeps every project aligned."
          description="Each phase is carefully orchestrated to deliver clarity, momentum, and exceptional results."
        />

        <div ref={timelineRef} className="relative">
          {/* Vertical timeline track */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 md:w-1 bg-neutral-700 md:-translate-x-1/2">
            <div
              className="progress-line absolute left-0 top-0 w-full bg-gradient-to-b from-accent-500 to-accent-400 origin-top"
              style={{ height: '0%' }}
            />
          </div>

          {/* Timeline steps */}
          <div className="space-y-12 md:space-y-16 relative">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="timeline-card group"
              >
                <div className="flex gap-8 md:gap-12 items-start">
                  {/* Left side - content (alternates on desktop) */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:col-start-2 md:pl-12'}`}>
                    {/* Mobile and left-side number */}
                    <div className="flex items-center gap-4 md:hidden mb-4">
                      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent-500 bg-bg-dark text-accent-400 font-semibold text-sm shrink-0 shadow-teal-glow">
                        {index + 1}
                      </div>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-neutral-700 bg-neutral-900/50 backdrop-blur-sm p-6 md:p-8 transition-all duration-300 hover:border-accent-500/50 hover:shadow-teal-glow">
                      <h3 className="text-2xl md:text-3xl font-semibold text-primary-50 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-base md:text-lg text-primary-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Center marker (desktop only) */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-20 items-center justify-center">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-3 border-accent-500 bg-bg-dark font-bold text-accent-400 text-lg shadow-teal-glow-lg group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
