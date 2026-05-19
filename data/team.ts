import type { TeamMember } from '@/types';
import teamData from './db/team.json';

export const team = teamData as unknown as TeamMember[];
