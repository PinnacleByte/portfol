import HomePageClient from '@/components/HomePageClient';
import { fetchProjects, fetchTeam } from '@/lib/sanityFetch';

export default async function HomePage() {
  const [projects, team] = await Promise.all([
    fetchProjects(),
    fetchTeam(),
  ]);

  return (
    <HomePageClient
      projects={projects}
      team={team}
    />
  );
}
