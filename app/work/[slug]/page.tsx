import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';

interface WorkCaseStudyProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default function WorkCaseStudyPage({ params }: WorkCaseStudyProps) {
  const project = projects.find((item) => item.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="container py-20">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.32em] text-accent-500">Case study</p>
        <h1 className="text-4xl font-semibold tracking-tight text-primary-900 sm:text-5xl">
          {project.title}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-neutral-600">
          {project.summary}
        </p>
      </div>

      <section className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="space-y-8 rounded-[2rem] border border-neutral-200 bg-white p-10 shadow-soft">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.32em] text-accent-500">Overview</p>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary-900">Project objective</h2>
              <p className="text-neutral-600 leading-8">
                A premium case study page designed to communicate the challenge, approach, and result for a PinnacleByte client.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-accent-500">Category</p>
              <p className="mt-2 text-lg font-semibold text-primary-900">{project.category}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-accent-500">Outcome</p>
              <p className="mt-2 text-lg font-semibold text-primary-900">Premium performance and clarity</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-accent-500">Role</p>
              <p className="mt-2 text-lg font-semibold text-primary-900">Strategy, design, development</p>
            </div>
          </div>
        </article>

        <aside className="space-y-6 rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-accent-500">Featured work</p>
            <h3 className="mt-4 text-2xl font-semibold text-primary-900">{project.title}</h3>
          </div>
          <div className="space-y-4 text-neutral-600">
            <p>Delivered a polished, scalable experience focused on clarity, speed, and confidence.</p>
            <p>Built as a long-term digital platform with strong design systems and front-end performance.</p>
          </div>
        </aside>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.32em] text-accent-500">Challenge</p>
          <p className="mt-4 text-neutral-600 leading-8">
            The client needed a premium web presence that could support product storytelling, lead capture, and scalable content updates.
          </p>
        </div>
        <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.32em] text-accent-500">Approach</p>
          <p className="mt-4 text-neutral-600 leading-8">
            We defined a concise strategy, prototyped detailed layouts, and built with performance and ease of content management in mind.
          </p>
        </div>
        <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.32em] text-accent-500">Result</p>
          <p className="mt-4 text-neutral-600 leading-8">
            A premium site experience with stronger brand trust, faster load times, and a clear path to conversion.
          </p>
        </div>
      </section>
    </main>
  );
}
