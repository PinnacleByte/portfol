import { promises as fs } from 'fs';
import path from 'path';
import type { Project, Testimonial, TeamMember } from '@/types';

const DB_DIR = path.join(process.cwd(), 'data', 'db');

const paths = {
  projects: path.join(DB_DIR, 'projects.json'),
  testimonials: path.join(DB_DIR, 'testimonials.json'),
  team: path.join(DB_DIR, 'team.json'),
};

async function read<T>(file: string): Promise<T[]> {
  const raw = await fs.readFile(file, 'utf-8');
  return JSON.parse(raw) as T[];
}

async function write<T>(file: string, data: T[]): Promise<void> {
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
}

export const readProjects = () => read<Project>(paths.projects);
export const writeProjects = (data: Project[]) => write(paths.projects, data);

export const readTestimonials = () => read<Testimonial>(paths.testimonials);
export const writeTestimonials = (data: Testimonial[]) => write(paths.testimonials, data);

export const readTeam = () => read<TeamMember>(paths.team);
export const writeTeam = (data: TeamMember[]) => write(paths.team, data);
