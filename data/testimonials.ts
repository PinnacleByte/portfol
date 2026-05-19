import type { Testimonial } from '@/types';
import testimonialsData from './db/testimonials.json';

export const testimonials = testimonialsData as unknown as Testimonial[];
