'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { projects } from '@/data/projects';
import { Project } from '@/types';
import { ArrowRight } from 'lucide-react';

const categories = ['All', 'Custom Apps', 'Shopify', 'WordPress'];

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="group overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900/50 shadow-soft transition-all duration-300 hover:border-accent-500/50 hover:shadow-teal-glow"
    >
      <div className="h-52 bg-neutral-800" />
      <div className="space-y-4 p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-accent-400">{project.category}</p>
        <h3 className="text-2xl font-semibold text-primary-50">{project.title}</h3>
        <p className="text-primary-300 leading-7">{project.summary}</p>
        <a className="inline-flex items-center gap-2 text-sm font-semibold text-accent-400 hover:text-accent-300 transition" href={`/work/${project.slug}`}>
          View case study
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </motion.article>
  );
}

export default function SelectedWorkSection() {
  return (
    <section id="work" className="bg-bg-dark py-20 md:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Selected work"
          title="Featured projects built with care across web applications, commerce, and content platforms."
          description="The portfolio highlights a curated set of projects that reflect quality, performance, and a premium digital presence."
        />

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {categories.map((category) => (
            <button key={category} className="rounded-full border border-neutral-700 bg-neutral-900/50 px-4 py-2 text-sm text-primary-300 transition hover:border-accent-500/50 hover:text-accent-300 hover:shadow-teal-glow">
              {category}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
