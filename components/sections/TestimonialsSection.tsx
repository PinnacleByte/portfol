'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import AuroraBackground from '@/components/ui/AuroraBackground';
import { testimonials } from '@/data/testimonials';

const GAP_PX = 24;

function getCardWidth(viewportWidth: number): number {
  if (viewportWidth >= 768) return 384;
  if (viewportWidth >= 640) return 320;
  return 280;
}

export default function TestimonialsSection() {
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);
  const [cardWidth, setCardWidth] = useState(384);

  useEffect(() => {
    const update = () => setCardWidth(getCardWidth(window.innerWidth));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const scrollDistance = -(testimonials.length * (cardWidth + GAP_PX));

  return (
    <section className="relative flex flex-col justify-center bg-bg-dark min-h-[100dvh] md:h-full overflow-hidden px-4 sm:px-6 lg:px-8">
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
              style={{ width: cardWidth }}
              className="shrink-0 rounded-2xl border border-neutral-700 bg-neutral-900/50 backdrop-blur-sm p-6 md:p-8 cursor-pointer transition-all duration-300 hover:border-accent-500/50"
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
