import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'b3q3iq0h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  perspective: 'published',
});
