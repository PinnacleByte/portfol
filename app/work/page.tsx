import type { Metadata } from 'next';
import AuroraBackground from '@/components/ui/AuroraBackground';
import PageHeader from '@/components/ui/PageHeader';
import WorkGallery from '@/components/work/WorkGallery';
import { fetchProjects } from '@/lib/sanityFetch';

export const metadata: Metadata = {
  title: 'Work | PinnacleByte',
  description:
    'Featured work and case studies — custom web applications, Shopify stores, and WordPress websites built by PinnacleByte.',
};

export default async function WorkPage() {
  const projects = await fetchProjects();

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-bg-dark md:h-[100dvh] md:overflow-y-auto">
      <AuroraBackground />
      <PageHeader />

      <div className="container relative z-10 py-16 md:py-20">
        <div className="max-w-3xl space-y-5">
          <p className="text-sm uppercase tracking-[0.32em] text-accent-400">Work</p>
          <h1 className="text-4xl font-semibold tracking-tight text-primary-50 sm:text-5xl">
            Featured work and case studies.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-primary-300">
            Explore custom web applications, Shopify stores, and WordPress websites built with
            clarity and craft. Filter by service to see the kind of work we deliver for growing
            brands.
          </p>
        </div>

        <WorkGallery projects={projects} />
      </div>
    </main>
  );
}
