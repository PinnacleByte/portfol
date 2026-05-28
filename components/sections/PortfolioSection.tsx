'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Project } from '@/types';

interface PortfolioSectionProps {
  scrollPanelRef?: React.RefObject<HTMLDivElement | null>;
  projects: Project[];
}

export default function PortfolioSection({ scrollPanelRef, projects }: PortfolioSectionProps) {
  const sorted = [...projects].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  return (
    <section
      id="work"
      ref={scrollPanelRef}
      className="bg-bg-dark relative md:h-[100dvh] md:overflow-y-auto"
    >
      {/* Sticky header — clears the fixed 57px navbar on mobile */}
      <div className="sticky top-[57px] md:top-0 z-10 bg-bg-dark/90 backdrop-blur-sm pt-16 pb-6 px-6 lg:px-16">
        <p className="text-xs font-semibold tracking-widest text-accent-400 uppercase mb-3">
          Our Work
        </p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary-50 text-balance">
          Projects we&apos;re proud of
        </h2>
      </div>

      {/* Cards grid */}
      <div className="px-6 lg:px-16 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: (index % 3) * 0.12 }}
      className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden
                 hover:border-accent-500/40 transition-colors group"
    >
      {/* Image area */}
      <div className="aspect-video bg-neutral-800 relative overflow-hidden">
        {project.image?.startsWith('/') || project.image?.startsWith('http') ? (
          <Image src={project.image} alt={project.title} fill style={{ objectFit: 'cover' }} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900
                          flex items-center justify-center">
            <span className="text-neutral-700 font-black text-8xl select-none">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <span className="text-xs font-semibold text-accent-400 bg-accent-500/10 px-3 py-1 rounded-full">
          {project.category}
        </span>
        <h3 className="text-lg font-bold text-primary-50 mt-3 mb-2">{project.title}</h3>
        <p className="text-sm text-primary-400 line-clamp-2 mb-4">{project.summary}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs bg-neutral-800 text-primary-300 px-2 py-0.5 rounded border border-neutral-700"
            >
              {t}
            </span>
          ))}
        </div>
        <a
          href={project.liveUrl ?? '#'}
          target={project.liveUrl ? '_blank' : undefined}
          rel={project.liveUrl ? 'noopener noreferrer' : undefined}
          className="text-sm text-accent-400 hover:text-accent-300 inline-flex items-center gap-1"
        >
          View case study →
        </a>
      </div>
    </motion.div>
  );
}
