import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'PinnacleByte | Premium Web Development Studio',
  description: 'PinnacleByte crafts premium MERN, Shopify, and WordPress websites with attention to detail and smooth motion.',
};

import LenisProvider from '@/components/LenisProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-primary-900 antialiased">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
