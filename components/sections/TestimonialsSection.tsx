'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import AuroraBackground from '@/components/ui/AuroraBackground';
import { testimonials } from '@/data/testimonials';

export default function TestimonialsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);

  // Scroll distance: 8 cards * (384px card + 24px gap) = ~3264px
  const scrollDistance = -(testimonials.length * 408);

  return (
    <section className="relative flex flex-col justify-center bg-bg-dark h-full overflow-hidden px-4 sm:px-6 lg:px-8">
      <AuroraBackground />
      <div className="container py-20 md:py-28">
        <SectionHeading
          eyebrow="Testimonials"
          title="Why clients fall in love with us."
          description="Seamless collaboration, exceptional results, and the kind of partnership you actually want."
          centered
        />
      </div>

      <div className="mt-12 w-full overflow-hidden">
        <motion.div
          className="flex gap-6 px-4 sm:px-6 lg:px-8"
          initial={{ x: 0 }}
          animate={{ x: isMarqueeHovered ? 0 : scrollDistance }}
          transition={{
            duration: isMarqueeHovered ? 0 : 80,
            ease: 'linear',
            repeat: isMarqueeHovered ? 0 : Infinity,
            repeatType: 'loop'
          }}
          onMouseEnter={() => setIsMarqueeHovered(true)}
          onMouseLeave={() => setIsMarqueeHovered(false)}
        >
          {[...testimonials, ...testimonials].map((item, index) => (
            <motion.div
              key={`${item.author}-${index}`}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="shrink-0 w-96 rounded-2xl border border-neutral-700 bg-neutral-900/50 backdrop-blur-sm p-8 cursor-pointer transition-all duration-300 hover:border-accent-500/50"
            >
              <p className="text-base leading-7 text-primary-200">&quot;{item.quote}&quot;</p>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.32em] text-accent-400">{item.author}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
