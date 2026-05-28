import SectionHeading from '@/components/ui/SectionHeading';
import WorkGallery from '@/components/work/WorkGallery';
import { fetchProjects } from '@/lib/sanityFetch';

export default async function WorkPage() {
  const projects = await fetchProjects();
  return (
    <main className="container py-20">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.32em] text-accent-500">Work</p>
        <h1 className="text-4xl font-semibold tracking-tight text-primary-900 sm:text-5xl">
          Featured work and case studies.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-neutral-600">
          Explore full case studies for custom web applications, Shopify stores, and WordPress websites built with clarity and craft.
        </p>
      </div>

      <SectionHeading
        eyebrow="All projects"
        title="Curated work across strategy, commerce, and content platforms."
        description="Filter by service to see the kind of work PinnacleByte delivers for small teams and growing brands."
      />

      <WorkGallery projects={projects} />
    </main>
  );
}
