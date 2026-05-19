'use client';

import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/types';

const categories = ['All', 'Custom Apps', 'Shopify', 'WordPress'] as const;

type Category = (typeof categories)[number];

interface WorkGalleryProps {
  projects: Project[];
}

export default function WorkGallery({ projects }: WorkGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filteredProjects = useMemo(
    () => (activeCategory === 'All' ? projects : projects.filter((project) => project.category === activeCategory)),
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
                ? 'border-accent-500 bg-accent-50 text-accent-700'
                : 'border-neutral-300 bg-white text-neutral-700 hover:border-accent-500 hover:text-primary-900'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => (
          <article key={project.slug} className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
            <div className="h-52 bg-neutral-100" />
            <div className="space-y-4 p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-accent-500">{project.category}</p>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-primary-900">{project.title}</h3>
                <p className="text-neutral-600 leading-7">{project.summary}</p>
              </div>
              <a className="inline-flex items-center gap-2 text-sm font-semibold text-accent-500" href={`/work/${project.slug}`}>
                View case study
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
