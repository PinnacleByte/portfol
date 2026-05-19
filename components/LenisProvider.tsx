'use client';

import { useEffect, type ReactNode } from 'react';
import { createLenis } from '@/lib/lenis';

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Snap-scroll on desktop takes over wheel events — Lenis conflicts with it
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop) return; // No smooth scroll on desktop when snap-scroll is active

    const lenis = createLenis();

    function frame(time: number) {
      lenis.raf(time);
      requestAnimationFrame(frame);
    }

    const rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
