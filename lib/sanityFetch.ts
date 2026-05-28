import { sanityClient } from './sanity';
import type { Project, Testimonial, TeamMember } from '@/types';

const PROJECTS_QUERY = `*[_type == "portfolioProject"] | order(order asc) {
  "slug": slug.current,
  title,
  category,
  summary,
  description,
  tech,
  featured,
  "image": image.asset->url,
  liveUrl,
  order
}`;

const TESTIMONIALS_QUERY = `*[_type == "portfolioTestimonial"] {
  "id": _id,
  quote,
  author
}`;

const TEAM_QUERY = `*[_type == "portfolioTeam"] {
  "id": _id,
  name,
  role,
  description,
  "photo": photo.asset->url
}`;

export async function fetchProjects(): Promise<Project[]> {
  return sanityClient.fetch<Project[]>(PROJECTS_QUERY);
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  return sanityClient.fetch<Testimonial[]>(TESTIMONIALS_QUERY);
}

export async function fetchTeam(): Promise<TeamMember[]> {
  return sanityClient.fetch<TeamMember[]>(TEAM_QUERY);
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  return sanityClient.fetch<Project | null>(
    `*[_type == "portfolioProject" && slug.current == $slug][0] {
      "slug": slug.current,
      title,
      category,
      summary,
      description,
      tech,
      featured,
      "image": image.asset->url,
      liveUrl,
      order
    }`,
    { slug }
  );
}

export async function fetchAllSlugs(): Promise<string[]> {
  const results = await sanityClient.fetch<{ slug: string }[]>(
    `*[_type == "portfolioProject"] { "slug": slug.current }`
  );
  return results.map((r) => r.slug);
}
