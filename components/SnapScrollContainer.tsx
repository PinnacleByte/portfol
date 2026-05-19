'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const INTERNAL_SCROLL_INDICES = [3, 4];

interface SnapScrollContainerProps {
  children: ReactNode[];
  currentIndex: number;
  isDesktop: boolean;
}

export default function SnapScrollContainer({
  children,
  currentIndex,
  isDesktop,
}: SnapScrollContainerProps) {
  if (!isDesktop) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        height: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
      }}
    >
      <motion.div
        animate={{ y: `-${currentIndex * 100}dvh` }}
        transition={{
          duration: 0.7,
          ease: [0.76, 0, 0.24, 1], // cubic-bezier for premium feel
        }}
        style={{
          willChange: 'transform',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children.map((panel, i) => (
          <div
            key={i}
            style={{
              height: '100dvh',
              minHeight: '100dvh',
              overflow: INTERNAL_SCROLL_INDICES.includes(i) ? 'auto' : 'hidden',
              flexShrink: 0,
            }}
          >
            {panel}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
