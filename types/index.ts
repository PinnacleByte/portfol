export interface Project {
  slug: string;
  title: string;
  category: 'Custom Apps' | 'Shopify' | 'WordPress';
  summary: string;
  description: string;
  tech: string[];
  featured: boolean;
  image?: string;
  liveUrl?: string;
  order?: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  photo?: string;
}

export interface Service {
  title: string;
  description: string;
  tag: string;
}
