import type { Project } from '@/types';
import projectsData from './db/projects.json';

export const projects = projectsData as unknown as Project[];
