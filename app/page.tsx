import HomePageClient from '@/components/HomePageClient';
import { fetchProjects, fetchTestimonials, fetchTeam } from '@/lib/sanityFetch';

export default async function HomePage() {
  const [projects, testimonials, team] = await Promise.all([
    fetchProjects(),
    fetchTestimonials(),
    fetchTeam(),
  ]);

  return (
    <HomePageClient
      projects={projects}
      testimonials={testimonials}
      team={team}
    />
  );
}
