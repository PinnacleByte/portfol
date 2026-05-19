'use client';

import { motion } from 'framer-motion';

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div
        className="absolute rounded-full bg-accent-500/15 blur-[140px]"
        style={{ width: 700, height: 500, left: '-8%', top: '-15%' }}
        animate={{ x: [0, 55, 0], y: [0, 35, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full bg-sky-300/15 blur-[120px]"
        style={{ width: 550, height: 420, left: '55%', top: '25%' }}
        animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full bg-violet-300/10 blur-[110px]"
        style={{ width: 480, height: 360, left: '20%', top: '55%' }}
        animate={{ x: [0, 45, 0], y: [0, -35, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
