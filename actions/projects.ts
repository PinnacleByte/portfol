'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { readProjects, writeProjects } from '@/lib/db';
import type { Project } from '@/types';

type ActionState = { error: string } | null;

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

function parseProject(formData: FormData, slug: string): Project {
  return {
    slug,
    title: (formData.get('title') as string).trim(),
    category: formData.get('category') as Project['category'],
    summary: (formData.get('summary') as string).trim(),
    description: (formData.get('description') as string).trim(),
    tech: (formData.get('tech') as string).split(',').map((t) => t.trim()).filter(Boolean),
    featured: formData.get('featured') === 'on',
    image: (formData.get('image') as string).trim() || undefined,
    liveUrl: (formData.get('liveUrl') as string).trim() || undefined,
    order: formData.get('order') ? Number(formData.get('order')) : undefined,
  };
}

export async function createProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const title = (formData.get('title') as string).trim();
  if (!title) return { error: 'Title is required.' };

  const slug = slugify(title);
  const projects = await readProjects();

  if (projects.some((p) => p.slug === slug)) {
    return { error: `A project with slug "${slug}" already exists.` };
  }

  projects.push(parseProject(formData, slug));
  await writeProjects(projects);
  revalidatePath('/');
  redirect('/admin/projects');
}

export async function updateProject(slug: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const projects = await readProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return { error: 'Project not found.' };

  projects[index] = parseProject(formData, slug);
  await writeProjects(projects);
  revalidatePath('/');
  redirect('/admin/projects');
}

export async function deleteProject(slug: string) {
  const projects = await readProjects();
  await writeProjects(projects.filter((p) => p.slug !== slug));
  revalidatePath('/');
  redirect('/admin/projects');
}

export async function reorderProject(slug: string, direction: 'up' | 'down') {
  const projects = await readProjects();
  const sorted = [...projects].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  const idx = sorted.findIndex((p) => p.slug === slug);
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;

  if (swapIdx < 0 || swapIdx >= sorted.length) return;

  const aOrder = sorted[idx].order ?? idx + 1;
  const bOrder = sorted[swapIdx].order ?? swapIdx + 1;
  sorted[idx].order = bOrder;
  sorted[swapIdx].order = aOrder;

  await writeProjects(sorted);
  revalidatePath('/');
  redirect('/admin/projects');
}
