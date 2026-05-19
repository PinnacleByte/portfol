'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE = 'admin_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function login(_prev: unknown, formData: FormData) {
  const password = formData.get('password') as string;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Incorrect password.' };
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });

  redirect('/admin/projects');
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect('/admin/login');
}

export async function getSession() {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value === 'authenticated';
}
