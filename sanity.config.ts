import { defineConfig, defineField, defineType } from 'sanity';
import { structureTool } from 'sanity/structure';

export default defineConfig({
  projectId: 'b3q3iq0h',
  dataset: 'production',
  basePath: '/studio',
  plugins: [structureTool()],
  schema: {
    types: [
      defineType({
        name: 'portfolioProject',
        title: 'Project',
        type: 'document',
        fields: [
          defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
          defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: { list: ['Custom Apps', 'Shopify', 'WordPress'] },
          }),
          defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3 }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 6 }),
          defineField({ name: 'tech', title: 'Tech Stack', type: 'array', of: [{ type: 'string' }] }),
          defineField({ name: 'featured', title: 'Featured', type: 'boolean' }),
          defineField({ name: 'image', title: 'Image', type: 'image' }),
          defineField({ name: 'liveUrl', title: 'Live URL', type: 'url' }),
          defineField({ name: 'order', title: 'Order', type: 'number' }),
        ],
      }),
      defineType({
        name: 'portfolioTestimonial',
        title: 'Testimonial',
        type: 'document',
        fields: [
          defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (r) => r.required() }),
          defineField({ name: 'author', title: 'Author', type: 'string', validation: (r) => r.required() }),
        ],
      }),
      defineType({
        name: 'portfolioTeam',
        title: 'Team Member',
        type: 'document',
        fields: [
          defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'role', title: 'Role', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
          defineField({ name: 'photo', title: 'Photo', type: 'image' }),
        ],
      }),
    ],
  },
});
