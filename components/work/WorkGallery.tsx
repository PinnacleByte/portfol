'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/types';

const categories = ['All', 'Custom Apps', 'Shopify', 'WordPress'] as const;

type Category = (typeof categories)[number];

interface WorkGalleryProps {
  projects: Project[];
}

// Only render <Image> for paths next/image can resolve; everything else falls
// back to the numbered placeholder (mirrors PortfolioSection's guard).
function hasValidImage(src?: string): src is string {
  return !!src && (src.startsWith('/') || src.startsWith('http'));
}

export default function WorkGallery({ projects }: WorkGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filteredProjects = useMemo(
    () =>
      activeCategory === 'All'
        ? projects
        : projects.filter((project) => project.category === activeCategory),
    [activeCategory, projects]
  );

  return (
    <section className="mt-12 space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              activeCategory === category
                ? 'border-accent-500 bg-accent-500/10 text-accent-300 shadow-teal-glow'
                : 'border-neutral-700 bg-neutral-900/50 text-primary-300 hover:border-accent-500/50 hover:text-accent-400'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <p className="text-primary-400">No projects in this category yet.</p>
      ) : (
        // Re-key on category so cards re-reveal when the filter changes.
        <div key={activeCategory} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: (index % 3) * 0.1 }}
      className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-accent-500/50 hover:shadow-teal-glow-lg"
    >
      <Link href={`/work/${project.slug}`} className="block">
        {/* Cover image — real Sanity asset, with numbered fallback */}
        <div className="relative aspect-video overflow-hidden bg-neutral-800">
          {hasValidImage(project.image) ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
              <span className="select-none text-7xl font-black text-neutral-700 transition-transform duration-500 ease-out group-hover:scale-110">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="space-y-3 p-6">
          <span className="inline-block rounded-full bg-accent-500/10 px-3 py-1 text-xs font-semibold text-accent-400">
            {project.category}
          </span>
          <h3 className="text-xl font-semibold text-primary-50">{project.title}</h3>
          <p className="line-clamp-2 leading-7 text-primary-400">{project.summary}</p>
          <span className="inline-flex items-center gap-2 pt-1 text-sm font-semibold text-accent-400 transition-colors group-hover:text-accent-300">
            View case study
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
