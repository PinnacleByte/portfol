'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { readTestimonials, writeTestimonials } from '@/lib/db';

type ActionState = { error: string } | null;

function generateId(author: string) {
  return author
    .split(',')[0]
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export async function createTestimonial(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const quote = (formData.get('quote') as string).trim();
  const author = (formData.get('author') as string).trim();

  if (!quote || !author) return { error: 'Quote and author are required.' };

  const testimonials = await readTestimonials();
  const baseId = generateId(author);
  let id = baseId;
  let n = 1;
  while (testimonials.some((t) => t.id === id)) {
    id = `${baseId}-${n++}`;
  }

  testimonials.push({ id, quote, author });
  await writeTestimonials(testimonials);
  revalidatePath('/');
  redirect('/admin/testimonials');
}

export async function updateTestimonial(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const quote = (formData.get('quote') as string).trim();
  const author = (formData.get('author') as string).trim();

  if (!quote || !author) return { error: 'Quote and author are required.' };

  const testimonials = await readTestimonials();
  const index = testimonials.findIndex((t) => t.id === id);
  if (index === -1) return { error: 'Testimonial not found.' };

  testimonials[index] = { id, quote, author };
  await writeTestimonials(testimonials);
  revalidatePath('/');
  redirect('/admin/testimonials');
}

export async function deleteTestimonial(id: string) {
  const testimonials = await readTestimonials();
  await writeTestimonials(testimonials.filter((t) => t.id !== id));
  revalidatePath('/');
  redirect('/admin/testimonials');
}
