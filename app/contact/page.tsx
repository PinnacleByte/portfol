import type { Metadata } from 'next';
import ContactClient from '@/components/ContactClient';

export const metadata: Metadata = {
  title: 'Contact | PinnacleByte',
  description:
    'Start a project with PinnacleByte. Tell us about your custom web app, Shopify store, or WordPress site and we’ll reply within 1–2 business days.',
};

export default function ContactPage() {
  return <ContactClient />;
}
