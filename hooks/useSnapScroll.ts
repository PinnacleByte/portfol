'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const THROTTLE_MS = 750;

interface InternalScrollSection {
  index: number;
  panelRef: React.RefObject<HTMLDivElement | null>;
}

interface UseSnapScrollProps {
  totalSections: number;
  internalScrollSections: InternalScrollSection[];
}

interface UseSnapScrollReturn {
  currentIndex: number;
  goTo: (index: number) => void;
  isDesktop: boolean;
  isTransitioning: boolean;
}

export function useSnapScroll({ totalSections, internalScrollSections }: UseSnapScrollProps): UseSnapScrollReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const lastEventTime = useRef(0);
  const isTransitioningRef = useRef(false);

  // Detect desktop on mount and hydration
  useEffect(() => {
    const isDesktopMatch = window.matchMedia('(min-width: 768px)').matches;
    setIsDesktop(isDesktopMatch);
  }, []);

  // Track transitioning state with throttle timeout
  useEffect(() => {
    isTransitioningRef.current = true;
    setIsTransitioning(true);

    const id = setTimeout(() => {
      isTransitioningRef.current = false;
      setIsTransitioning(false);
    }, THROTTLE_MS);

    return () => clearTimeout(id);
  }, [currentIndex]);

  const tryNavigate = useCallback(
    (direction: 1 | -1) => {
      const now = Date.now();

      // Throttle check
      if (now - lastEventTime.current < THROTTLE_MS) return;
      if (isTransitioningRef.current) return;

      // Escape logic for internal-scroll sections — allow internal scrolling until edges
      const scrollSection = internalScrollSections.find(s => s.index === currentIndex);
      if (scrollSection?.panelRef.current) {
        const panel = scrollSection.panelRef.current;
        if (direction === 1) {
          const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 4;
          if (!atBottom) return;
        }
        if (direction === -1) {
          const atTop = panel.scrollTop <= 4;
          if (!atTop) return;
        }
      }

      lastEventTime.current = now;
      setCurrentIndex((prev) => Math.max(0, Math.min(totalSections - 1, prev + direction)));
    },
    [currentIndex, totalSections, internalScrollSections]
  );

  const goTo = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(totalSections - 1, index));
    setCurrentIndex(clampedIndex);
  }, [totalSections]);

  // Wheel event listener — only on desktop
  useEffect(() => {
    if (!isDesktop) return;

    const handleWheel = (e: WheelEvent) => {
      // Check if we're in an internal-scroll section and should allow internal scrolling
      const scrollSection = internalScrollSections.find(s => s.index === currentIndex);
      if (scrollSection?.panelRef.current) {
        const panel = scrollSection.panelRef.current;
        const direction = e.deltaY > 0 ? 1 : -1;
        if (direction === 1) {
          const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 4;
          if (!atBottom) return;
        } else {
          const atTop = panel.scrollTop <= 4;
          if (!atTop) return;
        }
      }

      e.preventDefault();
      tryNavigate(e.deltaY > 0 ? 1 : -1);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isDesktop, currentIndex, internalScrollSections, tryNavigate]);

  // Keyboard event listener — only on desktop
  useEffect(() => {
    if (!isDesktop) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        tryNavigate(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        tryNavigate(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDesktop, tryNavigate]);

  return { currentIndex, goTo, isDesktop, isTransitioning };
}
