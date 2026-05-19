'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { readTeam, writeTeam } from '@/lib/db';

type ActionState = { error: string } | null;

function generateId(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export async function createTeamMember(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = (formData.get('name') as string).trim();
  const role = (formData.get('role') as string).trim();
  const description = (formData.get('description') as string).trim();

  if (!name || !role || !description) return { error: 'Name, role, and description are required.' };

  const team = await readTeam();
  const baseId = generateId(name);
  let id = baseId;
  let n = 1;
  while (team.some((m) => m.id === id)) {
    id = `${baseId}-${n++}`;
  }

  team.push({
    id,
    name,
    role,
    description,
    photo: (formData.get('photo') as string).trim() || undefined,
  });

  await writeTeam(team);
  revalidatePath('/');
  redirect('/admin/team');
}

export async function updateTeamMember(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = (formData.get('name') as string).trim();
  const role = (formData.get('role') as string).trim();
  const description = (formData.get('description') as string).trim();

  if (!name || !role || !description) return { error: 'Name, role, and description are required.' };

  const team = await readTeam();
  const index = team.findIndex((m) => m.id === id);
  if (index === -1) return { error: 'Team member not found.' };

  team[index] = {
    id,
    name,
    role,
    description,
    photo: (formData.get('photo') as string).trim() || undefined,
  };

  await writeTeam(team);
  revalidatePath('/');
  redirect('/admin/team');
}

export async function deleteTeamMember(id: string) {
  const team = await readTeam();
  await writeTeam(team.filter((m) => m.id !== id));
  revalidatePath('/');
  redirect('/admin/team');
}
