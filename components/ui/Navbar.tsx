'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import Button from '@/components/ui/Button';

const links = [
  { label: 'About', href: '#about', index: 2 },
  { label: 'Process', href: '#process', index: 3 },
  { label: 'Work', href: '#work', index: 4 },
  { label: 'Pricing', href: '#pricing', index: 5 },
  { label: 'Team', href: '#team', index: 6 },
  { label: 'Contact', href: '#contact', index: 8 },
];

interface NavbarProps {
  goTo?: (index: number) => void;
  visible?: boolean;
}

export default function Navbar({ goTo, visible = true }: NavbarProps) {
  const navItems = useMemo(
    () =>
      links.map((link) =>
        goTo ? (
          <button
            key={link.label}
            onClick={() => goTo(link.index)}
            className="text-sm font-medium text-primary-300 transition hover:text-accent-400 bg-transparent border-0 cursor-pointer p-0 leading-none"
          >
            {link.label}
          </button>
        ) : (
          <a key={link.label} href={link.href} className="text-sm font-medium text-primary-300 transition hover:text-accent-400">
            {link.label}
          </a>
        )
      ),
    [goTo]
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -16 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 bg-bg-dark/80 backdrop-blur-xl"
    >
      <div className="container flex items-center justify-between gap-6 py-4">
        {goTo ? (
          <button
            onClick={() => goTo(1)}
            className="text-lg font-semibold tracking-[0.04em] text-primary-50 bg-transparent border-0 cursor-pointer p-0 leading-none"
          >
            PinnacleByte
          </button>
        ) : (
          <a href="#top" className="text-lg font-semibold tracking-[0.04em] text-primary-50">
            PinnacleByte
          </a>
        )}
        <nav className="hidden items-center gap-8 md:flex">{navItems}</nav>
        <Button
          variant="primary"
          className="hidden md:inline-flex"
          onClick={() => goTo ? goTo(8) : undefined}
        >
          Start a Project
        </Button>
      </div>
    </motion.header>
  );
}
